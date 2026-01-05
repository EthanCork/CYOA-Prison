'use client';

/**
 * PathIndicator Component
 * Displays the player's current path selection (A, B, or C)
 * Shows path icon, name, description, and approach
 */

import { useGameStore } from '@/lib/store';
import { getPathInfo, getPathDisplayName, getPathColors } from '@/lib/pathUtils';

interface PathIndicatorProps {
  className?: string;
  compact?: boolean; // Show minimal version
  hideWhenUnselected?: boolean; // Hide if no path selected
  showDescription?: boolean; // Show full description
}

export default function PathIndicator({
  className = '',
  compact = false,
  hideWhenUnselected = false,
  showDescription = false,
}: PathIndicatorProps) {
  const currentPath = useGameStore((state) => state.currentPath);

  // Hide if no path selected and hideWhenUnselected is true
  if (!currentPath && hideWhenUnselected) {
    return null;
  }

  // Show placeholder if no path selected
  if (!currentPath) {
    return (
      <div
        className={`rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center ${className}`}
      >
        <p className="text-gray-500">No path selected yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Choose your approach at the branching point
        </p>
      </div>
    );
  }

  const pathInfo = getPathInfo(currentPath);
  const colors = getPathColors(currentPath);

  // Compact version - just show badge
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-2xl" aria-label={`Path ${currentPath} icon`}>
          {pathInfo.icon}
        </span>
        <span className={`font-semibold ${colors.text}`}>{pathInfo.name}</span>
      </div>
    );
  }

  // Full version with card
  return (
    <div
      className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4 ${className}`}
      role="status"
      aria-label={`Current path: ${pathInfo.name}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-label={`Path ${currentPath} icon`}>
          {pathInfo.icon}
        </span>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${colors.text}`}>{pathInfo.name}</h3>
          <p className={`mt-1 text-sm font-medium ${colors.text} opacity-80`}>
            {pathInfo.approach}
          </p>
          {showDescription && (
            <p className={`mt-2 text-sm ${colors.text} opacity-70`}>{pathInfo.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
