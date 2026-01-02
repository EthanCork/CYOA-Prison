/**
 * Demo component to verify the game store works in React
 */

'use client';

import { useGameStore } from '@/lib/store';

export default function StoreDemo() {
  const {
    currentScene,
    inventory,
    relationships,
    flags,
    evidence,
    goToScene,
    addItem,
    removeItem,
    changeRelationship,
    setFlag,
    addEvidence,
    resetGame,
  } = useGameStore();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Game Store Demo</h1>

      {/* Current State */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Current State</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Scene:</strong> {currentScene}</p>
          <p><strong>Inventory:</strong> {inventory.join(', ') || 'Empty'}</p>
          <p><strong>Flags:</strong> {flags.join(', ') || 'None'}</p>
          <p><strong>Evidence:</strong> {evidence.join(', ') || 'None'}</p>
          <p><strong>Relationships:</strong> {JSON.stringify(relationships) || 'None'}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Navigation</h2>
        <div className="space-x-2">
          <button
            onClick={() => goToScene('intro')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Intro
          </button>
          <button
            onClick={() => goToScene('cell')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Cell
          </button>
          <button
            onClick={() => goToScene('yard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Yard
          </button>
        </div>
      </div>

      {/* Inventory */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Inventory</h2>
        <div className="space-x-2">
          <button
            onClick={() => addItem('spoon')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Spoon
          </button>
          <button
            onClick={() => addItem('photo')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Photo
          </button>
          <button
            onClick={() => removeItem('spoon')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove Spoon
          </button>
        </div>
      </div>

      {/* Relationships */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Relationships</h2>
        <div className="space-x-2">
          <button
            onClick={() => changeRelationship('guard', 10)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            +10 Guard
          </button>
          <button
            onClick={() => changeRelationship('guard', -10)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            -10 Guard
          </button>
          <button
            onClick={() => changeRelationship('inmate', 15)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            +15 Inmate
          </button>
        </div>
      </div>

      {/* Flags & Evidence */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Flags & Evidence</h2>
        <div className="space-x-2">
          <button
            onClick={() => setFlag('day-1-complete')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Set Day 1 Flag
          </button>
          <button
            onClick={() => addEvidence('fingerprint')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add Fingerprint
          </button>
          <button
            onClick={() => addEvidence('note')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Reset</h2>
        <button
          onClick={resetGame}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
