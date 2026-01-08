/**
 * Game Full Demo - Visual Novel Style
 * Fullscreen immersive experience with background as primary focus
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSceneTransition } from '@/lib/hooks/useSceneTransition';
import { useGameStore } from '@/lib/store';
import { checkChoiceRequirements } from '@/lib/sceneTransitions';
import VisualNovelScene from '@/components/VisualNovelScene';
import SettingsMenu from '@/components/SettingsMenu';
import type { Hotspot, HotspotAction } from '@/types';

export default function GameFullDemo() {
  const router = useRouter();
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [interactedHotspots, setInteractedHotspots] = useState<Set<string>>(new Set());

  const {
    scene,
    currentSceneId,
    isLoading,
    error,
    handleChoiceSelected,
    handleContinue,
    goBack,
    canGoBack,
    sceneHistory,
    inventory,
    flags,
    relationships,
    evidence,
    isChoiceAvailable,
    resetGame,
  } = useSceneTransition();

  const handleResetGame = () => {
    resetGame();
    router.push('/');
  };

  const { addItem, addEvidence, setFlag } = useGameStore();

  const handleHotspotInteraction = (hotspot: Hotspot, action: HotspotAction) => {
    const { flagChanges, itemChanges, evidenceChanges } = action;

    // Apply flag changes
    if (flagChanges?.set) {
      flagChanges.set.forEach((flag) => setFlag(flag, true));
    }
    if (flagChanges?.unset) {
      flagChanges.unset.forEach((flag) => setFlag(flag, false));
    }

    // Apply item changes
    if (itemChanges?.add) {
      itemChanges.add.forEach((item) => addItem(item));
    }

    // Apply evidence changes
    if (evidenceChanges?.add) {
      evidenceChanges.add.forEach((evidence) => addEvidence(evidence));
    }

    // Mark hotspot as interacted if one-time
    if (action.oneTime) {
      setInteractedHotspots((prev) => new Set(prev).add(hotspot.id));
    }

    // Navigate if specified
    if (action.nextScene) {
      handleContinue(action.nextScene);
    }
  };

  const isHotspotAvailable = (hotspot: Hotspot) => {
    if (!hotspot.requirements) return true;

    const { canSelect } = checkChoiceRequirements(
      { text: '', nextScene: '', requirements: hotspot.requirements },
      { inventory, flags, relationships, evidence }
    );

    return canSelect;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl animate-pulse">Loading scene...</div>
      </div>
    );
  }

  if (error || !scene) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Scene not found'}</div>
          <button
            onClick={handleResetGame}
            className="px-6 py-2 bg-amber-600 text-gray-900 rounded-md hover:bg-amber-500"
          >
            Reset Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main visual novel scene - fullscreen */}
      <VisualNovelScene
        scene={scene}
        onChoiceSelected={handleChoiceSelected}
        onContinue={handleContinue}
        isChoiceAvailable={isChoiceAvailable}
        onHotspotInteraction={handleHotspotInteraction}
        isHotspotAvailable={isHotspotAvailable}
        interactedHotspots={interactedHotspots}
      />

      {/* Menu bar (top center) - minimalist */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 border border-amber-600/30 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Go back"
        >
          ← Back
        </button>
        <button
          onClick={() => setShowStatsPanel(!showStatsPanel)}
          className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 border border-amber-600/30"
          title="Toggle stats panel"
        >
          {showStatsPanel ? '✕ Stats' : '📊 Stats'}
        </button>
        <button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 border border-amber-600/30"
          title="Toggle debug panel"
        >
          {showDebugPanel ? '✕ Debug' : '⚙ Debug'}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 border border-amber-600/30"
          title="Open settings"
        >
          ⚙️ Settings
        </button>
        <button
          onClick={handleResetGame}
          className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 border border-amber-600/30"
          title="Reset game and return to main menu"
        >
          ↻ Reset
        </button>
      </div>

      {/* Stats panel (slide in from left) */}
      {showStatsPanel && (
        <div className="absolute top-0 left-0 bottom-0 w-80 bg-black/95 backdrop-blur-sm z-40 overflow-y-auto border-r border-amber-600/30 p-4 transition-transform duration-300">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-amber-400">Game Stats</h2>
              <button
                onClick={() => setShowStatsPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Inventory */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Inventory
              </h3>
              {inventory.length > 0 ? (
                <div className="space-y-1">
                  {inventory.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-gray-800/80 rounded text-sm text-gray-200 border border-gray-700"
                    >
                      {item.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No items</p>
              )}
            </div>

            {/* Evidence */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Evidence
              </h3>
              {evidence.length > 0 ? (
                <div className="space-y-1">
                  {evidence.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-yellow-900/30 rounded text-sm text-yellow-200 border border-yellow-700/50"
                    >
                      {item.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No evidence</p>
              )}
            </div>

            {/* Relationships */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Relationships
              </h3>
              {Object.keys(relationships).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(relationships).map(([character, score]) => (
                    <div key={character} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-200 capitalize font-medium">
                          {character.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`font-bold ${
                            score > 0
                              ? 'text-green-400'
                              : score < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }`}
                        >
                          {score > 0 ? '+' : ''}
                          {score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            score > 0
                              ? 'bg-green-500'
                              : score < 0
                              ? 'bg-red-500'
                              : 'bg-gray-500'
                          }`}
                          style={{
                            width: `${Math.abs(score)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No relationships tracked</p>
              )}
            </div>

            {/* Flags */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Story Flags ({flags.length})
              </h3>
              {flags.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                  {flags.map((flag) => (
                    <span
                      key={flag}
                      className="px-2 py-1 bg-green-900/40 text-green-300 rounded text-xs font-mono border border-green-700/50"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No flags set</p>
              )}
            </div>

            {/* Progress Info */}
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-amber-400 font-semibold mb-2">Progress</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p><span className="text-gray-500">Current Scene:</span> <span className="text-white font-mono">{currentSceneId}</span></p>
                <p><span className="text-gray-500">Scenes Visited:</span> <span className="text-white">{sceneHistory.length}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug panel (slide in from right) */}
      {showDebugPanel && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-sm z-40 overflow-y-auto border-l border-amber-600/30 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Scene Info</h3>
              <div className="text-xs text-gray-300 space-y-1">
                <p><span className="text-gray-500">ID:</span> {currentSceneId}</p>
                <p><span className="text-gray-500">Type:</span> {scene.type}</p>
                <p><span className="text-gray-500">History:</span> {sceneHistory.length} scenes</p>
              </div>
            </div>

            {inventory.length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Inventory</h3>
                <div className="flex flex-wrap gap-1">
                  {inventory.map((item) => (
                    <span key={item} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                      {item.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {evidence.length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Evidence</h3>
                <div className="flex flex-wrap gap-1">
                  {evidence.map((item) => (
                    <span key={item} className="px-2 py-1 bg-yellow-900/50 rounded text-xs text-yellow-300">
                      {item.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(relationships).length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Relationships</h3>
                <div className="space-y-2">
                  {Object.entries(relationships).map(([character, score]) => (
                    <div key={character} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 capitalize">{character.replace(/_/g, ' ')}</span>
                        <span className={score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : 'text-gray-400'}>
                          {score > 0 ? '+' : ''}{score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${score > 0 ? 'bg-green-500' : score < 0 ? 'bg-red-500' : 'bg-gray-500'}`}
                          style={{ width: `${Math.abs(score)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {flags.length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Flags</h3>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {flags.map((flag) => (
                    <span key={flag} className="px-2 py-1 bg-green-900/50 rounded text-xs text-green-300 font-mono">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <SettingsMenu onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
}
