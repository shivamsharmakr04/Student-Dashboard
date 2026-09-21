'use client'

import React, { useState } from 'react'
import CourseCard from '@/components/Course'
import { useRealtimeCourses } from '@/lib/realtimeService'
import { Course } from '@/types/course'
import { BookMarked, Filter, Sparkles, BookOpen } from 'lucide-react'

interface EnrolledCoursesSectionProps {
  searchQuery?: string
  onResumeCourse?: (course: Course) => void
}

export const EnrolledCoursesSection: React.FC<EnrolledCoursesSectionProps> = ({
  searchQuery = '',
  onResumeCourse
}) => {
  const { courses, loading } = useRealtimeCourses()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all')

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && course.progress < 100) ||
      (activeTab === 'completed' && course.progress === 100)
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.category && course.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesSearch
  })

  return (
    <div className="lg:col-span-2 space-y-6" id="courses">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            <span>Enrolled Courses</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
              {courses.length} Active
            </span>
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-white border border-slate-200/80 p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="h-2 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No matching courses found.</p>
          <p className="text-xs text-slate-500">
            {searchQuery
              ? `No courses matching "${searchQuery}". Try a different keyword.`
              : 'Try selecting a different filter tab.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onResume={onResumeCourse}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCoursesSection
