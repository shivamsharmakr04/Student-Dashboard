'use client'

import React from 'react'
import Link from 'next/link'
import { useRealtimeAssignments, useRealtimeSchedule } from '@/lib/realtimeService'
import { Calendar, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react'

export const UpcomingDeadlinesSection: React.FC = () => {
  const { assignments, loading: assignmentsLoading } = useRealtimeAssignments()
  const { events, loading: scheduleLoading } = useRealtimeSchedule()

  const pendingAssignments = assignments
    .filter((a) => a.status === 'pending' || a.status === 'overdue')
    .slice(0, 3)

  const upcomingEvents = events.slice(0, 2)

  const isLoading = assignmentsLoading || scheduleLoading

  return (
    <div className="space-y-6" id="schedule">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Upcoming Deadlines & Schedule</span>
          </h3>
          <span className="text-xs text-slate-400">Real-time</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pendingAssignments.length === 0 && upcomingEvents.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No pending deadlines</p>
            <p className="text-[11px] text-slate-500">You are all caught up with your coursework!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAssignments.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      item.status === 'overdue'
                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    {item.status === 'overdue' ? 'Overdue' : 'Assignment'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.course_code}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                  {item.title}
                </h4>

                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Due: {item.due_date} at {item.due_time}</span>
                </div>
              </div>
            ))}

            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/60 hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-indigo-500/10 text-indigo-700 border-indigo-200">
                    {evt.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-500">
                    {evt.day}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                  {evt.title}
                </h4>

                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span>{evt.start_time} - {evt.end_time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/Assignments"
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
        >
          <span>View Full Academic Tasks & Calendar</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default UpcomingDeadlinesSection
