import { Assignment } from '@/types/assignment'
import { Course } from '@/types/course'
import { StudentUser } from '@/types/auth'

export function generateUserAssignments(user: StudentUser, courses: Course[]): Assignment[] {
  if (!courses || courses.length === 0) return []

  const assignments: Assignment[] = []

  courses.forEach((course, idx) => {
    const codePrefix = (course.category || 'CS').slice(0, 2).toUpperCase()
    const courseCode = `${codePrefix}-${301 + idx * 10}`

    // Assignment 1: Active task (pending or submitted)
    assignments.push({
      id: `assign-${user.id}-${idx}-1`,
      title: `${course.title.split('&')[0].trim()} Core Implementation Project`,
      course_code: courseCode,
      course_name: course.title,
      due_date: idx % 2 === 0 ? 'Friday, Sep 19' : 'Sunday, Sep 21',
      due_time: '11:59 PM',
      status: idx === 0 ? 'pending' : idx === 1 ? 'submitted' : 'graded',
      submission_date: idx === 1 ? 'Sep 13 at 09:45 PM' : undefined,
      weightage: 15 + (idx % 3) * 5,
      max_score: 100,
      earned_score: idx >= 2 ? 92 + (idx % 7) : undefined,
      description: `Practical implementation project for ${course.title}. Apply core algorithms and token patterns.`,
      file_format: '.zip, .pdf, GitHub URL',
      feedback: idx >= 2 ? `Outstanding submission for ${course.title}! Excellent code organization and design structure.` : undefined
    })

    // Assignment 2: Graded review task
    if (idx < 4) {
      assignments.push({
        id: `assign-${user.id}-${idx}-2`,
        title: `${course.title.split(' ')[0]} Midterm Problem Set`,
        course_code: courseCode,
        course_name: course.title,
        due_date: 'Sep 10',
        due_time: '11:59 PM',
        status: idx === 3 ? 'overdue' : 'graded',
        submission_date: idx !== 3 ? 'Sep 09 at 10:15 PM' : undefined,
        weightage: 10,
        max_score: 100,
        earned_score: idx !== 3 ? 88 + (idx % 10) : undefined,
        description: `Comprehensive evaluation covering theoretical principles and code exercises in ${course.title}.`,
        file_format: '.pdf, .py, .ts',
        feedback: idx !== 3 ? `Great mastery of fundamental concepts in ${course.title}. Clean analysis.` : undefined
      })
    }
  })

  return assignments
}
