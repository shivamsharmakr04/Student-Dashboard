import React from 'react'
import Sidebar from '@/components/Sidebar'
import HeroCard from '@/components/HeroCard'
import ActivityCard from '@/components/ActivityCard'
import EnrolledCoursesSection from '@/components/EnrolledCoursesSection'
import UpcomingDeadlinesSection from '@/components/UpcomingDeadlinesSection'
import { Search, Bell } from 'lucide-react'

export const metadata = {
  title: 'Student Dashboard | EduPulse',
  description: 'Manage your courses, track learning progress, and view upcoming deadlines.',
}

export default async function DashboardPage() {
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

          {/* Right Sidebar Widget: Upcoming Deadlines (Dynamic Real User Data) */}
          <UpcomingDeadlinesSection />
        </div>
      </main>
    </div>
  )
}