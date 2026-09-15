'use client'

import React from 'react'
import { Sparkles, ArrowRight, Award, Target, BookOpen } from 'lucide-react'

export const HeroCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white p-6 md:p-8 shadow-xl shadow-indigo-600/15 border border-indigo-500/30">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Spring Semester 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white">Alex Morgan!</span> 👋
          </h1>

          <p className="text-indigo-100/90 text-sm md:text-base leading-relaxed font-normal">
            You&apos;ve completed <strong className="text-white font-bold">64%</strong> of your weekly learning goal. Keep up the momentum for your upcoming Data Structures midterm!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-slate-100 transition-all duration-200 shadow-lg shadow-black/10 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Resume Learning</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </a>

            <div className="flex items-center gap-2 text-xs text-white bg-white/15 px-3 py-2 rounded-xl border border-white/20 backdrop-blur-md font-medium">
              <Target className="w-4 h-4 text-amber-300" />
              <span>Target: 2 hours today</span>
            </div>
          </div>
        </div>

        {/* Quick Achievement Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-72">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-100 mb-2">
              <span className="text-xs font-semibold">Overall GPA</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-2xl font-black text-white">3.92</p>
            <p className="text-[11px] text-amber-200 font-bold">Top 5% of class</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-100 mb-2">
              <span className="text-xs font-semibold">Credits</span>
              <span className="text-xs font-bold text-indigo-200">18/20</span>
            </div>
            <p className="text-2xl font-black text-white">42</p>
            <p className="text-[11px] text-indigo-100 font-medium">Total Earned</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard
