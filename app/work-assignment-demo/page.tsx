'use client';

/**
 * Work Assignment Demo
 * Demonstrates the work assignment system for Path C
 */

import { useGameStore } from '@/lib/store';
import WorkAssignmentSelector from '@/components/WorkAssignmentSelector';
import WorkAssignmentIndicator from '@/components/WorkAssignmentIndicator';
import PathIndicator from '@/components/PathIndicator';
import TimeIndicator from '@/components/TimeIndicator';
import {
  getAllWorkAssignments,
  getWorkAssignmentItems,
  getWorkAssignmentEvidence,
  getWorkAssignmentCharacters,
} from '@/lib/workAssignmentUtils';

export default function WorkAssignmentDemo() {
  const {
    workAssignment,
    currentPath,
    dayTime,
    setPath,
    initializeTime,
    setWorkAssignment,
    resetGame,
  } = useGameStore();

  const allAssignments = getAllWorkAssignments();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Assignment Demo</h1>
          <p className="mt-2 text-gray-600">
            Test the work assignment selection system for Path C (Day/Justice)
          </p>
        </div>

        {/* Current State Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Current Path</h3>
            <PathIndicator compact={true} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Current Time</h3>
            <TimeIndicator compact={true} />
          </div>
        </div>

        {/* Current Assignment Indicator */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">Current Assignment</h2>
          <div className="space-y-3">
            <WorkAssignmentIndicator showOpportunities={true} />
            <WorkAssignmentIndicator compact={true} />
            <WorkAssignmentIndicator hideWhenUnset={true} />
          </div>
        </div>

        {/* Assignment Selector */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Select Work Assignment
          </h2>
          <WorkAssignmentSelector
            onAssignmentSelected={(assignment) => {
              console.log(`Assignment selected: ${assignment}`);
            }}
            showRecommendation={true}
          />
        </div>

        {/* Assignment Details */}
        {workAssignment && (
          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Assignment Details: {workAssignment}
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-blue-900">Items Available</h3>
                <ul className="space-y-1">
                  {getWorkAssignmentItems(workAssignment).map((item) => (
                    <li key={item} className="text-sm text-blue-800">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-amber-900">Evidence Found</h3>
                <ul className="space-y-1">
                  {getWorkAssignmentEvidence(workAssignment).map((evidence) => (
                    <li key={evidence} className="text-sm text-amber-800">
                      • {evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-green-900">Characters Met</h3>
                <ul className="space-y-1">
                  {getWorkAssignmentCharacters(workAssignment).map((character) => (
                    <li key={character} className="text-sm text-green-800">
                      • {character}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Assignment Buttons */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Quick Assignment Selection
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {allAssignments.map((assignment) => (
              <button
                key={assignment.id}
                onClick={() => setWorkAssignment(assignment.id)}
                className={`
                  rounded-lg border-2 p-4 text-left transition-all
                  ${
                    workAssignment === assignment.id
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }
                `}
              >
                <div className="text-3xl">{assignment.icon}</div>
                <div className="mt-2 text-sm font-semibold text-gray-900">
                  {assignment.name}
                </div>
                <div className="mt-1 text-xs text-gray-600">{assignment.location}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Assignment Comparison */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Assignment Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left font-semibold text-gray-900">Assignment</th>
                  <th className="pb-2 text-left font-semibold text-gray-900">Location</th>
                  <th className="pb-2 text-left font-semibold text-gray-900">Items</th>
                  <th className="pb-2 text-left font-semibold text-gray-900">Evidence</th>
                  <th className="pb-2 text-left font-semibold text-gray-900">Characters</th>
                </tr>
              </thead>
              <tbody>
                {allAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className={`border-b border-gray-100 ${
                      workAssignment === assignment.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{assignment.icon}</span>
                        <span className="font-medium text-gray-900">{assignment.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{assignment.location}</td>
                    <td className="py-3 text-gray-600">
                      {getWorkAssignmentItems(assignment.id).length}
                    </td>
                    <td className="py-3 text-gray-600">
                      {getWorkAssignmentEvidence(assignment.id).length}
                    </td>
                    <td className="py-3 text-gray-600">
                      {getWorkAssignmentCharacters(assignment.id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Path C Simulation */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Path C Day 1 Simulation
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Simulate the typical Path C Day 1 flow where the player chooses their work assignment.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setPath('C');
                initializeTime();
              }}
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Start Path C (Day 1, Morning)
            </button>
            <button
              onClick={resetGame}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Reset Everything
            </button>
          </div>

          {currentPath === 'C' && dayTime && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-300 p-4">
              <p className="text-sm text-green-800">
                ✓ Path C initialized! You are on Day {dayTime.day}, {dayTime.timeOfDay}.
                {!workAssignment && (
                  <span className="ml-1 font-semibold">
                    Choose your work assignment above.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Current State JSON */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Current State</h2>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
            {JSON.stringify(
              {
                currentPath,
                dayTime,
                workAssignment,
                hasAssignment: workAssignment !== null,
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
