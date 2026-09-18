'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRealtimeAssignments, useRealtimeCourses } from '@/lib/realtimeService'
import { Clock, CheckCircle2, Trophy, Flame, TrendingUp } from 'lucide-react'

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

  const gpa = user?.gpa || 3.9
  const classRank = gpa >= 3.9 ? '#3 of 120' : gpa >= 3.5 ? '#8 of 120' : '#15 of 120'

  const totalStudyHrs = (goalHours * 2.8).toFixed(1)

  const stats = [
    {
      title: 'Study Hours',
      value: `${totalStudyHrs} hrs`,
      change: `Target: ${goalHours} hrs/week`,
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      title: 'Completed Tasks',
      value: `${completedAssignments} / ${totalAssignmentsCount}`,
      change: `${taskRatio}% completion rate`,
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      title: 'Class Rank',
      value: classRank,
      change: `GPA: ${gpa.toFixed(2)}`,
      icon: Trophy,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      title: 'Active Streak',
      value: '12 Days',
      change: 'Personal Best ⚡',
      icon: Flame,
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
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
      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                <h3 className="text-2xl font-extrabold text-slate-900">
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
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Weekly Learning Hours ({user?.name || 'Student'})
            </h3>
            <p className="text-xs text-slate-500">
              Hours spent across all {courses.length} enrolled courses based on your {goalHours} hrs/week target
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
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
                  className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 rounded-t-lg transition-all duration-300 shadow-sm"
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
