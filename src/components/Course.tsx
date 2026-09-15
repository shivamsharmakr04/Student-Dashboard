'use client'

import React from 'react'
import { Course as CourseType } from '@/types/course'
import { ProgressBar } from './ProgressBar'
import { Code, Binary, Palette, Cpu, Cloud, BookOpen, PlayCircle, User } from 'lucide-react'

interface CourseProps {
  course: CourseType
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code: Code,
  Binary: Binary,
  Palette: Palette,
  Cpu: Cpu,
  Cloud: Cloud
}

export const CourseCard: React.FC<CourseProps> = ({ course }) => {
  const IconComponent = iconMap[course.icon_name] || BookOpen

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between">
      {/* Top Banner & Category */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${course.color_gradient || 'from-indigo-600 to-purple-600'} text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60">
            {course.category || 'General'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>
        
        {course.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-4 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.instructor}</span>
          </div>
        )}
      </div>

      {/* Progress & Action Footer */}
      <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Lessons</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {course.completed_lessons || Math.round((course.progress / 100) * (course.total_lessons || 20))} / {course.total_lessons || 20}
            </span>
          </div>
          <ProgressBar progress={course.progress} colorGradient={course.color_gradient} showLabel={false} />
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-semibold text-xs transition-all duration-200 group-hover:shadow-md">
          <PlayCircle className="w-4 h-4" />
          <span>Continue Lesson</span>
        </button>
      </div>
    </div>
  )
}

export default CourseCard
