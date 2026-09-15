'use client'

import React from 'react'
import { Clock, CheckCircle2, Trophy, Flame, TrendingUp } from 'lucide-react'

export const ActivityCard: React.FC = () => {
  const stats = [
    {
      title: 'Study Hours',
      value: '28.5 hrs',
      change: '+14% vs last week',
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      title: 'Completed Tasks',
      value: '24 / 28',
      change: '85% completion rate',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      title: 'Class Rank',
      value: '#4 of 120',
      change: 'Up 2 positions',
      icon: Trophy,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      title: 'Active Streak',
      value: '12 Days',
      change: 'Personal Best ⚡',
      icon: Flame,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    }
  ]

  const weeklyActivity = [
    { day: 'Mon', hours: 4.5, percentage: 75 },
    { day: 'Tue', hours: 6.0, percentage: 100 },
    { day: 'Wed', hours: 3.5, percentage: 58 },
    { day: 'Thu', hours: 5.0, percentage: 83 },
    { day: 'Fri', hours: 4.0, percentage: 66 },
    { day: 'Sat', hours: 2.5, percentage: 41 },
    { day: 'Sun', hours: 3.0, percentage: 50 }
  ]

  return (
    <div className="space-y-6">
      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500 inline" />
                  <span>{stat.change}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Weekly Learning Activity Visual Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Learning Hours
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hours spent across all active courses this week
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Avg: 4.1 hrs/day
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
                  className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-400 rounded-t-lg transition-all duration-300 shadow-sm"
                  style={{ height: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
