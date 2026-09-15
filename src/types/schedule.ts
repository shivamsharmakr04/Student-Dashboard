export type EventType = 'lecture' | 'lab' | 'office_hours' | 'study_group' | 'exam'

export interface ScheduleEvent {
  id: string
  title: string
  course_code: string
  type: EventType
  start_time: string // e.g. "09:00 AM"
  end_time: string   // e.g. "10:30 AM"
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  location: string   // e.g. "Turing Hall 302" or "Zoom Online"
  instructor?: string
  is_online?: boolean
  meeting_url?: string
  color?: string
  notes?: string
}
