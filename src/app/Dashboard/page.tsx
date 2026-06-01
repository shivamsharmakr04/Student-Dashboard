import { supabase } from '@/lib/supabase'

export default async function DashboardPage() {

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')

  if (error) {
    throw new Error('Failed to fetch courses')
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ul>
        {courses?.map((course) => (
          <li key={course.id}>
            <h2>{course.title}</h2>
            <p>Progress: {course.progress}%</p>
          </li>
        ))}
      </ul>
    </main>
  )
}