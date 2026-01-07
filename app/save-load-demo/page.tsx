/**
 * Save/Load Menu Demo Page
 * Tests the save/load UI with interactive examples
 */

'use client';

import { useState } from 'react';
import SaveLoadMenu from '@/components/SaveLoadMenu';
import { useGameStore } from '@/lib/store';

export default function SaveLoadDemoPage() {
  const [showMenu, setShowMenu] = useState(false);
  const {
    currentScene,
    inventory,
    flags,
    relationships,
    currentPath,
    dayTime,
    stats,
    goToScene,
    addItem,
    setFlag,
    changeRelationship,
    setPath,
    initializeTime,
    advanceToNextPeriod,
  } = useGameStore();

  const simulateGameProgress = () => {
    // Simulate some game progress
    goToScene('demo-scene-' + Math.floor(Math.random() * 100));
    addItem('demo-item-' + Math.floor(Math.random() * 10));
    setFlag('demo-flag-' + Math.floor(Math.random() * 5));
    changeRelationship('demo-char', Math.floor(Math.random() * 20) - 10);
  };

  const setPathA = () => {
    setPath('A');
  };

  const setPathB = () => {
    setPath('B');
  };

  const setPathC = () => {
    setPath('C');
    initializeTime();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Save/Load Menu Demo</h1>

        {/* Current Game State Display */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Current Game State</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-300">Current Scene:</div>
              <div className="text-white">{currentScene}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Current Path:</div>
              <div className="text-white">{currentPath || 'None'}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Inventory:</div>
              <div className="text-white">
                {inventory.length > 0 ? inventory.join(', ') : 'Empty'}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Flags:</div>
              <div className="text-white">
                {flags.length > 0 ? flags.join(', ') : 'None'}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Relationships:</div>
              <div className="text-white">
                {Object.keys(relationships).length > 0
                  ? Object.entries(relationships)
                      .map(([char, score]) => `${char}: ${score}`)
                      .join(', ')
                  : 'None'}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Stats:</div>
              <div className="text-white">
                Scenes: {stats.scenesVisited}, Choices: {stats.choicesMade}, Items: {stats.itemsFound}
              </div>
            </div>
            {dayTime && (
              <div>
                <div className="font-semibold text-gray-300">Day/Time:</div>
                <div className="text-white">
                  Day {dayTime.day} - {dayTime.timeOfDay}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demo Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Demo Actions</h2>
          <p className="text-gray-300 mb-4">
            Use these buttons to simulate game progress and test the save/load functionality:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={simulateGameProgress}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Simulate Game Progress
            </button>
            <button
              onClick={() => goToScene('scene-' + Math.floor(Math.random() * 100))}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
            >
              Change Scene
            </button>
            <button
              onClick={() => addItem('test-item-' + Date.now())}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Add Random Item
            </button>
            <button
              onClick={() => setFlag('test-flag-' + Date.now())}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Set Random Flag
            </button>
            <button
              onClick={setPathA}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Set Path A (Night)
            </button>
            <button
              onClick={setPathB}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            >
              Set Path B (Social)
            </button>
            <button
              onClick={setPathC}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
            >
              Set Path C (Day)
            </button>
            {currentPath === 'C' && dayTime && (
              <button
                onClick={advanceToNextPeriod}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
              >
                Advance Time
              </button>
            )}
          </div>
        </div>

        {/* Save/Load Menu Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            {showMenu ? 'Hide' : 'Show'} Save/Load Menu
          </button>
        </div>

        {/* Save/Load Menu */}
        {showMenu && (
          <SaveLoadMenu
            onClose={() => setShowMenu(false)}
            showCloseButton={true}
          />
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Use the demo actions to create some game state</li>
            <li>Click "Show Save/Load Menu" to open the menu</li>
            <li>Click "Save" on any slot to save the current game state</li>
            <li>
              If the slot already has a save, you'll be asked to confirm overwriting
            </li>
            <li>Modify the game state using the demo actions</li>
            <li>Click "Load" on a saved slot to restore that state</li>
            <li>You'll be asked to confirm loading (which loses current progress)</li>
            <li>Click "Delete" on a saved slot to permanently remove it</li>
            <li>You'll be asked to confirm deletion</li>
          </ol>
        </div>

        {/* Features List */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Features Implemented</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>3 independent save slots</li>
            <li>Display timestamp and date for each save</li>
            <li>Display current scene, path, day/time, and play time</li>
            <li>Save button (with overwrite confirmation)</li>
            <li>Load button (with unsaved progress warning)</li>
            <li>Delete button (with permanent deletion warning)</li>
            <li>Visual feedback with success/error notifications</li>
            <li>Empty slot handling (disabled Load/Delete buttons)</li>
            <li>Modal confirmation dialogs for destructive actions</li>
            <li>Auto-close menu after successful load</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
