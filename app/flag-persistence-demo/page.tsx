'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import SceneRenderer from '@/components/SceneRenderer';
import { loadScene } from '@/lib/sceneLoader';
import { checkChoiceRequirements } from '@/lib/sceneTransitions';
import type { Scene, Choice } from '@/types';

export default function FlagPersistenceDemo() {
  const {
    flags,
    inventory,
    relationships,
    evidence,
    resetGame,
  } = useGameStore();

  const [currentSceneId, setCurrentSceneId] = useState('FLAG-TEST-001');
  const [scene, setScene] = useState<Scene | null>(null);
  const [sceneHistory, setSceneHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load scene when ID changes
  useEffect(() => {
    try {
      const loadedScene = loadScene(currentSceneId);
      setScene(loadedScene);
      setError(null);

      // Apply scene-level flag changes
      if (loadedScene.flagChanges?.set) {
        loadedScene.flagChanges.set.forEach((flag) => {
          useGameStore.getState().setFlag(flag);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scene');
      setScene(null);
    }
  }, [currentSceneId]);

  const handleChoiceSelected = (choice: Choice) => {
    // Apply choice flag changes
    if (choice.flagChanges?.set) {
      choice.flagChanges.set.forEach((flag) => {
        useGameStore.getState().setFlag(flag);
      });
    }
    if (choice.flagChanges?.unset) {
      choice.flagChanges.unset.forEach((flag) => {
        useGameStore.getState().unsetFlag(flag);
      });
    }

    // Navigate to next scene
    setSceneHistory([...sceneHistory, currentSceneId]);
    setCurrentSceneId(choice.nextScene);
  };

  const handleContinue = () => {
    if (scene?.nextScene) {
      setSceneHistory([...sceneHistory, currentSceneId]);
      setCurrentSceneId(scene.nextScene);
    }
  };

  const handleGoBack = () => {
    if (sceneHistory.length > 0) {
      const newHistory = [...sceneHistory];
      const previousScene = newHistory.pop()!;
      setSceneHistory(newHistory);
      setCurrentSceneId(previousScene);
    }
  };

  const handleReset = () => {
    resetGame();
    setCurrentSceneId('FLAG-TEST-001');
    setSceneHistory([]);
  };

  const isChoiceAvailable = (choice: Choice) => {
    const result = checkChoiceRequirements(choice, {
      inventory,
      flags,
      relationships,
      evidence,
    });
    return result.canSelect;
  };

  const getChoiceLockReason = (choice: Choice) => {
    const result = checkChoiceRequirements(choice, {
      inventory,
      flags,
      relationships,
      evidence,
    });
    return result.reason;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
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

  if (!scene) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading scene...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-green-400">
                Flag Persistence Test
              </h1>
              <p className="text-sm text-gray-400">
                Navigate through scenes to verify flags persist correctly
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                disabled={sceneHistory.length === 0}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm"
              >
                Reset Test
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
                  <span className="text-green-400 font-mono font-semibold ml-2">
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

            {/* Test Instructions */}
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">
                Test Instructions
              </h3>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• Watch the flag panel to see flags being set as you navigate</li>
                <li>• Try going back to previous scenes - flags should persist</li>
                <li>• Some choices are locked until you set required flags</li>
                <li>• The escape ending requires both the warden meeting AND guard schedule flags</li>
                <li>• Use Reset Test to start over and clear all flags</li>
              </ul>
            </div>
          </div>

          {/* Flag Display Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Active Flags */}
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Active Flags ({flags.length})
                </h3>
                {flags.length > 0 ? (
                  <div className="space-y-1">
                    {flags.map((flag) => (
                      <div
                        key={flag}
                        className="px-3 py-2 bg-green-900/50 border border-green-700 rounded text-sm text-green-300 font-mono"
                      >
                        {flag}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No flags set yet</p>
                )}
              </div>

              {/* Expected Flags Guide */}
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  Expected Flags by Scene
                </h3>
                <div className="text-xs space-y-2">
                  <div>
                    <div className="text-gray-400">FLAG-TEST-001:</div>
                    <div className="text-green-300 font-mono ml-2">story:intro_complete</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Meet Warden Choice:</div>
                    <div className="text-green-300 font-mono ml-2">story:met_warden</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Courtyard Choice:</div>
                    <div className="text-green-300 font-mono ml-2">loc:found_courtyard</div>
                    <div className="text-green-300 font-mono ml-2">disc:guard_schedule</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Escape Plan:</div>
                    <div className="text-green-300 font-mono ml-2">quest:accepted_escape_plan</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Escape Ending:</div>
                    <div className="text-green-300 font-mono ml-2">ending:escape_success</div>
                  </div>
                </div>
              </div>

              {/* Persistence Indicator */}
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="flex items-center gap-2 text-green-300 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Flags Persisting</span>
                </div>
                <p className="text-xs text-green-200 mt-2">
                  Flags remain active across all scene transitions and navigation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
