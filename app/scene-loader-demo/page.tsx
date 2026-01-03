'use client';

import { useState } from 'react';
import { loadScene, sceneExists, getAllSceneIds, SceneNotFoundError } from '@/lib/sceneLoader';
import type { Scene } from '@/types';

export default function SceneLoaderDemo() {
  const [sceneId, setSceneId] = useState('X-0-001');
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadScene = () => {
    setError(null);
    try {
      const loadedScene = loadScene(sceneId);
      setScene(loadedScene);
    } catch (err) {
      if (err instanceof SceneNotFoundError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setScene(null);
    }
  };

  const allSceneIds = getAllSceneIds();

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scene Loader Demo</h1>

        {/* Scene Selector */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Load a Scene</h2>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter scene ID (e.g., X-0-001)"
            />
            <button
              onClick={handleLoadScene}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load Scene
            </button>
          </div>

          {/* Quick Select */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Quick select:</span>
            {allSceneIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSceneId(id);
                  setError(null);
                }}
                className={`px-3 py-1 text-sm rounded-md ${
                  sceneId === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {/* Scene Exists Check */}
          <div className="mt-4 text-sm">
            Scene exists: <span className={sceneExists(sceneId) ? 'text-green-600' : 'text-red-600'}>
              {sceneExists(sceneId) ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Scene Display */}
        {scene && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Scene: {scene.id}</h2>

            <div className="grid gap-4">
              {/* Basic Info */}
              <div className="border-b pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Type:</span>{' '}
                    <span className="inline-block px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded">
                      {scene.type}
                    </span>
                  </div>
                  {scene.nextScene && (
                    <div>
                      <span className="font-semibold">Next Scene:</span> {scene.nextScene}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                {scene.content.visual && (
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Visual:</strong> {scene.content.visual}
                  </div>
                )}
                {scene.content.speaker && (
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Speaker:</strong> {scene.content.speaker}
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="italic">{scene.content.text}</p>
                </div>
              </div>

              {/* Choices */}
              {scene.choices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Choices ({scene.choices.length})</h3>
                  <div className="space-y-2">
                    {scene.choices.map((choice, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-md">
                        <div className="font-medium">{choice.text}</div>
                        <div className="text-sm text-gray-600 mt-1">→ {choice.nextScene}</div>
                        {choice.relationshipChanges && (
                          <div className="text-xs text-purple-600 mt-1">
                            Relationships: {JSON.stringify(choice.relationshipChanges)}
                          </div>
                        )}
                        {choice.flagChanges && (
                          <div className="text-xs text-green-600 mt-1">
                            Flags: {JSON.stringify(choice.flagChanges)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* State Changes */}
              {(scene.flagChanges || scene.itemChanges || scene.relationshipChanges || scene.evidenceChanges) && (
                <div>
                  <h3 className="font-semibold mb-2">Scene State Changes</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                    {scene.flagChanges && (
                      <div><strong>Flags:</strong> {JSON.stringify(scene.flagChanges)}</div>
                    )}
                    {scene.itemChanges && (
                      <div><strong>Items:</strong> {JSON.stringify(scene.itemChanges)}</div>
                    )}
                    {scene.relationshipChanges && (
                      <div><strong>Relationships:</strong> {JSON.stringify(scene.relationshipChanges)}</div>
                    )}
                    {scene.evidenceChanges && (
                      <div><strong>Evidence:</strong> {JSON.stringify(scene.evidenceChanges)}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Scene Loader Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{allSceneIds.length}</div>
              <div className="text-sm text-gray-600">Total Scenes Loaded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {scene ? '✓' : '-'}
              </div>
              <div className="text-sm text-gray-600">Currently Viewing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
