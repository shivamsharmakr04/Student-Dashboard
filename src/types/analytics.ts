export interface SubjectPerformance {
  course_code: string
  course_name: string
  score: number           // e.g. 94 (%)
  grade: string           // e.g. "A+"
  credits: number         // e.g. 4
  color: string           // e.g. "from-blue-600 to-indigo-600"
}

export interface MonthlyStudyDistribution {
  month: string
  hours: number
  target: number
}

export interface SkillMastery {
  skill: string
  level: number           // e.g. 92 (%)
  category: string
  status: 'Mastered' | 'Proficient' | 'Developing'
}

export interface AcademicInsight {
  id: string
  title: string
  category: 'strength' | 'recommendation' | 'milestone'
  description: string
  impact: 'High' | 'Medium'
}
