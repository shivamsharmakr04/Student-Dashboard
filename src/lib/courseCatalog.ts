import { Course } from '@/types/course'
import { StudentUser } from '@/types/auth'

export const MASTER_COURSE_CATALOG: Record<string, Omit<Course, 'id' | 'user_id'>> = {
  // Web Development Track
  'nextjs-architecture': {
    title: 'Advanced React & Next.js 16 Architecture',
    category: 'Web Development',
    progress: 75,
    icon_name: 'Code',
    instructor: 'Dr. Sarah Jenkins',
    total_lessons: 24,
    completed_lessons: 18,
    color_gradient: 'from-blue-600 to-indigo-600',
    description: 'Master server components, streaming SSR, performance tuning, and fullstack state management.'
  },
  'fullstack-web-security': {
    title: 'Fullstack Web Security & OAuth 2.0',
    category: 'Web Development',
    progress: 40,
    icon_name: 'Code',
    instructor: 'Prof. David K.',
    total_lessons: 20,
    completed_lessons: 8,
    color_gradient: 'from-sky-500 to-blue-700',
    description: 'Protect modern web applications against XSS, CSRF, JWT exploits, and secure session state.'
  },
  'typescript-mastery': {
    title: 'TypeScript 5 Enterprise Design Patterns',
    category: 'Web Development',
    progress: 50,
    icon_name: 'Code',
    instructor: 'Elena Rostova',
    total_lessons: 16,
    completed_lessons: 8,
    color_gradient: 'from-cyan-600 to-indigo-700',
    description: 'Generics, conditional types, AST parsing, and strict type safety for large frontend codebases.'
  },

  // Computer Science Track
  'dsa-python': {
    title: 'Data Structures & Algorithms in Python',
    category: 'Computer Science',
    progress: 60,
    icon_name: 'Binary',
    instructor: 'Prof. Michael Chen',
    total_lessons: 30,
    completed_lessons: 18,
    color_gradient: 'from-purple-600 to-pink-600',
    description: 'In-depth exploration of graph algorithms, dynamic programming, and complexity analysis.'
  },
  'operating-systems': {
    title: 'Operating Systems & Distributed Concurrency',
    category: 'Computer Science',
    progress: 35,
    icon_name: 'Binary',
    instructor: 'Dr. Robert Vance',
    total_lessons: 22,
    completed_lessons: 8,
    color_gradient: 'from-violet-600 to-purple-800',
    description: 'Process scheduling, memory virtual allocation, multithreading locks, and IPC system calls.'
  },

  // Data Science & AI Track
  'ml-engineering': {
    title: 'Machine Learning Engineering Fundamentals',
    category: 'Data Science & AI',
    progress: 85,
    icon_name: 'Cpu',
    instructor: 'Alex Rivera',
    total_lessons: 20,
    completed_lessons: 17,
    color_gradient: 'from-emerald-500 to-teal-700',
    description: 'Building pipeline workflows, model deployment, and feature engineering with PyTorch.'
  },
  'deep-learning-pytorch': {
    title: 'Deep Neural Networks & Transformer Models',
    category: 'Data Science & AI',
    progress: 25,
    icon_name: 'Cpu',
    instructor: 'Dr. Andrew Ng',
    total_lessons: 28,
    completed_lessons: 7,
    color_gradient: 'from-emerald-600 to-cyan-700',
    description: 'Attention mechanisms, LLM fine-tuning, backpropagation calculus, and GPU memory optimization.'
  },

  // UI/UX Design Track
  'design-systems': {
    title: 'UI/UX Design Systems & Micro-Interactions',
    category: 'UI/UX Design',
    progress: 45,
    icon_name: 'Palette',
    instructor: 'Elena Rostova',
    total_lessons: 18,
    completed_lessons: 8,
    color_gradient: 'from-amber-500 to-rose-500',
    description: 'Crafting cohesive token systems, high-fidelity prototypes, and accessible interface designs.'
  },
  'user-research': {
    title: 'User Research Methods & Usability Metrics',
    category: 'UI/UX Design',
    progress: 60,
    icon_name: 'Palette',
    instructor: 'Maya Lin',
    total_lessons: 14,
    completed_lessons: 8,
    color_gradient: 'from-pink-500 to-rose-600',
    description: 'Conducting user interviews, card sorting, wireframing, and data-driven usability testing.'
  },

  // Cloud Infrastructure Track
  'cloud-devops': {
    title: 'Cloud Infrastructure & DevOps Mastery',
    category: 'Cloud Infrastructure',
    progress: 25,
    icon_name: 'Cloud',
    instructor: 'Marcus Vance',
    total_lessons: 16,
    completed_lessons: 4,
    color_gradient: 'from-cyan-500 to-blue-600',
    description: 'Docker containerization, Kubernetes orchestration, CI/CD automation, and Terraform.'
  },
  'aws-cloud-architecture': {
    title: 'AWS Cloud Solutions & Microservices',
    category: 'Cloud Infrastructure',
    progress: 55,
    icon_name: 'Cloud',
    instructor: 'Samantha Wright',
    total_lessons: 25,
    completed_lessons: 14,
    color_gradient: 'from-sky-600 to-indigo-800',
    description: 'Designing fault-tolerant VPC networks, Serverless Lambda pipelines, and S3 security.'
  },

  // Cybersecurity Track
  'ethical-hacking': {
    title: 'Ethical Hacking & Network Defense',
    category: 'Cybersecurity',
    progress: 30,
    icon_name: 'Shield',
    instructor: 'Cmdr. James Sterling',
    total_lessons: 22,
    completed_lessons: 7,
    color_gradient: 'from-rose-600 to-red-800',
    description: 'Penetration testing, packet inspection, cryptography fundamentals, and incident response.'
  },

  // Mobile Development Track
  'flutter-mobile-dev': {
    title: 'Cross-Platform Mobile Apps with Flutter',
    category: 'Mobile Development',
    progress: 50,
    icon_name: 'Smartphone',
    instructor: 'Lucas Silva',
    total_lessons: 20,
    completed_lessons: 10,
    color_gradient: 'from-blue-500 to-teal-500',
    description: 'Native iOS & Android compilation, reactive state management, and mobile UI animation.'
  }
}

