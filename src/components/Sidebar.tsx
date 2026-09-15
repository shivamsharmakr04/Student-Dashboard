'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  Flame,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/Dashboard' },
    { label: 'My Courses', icon: BookOpen, href: '#courses' },
    { label: 'Schedule', icon: Calendar, href: '/Schedule' },
    { label: 'Assignments', icon: CheckSquare, href: '/Assignments' },
    { label: 'Analytics', icon: BarChart3, href: '#analytics' },
    { label: 'Settings', icon: Settings, href: '#settings' },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200/80 text-slate-700 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                EduPulse <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </h1>
              <p className="text-xs text-slate-500 font-medium">Student Learning Hub</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 py-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/Dashboard' && pathname === '/')

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Study Streak & User Widget */}
        <div className="p-4 space-y-3 border-t border-slate-100">
          {/* Study Streak Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-600">
                  <Flame className="w-4 h-4 fill-orange-500" />
                </div>
                <span className="text-xs font-bold text-amber-900">Study Streak</span>
              </div>
              <span className="text-xs font-extrabold text-orange-600 bg-orange-500/15 px-2 py-0.5 rounded-full">
                12 Days 🔥
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Keep learning daily to reach your 15-day target badge!
            </p>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                AL
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Alex Morgan</p>
              <p className="text-[11px] text-slate-500 truncate">Computer Science • B.S.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
