'use client'

import React from 'react'
import { Sparkles, ArrowRight, Award, Target, BookOpen } from 'lucide-react'

export const HeroCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 md:p-8 shadow-xl border border-indigo-700/40">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Spring Semester 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-indigo-200">Alex Morgan!</span> 👋
          </h1>

          <p className="text-indigo-100/80 text-sm md:text-base leading-relaxed">
            You&apos;ve completed <strong className="text-white font-semibold">64%</strong> of your weekly goal. Keep up the momentum for your upcoming Data Structures midterm!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-white/10 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-indigo-700" />
              <span>Resume Learning</span>
              <ArrowRight className="w-4 h-4 text-indigo-700" />
            </a>

            <div className="flex items-center gap-2 text-xs text-indigo-200 bg-indigo-950/40 px-3 py-2 rounded-xl border border-indigo-700/40">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Target: 2 hours today</span>
            </div>
          </div>
        </div>

        {/* Quick Achievement Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-72">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-700/40 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-300 mb-2">
              <span className="text-xs font-semibold">Overall GPA</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">3.92</p>
            <p className="text-[11px] text-emerald-400 font-medium">Top 5% of class</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-700/40 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-300 mb-2">
              <span className="text-xs font-semibold">Credits</span>
              <span className="text-xs font-bold text-indigo-400">18/20</span>
            </div>
            <p className="text-2xl font-extrabold text-white">42</p>
            <p className="text-[11px] text-indigo-200 font-medium">Total Earned</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard
