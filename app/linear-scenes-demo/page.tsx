'use client';

import { useSceneTransition } from '@/lib/hooks/useSceneTransition';
import SceneRenderer from '@/components/SceneRenderer';
import StateChangeNotification from '@/components/StateChangeNotification';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';

export default function LinearScenesDemo() {
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
    isChoiceAvailable,
    getChoiceLockReason,
    recentStateChanges,
    clearStateChanges,
    resetGame,
  } = useSceneTransition();

  // Start at the linear test beginning
  const { goToScene } = useGameStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      goToScene('LINEAR-001', false);
      setInitialized(true);
    }
  }, [initialized, goToScene]);

  const handleReset = () => {
    resetGame();
    goToScene('LINEAR-001', false);
  };

  // Track scene flow statistics
  const linearSceneCount = sceneHistory.filter((id) => id.startsWith('LINEAR-')).length +
    (currentSceneId.startsWith('LINEAR-') ? 1 : 0);
  const hasChoices = scene?.choices && scene.choices.length > 0;
  const isLinear = !hasChoices && scene?.nextScene;
  const isEnding = scene?.type === 'ending';

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
                Linear Scenes Demo
              </h1>
              <p className="text-sm text-gray-400">
                Narrative scenes with automatic Continue buttons
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Current Scene:</span>{' '}
                  <span className="text-amber-400 font-mono font-semibold ml-2">
                    {currentSceneId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Scene Type:</span>{' '}
                  <span className={`font-semibold ml-2 ${
                    isLinear ? 'text-blue-400' : isEnding ? 'text-red-400' : 'text-purple-400'
                  }`}>
                    {isLinear ? 'Linear (Continue)' : isEnding ? 'Ending' : 'Choice'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">History:</span>{' '}
                  <span className="text-purple-400 font-semibold ml-2">
                    {sceneHistory.length} scenes
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Scenes Visited:</span>{' '}
                  <span className="text-green-400 font-semibold ml-2">
                    {linearSceneCount}
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
                typewriter={false}
              />
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">
                How Linear Scenes Work
              </h3>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• <strong>Linear scenes</strong> have no choices - just a Continue button</li>
                <li>• The Continue button appears automatically for narrative scenes with nextScene</li>
                <li>• <strong>Choice scenes</strong> show multiple options instead of Continue</li>
                <li>• <strong>Ending scenes</strong> show no Continue button (game ends)</li>
                <li>• You can navigate back through scenes using the Back button</li>
                <li>• State changes (items, flags, relationships) apply automatically as you continue</li>
              </ul>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Scene Flow Visualization */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">
                Scene Flow
              </h3>
              <div className="space-y-2">
                {[...sceneHistory, currentSceneId].map((sceneId, index) => {
                  const isCurrent = index === sceneHistory.length;

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        isCurrent ? 'bg-amber-400 animate-pulse' : 'bg-gray-600'
                      }`}></div>
                      <div className={`text-xs font-mono ${
                        isCurrent ? 'text-amber-400 font-semibold' : 'text-gray-400'
                      }`}>
                        {sceneId}
                      </div>
                      {isCurrent && (
                        <span className="text-xs text-amber-400 font-semibold">← Current</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Game State */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                Items ({inventory.length})
              </h3>
              {inventory.length > 0 ? (
                <div className="space-y-1">
                  {inventory.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-gray-700 rounded text-sm text-gray-200"
                    >
                      {item.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No items yet</p>
              )}
            </div>

            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">
                Flags ({flags.length})
              </h3>
              {flags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {flags.map((flag) => (
                    <span
                      key={flag}
                      className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs font-mono"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No flags set</p>
              )}
            </div>

            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
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
                        <span className={score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : 'text-gray-400'}>
                          {score > 0 ? '+' : ''}{score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            score > 0 ? 'bg-green-500' : score < 0 ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${Math.abs(score)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No relationships</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
