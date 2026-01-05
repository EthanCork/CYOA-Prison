'use client';

/**
 * Path Selection Demo
 * Demonstrates the path tracking system and selection UI
 */

import { useGameStore } from '@/lib/store';
import PathIndicator from '@/components/PathIndicator';
import PathSelector from '@/components/PathSelector';

export default function PathSelectionDemo() {
  const {
    currentPath,
    setPath,
    inventory,
    evidence,
    relationships,
    addItem,
    removeItem,
    addEvidence,
    removeEvidence,
    changeRelationship,
    resetGame,
  } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Path Selection Demo</h1>
          <p className="mt-2 text-gray-600">
            Test the path tracking system and selection interface
          </p>
        </div>

        {/* Current Path Indicator */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">Current Path</h2>
          <div className="space-y-3">
            <PathIndicator showDescription={true} />
            <PathIndicator compact={true} />
            <PathIndicator hideWhenUnselected={true} />
          </div>
        </div>

        {/* Path Selector */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">Select Path</h2>
          <PathSelector
            onPathSelected={(path) => {
              console.log(`Path selected: ${path}`);
            }}
          />
        </div>

        {/* Game State Controls */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Game State (for testing recommendations)
          </h2>

          {/* Inventory */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Inventory (affects Path A recommendation)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  if (inventory.includes('lockpick')) {
                    removeItem('lockpick');
                  } else {
                    addItem('lockpick');
                  }
                }}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  inventory.includes('lockpick')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {inventory.includes('lockpick') ? '✓' : '+'} Lockpick
              </button>
              <button
                onClick={() => {
                  if (inventory.includes('dark_clothes')) {
                    removeItem('dark_clothes');
                  } else {
                    addItem('dark_clothes');
                  }
                }}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  inventory.includes('dark_clothes')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {inventory.includes('dark_clothes') ? '✓' : '+'} Dark Clothes
              </button>
            </div>
          </div>

          {/* Evidence */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Evidence (affects Path C recommendation)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  if (evidence.includes('warden_ledger')) {
                    removeEvidence('warden_ledger');
                  } else {
                    addEvidence('warden_ledger');
                  }
                }}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  evidence.includes('warden_ledger')
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {evidence.includes('warden_ledger') ? '✓' : '+'} Warden&apos;s Ledger
              </button>
              <button
                onClick={() => {
                  if (evidence.includes('guard_brutality_photos')) {
                    removeEvidence('guard_brutality_photos');
                  } else {
                    addEvidence('guard_brutality_photos');
                  }
                }}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  evidence.includes('guard_brutality_photos')
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {evidence.includes('guard_brutality_photos') ? '✓' : '+'} Brutality Photos
              </button>
            </div>
          </div>

          {/* Relationships */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Relationships (affects Path B recommendation)
            </h3>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bastian</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {relationships.bastian || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeRelationship('bastian', -10)}
                    className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => changeRelationship('bastian', 10)}
                    className="rounded bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => changeRelationship('bastian', 50)}
                    className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Set to 50
                  </button>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rosa</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {relationships.rosa || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeRelationship('rosa', -10)}
                    className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => changeRelationship('rosa', 10)}
                    className="rounded bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => changeRelationship('rosa', 50)}
                    className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Set to 50
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={resetGame}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Reset Game State
            </button>
          </div>
        </div>

        {/* Manual Path Controls */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Manual Path Controls (for testing)
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setPath('A')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                currentPath === 'A'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Set Path A
            </button>
            <button
              onClick={() => setPath('B')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                currentPath === 'B'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Set Path B
            </button>
            <button
              onClick={() => setPath('C')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                currentPath === 'C'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Set Path C
            </button>
          </div>
        </div>

        {/* Current State Display */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Current Game State</h2>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
            {JSON.stringify(
              {
                currentPath,
                inventory,
                evidence,
                relationships,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
