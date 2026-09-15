import { createClient } from '@supabase/supabase-js'
import { Course } from '@/types/course'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced React & Next.js 16 Architecture',
    category: 'Web Development',
    progress: 85,
    icon_name: 'Code',
    instructor: 'Dr. Sarah Jenkins',
    total_lessons: 24,
    completed_lessons: 20,
    color_gradient: 'from-blue-600 to-indigo-600',
    description: 'Master server components, streaming, performance tuning, and fullstack state management.',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Data Structures & Algorithms in Python',
    category: 'Computer Science',
    progress: 60,
    icon_name: 'Binary',
    instructor: 'Prof. Michael Chen',
    total_lessons: 30,
    completed_lessons: 18,
    color_gradient: 'from-purple-600 to-pink-600',
    description: 'In-depth exploration of graph algorithms, dynamic programming, and complexity analysis.',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'UI/UX Design Systems & Micro-Interactions',
    category: 'Design & Product',
    progress: 42,
    icon_name: 'Palette',
    instructor: 'Elena Rostova',
    total_lessons: 18,
    completed_lessons: 8,
    color_gradient: 'from-amber-500 to-rose-500',
    description: 'Crafting cohesive token systems, high-fidelity prototypes, and accessible interface designs.',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Machine Learning Engineering Fundamentals',
    category: 'Data Science',
    progress: 90,
    icon_name: 'Cpu',
    instructor: 'Alex Rivera',
    total_lessons: 20,
    completed_lessons: 18,
    color_gradient: 'from-emerald-500 to-teal-700',
    description: 'Building pipeline workflows, model deployment, and feature engineering with PyTorch.',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Cloud Infrastructure & DevOps Mastery',
    category: 'Cloud Computing',
    progress: 25,
    icon_name: 'Cloud',
    instructor: 'Marcus Vance',
    total_lessons: 16,
    completed_lessons: 4,
    color_gradient: 'from-cyan-500 to-blue-600',
    description: 'Docker containerization, Kubernetes orchestration, CI/CD automation, and Terraform.',
    created_at: new Date().toISOString()
  }
]

export async function getCourses(): Promise<Course[]> {
  // If real Supabase keys exist, attempt fetching from Supabase table
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  ) {
    try {
      const { data, error } = await supabase.from('courses').select('*')
      if (!error && data && data.length > 0) {
        return data as Course[]
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to mock courses:', e)
    }
  }

  // Default fallback mock data
  return MOCK_COURSES
}