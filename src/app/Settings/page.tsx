'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  User,
  Bell,
  Shield,
  Palette,
  CheckCircle2,
  Save,
  KeyRound,
  Mail,
  GraduationCap,
  Sparkles,
  Lock,
  Smartphone
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Form states
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    student_id: 'STU-2026-8942',
    email: 'alex.morgan@university.edu',
    major: 'Computer Science & Software Engineering',
    bio: 'Passionate fullstack engineering student focused on Next.js, distributed systems, and machine learning.'
  })

  const [notifications, setNotifications] = useState({
    email_assignments: true,
    email_exams: true,
    email_announcements: true,
    push_alerts: false
  })

  const [security, setSecurity] = useState({
    two_factor: true,
    current_password: '',
    new_password: ''
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
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
                Account & System Settings
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                Student Portal
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Manage your personal student profile, notification alerts, and security preferences
            </p>
          </div>
        </header>

        {/* Success Alert Toast */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs font-bold">Your settings have been saved successfully!</p>
          </div>
        )}

        {/* Main Settings Grid: Navigation Tabs (1/4) + Form Panel (3/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Sub-Navigation */}
          <div className="space-y-2">
            {[
              { id: 'profile', label: 'Student Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Account Security', icon: Shield },
              { id: 'preferences', label: 'System Preferences', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Settings Form Body */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              {/* Tab 1: Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-500">Update your student details and university profile info</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                      AL
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Alex Morgan</h4>
                      <p className="text-xs text-slate-500">B.S. Computer Science • Year 3</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Student ID</label>
                      <input
                        type="text"
                        disabled
                        value={profile.student_id}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">University Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Academic Major</label>
                      <input
                        type="text"
                        value={profile.major}
                        onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-700">Academic Bio</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
                    <p className="text-xs text-slate-500">Configure how you receive assignment and exam alerts</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <h4 className="font-bold text-slate-900">Assignment Deadlines Reminders</h4>
                        <p className="text-slate-500">Receive email alerts 24 hours before assignment due dates.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_assignments}
                        onChange={(e) => setNotifications({ ...notifications, email_assignments: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <h4 className="font-bold text-slate-900">Exam & Quiz Alerts</h4>
                        <p className="text-slate-500">Receive email schedules for upcoming exams and hall locations.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_exams}
                        onChange={(e) => setNotifications({ ...notifications, email_exams: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <h4 className="font-bold text-slate-900">Department Announcements</h4>
                        <p className="text-slate-500">Receive news and updates from the Computer Science faculty.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_announcements}
                        onChange={(e) => setNotifications({ ...notifications, email_announcements: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Security */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Account Security & Credentials</h3>
                    <p className="text-xs text-slate-500">Manage password authentication and two-factor security</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-indigo-600" />
                          Two-Factor Authentication (2FA)
                        </h4>
                        <p className="text-slate-500">Add an extra layer of security using an authenticator app.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={security.two_factor}
                        onChange={(e) => setSecurity({ ...security, two_factor: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200/80 space-y-3">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-600" />
                        Update Password
                      </h4>

                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={security.current_password}
                          onChange={(e) => setSecurity({ ...security, current_password: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={security.new_password}
                          onChange={(e) => setSecurity({ ...security, new_password: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">System Preferences</h3>
                    <p className="text-xs text-slate-500">Theme and layout customizations</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                    <h4 className="font-bold text-slate-900">Interface Theme</h4>
                    <p className="text-slate-500">Currently active: Professional Light Slate Theme.</p>
                  </div>
                </div>
              )}

              {/* Save Button Bar */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
