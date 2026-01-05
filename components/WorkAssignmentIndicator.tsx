'use client';

/**
 * WorkAssignmentIndicator Component
 * Displays the player's current work assignment
 */

import { useGameStore } from '@/lib/store';
import {
  getWorkAssignmentInfo,
  getWorkAssignmentColors,
  getWorkAssignmentDisplayName,
} from '@/lib/workAssignmentUtils';

interface WorkAssignmentIndicatorProps {
  className?: string;
  compact?: boolean;
  hideWhenUnset?: boolean;
  showOpportunities?: boolean;
}

export default function WorkAssignmentIndicator({
  className = '',
  compact = false,
  hideWhenUnset = false,
  showOpportunities = false,
}: WorkAssignmentIndicatorProps) {
  const workAssignment = useGameStore((state) => state.workAssignment);

  // Hide if no assignment and hideWhenUnset is true
  if (!workAssignment && hideWhenUnset) {
    return null;
  }

  // Show placeholder if no assignment
  if (!workAssignment) {
    return (
      <div
        className={`rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center ${className}`}
      >
        <p className="text-gray-500">No work assignment selected</p>
        <p className="mt-1 text-sm text-gray-400">
          Choose your assignment on Day 1
        </p>
      </div>
    );
  }

  const assignmentInfo = getWorkAssignmentInfo(workAssignment);
  const colors = getWorkAssignmentColors(workAssignment);

  // Compact version
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-2xl" aria-label={`${assignmentInfo.name} icon`}>
          {assignmentInfo.icon}
        </span>
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${colors.text}`}>
            {assignmentInfo.name}
          </span>
          <span className={`text-xs ${colors.text} opacity-80`}>
            📍 {assignmentInfo.location}
          </span>
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div
      className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4 ${className}`}
      role="status"
      aria-label={`Current assignment: ${assignmentInfo.name}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-label={`${assignmentInfo.name} icon`}>
          {assignmentInfo.icon}
        </span>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {assignmentInfo.name}
          </h3>
          <p className={`mt-1 text-sm font-medium ${colors.text} opacity-80`}>
            📍 {assignmentInfo.location}
          </p>
          <p className={`mt-1 text-sm ${colors.text} opacity-70`}>
            {assignmentInfo.description}
          </p>

          {showOpportunities && (
            <div className="mt-3">
              <p className={`text-xs font-semibold ${colors.text}`}>
                Available Opportunities:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                {assignmentInfo.opportunities.map((opportunity, index) => (
                  <li key={index} className={`text-xs ${colors.text} opacity-80`}>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
