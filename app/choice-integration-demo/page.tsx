'use client';

import { useState } from 'react';
import { loadScene, sceneExists } from '@/lib/sceneLoader';
import ChoiceButton from '@/components/ChoiceButton';
import SceneText from '@/components/SceneText';
import type { Scene, Choice } from '@/types';

export default function ChoiceIntegrationDemo() {
  const [currentSceneId, setCurrentSceneId] = useState('X-0-002');
  const [scene, setScene] = useState<Scene | null>(() => loadScene('X-0-002'));
  const [history, setHistory] = useState<string[]>(['X-0-002']);

  const handleChoiceClick = (choice: Choice) => {
    const nextSceneId = choice.nextScene;

    // Check if scene exists before transitioning
    if (sceneExists(nextSceneId)) {
      const nextScene = loadScene(nextSceneId);
      setScene(nextScene);
      setCurrentSceneId(nextSceneId);
      setHistory((prev) => [...prev, nextSceneId]);
    } else {
      alert(`Scene "${nextSceneId}" not found! This would be an error in a real game.`);
    }
  };

  const resetDemo = () => {
    const startScene = loadScene('X-0-002');
    setScene(startScene);
    setCurrentSceneId('X-0-002');
    setHistory(['X-0-002']);
  };

  if (!scene) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Scene Not Found</h1>
          <button
            onClick={resetDemo}
            className="px-4 py-2 bg-amber-600 text-gray-900 rounded-md hover:bg-amber-500"
          >
            Reset Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">
              Choice Integration Demo
            </h1>
            <p className="text-sm text-gray-400">
              ChoiceButton + Scene Loader + SceneText
            </p>
          </div>
          <button
            onClick={resetDemo}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 text-sm"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Current Scene Info */}
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Scene:</span>{' '}
              <span className="text-amber-400 font-mono">{currentSceneId}</span>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>{' '}
              <span className="text-purple-400">{scene.type}</span>
            </div>
          </div>
        </div>

        {/* Scene Content */}
        <div className="mb-8 p-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg">
          {scene.content.speaker && (
            <div className="mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-amber-400 font-semibold">
                {scene.content.speaker}
              </span>
            </div>
          )}

          <SceneText text={scene.content.text} />

          {scene.content.visual && (
            <div className="mt-4 text-xs text-gray-500">
              Visual: {scene.content.visual}
            </div>
          )}
        </div>

        {/* Choices */}
        {scene.choices.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">
              What will you do?
            </h2>
            <div className="space-y-3">
              {scene.choices.map((choice, index) => (
                <ChoiceButton
                  key={index}
                  choice={choice}
                  onClick={handleChoiceClick}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-gray-800 border-2 border-amber-600 rounded-lg text-center">
            <p className="text-gray-300 mb-2">No more choices available.</p>
            {scene.type === 'ending' && (
              <p className="text-amber-400 font-semibold">
                This is an ending scene!
              </p>
            )}
            {scene.nextScene && (
              <button
                onClick={() => {
                  const next = loadScene(scene.nextScene!);
                  setScene(next);
                  setCurrentSceneId(scene.nextScene!);
                  setHistory((prev) => [...prev, scene.nextScene!]);
                }}
                className="mt-4 px-6 py-2 bg-amber-600 text-gray-900 rounded-md hover:bg-amber-500 font-medium"
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Navigation History */}
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Navigation History
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((sceneId, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded font-mono ${
                  sceneId === currentSceneId
                    ? 'bg-amber-600 text-gray-900'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {sceneId}
              </span>
            ))}
          </div>
        </div>

        {/* State Changes Display */}
        {(scene.flagChanges ||
          scene.itemChanges ||
          scene.relationshipChanges ||
          scene.evidenceChanges) && (
          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Scene State Changes
            </h3>
            <div className="space-y-1 text-xs">
              {scene.flagChanges && (
                <div className="text-green-400">
                  Flags: {JSON.stringify(scene.flagChanges)}
                </div>
              )}
              {scene.itemChanges && (
                <div className="text-blue-400">
                  Items: {JSON.stringify(scene.itemChanges)}
                </div>
              )}
              {scene.relationshipChanges && (
                <div className="text-purple-400">
                  Relationships: {JSON.stringify(scene.relationshipChanges)}
                </div>
              )}
              {scene.evidenceChanges && (
                <div className="text-yellow-400">
                  Evidence: {JSON.stringify(scene.evidenceChanges)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Implementation Notes */}
        <div className="mt-8 p-6 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-amber-400">1.</span>
              <span>
                <strong>Scene Loader</strong> loads scene data from JSON by ID
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">2.</span>
              <span>
                <strong>SceneText</strong> displays the narrative content
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">3.</span>
              <span>
                <strong>ChoiceButton</strong> renders each available choice
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">4.</span>
              <span>
                When clicked, ChoiceButton triggers scene transition to{' '}
                <code className="text-amber-400">choice.nextScene</code>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">5.</span>
              <span>
                Process repeats with new scene until an ending is reached
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
