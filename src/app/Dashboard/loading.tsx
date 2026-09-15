import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-200/80 rounded-xl w-1/3" />

      {/* Hero Banner Skeleton */}
      <div className="h-56 bg-slate-200/80 rounded-3xl w-full" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200/80 rounded-2xl" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-200/80 rounded-2xl" />
      </div>
    </div>
  )
}
