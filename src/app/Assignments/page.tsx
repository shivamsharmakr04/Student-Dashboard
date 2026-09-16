'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { useRealtimeAssignments } from '@/lib/realtimeService'
import { Assignment, AssignmentStatus } from '@/types/assignment'
import {
  CheckSquare,
  Clock,
  FileText,
  Upload,
  Award,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  MessageSquare,
  FileCheck,
  TrendingUp,
  Sparkles,
  Radio
} from 'lucide-react'

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { assignments, submitAssignment } = useRealtimeAssignments()

  // Filter assignments
  const filteredAssignments = assignments.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Metric stats
  const pendingCount = assignments.filter((a) => a.status === 'pending').length
  const submittedCount = assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length
  const gradedAssignments = assignments.filter((a) => a.status === 'graded' && a.earned_score !== undefined)

  const avgGrade =
    gradedAssignments.length > 0
      ? Math.round(
          (gradedAssignments.reduce((acc, a) => acc + (a.earned_score || 0), 0) /
            gradedAssignments.length) *
            10
        ) / 10
      : 0

  const completionRate = assignments.length > 0 ? Math.round((submittedCount / assignments.length) * 100) : 0

  const handleSimulateSubmit = (id: string) => {
    submitAssignment(id)
  }

  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Action', color: 'bg-amber-500/10 text-amber-700 border-amber-200' }
      case 'submitted':
        return { label: 'Submitted', color: 'bg-blue-500/10 text-blue-700 border-blue-200' }
      case 'graded':
        return { label: 'Graded', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200 font-bold' }
      case 'overdue':
        return { label: 'Overdue', color: 'bg-rose-500/10 text-rose-700 border-rose-200 font-bold' }
      default:
        return { label: 'Assignment', color: 'bg-slate-100 text-slate-700 border-slate-200' }
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
                Coursework & Assignments
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                {assignments.length} Total Tasks
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Track pending submissions, review instructor feedback, and manage your grades
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
          </div>
        </header>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Pending Action</p>
              <p className="text-xl font-extrabold text-slate-900">{pendingCount} Assignments</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Completion Rate</p>
              <p className="text-xl font-extrabold text-slate-900">{completionRate}% Done</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Average Grade</p>
              <p className="text-xl font-extrabold text-slate-900">{avgGrade}% Avg</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Submitted Tasks</p>
              <p className="text-xl font-extrabold text-slate-900">{submittedCount} Submitted</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter Status:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Tasks', count: assignments.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'submitted', label: 'Submitted', count: assignments.filter((a) => a.status === 'submitted').length },
              { id: 'graded', label: 'Graded', count: gradedAssignments.length },
              { id: 'overdue', label: 'Overdue', count: assignments.filter((a) => a.status === 'overdue').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Assignment Cards (2/3) + Feedback Widget (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Cards List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No assignments found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your filter status or search query to find your coursework.
                </p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const badge = getStatusBadge(assignment.status)

                return (
                  <div
                    key={assignment.id}
                    className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
                  >
                    {/* Card Header: Badges & Weightage */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold shadow-sm">
                          {assignment.course_code}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                          {assignment.weightage}% of Total Grade
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {assignment.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {assignment.description}
                      </p>
                    </div>

                    {/* Details: Format, Dates, Score & Feedback */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">Due: <strong className="text-slate-800 font-bold">{assignment.due_date} at {assignment.due_time}</strong></span>
                        </div>

                        {assignment.file_format && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Accepted: <strong className="text-slate-700">{assignment.file_format}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Graded Feedback Box */}
                      {assignment.status === 'graded' && assignment.feedback && (
                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between text-emerald-900 font-bold">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              Instructor Feedback
                            </span>
                            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                              Score: {assignment.earned_score} / {assignment.max_score}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-800 leading-relaxed italic">
                            &quot;{assignment.feedback}&quot;
                          </p>
                        </div>
                      )}

                      {/* Submitted status bar */}
                      {assignment.status === 'submitted' && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900">
                          <span className="flex items-center gap-2 font-bold">
                            <FileCheck className="w-4 h-4 text-blue-600" />
                            <span>Submitted successfully on {assignment.submission_date}</span>
                          </span>
                          <span className="text-xs text-blue-700 font-medium">Awaiting Grade</span>
                        </div>
                      )}

                      {/* Action CTA */}
                      {assignment.status === 'pending' && (
                        <div className="flex items-center justify-end pt-1">
                          <button
                            onClick={() => handleSimulateSubmit(assignment.id)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload & Submit Assignment</span>
                          </button>
                        </div>
                      )}

                      {assignment.status === 'overdue' && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900">
                          <span className="flex items-center gap-2 font-bold">
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            <span>Past Due Deadline</span>
                          </span>
                          <button className="text-xs font-bold text-rose-700 hover:underline">
                            Request Extension
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Right Side Panel: Grade Report & Guidelines (1/3) */}
          <div className="space-y-6">
            {/* Grade Overview Widget */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Recent Grade Report</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {gradedAssignments.map((g) => (
                  <div key={g.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{g.course_code}</p>
                      <p className="text-slate-500 line-clamp-1">{g.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-600">
                        {g.earned_score}/{g.max_score}
                      </span>
                      <p className="text-[10px] text-slate-400">Graded</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Guidelines Card */}
            <div className="p-6 rounded-2xl bg-indigo-900 text-white shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">Submission Policy</h4>
              </div>
              <p className="text-xs text-indigo-100/90 leading-relaxed">
                Ensure all code repositories and PDF documents include your full student ID and course code in the filename header before submitting.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
