import React from 'react'
import Sidebar from '@/components/Sidebar'
import HeroCard from '@/components/HeroCard'
import ActivityCard from '@/components/ActivityCard'
import EnrolledCoursesSection from '@/components/EnrolledCoursesSection'
import { Search, Bell, Calendar, Clock, ArrowUpRight } from 'lucide-react'

export const metadata = {
  title: 'Student Dashboard | EduPulse',
  description: 'Manage your courses, track learning progress, and view upcoming deadlines.',
}

export default async function DashboardPage() {
  const upcomingDeadlines = [
    {
      title: 'Data Structures Midterm Exam',
      course: 'CS-301',
      date: 'Tomorrow, 10:00 AM',
      type: 'Exam',
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      title: 'UI Component Library Submission',
      course: 'DES-204',
      date: 'Friday, 11:59 PM',
      type: 'Assignment',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      title: 'PyTorch Model Training Pipeline',
      course: 'DS-402',
      date: 'Sunday, 5:00 PM',
      type: 'Project',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
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
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
              />
            </div>

            {/* Notification Icon */}
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Hero Welcome Banner */}
        <HeroCard />

        {/* Activity Statistics & Weekly Visual Breakdown */}
        <ActivityCard />

        {/* Main Content Grid: Courses (2/3) + Upcoming Deadlines (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Courses Section (Dynamic User Courses) */}
          <EnrolledCoursesSection />

          {/* Right Sidebar Widget: Upcoming Deadlines */}
          <div className="space-y-6" id="schedule">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Upcoming Deadlines</span>
                </h3>
                <span className="text-xs text-slate-400">This Week</span>
              </div>

              <div className="space-y-4">
                {upcomingDeadlines.map((item) => (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-indigo-400 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.color}`}>
                        {item.type}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.course}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                <span>View Full Academic Calendar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}