'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Failed to load Dashboard</h2>
          <p className="text-xs text-slate-500">
            {error.message || 'An unexpected error occurred while loading your courses or academic data.'}
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition active:scale-95 shadow-md shadow-indigo-600/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  )
}
