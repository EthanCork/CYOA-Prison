'use client';

/**
 * Time Tracking Demo
 * Demonstrates the day/time tracking system for Path C (Day/Justice)
 */

import { useGameStore } from '@/lib/store';
import TimeIndicator from '@/components/TimeIndicator';
import PathIndicator from '@/components/PathIndicator';
import {
  getAllTimePeriods,
  calculateTimeProgress,
  getRemainingDays,
  isFinalDay,
  MAX_DAYS,
} from '@/lib/timeUtils';

export default function TimeTrackingDemo() {
  const {
    dayTime,
    currentPath,
    setPath,
    initializeTime,
    advanceToNextPeriod,
    setDayTime,
    isTimeOfDay,
    resetGame,
  } = useGameStore();

  const allPeriods = getAllTimePeriods();
  const progress = dayTime ? calculateTimeProgress(dayTime) : 0;
  const remainingDays = dayTime ? getRemainingDays(dayTime) : 0;
  const isLastDay = dayTime ? isFinalDay(dayTime) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking Demo</h1>
          <p className="mt-2 text-gray-600">
            Test the day/time tracking system for Path C (Day/Justice)
          </p>
        </div>

        {/* Current Path */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">Current Path</h2>
          <PathIndicator compact={true} />
          {!currentPath && (
            <p className="mt-2 text-sm text-gray-500">
              Time tracking is primarily used in Path C
            </p>
          )}
        </div>

        {/* Time Indicators */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">Time Display</h2>
          <div className="space-y-3">
            <TimeIndicator showProgress={true} showRemainingDays={true} />
            <TimeIndicator compact={true} />
            <TimeIndicator hideWhenUnset={true} />
          </div>
        </div>

        {/* Time Controls */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Time Controls
          </h2>

          <div className="space-y-4">
            {/* Initialize/Advance */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={initializeTime}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Initialize Time (Day 1 Morning)
              </button>
              <button
                onClick={advanceToNextPeriod}
                disabled={!dayTime}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                  dayTime
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'cursor-not-allowed bg-gray-400'
                }`}
              >
                Advance to Next Period →
              </button>
            </div>

            {/* Quick Time Sets */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Quick Jump to Specific Times
              </h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                <button
                  onClick={() => setDayTime(1, 'morning')}
                  className="rounded bg-orange-100 px-3 py-2 text-sm font-medium text-orange-800 hover:bg-orange-200"
                >
                  Day 1 🌅
                </button>
                <button
                  onClick={() => setDayTime(2, 'day')}
                  className="rounded bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                >
                  Day 2 ☀️
                </button>
                <button
                  onClick={() => setDayTime(3, 'evening')}
                  className="rounded bg-purple-100 px-3 py-2 text-sm font-medium text-purple-800 hover:bg-purple-200"
                >
                  Day 3 🌆
                </button>
                <button
                  onClick={() => setDayTime(4, 'night')}
                  className="rounded bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200"
                >
                  Day 4 🌙
                </button>
                <button
                  onClick={() => setDayTime(5, 'morning')}
                  className="rounded bg-orange-100 px-3 py-2 text-sm font-medium text-orange-800 hover:bg-orange-200"
                >
                  Day 5 🌅
                </button>
                <button
                  onClick={() => setDayTime(6, 'night')}
                  className="rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Day 6 Night (Final)
                </button>
              </div>
            </div>

            {/* Set Specific Day/Time */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Set Specific Day and Time
              </h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((day) => (
                  <div key={day} className="flex gap-1">
                    <span className="self-center text-sm font-medium text-gray-700">
                      D{day}:
                    </span>
                    {allPeriods.map((period) => (
                      <button
                        key={`${day}-${period.id}`}
                        onClick={() => setDayTime(day, period.id)}
                        className={`rounded px-2 py-1 text-xs ${
                          dayTime?.day === day && dayTime?.timeOfDay === period.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title={`${period.icon} ${period.name}`}
                      >
                        {period.icon}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Time Information */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Time Information
          </h2>

          {dayTime ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-xs text-gray-600">Current Day</p>
                  <p className="text-2xl font-bold text-gray-900">{dayTime.day}</p>
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-xs text-gray-600">Time of Day</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">
                    {dayTime.timeOfDay}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-xs text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{progress}%</p>
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="text-xs text-gray-600">Days Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">{remainingDays}</p>
                </div>
              </div>

              {isLastDay && (
                <div className="rounded-lg bg-red-100 border border-red-300 p-4">
                  <p className="font-semibold text-red-800">
                    ⚠️ Final Day! Time is running out to gather evidence.
                  </p>
                </div>
              )}

              {/* Time Period Checks */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Current Time Period Checks
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded px-3 py-1 text-sm font-medium ${
                    isTimeOfDay('morning')
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    🌅 Morning: {isTimeOfDay('morning') ? '✓' : '✗'}
                  </span>
                  <span className={`rounded px-3 py-1 text-sm font-medium ${
                    isTimeOfDay('day')
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    ☀️ Day: {isTimeOfDay('day') ? '✓' : '✗'}
                  </span>
                  <span className={`rounded px-3 py-1 text-sm font-medium ${
                    isTimeOfDay('evening')
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    🌆 Evening: {isTimeOfDay('evening') ? '✓' : '✗'}
                  </span>
                  <span className={`rounded px-3 py-1 text-sm font-medium ${
                    isTimeOfDay('night')
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    🌙 Night: {isTimeOfDay('night') ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Time not initialized. Click "Initialize Time" to start.
            </p>
          )}
        </div>

        {/* Path Integration */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Path C Integration
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Time tracking is primarily used in Path C (Day/Justice). Set the path and
            initialize time to simulate Path C gameplay.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setPath('C');
                initializeTime();
              }}
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Start Path C Journey
            </button>
            <button
              onClick={resetGame}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Reset Everything
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            6-Day Timeline
          </h2>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-16 text-sm font-semibold text-gray-700">
                  Day {day}
                </span>
                <div className="flex flex-1 gap-1">
                  {allPeriods.map((period) => {
                    const isCurrentTime =
                      dayTime?.day === day && dayTime?.timeOfDay === period.id;
                    const isPast =
                      dayTime &&
                      (dayTime.day > day ||
                        (dayTime.day === day &&
                          allPeriods.findIndex((p) => p.id === dayTime.timeOfDay) >
                            allPeriods.findIndex((p) => p.id === period.id)));

                    return (
                      <div
                        key={period.id}
                        className={`flex-1 rounded px-2 py-3 text-center text-xs font-medium transition-all ${
                          isCurrentTime
                            ? 'ring-2 ring-blue-600 bg-blue-600 text-white scale-105'
                            : isPast
                              ? 'bg-gray-300 text-gray-600'
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <div>{period.icon}</div>
                        <div className="mt-1">{period.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            • Blue highlight = current time
            <br />
            • Gray = past periods
            <br />
            • Light gray = future periods
          </div>
        </div>

        {/* Current State JSON */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Current State
          </h2>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
            {JSON.stringify(
              {
                currentPath,
                dayTime,
                maxDays: MAX_DAYS,
                progress: dayTime ? `${progress}%` : 'N/A',
                remainingDays: dayTime ? remainingDays : 'N/A',
                isFinalDay: dayTime ? isLastDay : 'N/A',
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
