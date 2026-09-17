'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { StudentUser, StudentPreferences } from '@/types/auth'
import { supabase } from '@/lib/supabase'
import { generateUserCourses } from '@/lib/courseCatalog'
import { generateUserAssignments } from '@/lib/userAssignmentGenerator'
import { generateUserSchedule } from '@/lib/userScheduleGenerator'

export const DEFAULT_PREFERENCES: StudentPreferences = {
  preferred_tracks: ['Web Development', 'Computer Science'],
  learning_goal_hours: 10,
  study_mode: 'Project-Based',
  email_assignments: true,
  email_exams: true,
  email_announcements: true,
  push_alerts: false,
  theme: 'light'
}

export const DEMO_STUDENT: StudentUser = {
  id: 'demo-student-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@university.edu',
  student_id: 'STU-2026-8942',
  major: 'Computer Science & Software Engineering',
  bio: 'Passionate fullstack engineering student focused on Next.js, distributed systems, and machine learning.',
  avatar_initials: 'AL',
  year_level: 'Year 3',
  gpa: 3.92,
  preferences: DEFAULT_PREFERENCES
}

interface AuthContextType {
  user: StudentUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isRealtimeConnected: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  createAccount: (
    details: Omit<StudentUser, 'id' | 'avatar_initials' | 'preferences'>,
    preferences: StudentPreferences
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updated: Partial<StudentUser>) => void
  updatePreferences: (newPrefs: Partial<StudentPreferences>) => void
  loginAsDemo: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'edupulse_student_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentUser | null>(DEMO_STUDENT)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false)

  const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'

