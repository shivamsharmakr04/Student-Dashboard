import React from 'react'

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-200/80 rounded-xl w-1/3" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-3 h-96 bg-slate-200/80 rounded-3xl" />
      </div>
    </div>
  )
}
