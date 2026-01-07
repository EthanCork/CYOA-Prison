/**
 * New Game Flow Demo Page
 * Tests the new game initialization with confirmation dialog
 */

'use client';

import { useGameStore } from '@/lib/store';
import NewGameButton from '@/components/NewGameButton';

export default function NewGameDemoPage() {
  const {
    currentScene,
    sceneHistory,
    inventory,
    flags,
    relationships,
    currentPath,
    stats,
    hasProgress,
    goToScene,
    addItem,
    setFlag,
    changeRelationship,
    setPath,
  } = useGameStore();

  const handleNewGame = () => {
    console.log('New game started!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">New Game Flow Demo</h1>

        {/* New Game Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">New Game Actions</h2>
          <div className="flex flex-wrap gap-3">
            <NewGameButton
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              onNewGame={handleNewGame}
            >
              New Game
            </NewGameButton>

            <NewGameButton
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
              deleteAutoSave={false}
              onNewGame={handleNewGame}
            >
              New Game (Keep Auto-Save)
            </NewGameButton>

            <NewGameButton
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
              alwaysConfirm={true}
              onNewGame={handleNewGame}
            >
              New Game (Always Confirm)
            </NewGameButton>
          </div>
        </div>

        {/* Progress Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Progress Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-300">Has Progress:</span>
              <span className={hasProgress() ? 'text-yellow-400' : 'text-green-400'}>
                {hasProgress() ? 'Yes (will show confirmation)' : 'No (will start immediately)'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Game State */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Current Game State</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-300">Current Scene:</div>
              <div className="text-white">{currentScene}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Scene History Length:</div>
              <div className="text-white">{sceneHistory.length}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Scenes Visited:</div>
              <div className="text-white">{stats.scenesVisited}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Current Path:</div>
              <div className="text-white">{currentPath || 'None'}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Inventory Count:</div>
              <div className="text-white">{inventory.length}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Flags Set:</div>
              <div className="text-white">{flags.length}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Relationships:</div>
              <div className="text-white">{Object.keys(relationships).length}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Choices Made:</div>
              <div className="text-white">{stats.choicesMade}</div>
            </div>
          </div>
        </div>

        {/* Test Actions to Create Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Test Actions</h2>
          <p className="text-gray-300 mb-4">
            Use these buttons to simulate game progress and test the confirmation dialog:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => goToScene('test-scene-' + Math.random())}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Change Scene
            </button>
            <button
              onClick={() => addItem('test-item-' + Date.now())}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={() => setFlag('test-flag-' + Date.now())}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Set Flag
            </button>
            <button
              onClick={() => changeRelationship('test-char', 10)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            >
              Change Relationship
            </button>
            <button
              onClick={() => setPath('A')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Set Path A
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Initially at X-0-001 with no progress - "New Game" should start immediately without confirmation</li>
            <li>Use "Test Actions" to create some progress (change scene, add items, etc.)</li>
            <li>Notice "Has Progress" changes to "Yes"</li>
            <li>Click "New Game" - should now show confirmation dialog</li>
            <li>Click "Cancel" to abort or "Start New Game" to reset</li>
            <li>After resetting, verify all state returns to initial values</li>
            <li>Try "New Game (Keep Auto-Save)" - resets game but preserves auto-save</li>
            <li>Try "New Game (Always Confirm)" - shows confirmation even without progress</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-900 rounded">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Automatically detects if player has made progress</li>
              <li>Shows confirmation dialog only when needed</li>
              <li>Resets all game state to initial values</li>
              <li>Returns to scene X-0-001</li>
              <li>Optionally deletes auto-save data</li>
              <li>Provides callback for post-reset actions</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-green-900 rounded">
            <h3 className="font-semibold mb-2">Initial State Values:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Current Scene: X-0-001</li>
              <li>Scene History: Empty</li>
              <li>Current Path: null</li>
              <li>Inventory: Empty</li>
              <li>Flags: Empty</li>
              <li>Relationships: Empty</li>
              <li>All Stats: Reset to 0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
