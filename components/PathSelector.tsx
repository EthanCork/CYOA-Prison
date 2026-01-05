'use client';

/**
 * PathSelector Component
 * Allows player to choose one of three paths (A, B, or C)
 * Displays path information and recommendations based on collected items/evidence/relationships
 */

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import {
  getAllPaths,
  getPathColors,
  getRecommendedPath,
  type PathInfo,
} from '@/lib/pathUtils';

interface PathSelectorProps {
  onPathSelected?: (path: 'A' | 'B' | 'C') => void;
  className?: string;
  showRecommendation?: boolean; // Show which path is recommended
}

export default function PathSelector({
  onPathSelected,
  className = '',
  showRecommendation = true,
}: PathSelectorProps) {
  const { currentPath, setPath, evidence, relationships, inventory } = useGameStore();
  const [selectedPath, setSelectedPath] = useState<'A' | 'B' | 'C' | null>(currentPath);

  // Calculate recommendation based on current game state
  const hasEvidence = evidence.length > 0;
  const highRelationships = Object.values(relationships).filter((score) => score >= 50).length;
  const hasStealthItems = inventory.some(
    (item) => item.includes('lockpick') || item.includes('dark') || item.includes('stealth')
  );

  const recommendedPath = showRecommendation
    ? getRecommendedPath(hasEvidence, highRelationships, hasStealthItems)
    : null;

  const paths = getAllPaths();

  const handleSelectPath = (path: 'A' | 'B' | 'C') => {
    setSelectedPath(path);
  };

  const handleConfirm = () => {
    if (selectedPath) {
      setPath(selectedPath);
      onPathSelected?.(selectedPath);
    }
  };

  const renderPathCard = (pathInfo: PathInfo) => {
    const path = pathInfo.id as 'A' | 'B' | 'C';
    const colors = getPathColors(path);
    const isSelected = selectedPath === path;
    const isRecommended = recommendedPath === path;

    return (
      <button
        key={path}
        onClick={() => handleSelectPath(path)}
        className={`
          relative w-full rounded-lg border-2 p-4 text-left transition-all
          ${isSelected ? `${colors.border} ${colors.bg} ring-2 ring-offset-2` : 'border-gray-300 bg-white hover:border-gray-400'}
          ${colors.hover}
        `}
        aria-pressed={isSelected}
      >
        {isRecommended && (
          <div className="absolute right-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-yellow-900">
            ⭐ Recommended
          </div>
        )}

        <div className="flex items-start gap-3">
          <span className="text-4xl" aria-label={`Path ${path} icon`}>
            {pathInfo.icon}
          </span>
          <div className="flex-1">
            <h3
              className={`text-lg font-bold ${isSelected ? colors.text : 'text-gray-800'}`}
            >
              {pathInfo.name}
            </h3>
            <p
              className={`mt-1 text-sm font-medium ${isSelected ? colors.text : 'text-gray-600'} opacity-80`}
            >
              {pathInfo.approach}
            </p>
            <p
              className={`mt-2 text-sm ${isSelected ? colors.text : 'text-gray-600'} opacity-70`}
            >
              {pathInfo.description}
            </p>
          </div>
        </div>

        {isSelected && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${colors.text}`}>
            <span>✓</span>
            <span>Selected</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Choose Your Path</h2>
        <p className="mt-1 text-sm text-gray-600">
          This choice will determine your approach to escaping El Palo de Queso. Choose wisely.
        </p>
      </div>

      {showRecommendation && recommendedPath && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Hint:</span> Based on your current resources and
            relationships, <strong>Path {recommendedPath}</strong> might be your best option.
          </p>
        </div>
      )}

      <div className="space-y-3">{paths.map(renderPathCard)}</div>

      <div className="flex justify-end gap-3">
        {currentPath && (
          <button
            onClick={() => setSelectedPath(currentPath)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Keep Current: {currentPath}
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedPath}
          className={`
            rounded-md px-6 py-2 text-sm font-bold text-white transition-colors
            ${selectedPath ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'}
          `}
        >
          {currentPath ? 'Change Path' : 'Confirm Path Selection'}
        </button>
      </div>
    </div>
  );
}
