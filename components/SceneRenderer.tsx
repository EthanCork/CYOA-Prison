/**
 * SceneRenderer component - Combines text display and choice buttons
 * Renders a complete scene with content and interactive choices
 */

'use client';

import { useState } from 'react';
import SceneText from './SceneText';
import ChoiceButton from './ChoiceButton';
import type { Scene, Choice } from '@/types';

interface SceneRendererProps {
  /** The scene data to render */
  scene: Scene;
  /** Callback when a choice is selected */
  onChoiceSelected?: (choice: Choice) => void;
  /** Callback for auto-continue (narrative scenes with nextScene) */
  onContinue?: (nextSceneId: string) => void;
  /** Enable typewriter effect for scene text */
  typewriter?: boolean;
  /** Typewriter speed in milliseconds per character */
  typewriterSpeed?: number;
  /** Show choice numbers */
  showChoiceNumbers?: boolean;
  /** Custom className for container */
  className?: string;
  /** Filter function to determine if a choice should be shown/enabled */
  isChoiceAvailable?: (choice: Choice) => boolean;
  /** Function to get lock reason for unavailable choices */
  getChoiceLockReason?: (choice: Choice) => string | undefined;
  /** Hide unavailable choices completely instead of showing them as disabled */
  hideUnavailableChoices?: boolean;
}

export default function SceneRenderer({
  scene,
  onChoiceSelected,
  onContinue,
  typewriter = false,
  typewriterSpeed = 30,
  showChoiceNumbers = true,
  className = '',
  isChoiceAvailable,
  getChoiceLockReason,
  hideUnavailableChoices = false,
}: SceneRendererProps) {
  const [typewriterComplete, setTypewriterComplete] = useState(!typewriter);

  const handleChoiceClick = (choice: Choice) => {
    if (onChoiceSelected) {
      onChoiceSelected(choice);
    }
  };

  const handleContinue = () => {
    if (scene.nextScene && onContinue) {
      onContinue(scene.nextScene);
    }
  };

  const hasChoices = scene.choices && scene.choices.length > 0;
  const isEnding = scene.type === 'ending';
  const isNarrative = scene.type === 'narrative' && scene.nextScene;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Scene Content Section */}
      <div className="space-y-4">
        {/* Speaker Name (for dialogue scenes) */}
        {scene.content.speaker && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-amber-400">
              {scene.content.speaker}
            </h2>
          </div>
        )}

        {/* Scene Text */}
        <SceneText
          text={scene.content.text}
          typewriter={typewriter}
          typewriterSpeed={typewriterSpeed}
          onComplete={() => setTypewriterComplete(true)}
        />

        {/* Visual Indicator (if present) */}
        {scene.content.visual && (
          <div className="text-xs text-gray-500 italic">
            📍 {scene.content.visual}
          </div>
        )}

        {/* Scene Type Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
              scene.type === 'dialogue'
                ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                : scene.type === 'investigation'
                ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                : scene.type === 'choice'
                ? 'bg-amber-900/50 text-amber-300 border border-amber-700'
                : scene.type === 'ending'
                ? 'bg-red-900/50 text-red-300 border border-red-700'
                : 'bg-gray-700/50 text-gray-300 border border-gray-600'
            }`}
          >
            {scene.type.charAt(0).toUpperCase() + scene.type.slice(1)}
          </span>

          {/* Scene ID (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <span className="text-xs text-gray-500 font-mono">{scene.id}</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Choices Section */}
      {hasChoices && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">
            What will you do?
          </h3>

          {/* Show choices only after typewriter completes (if enabled) */}
          {typewriterComplete ? (
            <div className="space-y-3">
              {scene.choices
                .filter((choice) => {
                  // If hideUnavailableChoices is true, filter out unavailable choices
                  if (hideUnavailableChoices && isChoiceAvailable) {
                    return isChoiceAvailable(choice);
                  }
                  return true;
                })
                .map((choice, index) => {
                  const available = isChoiceAvailable
                    ? isChoiceAvailable(choice)
                    : true;
                  const lockReason = getChoiceLockReason
                    ? getChoiceLockReason(choice)
                    : undefined;

                  return (
                    <ChoiceButton
                      key={index}
                      choice={choice}
                      onClick={handleChoiceClick}
                      index={showChoiceNumbers ? index + 1 : undefined}
                      disabled={!available}
                      lockReason={lockReason}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="text-gray-500 italic text-sm">
              Reading scene...
            </div>
          )}
        </div>
      )}

      {/* Auto-Continue Section (for narrative scenes with nextScene) */}
      {!hasChoices && isNarrative && typewriterComplete && (
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-amber-600 text-gray-900 rounded-lg font-semibold hover:bg-amber-500 transition-colors shadow-lg hover:shadow-amber-500/20"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Ending Section */}
      {isEnding && typewriterComplete && (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-amber-600 rounded-lg text-center space-y-4">
          <div className="text-4xl">🏁</div>
          <h3 className="text-2xl font-bold text-amber-400">The End</h3>
          <p className="text-gray-400">
            You have reached an ending in El Palo de Queso
          </p>

          {/* Show ending flags if present */}
          {scene.flagChanges?.set && scene.flagChanges.set.length > 0 && (
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Ending flags:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {scene.flagChanges.set.map((flag) => (
                  <span
                    key={flag}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Choices and No Next Scene (error state) */}
      {!hasChoices && !isNarrative && !isEnding && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg text-center">
          <p className="text-yellow-400 text-sm">
            ⚠️ This scene has no choices or continuation
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Scene ID: {scene.id} • Type: {scene.type}
          </p>
        </div>
      )}

      {/* State Changes Display (Development) */}
      {process.env.NODE_ENV === 'development' &&
        (scene.flagChanges ||
          scene.itemChanges ||
          scene.relationshipChanges ||
          scene.evidenceChanges) && (
          <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">
              Scene State Changes (Dev):
            </h4>
            <div className="space-y-1 text-xs">
              {scene.flagChanges && (
                <div className="text-green-400">
                  Flags: {JSON.stringify(scene.flagChanges)}
                </div>
              )}
              {scene.itemChanges && (
                <div className="text-blue-400">
                  Items: {JSON.stringify(scene.itemChanges)}
                </div>
              )}
              {scene.relationshipChanges && (
                <div className="text-purple-400">
                  Relationships: {JSON.stringify(scene.relationshipChanges)}
                </div>
              )}
              {scene.evidenceChanges && (
                <div className="text-yellow-400">
                  Evidence: {JSON.stringify(scene.evidenceChanges)}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
