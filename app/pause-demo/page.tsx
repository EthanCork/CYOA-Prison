/**
 * Pause Menu Demo Page
 * Interactive demo for testing the pause menu
 */

'use client';

import { useGameStore } from '@/lib/store';
import { usePauseMenu } from '@/lib/hooks/usePauseMenu';
import PauseMenu from '@/components/PauseMenu';

export default function PauseDemoPage() {
  const { isPaused, pause, resume } = usePauseMenu();
  const { currentScene, goToScene, addItem, inventory } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Pause Menu Demo</h1>

        {/* Game Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Game Content</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">
                <strong>Current Scene:</strong> {currentScene}
              </p>
              <p className="text-gray-400 text-sm">
                This represents the game interface. Try pausing with the ESC key or
                the button below.
              </p>
            </div>

            <div>
              <p className="text-gray-300 mb-2">
                <strong>Inventory:</strong>
              </p>
              {inventory.length > 0 ? (
                <ul className="list-disc list-inside text-gray-400">
                  {inventory.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Empty</p>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={pause}
              className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              Open Pause Menu
            </button>

            <button
              onClick={() => goToScene('scene-' + Math.random().toString(36).substr(2, 9))}
              className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              Change Scene
            </button>

            <button
              onClick={() => addItem('Test Item ' + (inventory.length + 1))}
              className="px-6 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              Add Item
            </button>

            <button
              onClick={() => goToScene('X-0-001')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Reset Scene
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Press <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">ESC</kbd> to open the pause menu</li>
            <li>Try clicking "Resume Game" to close the menu</li>
            <li>Open pause menu again and click "Save Game"</li>
            <li>Try the "Load Game" option to see the save/load interface</li>
            <li>Open "Settings" to access game settings</li>
            <li>Click "Main Menu" and confirm/cancel the dialog</li>
            <li>Verify ESC key works to both open and close the pause menu</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-200">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-100">
              <li>Keyboard shortcut: ESC key toggles pause</li>
              <li>Full-screen overlay with 90% black opacity</li>
              <li>Resume, Save, Load, Settings, Main Menu options</li>
              <li>Confirmation dialog before returning to main menu</li>
              <li>Integrated with existing save/load and settings systems</li>
              <li>Fade-in animation on open</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-200">Expected Behavior:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-100">
              <li>ESC opens pause menu from game</li>
              <li>ESC closes pause menu when open (no sub-menus)</li>
              <li>Save/Load opens SaveLoadMenu component</li>
              <li>Settings opens SettingsMenu component</li>
              <li>Main Menu shows warning about unsaved progress</li>
              <li>Resume button closes pause menu</li>
            </ul>
          </div>
        </div>

        {/* Pause Status Indicator */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Pause Status:{' '}
            <span className={isPaused ? 'text-yellow-400 font-semibold' : 'text-green-400 font-semibold'}>
              {isPaused ? 'PAUSED' : 'PLAYING'}
            </span>
          </p>
        </div>
      </div>

      {/* Pause Menu */}
      <PauseMenu isOpen={isPaused} onResume={resume} />
    </div>
  );
}
