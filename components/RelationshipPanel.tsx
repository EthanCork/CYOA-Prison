'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { loadAllCharacters, getNextUnlock, getUnlockedContent } from '@/lib/characterLoader';
import {
  getRelationshipColor,
  getRelationshipBgColor,
  getRelationshipBorderColor,
  getRelationshipProgressColor,
  getRelationshipLabel,
  getRelationshipEmoji,
  getCategoryEmoji,
} from '@/lib/relationshipColors';
import type { Character } from '@/types';

interface RelationshipPanelProps {
  className?: string;
  defaultCollapsed?: boolean;
  showUndiscovered?: boolean; // Dev mode to show all characters
}

/**
 * Panel displaying character relationships with visual progress indicators
 * Shows discovered characters with color-coded relationship scores and unlock progress
 */
export default function RelationshipPanel({
  className = '',
  defaultCollapsed = false,
  showUndiscovered = false,
}: RelationshipPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedCharacterId, setExpandedCharacterId] = useState<string | null>(null);

  const relationships = useGameStore((state) => state.relationships);
  const discoveredCharacters = useGameStore((state) => state.discoveredCharacters);
  const hasDiscoveredCharacter = useGameStore((state) => state.hasDiscoveredCharacter);

  // Load all characters and filter by discovered status
  const allCharacters = loadAllCharacters();
  const visibleCharacters = showUndiscovered
    ? allCharacters
    : allCharacters.filter((char) => hasDiscoveredCharacter(char.id));

  // Group characters by category
  const charactersByCategory = {
    ally: visibleCharacters.filter((c) => c.category === 'ally'),
    neutral: visibleCharacters.filter((c) => c.category === 'neutral'),
    antagonist: visibleCharacters.filter((c) => c.category === 'antagonist'),
    referenced: visibleCharacters.filter((c) => c.category === 'referenced'),
  };

  const toggleExpanded = (characterId: string) => {
    setExpandedCharacterId(expandedCharacterId === characterId ? null : characterId);
  };

  const renderCharacter = (character: Character) => {
    const score = relationships[character.id] || 0;
    const isExpanded = expandedCharacterId === character.id;
    const isDiscovered = hasDiscoveredCharacter(character.id);

    // Calculate progress bar percentage (0 to 100 from -100 to 100 score)
    const progressPercentage = ((score + 100) / 200) * 100;

    const nextUnlock = getNextUnlock(character.id, score);
    const unlockedContent = getUnlockedContent(character.id, score);

    return (
      <div
        key={character.id}
        className={`
          border-l-4 p-3 rounded-r-lg mb-2 cursor-pointer transition-all
          ${getRelationshipBorderColor(score)}
          ${getRelationshipBgColor(score)}
          hover:shadow-md
        `}
        onClick={() => toggleExpanded(character.id)}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryEmoji(character.category)}</span>
            <span className="font-semibold">{character.name}</span>
            {!isDiscovered && <span className="text-xs text-gray-500">(Debug Mode)</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getRelationshipEmoji(score)}</span>
            <span className={`font-bold ${getRelationshipColor(score)}`}>{score}</span>
          </div>
        </div>

        {/* Role and Status */}
        <div className="mt-1 text-sm text-gray-600">
          <span className="italic">{character.role}</span>
          <span className="mx-2">•</span>
          <span className={getRelationshipColor(score)}>{getRelationshipLabel(score)}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getRelationshipProgressColor(score)}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Next Unlock Preview */}
        {nextUnlock && (
          <div className="mt-2 text-xs text-gray-700 bg-white/50 rounded p-2">
            <span className="font-semibold">Next at {nextUnlock.threshold}:</span> {nextUnlock.description}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
            {/* Description */}
            <div className="text-sm">
              <p className="font-semibold mb-1">About:</p>
              <p className="text-gray-700">{character.description}</p>
            </div>

            {/* Location */}
            <div className="text-sm">
              <p className="font-semibold mb-1">Location:</p>
              <p className="text-gray-700">{character.location}</p>
            </div>

            {/* Traits */}
            <div className="text-sm">
              <p className="font-semibold mb-1">Traits:</p>
              <div className="flex flex-wrap gap-1">
                {character.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Unlocked Content */}
            {unlockedContent.length > 0 && (
              <div className="text-sm">
                <p className="font-semibold mb-1">Unlocked:</p>
                <ul className="list-disc list-inside space-y-1">
                  {unlockedContent.map((content, idx) => (
                    <li key={idx} className="text-gray-700 text-xs">
                      {content}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Thresholds */}
            <div className="text-sm">
              <p className="font-semibold mb-1">Relationship Milestones:</p>
              <div className="space-y-1">
                {Object.entries(character.relationshipThresholds).map(([name, threshold]) => {
                  const isReached = score >= threshold;
                  return (
                    <div
                      key={name}
                      className={`text-xs flex items-center justify-between ${
                        isReached ? 'text-green-700 font-semibold' : 'text-gray-500'
                      }`}
                    >
                      <span>
                        {isReached ? '✓' : '○'} {name}
                      </span>
                      <span>{threshold}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCategory = (category: string, characters: Character[]) => {
    if (characters.length === 0) return null;

    const categoryNames = {
      ally: 'Allies',
      neutral: 'Neutral',
      antagonist: 'Antagonists',
      referenced: 'Referenced',
    };

    return (
      <div key={category} className="mb-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <span>{getCategoryEmoji(category)}</span>
          <span>{categoryNames[category as keyof typeof categoryNames]}</span>
          <span className="text-xs font-normal text-gray-500">({characters.length})</span>
        </h3>
        {characters.map(renderCharacter)}
      </div>
    );
  };

  return (
    <div className={`bg-white border-l-2 border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Relationships</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden text-gray-600 hover:text-gray-800"
            aria-label={isCollapsed ? 'Expand relationships' : 'Collapse relationships'}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {visibleCharacters.length} character{visibleCharacters.length !== 1 ? 's' : ''} discovered
        </p>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto max-h-screen">
          {visibleCharacters.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No characters discovered yet.</p>
              <p className="text-xs mt-2">Meet NPCs to track relationships.</p>
            </div>
          ) : (
            <>
              {renderCategory('ally', charactersByCategory.ally)}
              {renderCategory('neutral', charactersByCategory.neutral)}
              {renderCategory('antagonist', charactersByCategory.antagonist)}
              {renderCategory('referenced', charactersByCategory.referenced)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
