'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Course } from '@/types/course'
import { Assignment } from '@/types/assignment'
import { ScheduleEvent } from '@/types/schedule'
import { useAuth } from '@/context/AuthContext'
import { generateUserCourses } from '@/lib/courseCatalog'
import { generateUserAssignments } from '@/lib/userAssignmentGenerator'
import { generateUserSchedule } from '@/lib/userScheduleGenerator'
import {
  apiGetCourses,
  apiUpdateCourseProgress,
  apiGetAssignments,
  apiSubmitAssignment,
  apiGetSchedule,
  apiAddScheduleEvent
} from '@/lib/backendApi'

const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'

// Helper for local storage persistence
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (e) {
    return fallback
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

// ==========================================
// 1. REAL-TIME COURSES HOOK & API
// ==========================================
export function useRealtimeCourses() {
  const { user } = useAuth()
  const userId = user?.id || 'demo-student-001'
  const userStorageKey = `edupulse_courses_${userId}`

  const [courses, setCourses] = useState<Course[]>(() => {
    if (!user) return []
    const stored = getStored<Course[] | null>(userStorageKey, null)
    if (stored && stored.length > 0) return stored
    return generateUserCourses(user)
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setCourses([])
      setLoading(false)
      return
    }

    const currentUser = user

    async function loadCourses() {
      // 1. Try fetching from Express Backend API
      const backendCourses = await apiGetCourses(currentUser.id)
      if (backendCourses && backendCourses.length > 0) {
        setCourses(backendCourses)
        setStored(userStorageKey, backendCourses)
        setLoading(false)
        return
      }

      // 2. Fallback to localStorage or generator
      let currentCourses = getStored<Course[] | null>(userStorageKey, null)

      if (!currentCourses || currentCourses.length === 0) {
        currentCourses = generateUserCourses(currentUser)
        setStored(userStorageKey, currentCourses)
      } else if (currentUser.email?.toLowerCase() !== 'alex.morgan@university.edu') {
        const freshGen = generateUserCourses(currentUser)
        const existingMap = new Map(currentCourses.map((c) => [c.title, c]))
        const merged = freshGen.map((fresh) => {
          const existing = existingMap.get(fresh.title)
          return existing ? existing : fresh
        })
        currentCourses = merged
        setStored(userStorageKey, currentCourses)
      }

      setCourses(currentCourses)

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('user_id', currentUser.id)

          if (!error && data && data.length > 0) {
            setCourses(data as Course[])
            setStored(userStorageKey, data)
          } else if (!error && (!data || data.length === 0)) {
            await supabase.from('courses').upsert(currentCourses)
          }
        } catch (e) {
          console.warn('Supabase fetch courses failed:', e)
        }
      }
      setLoading(false)
    }

    loadCourses()

    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel(`realtime_courses_${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses', filter: `user_id=eq.${currentUser.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCourses((prev) => [payload.new as Course, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setCourses((prev) => prev.map((c) => (c.id === (payload.new as Course).id ? (payload.new as Course) : c)))
        } else if (payload.eventType === 'DELETE') {
          setCourses((prev) => prev.filter((c) => c.id === (payload.old as Course).id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, userStorageKey, JSON.stringify(user?.preferences?.preferred_tracks)])

  const updateCourseProgress = async (courseId: string, newProgress: number, newCompletedLessons?: number) => {
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          const total = c.total_lessons || 20
          const completed =
            newCompletedLessons !== undefined
              ? newCompletedLessons
              : Math.min(total, Math.round((newProgress / 100) * total))
          return {
            ...c,
            progress: Math.min(100, Math.max(0, newProgress)),
            completed_lessons: completed
          }
        }
        return c
      })
      if (user?.id) {
        setStored(userStorageKey, updated)
      }
      return updated
    })

    // Call Express Backend API
    apiUpdateCourseProgress(courseId, newProgress, newCompletedLessons).catch(() => {})

    if (isSupabaseConfigured && user?.id) {
      try {
        const targetCourse = courses.find((c) => c.id === courseId)
        if (targetCourse) {
          const total = targetCourse.total_lessons || 20
          const completed =
            newCompletedLessons !== undefined
              ? newCompletedLessons
              : Math.min(total, Math.round((newProgress / 100) * total))
          await supabase
            .from('courses')
            .update({ progress: newProgress, completed_lessons: completed })
            .eq('id', courseId)
            .eq('user_id', user.id)
        }
      } catch (e) {}
    }
  }

  return { courses, loading, updateCourseProgress }
}

