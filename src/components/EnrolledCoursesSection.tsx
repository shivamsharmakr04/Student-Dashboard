'use client'

import React from 'react'
import CourseCard from '@/components/Course'
import { useRealtimeCourses } from '@/lib/realtimeService'
import { BookMarked, Filter, Sparkles } from 'lucide-react'

export const EnrolledCoursesSection: React.FC = () => {
  const { courses, loading } = useRealtimeCourses()

  return (
    <div className="lg:col-span-2 space-y-6" id="courses">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            <span>Enrolled Courses</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
              {courses.length} Active
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Tailored to Your Tracks
          </span>
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
      ) : courses.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No courses currently enrolled.</p>
          <p className="text-xs text-slate-500">
            Create an account or select study tracks to generate your personalized course portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCoursesSection
