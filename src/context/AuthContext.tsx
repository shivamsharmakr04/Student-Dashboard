'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { StudentUser, StudentPreferences } from '@/types/auth'
import { supabase } from '@/lib/supabase'

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

  useEffect(() => {
    // Restore user session from localStorage if present
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) {
          setUser(parsed)
        }
      } else {
        // Save default demo student to local storage for seamless experience
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STUDENT))
      }
    } catch (e) {
      console.warn('Failed to parse stored student session:', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveUserToStorage = (userData: StudentUser | null) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password.' }
    }

    // Try Supabase auth if real credentials present
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
        if (error) throw error
        if (data.user) {
          const authUser: StudentUser = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            student_id: data.user.user_metadata?.student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
            major: data.user.user_metadata?.major || 'General Studies',
            bio: data.user.user_metadata?.bio || 'Enthusiastic university student.',
            avatar_initials: (data.user.user_metadata?.name || email).slice(0, 2).toUpperCase(),
            year_level: data.user.user_metadata?.year_level || 'Year 1',
            gpa: 3.8,
            preferences: data.user.user_metadata?.preferences || DEFAULT_PREFERENCES
          }
          saveUserToStorage(authUser)
          return { success: true }
        }
      } catch (err: any) {
        console.warn('Supabase auth login error, checking fallback demo/local storage:', err)
      }
    }

    // Fallback: Check local storage or match email with demo student
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
        } catch (e) {
          // ignore error
        }
      }

      saveUserToStorage(loggedUser)
      return { success: true }
    }

    return { success: false, error: 'Invalid email or password.' }
  }

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

    const newUser: StudentUser = {
      ...details,
      id: `stu-${Date.now()}`,
      avatar_initials: initials,
      gpa: 4.0,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...preferences
      }
    }

    // Attempt Supabase SignUp if env configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      try {
        await supabase.auth.signUp({
          email: details.email,
          password: 'Password123!',
          options: {
            data: {
              name: details.name,
              major: details.major,
              student_id: details.student_id,
              preferences
            }
          }
        })
      } catch (err) {
        console.warn('Supabase signup fallback notice:', err)
      }
    }

    saveUserToStorage(newUser)
    return { success: true }
  }

  const logout = () => {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    ) {
      supabase.auth.signOut().catch(() => {})
    }
    saveUserToStorage(null)
  }

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
  }

  const updatePreferences = (newPrefs: Partial<StudentPreferences>) => {
    if (!user) return
    const newUserData: StudentUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...newPrefs
      }
    }
    saveUserToStorage(newUserData)
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
