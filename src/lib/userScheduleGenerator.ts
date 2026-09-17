import { ScheduleEvent, EventType } from '@/types/schedule'
import { Course } from '@/types/course'
import { StudentUser } from '@/types/auth'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

export function generateUserSchedule(user: StudentUser, courses: Course[]): ScheduleEvent[] {
  if (!courses || courses.length === 0) return []

  const events: ScheduleEvent[] = []
  const timeSlots = [
    { start: '09:00 AM', end: '10:30 AM' },
    { start: '11:00 AM', end: '12:30 PM' },
    { start: '01:30 PM', end: '03:00 PM' },
    { start: '03:30 PM', end: '05:00 PM' }
  ]

  courses.forEach((course, cIdx) => {
    const codePrefix = (course.category || 'CS').slice(0, 2).toUpperCase()
    const courseCode = `${codePrefix}-${301 + cIdx * 10}`

    const day1 = DAYS[cIdx % DAYS.length]
    const day2 = DAYS[(cIdx + 2) % DAYS.length]
    const slot1 = timeSlots[cIdx % timeSlots.length]
    const slot2 = timeSlots[(cIdx + 1) % timeSlots.length]

    // Lecture event
    events.push({
      id: `sched-${user.id}-${cIdx}-lec`,
      title: `${course.title} - Lecture`,
      course_code: courseCode,
      type: 'lecture',
      start_time: slot1.start,
      end_time: slot1.end,
      day: day1,
      location: cIdx % 2 === 0 ? 'Turing Science Center 204' : 'Ada Lovelace Hall 102',
      instructor: course.instructor || 'EduPulse Faculty',
      is_online: cIdx % 3 === 0,
      meeting_url: cIdx % 3 === 0 ? `https://zoom.us/j/edupulse-${cIdx}` : undefined,
      color: course.color_gradient || 'from-indigo-600 to-blue-600',
      notes: `Weekly interactive lecture session for ${course.title}.`
    })

    // Secondary session (Lab / Office Hours / Study Group)
    const eventType: EventType = cIdx % 3 === 0 ? 'lab' : cIdx % 3 === 1 ? 'office_hours' : 'study_group'
    events.push({
      id: `sched-${user.id}-${cIdx}-session`,
      title: `${course.title} - ${eventType === 'lab' ? 'Practical Lab' : eventType === 'office_hours' ? 'Office Hours' : 'Study Session'}`,
      course_code: courseCode,
      type: eventType,
      start_time: slot2.start,
      end_time: slot2.end,
      day: day2,
      location: eventType === 'office_hours' ? 'Zoom Virtual Office' : 'Design Studio 405',
      instructor: course.instructor || 'EduPulse Faculty',
      is_online: eventType === 'office_hours',
      meeting_url: eventType === 'office_hours' ? `https://zoom.us/j/office-hours-${cIdx}` : undefined,
      color: course.color_gradient || 'from-purple-600 to-indigo-600',
      notes: `Hands-on practice and Q&A for ${course.title}.`
    })
  })

  return events
}
