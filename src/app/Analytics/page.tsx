'use client'

import React from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { useRealtimeCourses, useRealtimeAssignments } from '@/lib/realtimeService'
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  BookOpen,
  Target,
  Zap
} from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { courses } = useRealtimeCourses()
  const { assignments } = useRealtimeAssignments()

  const handleExportReport = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const gpa = user?.gpa || 3.92
  const goalHours = user?.preferences?.learning_goal_hours || 10
  const tracks = user?.preferences?.preferred_tracks || ['Web Development', 'Computer Science']

  const graded = assignments.filter((a) => a.status === 'graded' && a.earned_score !== undefined)
  const avgAssignmentScore =
    graded.length > 0
      ? Math.round(
          graded.reduce((sum, a) => sum + ((a.earned_score || 0) / (a.max_score || 100)) * 100, 0) /
            graded.length
        )
      : 92

  const totalStudyTime = (goalHours * 14.2).toFixed(1)

  // Calculate Course Grade Performance from user's real courses
  const subjectPerformance = courses.map((course, idx) => {
    const codePrefix = (course.category || 'CS').slice(0, 2).toUpperCase()
    const courseCode = `${codePrefix}-${301 + idx * 10}`
    const score = course.progress
    let grade = 'A'
    if (score >= 93) grade = 'A+'
    else if (score >= 88) grade = 'A'
    else if (score >= 82) grade = 'A-'
    else if (score >= 75) grade = 'B+'
    else if (score >= 68) grade = 'B'
    else grade = 'C+'

    return {
      course_code: courseCode,
      course_name: course.title,
      score,
      grade,
      color: course.color_gradient || 'from-indigo-600 to-blue-600'
    }
  })

  // Dynamic monthly distribution scaled to target goal hours
  const monthlyStudy = [
    { month: 'Jan', hours: Math.round(goalHours * 2.8) },
    { month: 'Feb', hours: Math.round(goalHours * 3.5) },
    { month: 'Mar', hours: Math.round(goalHours * 4.2) },
    { month: 'Apr', hours: Math.round(goalHours * 3.8) },
    { month: 'May', hours: Math.round(goalHours * 4.6) },
    { month: 'Jun', hours: Math.round(goalHours * 3.0) },
    { month: 'Jul', hours: Math.round(goalHours * 2.4) },
    { month: 'Aug', hours: Math.round(goalHours * 3.9) },
    { month: 'Sep', hours: Math.round(goalHours * 4.4) }
  ]

  // Dynamic Skill Mastery from user's preferred tracks
  const skillMastery = tracks.map((track, i) => ({
    skill: track,
    level: Math.min(98, 80 + (i * 4) % 18)
  }))

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-8 max-w-7xl mx-auto print:ml-0 print:p-0">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                Academic Analytics & Report
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                {user?.name || 'Student'} Report
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Personalized audit for major in <strong className="text-slate-800">{user?.major || 'Computer Science'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </header>

        {/* 4 Key Academic KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Cumulative GPA</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {gpa.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
              </h3>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{gpa >= 3.8 ? 'Top 5% Honor Roll' : 'Academic Standing Good'}</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Study Time</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalStudyTime} hrs</h3>
              <p className="text-xs text-indigo-600 font-bold mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Target: {goalHours} hrs/wk</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Class Attendance</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">96.5%</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Consistent Presence</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Avg Assignment Score</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{avgAssignmentScore}%</h3>
              <p className="text-xs text-purple-600 font-bold mt-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>{assignments.length} Course Tasks</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Section: Subject Breakdown (2/3) + AI Insights (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Performance Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Grade Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Enrolled Courses Grade Performance</span>
                  </h3>
                  <p className="text-xs text-slate-500">Real-time academic standing calculated from your active courses</p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {courses.length} Courses Active
                </span>
              </div>

              <div className="space-y-5">
                {subjectPerformance.map((subject) => (
                  <div key={subject.course_code} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {subject.course_code}
                        </span>
                        <span className="font-bold text-slate-800 line-clamp-1">{subject.course_name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                          Grade {subject.grade}
                        </span>
                        <span className="font-bold text-slate-900 w-10 text-right">{subject.score}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-700 shadow-sm`}
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Study Hours Distribution Chart */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Monthly Study Hours vs Pace</h3>
                  <p className="text-xs text-slate-500">Tracked effort based on target {goalHours} hrs/week</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-indigo-600 rounded-sm" />
                    <span className="text-slate-600">Actual Hours</span>
                  </div>
                </div>
              </div>

              {/* Monthly Bar Visualizer */}
              <div className="grid grid-cols-9 gap-2 items-end h-44 pt-6">
                {monthlyStudy.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full flex justify-center items-end h-full gap-1">
                      <div
                        className="w-full max-w-[20px] bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 rounded-t shadow-sm transition-all duration-300"
                        style={{ height: `${Math.min(100, (item.hours / (goalHours * 5)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Panel: Skill Mastery & AI Insights (1/3) */}
          <div className="space-y-6">
            {/* AI Insights Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                  <h3 className="font-bold text-base">Academic Growth Insights</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-200">Major: {user?.major || 'Computer Science'}</h4>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white">Active</span>
                  </div>
                  <p className="text-xs text-indigo-100/90 leading-relaxed">
                    Your active enrolled courses align directly with your major and chosen tracks: {tracks.join(', ')}.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-200">Study Style: {user?.preferences?.study_mode || 'Project-Based'}</h4>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white">Pace</span>
                  </div>
                  <p className="text-xs text-indigo-100/90 leading-relaxed">
                    Target pace set at {goalHours} hrs/week. Submitting core project labs on time maintains your high GPA standing!
                  </p>
                </div>
              </div>
            </div>

            {/* Skill Mastery Widget */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Subject Track Mastery</span>
                </h3>
              </div>

              <div className="space-y-4">
                {skillMastery.map((skill) => (
                  <div key={skill.skill} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{skill.skill}</span>
                      <span className="font-extrabold text-indigo-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
