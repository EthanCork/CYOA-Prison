/**
 * Auto-Save Demo Page
 * Tests the auto-save functionality with scene transitions
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import SavingIndicator from '@/components/SavingIndicator';
import { hasAutoSave, loadAutoSave } from '@/lib/saveGame';

export default function AutoSaveDemoPage() {
  const {
    currentScene,
    inventory,
    flags,
    relationships,
    currentPath,
    stats,
    goToScene,
    addItem,
    setFlag,
    changeRelationship,
    setPath,
    loadFromAutoSave,
    hasAutoSaveData,
  } = useGameStore();

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const { isSaving } = useAutoSave({ enabled: autoSaveEnabled });
  const [autoSaveInfo, setAutoSaveInfo] = useState<any>(null);

  const checkAutoSave = () => {
    if (typeof window !== 'undefined') {
      const exists = hasAutoSave();
      if (exists) {
        const data = loadAutoSave();
        setAutoSaveInfo(data);
      } else {
        setAutoSaveInfo(null);
      }
    }
  };

  const handleLoadAutoSave = () => {
    const success = loadFromAutoSave();
    if (success) {
      alert('Auto-save loaded successfully!');
    } else {
      alert('No auto-save found');
    }
  };

  const simulateSceneTransition = () => {
    const newScene = `scene-${Math.floor(Math.random() * 1000)}`;
    goToScene(newScene);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Auto-Save Demo</h1>

        {/* Saving Indicator */}
        <SavingIndicator isSaving={isSaving} />

        {/* Auto-Save Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Auto-Save Status</h2>
            <button
              onClick={checkAutoSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Check Auto-Save
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-300">Enabled:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
                <span>{autoSaveEnabled ? 'Yes' : 'No'}</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-300">Currently Saving:</span>
              <span className={isSaving ? 'text-yellow-400' : 'text-green-400'}>
                {isSaving ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-300">Auto-Save Exists:</span>
              <span className={hasAutoSaveData() ? 'text-green-400' : 'text-red-400'}>
                {hasAutoSaveData() ? 'Yes' : 'No'}
              </span>
            </div>

            {autoSaveInfo && (
              <div className="mt-4 p-4 bg-gray-700 rounded">
                <h3 className="font-semibold mb-2">Auto-Save Data:</h3>
                <div className="text-sm space-y-1">
                  <div>Scene: {autoSaveInfo.metadata.currentScene}</div>
                  <div>Path: {autoSaveInfo.metadata.currentPath || 'None'}</div>
                  <div>Date: {autoSaveInfo.metadata.dateString}</div>
                  <div>Scenes Visited: {autoSaveInfo.gameState.stats.scenesVisited}</div>
                </div>
              </div>
            )}
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
          </div>
        </div>

        {/* Demo Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Test Actions</h2>
          <p className="text-gray-300 mb-4">
            Use these buttons to trigger scene changes and watch the auto-save indicator:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={simulateSceneTransition}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Change Scene (Triggers Auto-Save)
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

        {/* Auto-Save Management */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Auto-Save Management</h2>
          <div className="flex gap-3">
            <button
              onClick={handleLoadAutoSave}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Load Auto-Save
            </button>
            <button
              onClick={checkAutoSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Refresh Auto-Save Info
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Click "Change Scene" to trigger a scene transition</li>
            <li>Watch the "Saving..." indicator appear in the top-right</li>
            <li>The indicator will show "Saved" briefly after saving completes</li>
            <li>Click "Check Auto-Save" to see the auto-save data</li>
            <li>Make more changes and click "Change Scene" again</li>
            <li>Notice the auto-save updates automatically</li>
            <li>Try disabling auto-save and notice scene changes don't trigger saves</li>
            <li>Re-enable auto-save to resume automatic saving</li>
            <li>Click "Load Auto-Save" to restore the auto-saved state</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-900 rounded">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Auto-saves on every scene transition</li>
              <li>Uses separate auto-save slot (doesn't overwrite manual saves)</li>
              <li>Shows brief "Saving..." indicator</li>
              <li>500ms delay to batch rapid scene changes</li>
              <li>Can be enabled/disabled</li>
              <li>Persists in localStorage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
