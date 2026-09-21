'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRealtimeAssignments, useRealtimeCourses } from '@/lib/realtimeService'
import { Clock, CheckCircle2, Award, BookOpen, TrendingUp } from 'lucide-react'

export const ActivityCard: React.FC = () => {
  const { user } = useAuth()
  const { courses } = useRealtimeCourses()
  const { assignments } = useRealtimeAssignments()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const goalHours = user?.preferences?.learning_goal_hours || 10
  const completedAssignments = mounted ? assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length : 3
  const totalAssignmentsCount = mounted ? assignments.length : 5
  const totalAssignments = totalAssignmentsCount || 1
  const taskRatio = Math.round((completedAssignments / totalAssignments) * 100)

  const gpa = user?.gpa || 3.92
  const totalStudyHrs = (goalHours * 2.8).toFixed(1)

  const stats = [
    {
      title: 'Weekly Study Effort',
      value: `${totalStudyHrs} hrs`,
      change: `Target: ${goalHours} hrs/week`,
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      title: 'Coursework Progress',
      value: `${completedAssignments} / ${totalAssignmentsCount}`,
      change: `${taskRatio}% completed`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      title: 'Cumulative GPA',
      value: `${gpa.toFixed(2)}`,
      change: gpa >= 3.8 ? 'Top Honor Roll ⭐' : 'Good Academic Standing',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Active Courses',
      value: `${courses.length} Enrolled`,
      change: `${courses.filter(c => c.progress === 100).length} Completed`,
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ]

  // Dynamic daily distribution scaling to target goal hours
  const dailyTarget = goalHours / 5
  const weeklyActivity = [
    { day: 'Mon', hours: +(dailyTarget * 0.9).toFixed(1), percentage: 70 },
    { day: 'Tue', hours: +(dailyTarget * 1.2).toFixed(1), percentage: 95 },
    { day: 'Wed', hours: +(dailyTarget * 0.8).toFixed(1), percentage: 60 },
    { day: 'Thu', hours: +(dailyTarget * 1.1).toFixed(1), percentage: 85 },
    { day: 'Fri', hours: +(dailyTarget * 1.0).toFixed(1), percentage: 75 },
    { day: 'Sat', hours: +(dailyTarget * 0.5).toFixed(1), percentage: 40 },
    { day: 'Sun', hours: +(dailyTarget * 0.6).toFixed(1), percentage: 50 }
  ]

  const dailyAvg = (goalHours / 7).toFixed(1)

  return (
    <div className="space-y-6">
      {/* 4 Key Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>{stat.change}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Weekly Learning Activity Visual Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Weekly Study Hours & Activity
            </h3>
            <p className="text-xs text-slate-500">
              Tracked study time across all {courses.length} active courses (Goal: {goalHours} hrs/week)
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 w-fit">
            Avg: {dailyAvg} hrs/day
          </span>
        </div>

        {/* Bar Visual Chart */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-40 pt-6 px-2">
          {weeklyActivity.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2 group h-full justify-end">
              <div className="relative w-full flex justify-center items-end h-full">
                {/* Tooltip on hover */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap">
                  {item.hours} hrs
                </div>
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 rounded-t-xl transition-all duration-300 shadow-sm"
                  style={{ height: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityCard
