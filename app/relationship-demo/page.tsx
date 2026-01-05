'use client';

import { useGameStore } from '@/lib/store';
import RelationshipPanel from '@/components/RelationshipPanel';
import { loadAllCharacters, getInitialRelationships } from '@/lib/characterLoader';
import { useEffect, useState } from 'react';

/**
 * Demo page for RelationshipPanel component
 * Shows relationship tracking with interactive controls
 */
export default function RelationshipDemoPage() {
  const [initialized, setInitialized] = useState(false);
  const [showDebugMode, setShowDebugMode] = useState(false);

  const relationships = useGameStore((state) => state.relationships);
  const discoveredCharacters = useGameStore((state) => state.discoveredCharacters);
  const changeRelationship = useGameStore((state) => state.changeRelationship);
  const setRelationship = useGameStore((state) => state.setRelationship);
  const discoverCharacter = useGameStore((state) => state.discoverCharacter);

  const allCharacters = loadAllCharacters();

  // Initialize relationships on first load
  useEffect(() => {
    if (!initialized) {
      const initialRelationships = getInitialRelationships();
      Object.entries(initialRelationships).forEach(([charId, score]) => {
        setRelationship(charId, score);
      });
      setInitialized(true);
    }
  }, [initialized, setRelationship]);

  const handleDiscoverCharacter = (characterId: string) => {
    discoverCharacter(characterId);
  };

  const handleChangeRelationship = (characterId: string, delta: number) => {
    changeRelationship(characterId, delta);
  };

  const handleDiscoverAll = () => {
    allCharacters.forEach((char) => discoverCharacter(char.id));
  };

  const handleResetDiscoveries = () => {
    useGameStore.setState({ discoveredCharacters: [] });
  };

  const handleResetRelationships = () => {
    const initialRelationships = getInitialRelationships();
    Object.entries(initialRelationships).forEach(([charId, score]) => {
      setRelationship(charId, score);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">Relationship Panel Demo</h1>
          <p className="text-gray-600 mb-8">
            Interactive demonstration of the relationship tracking system for El Palo de Queso.
          </p>

          {/* Global Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Global Controls</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDiscoverAll}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Discover All Characters
              </button>
              <button
                onClick={handleResetDiscoveries}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Reset Discoveries
              </button>
              <button
                onClick={handleResetRelationships}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Reset Relationships
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showDebugMode}
                  onChange={(e) => setShowDebugMode(e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Show Debug Mode (All Characters)</span>
              </label>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Discovered:</strong> {discoveredCharacters.length} / {allCharacters.length}{' '}
                characters
              </p>
            </div>
          </div>

          {/* Character Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Character Controls</h2>
            <p className="text-sm text-gray-600 mb-4">
              Discover characters and adjust their relationship scores to see the panel update in
              real-time.
            </p>

            <div className="space-y-4">
              {allCharacters.map((character) => {
                const isDiscovered = discoveredCharacters.includes(character.id);
                const currentScore = relationships[character.id] || 0;

                return (
                  <div
                    key={character.id}
                    className={`border rounded-lg p-4 ${
                      isDiscovered ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold">{character.name}</h3>
                        <p className="text-sm text-gray-600">{character.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isDiscovered && (
                          <button
                            onClick={() => handleDiscoverCharacter(character.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Discover
                          </button>
                        )}
                        {isDiscovered && (
                          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded">
                            Discovered
                          </span>
                        )}
                      </div>
                    </div>

                    {isDiscovered && (
                      <div className="mt-3">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold">Score: {currentScore}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleChangeRelationship(character.id, -10)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                              -10
                            </button>
                            <button
                              onClick={() => handleChangeRelationship(character.id, -5)}
                              className="px-3 py-1 bg-red-400 text-white text-sm rounded hover:bg-red-500"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleChangeRelationship(character.id, 5)}
                              className="px-3 py-1 bg-green-400 text-white text-sm rounded hover:bg-green-500"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleChangeRelationship(character.id, 10)}
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                            >
                              +10
                            </button>
                          </div>
                        </div>

                        {/* Show next unlock */}
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(character.relationshipThresholds).map(
                              ([name, threshold]) => {
                                const isReached = currentScore >= threshold;
                                return (
                                  <span
                                    key={name}
                                    className={`px-2 py-1 rounded ${
                                      isReached
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                                  >
                                    {name}: {threshold} {isReached ? '✓' : ''}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Relationship Panel Sidebar */}
        <div className="md:w-96 md:sticky md:top-0 md:h-screen">
          <RelationshipPanel showUndiscovered={showDebugMode} />
        </div>
      </div>
    </div>
  );
}
