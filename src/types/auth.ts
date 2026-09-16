export interface StudentPreferences {
  preferred_tracks: string[]
  learning_goal_hours: number // hours per week
  study_mode: 'Project-Based' | 'Exam Prep' | 'Concept Mastery' | 'Fast-Track'
  email_assignments: boolean
  email_exams: boolean
  email_announcements: boolean
  push_alerts: boolean
  theme: 'light' | 'dark' | 'system'
}

export interface StudentUser {
  id: string
  name: string
  email: string
  student_id: string
  major: string
  bio: string
  avatar_initials: string
  year_level: string
  gpa?: number
  preferences: StudentPreferences
}

export interface AuthState {
  user: StudentUser | null
  isAuthenticated: boolean
  isLoading: boolean
}
