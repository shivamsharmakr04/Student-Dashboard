'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRealtimeAssignments, useRealtimeSchedule } from '@/lib/realtimeService'
import { Calendar, Clock, ArrowUpRight, CheckCircle2, Upload, ExternalLink, Video } from 'lucide-react'

interface UpcomingDeadlinesSectionProps {
  searchQuery?: string
}

export const UpcomingDeadlinesSection: React.FC<UpcomingDeadlinesSectionProps> = ({
  searchQuery = ''
}) => {
  const { assignments, submitAssignment, loading: assignmentsLoading } = useRealtimeAssignments()
  const { events, loading: scheduleLoading } = useRealtimeSchedule()
  const [activeTab, setActiveTab] = useState<'all' | 'assignments' | 'events'>('all')

  const pendingAssignments = assignments
    .filter((a) => a.status === 'pending' || a.status === 'overdue')
    .filter((a) =>
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course_code.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const upcomingEvents = events.filter((e) =>
    !searchQuery ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isLoading = assignmentsLoading || scheduleLoading

  const showAssignments = (activeTab === 'all' || activeTab === 'assignments') ? pendingAssignments.slice(0, 3) : []
  const showEvents = (activeTab === 'all' || activeTab === 'events') ? upcomingEvents.slice(0, 2) : []

  return (
    <div className="space-y-6" id="schedule">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Deadlines & Timetable</span>
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            {[
              { id: 'all', label: 'All' },
              { id: 'assignments', label: 'Tasks' },
              { id: 'events', label: 'Classes' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  activeTab === t.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : showAssignments.length === 0 && showEvents.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No matching deadlines or classes</p>
            <p className="text-[11px] text-slate-500">You are all caught up with your schedule!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {showAssignments.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-indigo-400 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
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

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Due: {item.due_date}</span>
                  </div>

                  <button
                    onClick={() => submitAssignment(item.id)}
                    className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline hover:text-indigo-700"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            ))}

            {showEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/60 hover:border-indigo-400 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
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

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{evt.start_time} - {evt.end_time}</span>
                  </div>

                  {evt.is_online && evt.meeting_url && (
                    <a
                      href={evt.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/Assignments"
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
        >
          <span>View Full Calendar & Assignments</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default UpcomingDeadlinesSection
