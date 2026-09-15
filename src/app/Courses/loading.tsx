import React from 'react'

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-200/80 rounded-xl w-1/3" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-200/80 rounded-2xl" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-200/80 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