  // Helper to persist user state and notify all active browser windows
  const saveUserToStorage = (userData: StudentUser | null) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // 1. Initial Session Restoration & Real-time Storage Listener (Multi-Tab Sync)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) {
          setUser(parsed)
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STUDENT))
      }
    } catch (e) {
      console.warn('Failed to parse stored student session:', e)
    } finally {
      setIsLoading(false)
    }

    // Real-time tab sync listener: updates state across tabs instantly
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        if (event.newValue) {
          try {
            setUser(JSON.parse(event.newValue))
          } catch (e) {}
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // 2. Real-Time Supabase Auth Listener & Database Channel Subscription
  useEffect(() => {
    if (!isSupabaseConfigured) return

    setIsRealtimeConnected(true)

    // Listen to real-time auth state events (SIGNED_IN, SIGNED_OUT, USER_UPDATED)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const authUser: StudentUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Student',
            email: session.user.email || '',
            student_id: session.user.user_metadata?.student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
            major: session.user.user_metadata?.major || 'Computer Science',
            bio: session.user.user_metadata?.bio || 'Enthusiastic university student.',
            avatar_initials: (session.user.user_metadata?.name || session.user.email || 'ST')
              .slice(0, 2)
              .toUpperCase(),
            year_level: session.user.user_metadata?.year_level || 'Year 1',
            gpa: 3.9,
            preferences: session.user.user_metadata?.preferences || DEFAULT_PREFERENCES
          }

          // Try fetching real-time database profile if exists
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profile) {
              authUser.name = profile.name || authUser.name
              authUser.major = profile.major || authUser.major
              authUser.student_id = profile.student_id || authUser.student_id
              authUser.bio = profile.bio || authUser.bio
              if (profile.preferences) {
                authUser.preferences = profile.preferences
              }
            }
          } catch (e) {
            console.warn('Real-time database profile lookup skipped:', e)
          }

          saveUserToStorage(authUser)
        }
      } else if (event === 'SIGNED_OUT') {
        saveUserToStorage(null)
      }
    })

    // Real-time Database Channel for Profiles table changes
    const channel = supabase
      .channel('realtime_profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (user && payload.new && (payload.new as any).id === user.id) {
            const updatedFromDb = payload.new as any
            setUser((prev) => {
              if (!prev) return null
              return {
                ...prev,
                name: updatedFromDb.name || prev.name,
                major: updatedFromDb.major || prev.major,
                bio: updatedFromDb.bio || prev.bio,
                preferences: updatedFromDb.preferences || prev.preferences
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      authListener?.subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [isSupabaseConfigured])

  // Login handler
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password.' }
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
        if (error) return { success: false, error: error.message }
        if (data.user) {
          const initials = (data.user.user_metadata?.name || email).slice(0, 2).toUpperCase()
          const authUser: StudentUser = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            student_id: data.user.user_metadata?.student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
            major: data.user.user_metadata?.major || 'Computer Science',
            bio: data.user.user_metadata?.bio || 'Enthusiastic university student.',
            avatar_initials: initials,
            year_level: data.user.user_metadata?.year_level || 'Year 1',
            gpa: 3.92,
            preferences: data.user.user_metadata?.preferences || DEFAULT_PREFERENCES
          }
          saveUserToStorage(authUser)
          return { success: true }
        }
      } catch (err: any) {
        console.warn('Supabase auth login exception, using client fallback:', err)
      }
    }

    // Local / Demo Fallback
    if (email.toLowerCase() === DEMO_STUDENT.email.toLowerCase() || email.includes('@')) {
      const initials = email
        .split('@')[0]
        .split('.')
        .map((part) => part[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2) || 'ST'

      const existingStored = localStorage.getItem(STORAGE_KEY)
      let loggedUser: StudentUser = DEMO_STUDENT

      if (existingStored) {
        try {
          const parsed = JSON.parse(existingStored)
          if (parsed.email?.toLowerCase() === email.toLowerCase()) {
            loggedUser = parsed
          } else {
            loggedUser = {
              ...DEMO_STUDENT,
              id: `user-${Date.now()}`,
              name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              email,
              avatar_initials: initials
            }
          }
        } catch (e) {}
      }

      saveUserToStorage(loggedUser)
      return { success: true }
    }

    return { success: false, error: 'Invalid email or password.' }
  }

  // Create Account handler
  const createAccount = async (
    details: Omit<StudentUser, 'id' | 'avatar_initials' | 'preferences'>,
    preferences: StudentPreferences
  ): Promise<{ success: boolean; error?: string }> => {
    if (!details.email || !details.name) {
      return { success: false, error: 'Name and email are required.' }
    }

    const initials = details.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST'

    let userId = `stu-${Date.now()}`

    // Attempt real-time Supabase Auth SignUp if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: details.email,
          password: 'Password123!',
          options: {
            data: {
              name: details.name,
              major: details.major,
              student_id: details.student_id,
              year_level: details.year_level,
              preferences
            }
          }
        })

        if (error) {
          return { success: false, error: error.message }
        }

        if (data.user) {
          userId = data.user.id

          // Upsert student profile record in Supabase Database
          await supabase.from('profiles').upsert({
            id: userId,
            name: details.name,
            email: details.email,
            student_id: details.student_id,
            major: details.major,
            bio: details.bio,
            preferences: preferences,
            updated_at: new Date().toISOString()
          })
        }
      } catch (err: any) {
        console.warn('Supabase signup execution note:', err)
      }
    }

    const newUser: StudentUser = {
      ...details,
      id: userId,
      avatar_initials: initials,
      gpa: 4.0,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...preferences
      }
    }

    // Generate and persist real personalized user courses, assignments, and schedule upon account creation
    try {
      const userCourses = generateUserCourses(newUser)
      const userAssignments = generateUserAssignments(newUser, userCourses)
      const userSchedule = generateUserSchedule(newUser, userCourses)

      if (typeof window !== 'undefined') {
        localStorage.setItem(`edupulse_courses_${newUser.id}`, JSON.stringify(userCourses))
        localStorage.setItem(`edupulse_assignments_${newUser.id}`, JSON.stringify(userAssignments))
        localStorage.setItem(`edupulse_schedule_${newUser.id}`, JSON.stringify(userSchedule))
      }
      if (isSupabaseConfigured) {
        Promise.resolve(supabase.from('courses').upsert(userCourses)).catch(() => {})
        Promise.resolve(supabase.from('assignments').upsert(userAssignments)).catch(() => {})
        Promise.resolve(supabase.from('schedule_events').upsert(userSchedule)).catch(() => {})
      }
    } catch (e) {
      console.warn('User initial data generation note:', e)
    }

    saveUserToStorage(newUser)
    return { success: true }
  }

  // Logout handler
  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {})
    }
    saveUserToStorage(null)
  }

  // Update profile handler
  const updateProfile = (updated: Partial<StudentUser>) => {
    if (!user) return
    const initials = updated.name
      ? updated.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : user.avatar_initials

    const newUserData: StudentUser = {
      ...user,
      ...updated,
      avatar_initials: initials
    }

    saveUserToStorage(newUserData)

    // Sync real-time with Supabase if active
    if (isSupabaseConfigured && user.id) {
      Promise.resolve(
        supabase.from('profiles').upsert({
          id: user.id,
          name: newUserData.name,
          major: newUserData.major,
          bio: newUserData.bio,
          updated_at: new Date().toISOString()
        })
      ).catch((e) => console.warn('Supabase profile update sync note:', e))
    }
  }

  // Update preferences handler
  const updatePreferences = (newPrefs: Partial<StudentPreferences>) => {
    if (!user) return
    const updatedPreferences = {
      ...user.preferences,
      ...newPrefs
    }
    const newUserData: StudentUser = {
      ...user,
      preferences: updatedPreferences
    }

    saveUserToStorage(newUserData)

    // Sync real-time with Supabase if active
    if (isSupabaseConfigured && user.id) {
      Promise.resolve(
        supabase.from('profiles').upsert({
          id: user.id,
          preferences: updatedPreferences,
          updated_at: new Date().toISOString()
        })
      ).catch((e) => console.warn('Supabase preferences update sync note:', e))
    }
  }

  const loginAsDemo = () => {
    saveUserToStorage(DEMO_STUDENT)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isRealtimeConnected,
        login,
        createAccount,
        logout,
        updateProfile,
        updatePreferences,
        loginAsDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
