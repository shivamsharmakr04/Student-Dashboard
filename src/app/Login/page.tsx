'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { StudentPreferences } from '@/types/auth'
import {
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Bell,
  Compass,
  Zap,
  ChevronLeft,
  Radio
} from 'lucide-react'

const AVAILABLE_TRACKS = [
  'Web Development',
  'Computer Science',
  'Data Science & AI',
  'UI/UX Design',
  'Cloud Infrastructure',
  'Mobile Development',
  'Cybersecurity',
  'DevOps & Automation'
]

const STUDY_STYLES: { id: StudentPreferences['study_mode']; label: string; desc: string }[] = [
  { id: 'Project-Based', label: '🚀 Project-Based', desc: 'Learn by building real software projects & repos' },
  { id: 'Exam Prep', label: '📚 Exam & Test Prep', desc: 'Focus on practice tests, flashcards & core theory' },
  { id: 'Concept Mastery', label: '🧠 Deep Concept Mastery', desc: 'Thorough step-by-step algorithms & fundamentals' },
  { id: 'Fast-Track', label: '⚡ Fast-Track Accelerated', desc: 'High-impact concise summary modules' }
]

export default function LoginPage() {
  const router = useRouter()
  const { login, createAccount, loginAsDemo, isRealtimeConnected, isBackendConnected } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [signupStep, setSignupStep] = useState<1 | 2>(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('alex.morgan@university.edu')
  const [loginPassword, setLoginPassword] = useState('password123')

  // Signup form state - Step 1: Credentials
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    student_id: '',
    major: 'Computer Science',
    bio: '',
    year_level: 'Year 1'
  })

  // Signup form state - Step 2: Preferences
  const [preferences, setPreferences] = useState<StudentPreferences>({
    preferred_tracks: ['Web Development', 'Computer Science'],
    learning_goal_hours: 10,
    study_mode: 'Project-Based',
    email_assignments: true,
    email_exams: true,
    email_announcements: true,
    push_alerts: false,
    theme: 'light'
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await login(loginEmail, loginPassword)
    setLoading(false)

    if (res.success) {
      router.push('/Dashboard')
    } else {
      setError(res.error || 'Login failed')
    }
  }

  const handleDemoSignIn = () => {
    loginAsDemo()
    router.push('/Dashboard')
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setError('Please fill in your name, email, and password.')
      return
    }
    setError(null)
    setSignupStep(2)
  }

  const handleCompleteSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const studentId = signupForm.student_id || `STU-${2026}-${Math.floor(1000 + Math.random() * 9000)}`

    const res = await createAccount(
      {
        name: signupForm.name,
        email: signupForm.email,
        student_id: studentId,
        major: signupForm.major,
        bio: signupForm.bio || `Student in ${signupForm.major}`,
        year_level: signupForm.year_level
      },
      preferences
    )

    setLoading(false)

    if (res.success) {
      router.push('/Dashboard')
    } else {
      setError(res.error || 'Account creation failed.')
    }
  }

  const toggleTrack = (track: string) => {
    setPreferences((prev) => {
      const exists = prev.preferred_tracks.includes(track)
      const updated = exists
        ? prev.preferred_tracks.filter((t) => t !== track)
        : [...prev.preferred_tracks, track]
      return { ...prev, preferred_tracks: updated }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Decorative Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-4 ring-white">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            EduPulse <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Student Learning Portal & Academic Dashboard
          </p>

          {/* Database & Auth Connection Status Badge */}
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-bold text-slate-600 shadow-sm">
            <Radio className={`w-3 h-3 ${isBackendConnected ? 'text-emerald-500 animate-pulse' : 'text-indigo-500'}`} />
            <span>
              {isBackendConnected
                ? 'Express SQLite DB & Authorized Session Connected'
                : isRealtimeConnected
                ? 'Supabase Real-time Auth Connected'
                : 'Real-time Session Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1.5 rounded-2xl bg-slate-100 mb-6">
            <button
              onClick={() => {
                setMode('signin')
                setError(null)
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup')
                setSignupStep(1)
                setError(null)
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Student Account
            </button>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating Real-time...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* MODE 2: CREATE ACCOUNT (STEP 1 & STEP 2) */}
          {mode === 'signup' && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      signupStep === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {signupStep === 1 ? '1' : '✓'}
                  </span>
                  <span className="text-xs font-bold text-slate-900">Student Info</span>
                </div>

                <div className="w-12 h-0.5 bg-slate-200" />

                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      signupStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </span>
                  <span className="text-xs font-bold text-slate-900">Learning Preferences</span>
                </div>
              </div>

              {/* STEP 1 FORM */}
              {signupStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          placeholder="e.g. Jordan Smith"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Academic Major</label>
                      <input
                        type="text"
                        required
                        value={signupForm.major}
                        onChange={(e) => setSignupForm({ ...signupForm, major: e.target.value })}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">University Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        placeholder="jordan.smith@university.edu"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          placeholder="Create password"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Academic Year</label>
                      <select
                        value={signupForm.year_level}
                        onChange={(e) => setSignupForm({ ...signupForm, year_level: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                      >
                        <option value="Year 1">Year 1 (Freshman)</option>
                        <option value="Year 2">Year 2 (Sophomore)</option>
                        <option value="Year 3">Year 3 (Junior)</option>
                        <option value="Year 4">Year 4 (Senior)</option>
                        <option value="Graduate">Postgraduate / M.S.</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition active:scale-95"
                  >
                    <span>Proceed to Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2 FORM: PREFERENCES SELECTION */}
              {signupStep === 2 && (
                <form onSubmit={handleCompleteSignUp} className="space-y-6">
                  {/* Preferred Tracks */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      <span>Select Preferred Study Tracks</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Choose subjects you are interested in mastering:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {AVAILABLE_TRACKS.map((track) => {
                        const isSelected = preferences.preferred_tracks.includes(track)
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

                  {/* Weekly Study Pace */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Weekly Target Study Pace</span>
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 15, 20].map((hours) => {
                        const isSelected = preferences.learning_goal_hours === hours
                        return (
                          <button
                            type="button"
                            key={hours}
                            onClick={() => setPreferences({ ...preferences, learning_goal_hours: hours })}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {STUDY_STYLES.map((style) => {
                        const isSelected = preferences.study_mode === style.id
                        return (
                          <button
                            type="button"
                            key={style.id}
                            onClick={() => setPreferences({ ...preferences, study_mode: style.id })}
                            className={`p-2.5 text-left rounded-xl border transition ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <p className="text-xs font-bold">{style.label}</p>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{style.desc}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notification Checkboxes */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      <span>Notification Reminders</span>
                    </label>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.email_assignments}
                          onChange={(e) =>
                            setPreferences({ ...preferences, email_assignments: e.target.checked })
                          }
                          className="w-4 h-4 accent-indigo-600 rounded"
                        />
                        <span>Email reminders 24h before assignments are due</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.email_exams}
                          onChange={(e) =>
                            setPreferences({ ...preferences, email_exams: e.target.checked })
                          }
                          className="w-4 h-4 accent-indigo-600 rounded"
                        />
                        <span>Exam and quiz schedule notifications</span>
                      </label>
                    </div>
                  </div>

                  {/* Back & Submit buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>{loading ? 'Registering Real-Time Account...' : 'Complete & Open Dashboard'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
