'use client';

/**
 * TimeIndicator Component
 * Displays the current day and time for Path C (Day/Justice)
 * Shows day number (1-6), time period, and progress
 */

import { useGameStore } from '@/lib/store';
import {
  getDayTimeDisplayName,
  getTimePeriodInfo,
  getTimePeriodColors,
  calculateTimeProgress,
  getRemainingDays,
  isFinalDay,
  MAX_DAYS,
} from '@/lib/timeUtils';

interface TimeIndicatorProps {
  className?: string;
  compact?: boolean; // Show minimal version
  hideWhenUnset?: boolean; // Hide if no time is set
  showProgress?: boolean; // Show progress bar
  showRemainingDays?: boolean; // Show days remaining
}

export default function TimeIndicator({
  className = '',
  compact = false,
  hideWhenUnset = false,
  showProgress = true,
  showRemainingDays = true,
}: TimeIndicatorProps) {
  const dayTime = useGameStore((state) => state.dayTime);

  // Hide if no time set and hideWhenUnset is true
  if (!dayTime && hideWhenUnset) {
    return null;
  }

  // Show placeholder if no time set
  if (!dayTime) {
    return (
      <div
        className={`rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center ${className}`}
      >
        <p className="text-gray-500">Time not set</p>
        <p className="mt-1 text-sm text-gray-400">
          Available on Path C (Day/Justice)
        </p>
      </div>
    );
  }

  const periodInfo = getTimePeriodInfo(dayTime.timeOfDay);
  const colors = getTimePeriodColors(dayTime.timeOfDay);
  const progress = calculateTimeProgress(dayTime);
  const remainingDays = getRemainingDays(dayTime);
  const isLastDay = isFinalDay(dayTime);

  // Compact version - just show badge
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-2xl" aria-label={`${periodInfo.name} icon`}>
          {periodInfo.icon}
        </span>
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${colors.text}`}>
            Day {dayTime.day}
          </span>
          <span className={`text-xs ${colors.text} opacity-80`}>
            {periodInfo.name}
          </span>
        </div>
      </div>
    );
  }

  // Full version with card
  return (
    <div
      className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4 ${className}`}
      role="status"
      aria-label={`Current time: ${getDayTimeDisplayName(dayTime)}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-label={`${periodInfo.name} icon`}>
          {periodInfo.icon}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${colors.text}`}>
              Day {dayTime.day} of {MAX_DAYS}
            </h3>
            {isLastDay && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                Final Day
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm font-medium ${colors.text} opacity-80`}>
            {periodInfo.icon} {periodInfo.name}
          </p>
          <p className={`mt-1 text-xs ${colors.text} opacity-70`}>
            {periodInfo.description}
          </p>

          {showRemainingDays && remainingDays > 0 && (
            <p className={`mt-2 text-xs ${colors.text} opacity-60`}>
              {remainingDays} {remainingDays === 1 ? 'day' : 'days'} remaining
            </p>
          )}

          {showProgress && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className={colors.text}>Progress</span>
                <span className={`font-semibold ${colors.text}`}>{progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${colors.border.replace('border', 'bg')}`}
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
