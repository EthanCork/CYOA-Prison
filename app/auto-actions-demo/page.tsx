'use client';

import { useSceneTransition } from '@/lib/hooks/useSceneTransition';
import SceneRenderer from '@/components/SceneRenderer';
import StateChangeNotification from '@/components/StateChangeNotification';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';

export default function AutoActionsDemo() {
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
    getChoiceLockReason,
    recentStateChanges,
    clearStateChanges,
    resetGame,
  } = useSceneTransition();

  // Start at the auto-actions test beginning
  const { goToScene } = useGameStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      goToScene('AUTO-001', false);
      setInitialized(true);
    }
  }, [initialized, goToScene]);

  const handleReset = () => {
    resetGame();
    goToScene('AUTO-001', false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading scene...</div>
      </div>
    );
  }

  if (error || !scene) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Scene not found'}</div>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-amber-600 text-gray-900 rounded-md hover:bg-amber-500"
          >
            Reset Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* State Change Notifications */}
      <StateChangeNotification
        changes={recentStateChanges}
        duration={4000}
        onComplete={clearStateChanges}
      />

      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">
                Auto-Actions Demo
              </h1>
              <p className="text-sm text-gray-400">
                Watch state changes happen automatically when entering scenes
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scene Content */}
          <div className="lg:col-span-2">
            {/* Scene Info */}
            <div className="mb-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-sm">Current Scene:</span>{' '}
                  <span className="text-amber-400 font-mono font-semibold ml-2">
                    {currentSceneId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">History:</span>{' '}
                  <span className="text-purple-400 font-semibold ml-2">
                    {sceneHistory.length} scenes
                  </span>
                </div>
              </div>
            </div>

            {/* Scene Renderer */}
            <div className="p-8 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl">
              <SceneRenderer
                scene={scene}
                onChoiceSelected={handleChoiceSelected}
                onContinue={handleContinue}
                isChoiceAvailable={isChoiceAvailable}
                getChoiceLockReason={getChoiceLockReason}
                showChoiceNumbers={true}
              />
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">
                How Auto-Actions Work
              </h3>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• State changes defined in scenes happen automatically when you enter them</li>
                <li>• Watch the notifications in the top-right corner show what changed</li>
                <li>• Items, flags, relationships, and evidence can all be auto-applied</li>
                <li>• The sidebar updates in real-time to reflect changes</li>
                <li>• Navigate through all 7 scenes to see different auto-action types</li>
              </ul>
            </div>
          </div>

          {/* Game State Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Inventory */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Inventory ({inventory.length})
              </h3>
              {inventory.length > 0 ? (
                <div className="space-y-1">
                  {inventory.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-gray-700 rounded text-sm text-gray-200 flex items-center gap-2"
                    >
                      <span className="text-amber-400">📦</span>
                      {item.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No items</p>
              )}
            </div>

            {/* Evidence */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Evidence ({evidence.length})
              </h3>
              {evidence.length > 0 ? (
                <div className="space-y-1">
                  {evidence.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-gray-700 rounded text-sm text-gray-200 flex items-center gap-2"
                    >
                      <span className="text-yellow-400">📋</span>
                      {item.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No evidence</p>
              )}
            </div>

            {/* Relationships */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Relationships
              </h3>
              {Object.keys(relationships).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(relationships).map(([character, score]) => (
                    <div key={character} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 capitalize">
                          {character.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={
                            score > 0
                              ? 'text-green-400'
                              : score < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }
                        >
                          {score > 0 ? '+' : ''}
                          {score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
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
                <p className="text-gray-500 text-sm">No relationships</p>
              )}
            </div>

            {/* Flags */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Flags ({flags.length})
              </h3>
              {flags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {flags.map((flag) => (
                    <span
                      key={flag}
                      className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs font-mono border border-green-700"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No flags set</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