export const DEMO_COURSES: Course[] = [
  {
    id: 'demo-1',
    user_id: 'demo-student-001',
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
    id: 'demo-2',
    user_id: 'demo-student-001',
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
    id: 'demo-3',
    user_id: 'demo-student-001',
    title: 'UI/UX Design Systems & Micro-Interactions',
    category: 'UI/UX Design',
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
    id: 'demo-4',
    user_id: 'demo-student-001',
    title: 'Machine Learning Engineering Fundamentals',
    category: 'Data Science & AI',
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
    id: 'demo-5',
    user_id: 'demo-student-001',
    title: 'Cloud Infrastructure & DevOps Mastery',
    category: 'Cloud Infrastructure',
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

export function generateUserCourses(user: StudentUser): Course[] {
  if (!user || !user.id) return []

  // If user is demo user, return Alex Morgan's demo courses
  if (user.email?.toLowerCase() === 'alex.morgan@university.edu' || user.id === 'demo-student-001') {
    return DEMO_COURSES.map((c) => ({ ...c, user_id: user.id }))
  }

  const userTracks = user.preferences?.preferred_tracks || ['Web Development', 'Computer Science']
  const major = user.major || ''

  const catalogEntries = Object.entries(MASTER_COURSE_CATALOG)

  // Filter courses that match the user's selected study tracks or major
  let matched = catalogEntries.filter(([_, course]) => {
    const catMatch = userTracks.some(
      (t) => t.toLowerCase() === course.category?.toLowerCase()
    )
    const majorMatch = major.toLowerCase().includes(course.category?.toLowerCase() || '')
    return catMatch || majorMatch
  })

  // If fewer than 3 matched, pick fallback mix from catalog
  if (matched.length < 3) {
    matched = catalogEntries.slice(0, 4)
  }

  // Cap max courses at 6
  if (matched.length > 6) {
    matched = matched.slice(0, 6)
  }

  return matched.map(([slug, item], index) => {
    const totalLessons = item.total_lessons || 20
    const initialCompleted = Math.min(totalLessons, Math.floor((index + 1) * 2))
    const initialProgress = Math.round((initialCompleted / totalLessons) * 100)

    return {
      ...item,
      id: `course-${user.id}-${slug}`,
      user_id: user.id,
      progress: initialProgress,
      completed_lessons: initialCompleted,
      total_lessons: totalLessons,
      created_at: new Date().toISOString()
    }
  })
}