// ==========================================
// 2. REAL-TIME ASSIGNMENTS HOOK & API
// ==========================================
export function useRealtimeAssignments() {
  const { user } = useAuth()
  const { courses } = useRealtimeCourses()
  const userId = user?.id || 'demo-student-001'
  const userStorageKey = `edupulse_assignments_${userId}`

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    if (!user) return []
    const stored = getStored<Assignment[] | null>(userStorageKey, null)
    if (stored && stored.length > 0) return stored
    return generateUserAssignments(user, courses)
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAssignments([])
      setLoading(false)
      return
    }

    const currentUser = user

    async function loadAssignments() {
      // 1. Try Express Backend API
      const backendAssignments = await apiGetAssignments(currentUser.id)
      if (backendAssignments && backendAssignments.length > 0) {
        setAssignments(backendAssignments)
        setStored(userStorageKey, backendAssignments)
        setLoading(false)
        return
      }

      // 2. Fallback to localStorage or generator
      let currentAssignments = getStored<Assignment[] | null>(userStorageKey, null)
      if (!currentAssignments || currentAssignments.length === 0) {
        currentAssignments = generateUserAssignments(currentUser, courses)
        setStored(userStorageKey, currentAssignments)
      }

      setAssignments(currentAssignments)

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('user_id', currentUser.id)

          if (!error && data && data.length > 0) {
            setAssignments(data as Assignment[])
            setStored(userStorageKey, data)
          } else if (!error && (!data || data.length === 0)) {
            await supabase.from('assignments').upsert(currentAssignments)
          }
        } catch (e) {
          console.warn('Supabase fetch assignments failed:', e)
        }
      }
      setLoading(false)
    }

    loadAssignments()

    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel(`realtime_assignments_${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments', filter: `user_id=eq.${currentUser.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAssignments((prev) => [payload.new as Assignment, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setAssignments((prev) =>
            prev.map((a) => (a.id === (payload.new as Assignment).id ? (payload.new as Assignment) : a))
          )
        } else if (payload.eventType === 'DELETE') {
          setAssignments((prev) => prev.filter((a) => a.id === (payload.old as Assignment).id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, courses, userStorageKey])

  const submitAssignment = async (id: string) => {
    const subDate = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    setAssignments((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'submitted' as const,
              submission_date: subDate
            }
          : item
      )
      if (user?.id) {
        setStored(userStorageKey, updated)
      }
      return updated
    })

    // Call Express Backend API
    apiSubmitAssignment(id).catch(() => {})

    if (isSupabaseConfigured && user?.id) {
      try {
        await supabase
          .from('assignments')
          .update({ status: 'submitted', submission_date: subDate })
          .eq('id', id)
          .eq('user_id', user.id)
      } catch (e) {}
    }
  }

  return { assignments, loading, submitAssignment }
}

// ==========================================
// 3. REAL-TIME SCHEDULE HOOK & API
// ==========================================
export function useRealtimeSchedule() {
  const { user } = useAuth()
  const { courses } = useRealtimeCourses()
  const userId = user?.id || 'demo-student-001'
  const userStorageKey = `edupulse_schedule_${userId}`

  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    if (!user) return []
    const stored = getStored<ScheduleEvent[] | null>(userStorageKey, null)
    if (stored && stored.length > 0) return stored
    return generateUserSchedule(user, courses)
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setEvents([])
      setLoading(false)
      return
    }

    const currentUser = user

    async function loadSchedule() {
      // 1. Try Express Backend API
      const backendSchedule = await apiGetSchedule(currentUser.id)
      if (backendSchedule && backendSchedule.length > 0) {
        setEvents(backendSchedule)
        setStored(userStorageKey, backendSchedule)
        setLoading(false)
        return
      }

      // 2. Fallback to localStorage or generator
      let currentEvents = getStored<ScheduleEvent[] | null>(userStorageKey, null)
      if (!currentEvents || currentEvents.length === 0) {
        currentEvents = generateUserSchedule(currentUser, courses)
        setStored(userStorageKey, currentEvents)
      }

      setEvents(currentEvents)

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('schedule_events')
            .select('*')
            .eq('user_id', currentUser.id)

          if (!error && data && data.length > 0) {
            setEvents(data as ScheduleEvent[])
            setStored(userStorageKey, data)
          } else if (!error && (!data || data.length === 0)) {
            await supabase.from('schedule_events').upsert(currentEvents)
          }
        } catch (e) {
          console.warn('Supabase fetch schedule failed:', e)
        }
      }
      setLoading(false)
    }

    loadSchedule()

    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel(`realtime_schedule_${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule_events', filter: `user_id=eq.${currentUser.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEvents((prev) => [payload.new as ScheduleEvent, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setEvents((prev) =>
            prev.map((s) => (s.id === (payload.new as ScheduleEvent).id ? (payload.new as ScheduleEvent) : s))
          )
        } else if (payload.eventType === 'DELETE') {
          setEvents((prev) => prev.filter((s) => s.id === (payload.old as ScheduleEvent).id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, courses, userStorageKey])

  const addScheduleEvent = async (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: `evt-${user?.id || 'demo'}-${Date.now()}`
    }

    setEvents((prev) => {
      const updated = [newEvent, ...prev]
      if (user?.id) {
        setStored(userStorageKey, updated)
      }
      return updated
    })

    // Call Express Backend API
    if (user?.id) {
      apiAddScheduleEvent(user.id, event).catch(() => {})
    }

    if (isSupabaseConfigured && user?.id) {
      try {
        await supabase.from('schedule_events').insert([{ ...newEvent, user_id: user.id }])
      } catch (e) {}
    }
  }

  return { events, loading, addScheduleEvent }
}

