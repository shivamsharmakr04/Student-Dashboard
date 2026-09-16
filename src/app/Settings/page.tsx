'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { StudentPreferences } from '@/types/auth'
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
  Smartphone,
  Compass,
  Clock,
  Target
} from 'lucide-react'

const ALL_TRACKS = [
  'Web Development',
  'Computer Science',
  'Data Science & AI',
  'UI/UX Design',
  'Cloud Infrastructure',
  'Mobile Development',
  'Cybersecurity',
  'DevOps & Automation'
]

export default function SettingsPage() {
  const { user, updateProfile, updatePreferences } = useAuth()

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Morgan',
    student_id: user?.student_id || 'STU-2026-8942',
    email: user?.email || 'alex.morgan@university.edu',
    major: user?.major || 'Computer Science & Software Engineering',
    bio: user?.bio || 'Passionate fullstack engineering student focused on Next.js, distributed systems, and machine learning.'
  })

  // Preferences state
  const [prefs, setPrefs] = useState<StudentPreferences>({
    preferred_tracks: user?.preferences?.preferred_tracks || ['Web Development', 'Computer Science'],
    learning_goal_hours: user?.preferences?.learning_goal_hours || 10,
    study_mode: user?.preferences?.study_mode || 'Project-Based',
    email_assignments: user?.preferences?.email_assignments ?? true,
    email_exams: user?.preferences?.email_exams ?? true,
    email_announcements: user?.preferences?.email_announcements ?? true,
    push_alerts: user?.preferences?.push_alerts ?? false,
    theme: user?.preferences?.theme || 'light'
  })

  const [security, setSecurity] = useState({
    two_factor: true,
    current_password: '',
    new_password: ''
  })

  // Sync state if user context loads/changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        student_id: user.student_id,
        email: user.email,
        major: user.major,
        bio: user.bio
      })
      if (user.preferences) {
        setPrefs(user.preferences)
      }
    }
  }, [user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    updateProfile({
      name: profile.name,
      email: profile.email,
      major: profile.major,
      bio: profile.bio
    })

    updatePreferences(prefs)

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const toggleTrack = (track: string) => {
    setPrefs((prev) => {
      const exists = prev.preferred_tracks.includes(track)
      const updated = exists
        ? prev.preferred_tracks.filter((t) => t !== track)
        : [...prev.preferred_tracks, track]
      return { ...prev, preferred_tracks: updated }
    })
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
              Manage your personal student profile, learning preferences, and security settings
            </p>
          </div>
        </header>

        {/* Success Alert Toast */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs font-bold">Your student profile and preferences have been updated!</p>
          </div>
        )}

        {/* Main Settings Grid: Navigation Tabs (1/4) + Form Panel (3/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Sub-Navigation */}
          <div className="space-y-2">
            {[
              { id: 'profile', label: 'Student Profile', icon: User },
              { id: 'preferences', label: 'Learning Preferences', icon: Compass },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Account Security', icon: Shield },
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
                    <h3 className="text-base font-bold text-slate-900">Personal Student Profile</h3>
                    <p className="text-xs text-slate-500">Update your identity and university details</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                      {user?.avatar_initials || 'ST'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{profile.name}</h4>
                      <p className="text-xs text-slate-500">{profile.major}</p>
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

              {/* Tab 2: Learning Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Customized Learning Preferences</h3>
                    <p className="text-xs text-slate-500">Tailor recommended courses, weekly targets, and study styles</p>
                  </div>

                  {/* Preferred Tracks */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      <span>Preferred Learning Tracks</span>
                    </label>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {ALL_TRACKS.map((track) => {
                        const isSelected = prefs.preferred_tracks.includes(track)
                        return (
                          <button
                            type="button"
                            key={track}
                            onClick={() => toggleTrack(track)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {track}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Weekly Study Pace Goal */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Weekly Target Study Pace</span>
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 15, 20].map((hours) => {
                        const isSelected = prefs.learning_goal_hours === hours
                        return (
                          <button
                            type="button"
                            key={hours}
                            onClick={() => setPrefs({ ...prefs, learning_goal_hours: hours })}
                            className={`py-2 rounded-xl text-xs font-bold border transition ${
                              isSelected
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {hours} hrs/wk
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Preferred Study Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span>Primary Learning Style</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'Project-Based', label: '🚀 Project-Based', desc: 'Build software projects & repos' },
                        { id: 'Exam Prep', label: '📚 Exam Prep', desc: 'Practice tests & core theory' },
                        { id: 'Concept Mastery', label: '🧠 Deep Concepts', desc: 'Step-by-step algorithms & theory' },
                        { id: 'Fast-Track', label: '⚡ Fast-Track', desc: 'Accelerated concise modules' }
                      ].map((style) => {
                        const isSelected = prefs.study_mode === style.id
                        return (
                          <button
                            type="button"
                            key={style.id}
                            onClick={() => setPrefs({ ...prefs, study_mode: style.id as any })}
                            className={`p-3 text-left rounded-xl border transition ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm font-bold'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <p className="text-xs">{style.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{style.desc}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Notifications */}
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
                        checked={prefs.email_assignments}
                        onChange={(e) => setPrefs({ ...prefs, email_assignments: e.target.checked })}
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
                        checked={prefs.email_exams}
                        onChange={(e) => setPrefs({ ...prefs, email_exams: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <h4 className="font-bold text-slate-900">Department Announcements</h4>
                        <p className="text-slate-500">Receive news and updates from your faculty.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={prefs.email_announcements}
                        onChange={(e) => setPrefs({ ...prefs, email_announcements: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Security */}
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
