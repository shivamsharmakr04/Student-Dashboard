'use client'

import React from 'react'

interface ProgressBarProps {
  progress: number
  colorGradient?: string
  showLabel?: boolean
  height?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorGradient = 'from-blue-500 to-indigo-600',
  showLabel = true,
  height = 'h-2.5'
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
          <span>Completion</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700/60 rounded-full overflow-hidden ${height}`}>
        <div
          className={`bg-gradient-to-r ${colorGradient} ${height} rounded-full transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
