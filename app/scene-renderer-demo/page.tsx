'use client';

import { useState } from 'react';
import { loadScene, getAllSceneIds } from '@/lib/sceneLoader';
import SceneRenderer from '@/components/SceneRenderer';
import type { Scene, Choice } from '@/types';

export default function SceneRendererDemo() {
  const [currentSceneId, setCurrentSceneId] = useState('X-0-001');
  const [scene, setScene] = useState<Scene>(() => loadScene('X-0-001'));
  const [history, setHistory] = useState<string[]>(['X-0-001']);
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);

  const allSceneIds = getAllSceneIds();

  const handleChoiceSelected = (choice: Choice) => {
    const nextSceneId = choice.nextScene;
    const nextScene = loadScene(nextSceneId);
    setScene(nextScene);
    setCurrentSceneId(nextSceneId);
    setHistory((prev) => [...prev, nextSceneId]);
  };

  const handleContinue = (nextSceneId: string) => {
    const nextScene = loadScene(nextSceneId);
    setScene(nextScene);
    setCurrentSceneId(nextSceneId);
    setHistory((prev) => [...prev, nextSceneId]);
  };

  const loadSceneById = (sceneId: string) => {
    const newScene = loadScene(sceneId);
    setScene(newScene);
    setCurrentSceneId(sceneId);
    setHistory([sceneId]);
  };

  const resetDemo = () => {
    loadSceneById('X-0-001');
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousSceneId = newHistory[newHistory.length - 1];
      const previousScene = loadScene(previousSceneId);
      setScene(previousScene);
      setCurrentSceneId(previousSceneId);
      setHistory(newHistory);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-amber-400 mb-1">
                Scene Renderer Demo
              </h1>
              <p className="text-sm text-gray-400">
                Complete scene rendering with text + choices
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={goBack}
                disabled={history.length <= 1}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={resetDemo}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Settings Bar */}
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={typewriterEnabled}
                onChange={(e) => setTypewriterEnabled(e.target.checked)}
                className="rounded"
              />
              Typewriter Effect
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showNumbers}
                onChange={(e) => setShowNumbers(e.target.checked)}
                className="rounded"
              />
              Show Choice Numbers
            </label>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Scene Info Card */}
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Scene ID:</span>{' '}
              <span className="text-amber-400 font-mono font-semibold">
                {currentSceneId}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>{' '}
              <span className="text-purple-400 capitalize">{scene.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Choices:</span>{' '}
              <span className="text-green-400">{scene.choices.length}</span>
            </div>
          </div>
        </div>

        {/* Main Scene Renderer */}
        <div className="mb-6 p-8 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl">
          <SceneRenderer
            scene={scene}
            onChoiceSelected={handleChoiceSelected}
            onContinue={handleContinue}
            typewriter={typewriterEnabled}
            typewriterSpeed={30}
            showChoiceNumbers={showNumbers}
          />
        </div>

        {/* Navigation History */}
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            Navigation History ({history.length} scenes)
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((sceneId, index) => (
              <button
                key={index}
                onClick={() => loadSceneById(sceneId)}
                className={`px-3 py-1.5 text-xs rounded font-mono transition-colors ${
                  sceneId === currentSceneId
                    ? 'bg-amber-600 text-gray-900 font-bold'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {sceneId}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Scene Selector */}
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            Quick Scene Selector
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {allSceneIds.map((sceneId) => (
              <button
                key={sceneId}
                onClick={() => loadSceneById(sceneId)}
                className={`px-3 py-2 text-xs rounded font-mono transition-colors ${
                  sceneId === currentSceneId
                    ? 'bg-amber-600 text-gray-900 font-bold'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {sceneId}
              </button>
            ))}
          </div>
        </div>

        {/* Scene Types Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Scene Types in Sample Data:
            </h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                <span>
                  <strong>X-0-001:</strong> Narrative (auto-continue)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>
                  <strong>X-0-002:</strong> Dialogue (with speaker)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>
                  <strong>A-1-001:</strong> Choice (multiple options)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>
                  <strong>A-1-015:</strong> Investigation (evidence)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>
                  <strong>END-1-ESCAPE:</strong> Ending (terminal)
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Component Features:
            </h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Renders scene text at top</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Renders choice buttons at bottom</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Auto-continue for narrative scenes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Special ending display</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Speaker names for dialogue</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Scene type badges</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Optional typewriter effect</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Development metadata display</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            How to Use SceneRenderer
          </h3>
          <div className="space-y-4 text-sm text-gray-400">
            <div>
              <h4 className="text-amber-400 font-semibold mb-1">Basic Usage:</h4>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
{`<SceneRenderer
  scene={currentScene}
  onChoiceSelected={(choice) => {
    // Handle scene transition
    loadScene(choice.nextScene);
  }}
  onContinue={(nextSceneId) => {
    // Handle auto-continue
    loadScene(nextSceneId);
  }}
/>`}
              </pre>
            </div>

            <div>
              <h4 className="text-amber-400 font-semibold mb-1">With Options:</h4>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
{`<SceneRenderer
  scene={currentScene}
  onChoiceSelected={handleChoice}
  onContinue={handleContinue}
  typewriter={true}
  typewriterSpeed={25}
  showChoiceNumbers={true}
/>`}
              </pre>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs">
                💡 <strong>Tip:</strong> The SceneRenderer automatically handles all scene types
                (narrative, dialogue, choice, investigation, ending) and displays them appropriately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
