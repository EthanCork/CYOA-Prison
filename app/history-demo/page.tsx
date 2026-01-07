/**
 * Scene History Demo Page
 * Interactive demo for testing scene history and back button
 */

'use client';

import { useGameStore } from '@/lib/store';
import BackButton from '@/components/BackButton';
import SceneHistory from '@/components/SceneHistory';

export default function HistoryDemoPage() {
  const { currentScene, sceneHistory, goToScene, goBack } = useGameStore();

  const generateRandomScene = () => {
    const prefixes = ['A', 'B', 'C', 'X'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 100);
    const suffix = Math.floor(Math.random() * 10);
    return `${prefix}-${number}-${suffix.toString().padStart(3, '0')}`;
  };

  const handleNavigateRandom = () => {
    const newScene = generateRandomScene();
    goToScene(newScene);
  };

  const handleNavigateSpecific = (sceneId: string) => {
    goToScene(sceneId);
  };

  const handleNavigateMany = () => {
    // Navigate through multiple scenes to test history limit
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const scene = generateRandomScene();
        goToScene(scene);
      }, i * 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Scene History & Back Button Demo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Current Scene */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Current Scene</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <div className="text-sm text-blue-200 mb-1">Scene ID</div>
                  <div className="text-2xl font-mono text-white">{currentScene}</div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Navigation</h2>

              {/* Back Button */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Back Button:</p>
                <BackButton variant="full" />
                <p className="text-xs text-gray-500 mt-2">
                  {sceneHistory.length > 0
                    ? `Will return to: ${sceneHistory[sceneHistory.length - 1]}`
                    : 'No previous scenes'}
                </p>
              </div>

              {/* Test Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleNavigateRandom}
                  className="w-full px-4 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Navigate to Random Scene
                </button>

                <button
                  onClick={handleNavigateMany}
                  className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Navigate 5 Random Scenes
                </button>

                <button
                  onClick={() => handleNavigateSpecific('X-0-001')}
                  className="w-full px-4 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Go to X-0-001
                </button>

                <button
                  onClick={goBack}
                  disabled={sceneHistory.length === 0}
                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  Go Back (Manual)
                </button>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Quick Navigate</h3>
              <div className="grid grid-cols-2 gap-2">
                {['A-1-001', 'B-2-002', 'C-3-003', 'X-4-004'].map((scene) => (
                  <button
                    key={scene}
                    onClick={() => handleNavigateSpecific(scene)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                  >
                    {scene}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">History Length:</span>
                  <span className="text-white font-semibold">{sceneHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Can Go Back:</span>
                  <span className={sceneHistory.length > 0 ? 'text-green-400' : 'text-red-400'}>
                    {sceneHistory.length > 0 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max History:</span>
                  <span className="text-white">20 scenes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - History Panel */}
          <div className="space-y-6">
            {/* History Panel */}
            <SceneHistory maxItems={20} variant="panel" interactive={false} />

            {/* Inline History Example */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Inline History (5 most recent)</h3>
              <SceneHistory variant="inline" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Click "Navigate to Random Scene" to create history</li>
            <li>Watch the history panel populate on the right</li>
            <li>Click the "Back Button" to return to previous scenes</li>
            <li>Try "Navigate 5 Random Scenes" to quickly build history</li>
            <li>Observe that history is limited to 20 scenes (oldest are removed)</li>
            <li>Use "Quick Navigate" buttons to jump to specific scenes</li>
            <li>Verify current scene is always highlighted in blue</li>
            <li>Check that back button is disabled when no history exists</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-200">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-100">
              <li>History limited to last 20 scenes visited</li>
              <li>Back button returns to immediately previous scene</li>
              <li>History list shows most recent scenes first</li>
              <li>Current scene highlighted in blue</li>
              <li>Previous scene marked with "Previous" label</li>
              <li>Inline variant shows compact 5-scene breadcrumb</li>
              <li>Panel variant shows full scrollable list</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded">
            <h3 className="font-semibold mb-2 text-yellow-200">Important Notes:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-100">
              <li>History is for viewing/reference only</li>
              <li>Use Back button for navigation (not clicking history items)</li>
              <li>Going back removes that scene from history</li>
              <li>History persists in save files</li>
              <li>New game clears all history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
