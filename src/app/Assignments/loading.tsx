import React from 'react'

export default function AssignmentsLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-200/80 rounded-xl w-1/3" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200/80 rounded-2xl" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200/80 rounded-2xl" />
      </div>
    </div>
  )
}
