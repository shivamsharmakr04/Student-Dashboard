'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Course } from '@/types/course'
import { Assignment } from '@/types/assignment'
import { ScheduleEvent } from '@/types/schedule'
import { MOCK_COURSES } from '@/lib/supabase'
import { MOCK_ASSIGNMENTS } from '@/lib/assignmentData'
import { MOCK_SCHEDULE_EVENTS } from '@/lib/scheduleData'

const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'

// Storage Keys
const STORAGE_COURSES = 'edupulse_courses'
const STORAGE_ASSIGNMENTS = 'edupulse_assignments'
const STORAGE_SCHEDULE = 'edupulse_schedule'

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
  const [courses, setCourses] = useState<Course[]>(() => getStored(STORAGE_COURSES, MOCK_COURSES))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCourses() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('courses').select('*')
          if (!error && data && data.length > 0) {
            setCourses(data as Course[])
            setStored(STORAGE_COURSES, data)
          }
        } catch (e) {
          console.warn('Supabase fetch courses failed:', e)
        }
      }
      setLoading(false)
    }

    loadCourses()

    if (!isSupabaseConfigured) return

    // Real-Time Supabase WebSocket Channel for Courses
    const channel = supabase
      .channel('realtime_courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
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
  }, [])

  const updateCourseProgress = async (courseId: string, progress: number) => {
    setCourses((prev) => {
      const updated = prev.map((c) => (c.id === courseId ? { ...c, progress } : c))
      setStored(STORAGE_COURSES, updated)
      return updated
    })

    if (isSupabaseConfigured) {
      try {
        await supabase.from('courses').update({ progress }).eq('id', courseId)
      } catch (e) {}
    }
  }

  return { courses, loading, updateCourseProgress }
}

// ==========================================
// 2. REAL-TIME ASSIGNMENTS HOOK & API
// ==========================================
export function useRealtimeAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    getStored(STORAGE_ASSIGNMENTS, MOCK_ASSIGNMENTS)
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAssignments() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('assignments').select('*')
          if (!error && data && data.length > 0) {
            setAssignments(data as Assignment[])
            setStored(STORAGE_ASSIGNMENTS, data)
          }
        } catch (e) {
          console.warn('Supabase fetch assignments failed:', e)
        }
      }
      setLoading(false)
    }

    loadAssignments()

    if (!isSupabaseConfigured) return

    // Real-Time Supabase WebSocket Channel for Assignments
    const channel = supabase
      .channel('realtime_assignments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, (payload) => {
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
  }, [])

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
      setStored(STORAGE_ASSIGNMENTS, updated)
      return updated
    })

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('assignments')
          .update({ status: 'submitted', submission_date: subDate })
          .eq('id', id)
      } catch (e) {}
    }
  }

  return { assignments, loading, submitAssignment }
}

// ==========================================
// 3. REAL-TIME SCHEDULE HOOK & API
// ==========================================
export function useRealtimeSchedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>(() =>
    getStored(STORAGE_SCHEDULE, MOCK_SCHEDULE_EVENTS)
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSchedule() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('schedule_events').select('*')
          if (!error && data && data.length > 0) {
            setEvents(data as ScheduleEvent[])
            setStored(STORAGE_SCHEDULE, data)
          }
        } catch (e) {
          console.warn('Supabase fetch schedule failed:', e)
        }
      }
      setLoading(false)
    }

    loadSchedule()

    if (!isSupabaseConfigured) return

    // Real-Time Supabase WebSocket Channel for Schedule
    const channel = supabase
      .channel('realtime_schedule')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule_events' }, (payload) => {
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
  }, [])

  const addScheduleEvent = async (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: `evt-${Date.now()}`
    }

    setEvents((prev) => {
      const updated = [newEvent, ...prev]
      setStored(STORAGE_SCHEDULE, updated)
      return updated
    })

    if (isSupabaseConfigured) {
      try {
        await supabase.from('schedule_events').insert([newEvent])
      } catch (e) {}
    }
  }

  return { events, loading, addScheduleEvent }
}
