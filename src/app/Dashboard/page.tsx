'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import HeroCard from '@/components/HeroCard'
import ActivityCard from '@/components/ActivityCard'
import EnrolledCoursesSection from '@/components/EnrolledCoursesSection'
import UpcomingDeadlinesSection from '@/components/UpcomingDeadlinesSection'
import { Course } from '@/types/course'
import { useRealtimeCourses } from '@/lib/realtimeService'
import { Search, Bell, X, CheckCircle2, Video, PlayCircle, Clock, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const { updateCourseProgress } = useRealtimeCourses()

  const notifications = [
    {
      id: 1,
      title: 'Assignment Due Tomorrow',
      desc: 'CS-301 Algorithm Analysis & Design Report is due at 11:59 PM',
      time: '1h ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 2,
      title: 'New Course Lecture Available',
      desc: 'Module 4: React Server Components uploaded in Web Development',
      time: '3h ago',
      unread: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Midterm Examination Hall',
      desc: 'Room A-104 assigned for Friday Midterm Exam',
      time: '1d ago',
      unread: false,
      type: 'alert'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Student Dashboard
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Overview of your enrolled courses, statistics, and daily schedule
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Realtime Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, topics, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Notification Drawer Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 bg-white border rounded-xl transition shadow-sm ${
                  showNotifications ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Notification Popover Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Notifications</span>
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                          n.unread ? 'bg-indigo-50/60 border-indigo-200/80' : 'bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Welcome Banner */}
        <HeroCard />

        {/* Activity Statistics & Weekly Visual Breakdown */}
        <ActivityCard />

        {/* Main Content Grid: Courses (2/3) + Upcoming Deadlines (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Courses Section (Filtered by real-time search) */}
          <EnrolledCoursesSection
            searchQuery={searchQuery}
            onResumeCourse={(course) => setSelectedCourse(course)}
          />

          {/* Right Sidebar Widget: Upcoming Deadlines */}
          <UpcomingDeadlinesSection searchQuery={searchQuery} />
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

              {/* Video Player Box */}
              <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-6 space-y-3 shadow-inner">
                <PlayCircle className="w-16 h-16 text-indigo-400 animate-pulse" />
                <p className="text-sm font-bold text-slate-200">
                  Lesson {(selectedCourse.completed_lessons || 0) + 1}: Core Concepts & Practice Application
                </p>
                <p className="text-xs text-slate-400">
                  {selectedCourse.category} • Instructor: {selectedCourse.instructor || 'Faculty'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500">
                  Progress: <strong className="text-slate-800">{selectedCourse.completed_lessons || 0} / {selectedCourse.total_lessons || 20} Lessons ({selectedCourse.progress}%)</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const total = selectedCourse.total_lessons || 20
                      const currentComp = selectedCourse.completed_lessons || 0
                      if (currentComp < total) {
                        const newComp = currentComp + 1
                        const newProg = Math.round((newComp / total) * 100)
                        updateCourseProgress(selectedCourse.id, newProg, newComp)
                        setSelectedCourse({
                          ...selectedCourse,
                          completed_lessons: newComp,
                          progress: newProg
                        })
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
                  >
                    Mark Lesson Completed (+1)
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Close Player
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}