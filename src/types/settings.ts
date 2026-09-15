export interface UserProfile {
  name: string
  email: string
  student_id: string
  major: string
  bio: string
  avatar_initials: string
}

export interface NotificationSettings {
  email_assignments: boolean
  email_exam_reminders: boolean
  email_announcements: boolean
  push_class_alerts: boolean
}

export interface SecuritySettings {
  two_factor_enabled: boolean
  last_password_change: string
}
