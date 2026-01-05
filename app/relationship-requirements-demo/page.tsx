'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import SceneRenderer from '@/components/SceneRenderer';
import { loadScene } from '@/lib/sceneLoader';
import { getInitialRelationships, loadAllCharacters } from '@/lib/characterLoader';
import type { Scene } from '@/types';

/**
 * Demo page for relationship-based choice requirements
 * Shows how choices can be locked/unlocked based on relationship scores
 */
export default function RelationshipRequirementsDemoPage() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [initialized, setInitialized] = useState(false);

  const relationships = useGameStore((state) => state.relationships);
  const setRelationship = useGameStore((state) => state.setRelationship);
  const changeRelationship = useGameStore((state) => state.changeRelationship);
  const addItem = useGameStore((state) => state.addItem);
  const removeItem = useGameStore((state) => state.removeItem);
  const inventory = useGameStore((state) => state.inventory);

  const allCharacters = loadAllCharacters();

  // Initialize on first load
  useEffect(() => {
    if (!initialized) {
      // Load the demo scene
      const demoScene = loadScene('REL-DEMO-001');
      setScene(demoScene);

      // Initialize relationships
      const initialRelationships = getInitialRelationships();
      Object.entries(initialRelationships).forEach(([charId, score]) => {
        setRelationship(charId, score);
      });

      setInitialized(true);
    }
  }, [initialized, setRelationship]);

  const handleChoiceSelected = (choice: any) => {
    const nextScene = loadScene(choice.nextScene);
    setScene(nextScene);
  };

  const handleContinue = (nextSceneId: string) => {
    const nextScene = loadScene(nextSceneId);
    setScene(nextScene);
  };

  const handleResetRelationships = () => {
    const initialRelationships = getInitialRelationships();
    Object.entries(initialRelationships).forEach(([charId, score]) => {
      setRelationship(charId, score);
    });
  };

  const handleSetAllHigh = () => {
    allCharacters.forEach((char) => {
      setRelationship(char.id, 80);
    });
  };

  const handleSetAllLow = () => {
    allCharacters.forEach((char) => {
      setRelationship(char.id, -50);
    });
  };

  const handleToggleUniform = () => {
    if (inventory.includes('guard_uniform')) {
      removeItem('guard_uniform');
    } else {
      addItem('guard_uniform');
    }
  };

  if (!scene) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Relationship Requirements Demo</h1>
        <p className="text-gray-400 mb-8">
          Test how relationship scores lock and unlock different choices. Adjust character
          relationships below to see choices become available.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scene Display */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <SceneRenderer
                scene={scene}
                onChoiceSelected={handleChoiceSelected}
                onContinue={handleContinue}
                showChoiceNumbers={true}
              />
            </div>

            {/* Info Panel */}
            <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h3 className="font-bold text-blue-300 mb-2">How It Works:</h3>
              <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
                <li>Locked choices show in gray with a lock icon</li>
                <li>Hover over locked choices to see requirement details</li>
                <li>Adjust relationships on the right to unlock choices</li>
                <li>Some choices require minimum scores (≥)</li>
                <li>Some choices require maximum scores (≤)</li>
                <li>Some choices require ranges or multiple characters</li>
                <li>Some choices combine relationships with items/flags</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Relationship Controls */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={handleResetRelationships}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
                >
                  Reset to Initial Values
                </button>
                <button
                  onClick={handleSetAllHigh}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                >
                  Set All to 80 (Unlock Most)
                </button>
                <button
                  onClick={handleSetAllLow}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                >
                  Set All to -50 (Lock Most)
                </button>
                <button
                  onClick={handleToggleUniform}
                  className={`w-full px-4 py-2 rounded transition ${
                    inventory.includes('guard_uniform')
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {inventory.includes('guard_uniform') ? '✓ ' : ''}Guard Uniform
                  {inventory.includes('guard_uniform') ? '' : ' (Not Owned)'}
                </button>
              </div>
            </div>

            {/* Individual Character Controls */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-xl max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Character Relationships</h2>
              <div className="space-y-4">
                {allCharacters
                  .filter((char) => char.category !== 'referenced')
                  .map((character) => {
                    const score = relationships[character.id] || 0;
                    const progressPercentage = ((score + 100) / 200) * 100;
                    const colorClass =
                      score >= 60
                        ? 'bg-green-600'
                        : score >= 20
                        ? 'bg-green-500'
                        : score >= -10
                        ? 'bg-yellow-600'
                        : score >= -40
                        ? 'bg-orange-500'
                        : 'bg-red-600';

                    return (
                      <div key={character.id} className="border border-gray-700 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{character.name}</span>
                          <span className="text-lg font-bold">{score}</span>
                        </div>

                        <div className="bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className={`h-full rounded-full transition-all ${colorClass}`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => changeRelationship(character.id, -20)}
                            className="flex-1 px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs transition"
                          >
                            -20
                          </button>
                          <button
                            onClick={() => changeRelationship(character.id, -10)}
                            className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs transition"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => changeRelationship(character.id, -5)}
                            className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-400 rounded text-xs transition"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => setRelationship(character.id, 0)}
                            className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs transition"
                          >
                            0
                          </button>
                          <button
                            onClick={() => changeRelationship(character.id, 5)}
                            className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-400 rounded text-xs transition"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => changeRelationship(character.id, 10)}
                            className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs transition"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => changeRelationship(character.id, 20)}
                            className="flex-1 px-2 py-1 bg-green-700 hover:bg-green-600 rounded text-xs transition"
                          >
                            +20
                          </button>
                        </div>

                        {/* Show key thresholds for this character */}
                        <div className="mt-2 text-xs text-gray-400">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(character.relationshipThresholds).map(
                              ([name, threshold]) => {
                                const isReached = score >= threshold;
                                return (
                                  <span
                                    key={name}
                                    className={`px-1 py-0.5 rounded ${
                                      isReached
                                        ? 'bg-green-900/50 text-green-300'
                                        : 'bg-gray-700 text-gray-500'
                                    }`}
                                  >
                                    {threshold} {isReached ? '✓' : ''}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
