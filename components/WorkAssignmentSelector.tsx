'use client';

/**
 * WorkAssignmentSelector Component
 * Allows player to choose their work assignment on Day 1
 * Displays all 6 assignments with details about opportunities
 */

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import {
  getAllWorkAssignments,
  getWorkAssignmentColors,
  type WorkAssignmentInfo,
} from '@/lib/workAssignmentUtils';
import type { WorkAssignment } from '@/types';

interface WorkAssignmentSelectorProps {
  onAssignmentSelected?: (assignment: WorkAssignment) => void;
  className?: string;
  showRecommendation?: boolean;
}

export default function WorkAssignmentSelector({
  onAssignmentSelected,
  className = '',
  showRecommendation = true,
}: WorkAssignmentSelectorProps) {
  const { workAssignment, setWorkAssignment, evidence, currentPath } = useGameStore();
  const [selectedAssignment, setSelectedAssignment] = useState<WorkAssignment | null>(
    workAssignment
  );
  const [expandedAssignment, setExpandedAssignment] = useState<WorkAssignment | null>(null);

  const assignments = getAllWorkAssignments();

  // Simple recommendation: library if on Path C or has evidence
  const recommendedAssignment: WorkAssignment | null =
    showRecommendation && (currentPath === 'C' || evidence.length > 0) ? 'library' : null;

  const handleSelectAssignment = (assignment: WorkAssignment) => {
    setSelectedAssignment(assignment);
  };

  const handleToggleDetails = (assignment: WorkAssignment) => {
    setExpandedAssignment(expandedAssignment === assignment ? null : assignment);
  };

  const handleConfirm = () => {
    if (selectedAssignment) {
      setWorkAssignment(selectedAssignment);
      onAssignmentSelected?.(selectedAssignment);
    }
  };

  const renderAssignmentCard = (assignmentInfo: WorkAssignmentInfo) => {
    const assignment = assignmentInfo.id;
    const colors = getWorkAssignmentColors(assignment);
    const isSelected = selectedAssignment === assignment;
    const isExpanded = expandedAssignment === assignment;
    const isRecommended = recommendedAssignment === assignment;

    return (
      <div
        key={assignment}
        className={`
          relative rounded-lg border-2 p-4 transition-all cursor-pointer
          ${isSelected ? `${colors.border} ${colors.bg} ring-2 ring-offset-2` : 'border-gray-300 bg-white hover:border-gray-400'}
        `}
        onClick={() => handleSelectAssignment(assignment)}
      >
        {isRecommended && (
          <div className="absolute right-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-yellow-900">
            ⭐ Recommended
          </div>
        )}

        <div className="flex items-start gap-3">
          <span className="text-4xl" aria-label={`${assignmentInfo.name} icon`}>
            {assignmentInfo.icon}
          </span>
          <div className="flex-1">
            <h3
              className={`text-lg font-bold ${isSelected ? colors.text : 'text-gray-800'}`}
            >
              {assignmentInfo.name}
            </h3>
            <p className={`mt-1 text-sm ${isSelected ? colors.text : 'text-gray-600'} opacity-80`}>
              📍 {assignmentInfo.location}
            </p>
            <p className={`mt-1 text-sm ${isSelected ? colors.text : 'text-gray-600'}`}>
              {assignmentInfo.description}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDetails(assignment);
              }}
              className={`mt-2 text-sm font-medium ${isSelected ? colors.text : 'text-blue-600'} hover:underline`}
            >
              {isExpanded ? '▼ Hide' : '▶ Show'} Opportunities
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-1">
                <p className={`text-xs font-semibold ${isSelected ? colors.text : 'text-gray-700'}`}>
                  What you can access:
                </p>
                <ul className="list-inside list-disc space-y-1">
                  {assignmentInfo.opportunities.map((opportunity, index) => (
                    <li
                      key={index}
                      className={`text-xs ${isSelected ? colors.text : 'text-gray-600'}`}
                    >
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isSelected && (
              <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${colors.text}`}>
                <span>✓</span>
                <span>Selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Choose Your Work Assignment</h2>
        <p className="mt-1 text-sm text-gray-600">
          Your assignment determines what areas you can access, who you meet, and what
          opportunities arise. Choose wisely—this decision is made on Day 1 and cannot be changed.
        </p>
      </div>

      {showRecommendation && recommendedAssignment && (
        <div className="rounded-lg border border-blue-300 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Hint:</span> Based on your current path,{' '}
            <strong>{getAllWorkAssignments().find((a) => a.id === recommendedAssignment)?.name}</strong>{' '}
            might be your best choice for gathering evidence.
          </p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">{assignments.map(renderAssignmentCard)}</div>

      <div className="flex justify-end gap-3">
        {workAssignment && (
          <button
            onClick={() => setSelectedAssignment(workAssignment)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Keep Current: {workAssignment}
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedAssignment}
          className={`
            rounded-md px-6 py-2 text-sm font-bold text-white transition-colors
            ${selectedAssignment ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'}
          `}
        >
          {workAssignment ? 'Change Assignment' : 'Confirm Assignment'}
        </button>
      </div>
    </div>
  );
}
