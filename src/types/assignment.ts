export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue'

export interface Assignment {
  id: string
  title: string
  course_code: string
  course_name: string
  due_date: string         // e.g. "Tomorrow", "Friday, Sep 19"
  due_time: string         // e.g. "11:59 PM"
  status: AssignmentStatus
  weightage: number        // e.g. 15 (%)
  max_score: number        // e.g. 100
  earned_score?: number    // e.g. 96
  description: string
  file_format?: string     // e.g. ".pdf, .zip, .ipynb"
  submission_date?: string // e.g. "Sep 12 at 8:30 PM"
  feedback?: string        // e.g. "Great optimization on graph traversal complexity!"
}
