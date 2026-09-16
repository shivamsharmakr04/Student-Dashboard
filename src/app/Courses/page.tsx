'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { useRealtimeCourses } from '@/lib/realtimeService'
import { Course } from '@/types/course'
import { ProgressBar } from '@/components/ProgressBar'
import {
  BookOpen,
  Search,
  Filter,
  PlayCircle,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Video,
  X,
  ChevronRight
} from 'lucide-react'

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const { courses, updateCourseProgress } = useRealtimeCourses()

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && course.progress < 100) ||
      (activeTab === 'completed' && course.progress === 100)
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.category && course.category.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                My Enrolled Courses
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                {courses.length} Enrolled
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Access video lectures, syllabus modules, course progress, and study materials
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
          </div>
        </header>

        {/* Summary Metric Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Courses</p>
              <p className="text-xl font-extrabold text-slate-900">{courses.length} Courses</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed Lessons</p>
              <p className="text-xl font-extrabold text-slate-900">68 of 108 Lessons</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Registered Credits</p>
              <p className="text-xl font-extrabold text-slate-900">18 Academic Credits</p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter Catalog:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Courses', count: courses.length },
              { id: 'active', label: 'In Progress', count: courses.filter((c) => c.progress < 100).length },
              { id: 'completed', label: 'Completed', count: courses.filter((c) => c.progress === 100).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${
                      course.color_gradient || 'from-indigo-600 to-purple-600'
                    } text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/80">
                    {course.category || 'Computer Science'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
                  {course.description}
                </p>

                {course.instructor && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instructor: <strong className="text-slate-800 font-bold">{course.instructor}</strong></span>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Lessons Progress</span>
                    <span className="font-semibold text-slate-700">
                      {course.completed_lessons} / {course.total_lessons} Completed
                    </span>
                  </div>
                  <ProgressBar progress={course.progress} colorGradient={course.color_gradient} showLabel={false} />
                </div>

                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Course Modules</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Lesson Modal Preview */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">{selectedCourse.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Placeholder */}
              <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-6 space-y-3 shadow-inner">
                <PlayCircle className="w-16 h-16 text-indigo-400 animate-pulse" />
                <p className="text-sm font-bold text-slate-200">
                  Module 4: Next-Gen Server Components & Streaming SSR
                </p>
                <p className="text-xs text-slate-400">Duration: 42 mins • HD 1080p</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  Instructor: <strong className="text-slate-800">{selectedCourse.instructor}</strong>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Continue Next Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
