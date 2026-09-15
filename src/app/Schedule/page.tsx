'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { MOCK_SCHEDULE_EVENTS } from '@/lib/scheduleData'
import { ScheduleEvent, EventType } from '@/types/schedule'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  User,
  BookOpen,
  Filter,
  CheckCircle2,
  ExternalLink,
  Plus,
  BellRing,
  Sparkles,
  Search
} from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Monday')
  const [filterType, setFilterType] = useState<string>('all')

  // Filter events by day and type
  const dayEvents = MOCK_SCHEDULE_EVENTS.filter(
    (event) => event.day === selectedDay
  ).filter((event) => {
    if (filterType === 'all') return true
    if (filterType === 'online') return event.is_online === true
    return event.type === filterType
  })

  const getEventTypeBadge = (type: EventType) => {
    switch (type) {
      case 'lecture':
        return { label: 'Lecture', color: 'bg-blue-500/10 text-blue-700 border-blue-200' }
      case 'lab':
        return { label: 'Practical Lab', color: 'bg-purple-500/10 text-purple-700 border-purple-200' }
      case 'office_hours':
        return { label: 'Office Hours', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' }
      case 'study_group':
        return { label: 'Study Group', color: 'bg-amber-500/10 text-amber-700 border-amber-200' }
      case 'exam':
        return { label: 'Examination', color: 'bg-rose-500/10 text-rose-700 border-rose-200 font-bold' }
      default:
        return { label: 'Class', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    }
  }

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
                Academic Schedule & Timetable
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                Spring 2026
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Manage your daily lectures, lab sessions, office hours, and study groups
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95">
              <Plus className="w-4 h-4" />
              <span>Add Custom Event</span>
            </button>
          </div>
        </header>

        {/* Day Selector Tabs & Summary Row */}
        <div className="space-y-4">
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {DAYS.map((day) => {
              const count = MOCK_SCHEDULE_EVENTS.filter((e) => e.day === day).length
              const isSelected = selectedDay === day

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{day}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Events Scheduled</p>
                <p className="text-lg font-extrabold text-slate-900">{dayEvents.length} Sessions for {selectedDay}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Next Upcoming Class</p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {dayEvents.length > 0 ? `${dayEvents[0].course_code} @ ${dayEvents[0].start_time}` : 'No remaining classes'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Weekly Credit Hours</p>
                <p className="text-lg font-extrabold text-slate-900">18 Hours Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter Schedule:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'lecture', label: 'Lectures' },
              { id: 'lab', label: 'Labs' },
              { id: 'office_hours', label: 'Office Hours' },
              { id: 'online', label: 'Online Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Grid & Side Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Events Timeline (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {dayEvents.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No classes scheduled for {selectedDay}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Enjoy your free study window or use this time to review upcoming assignment submissions!
                </p>
              </div>
            ) : (
              dayEvents.map((event) => {
                const badge = getEventTypeBadge(event.type)

                return (
                  <div
                    key={event.id}
                    className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
                  >
                    {/* Event Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold shadow-sm">
                          {event.course_code}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200/60 w-fit">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{event.start_time} - {event.end_time}</span>
                      </div>
                    </div>

                    {/* Event Title */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>
                      {event.notes && (
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {event.notes}
                        </p>
                      )}
                    </div>

                    {/* Meta info & Action bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Location */}
                        <div className="flex items-center gap-1.5 font-medium">
                          {event.is_online ? (
                            <Video className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <MapPin className="w-4 h-4 text-slate-400" />
                          )}
                          <span className={event.is_online ? 'font-bold text-emerald-700' : 'text-slate-700'}>
                            {event.location}
                          </span>
                        </div>

                        {/* Instructor */}
                        {event.instructor && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{event.instructor}</span>
                          </div>
                        )}
                      </div>

                      {/* Online Meeting Join Button */}
                      {event.is_online && event.meeting_url && (
                        <a
                          href={event.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
                        >
                          <span>Join Online Lecture</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Right Side Panel: Academic Reminders & Deadlines (1/3) */}
          <div className="space-y-6">
            {/* Quick Academic Reminders */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-indigo-600" />
                  <span>Important Reminders</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>CS-301 Midterm Exam</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded">Friday</span>
                  </div>
                  <p className="text-[11px] text-rose-700">Main Exam Hall A @ 10:00 AM. Bring Student ID card.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>DES-204 Figma Submission</span>
                    <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded">Friday 11:59 PM</span>
                  </div>
                  <p className="text-[11px] text-amber-700">Export high-fidelity interactive prototype link to portal.</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>DS-402 PyTorch Office Hours</span>
                    <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">Monday 2:30 PM</span>
                  </div>
                  <p className="text-[11px] text-indigo-700">Virtual Zoom Q&A session for model training assignment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
