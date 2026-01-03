'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import {
  CommonFlags,
  getFlagDescription,
  getFlagsByCategory,
  hasAllFlags,
  hasAnyFlag,
  countSetFlags,
  isValidFlagName,
  FlagCategories,
} from '@/lib/flagUtils';

export default function FlagDemo() {
  const {
    flags,
    setFlag,
    unsetFlag,
    hasFlag,
    resetGame,
    goToScene,
    currentScene,
    sceneHistory,
  } = useGameStore();

  const [customFlag, setCustomFlag] = useState('');
  const [flagValidation, setFlagValidation] = useState<string | null>(null);

  // Simulate scene transitions to test persistence
  const simulateSceneTransition = () => {
    const scenes = ['X-0-001', 'X-0-002', 'A-1-001', 'A-1-015'];
    const currentIndex = scenes.indexOf(currentScene);
    const nextScene = scenes[(currentIndex + 1) % scenes.length];
    goToScene(nextScene);
  };

  // Group flags by category
  const flagsByCategory = {
    story: getFlagsByCategory(flags, FlagCategories.STORY),
    character: getFlagsByCategory(flags, FlagCategories.CHARACTER),
    location: getFlagsByCategory(flags, FlagCategories.LOCATION),
    quest: getFlagsByCategory(flags, FlagCategories.QUEST),
    discovery: getFlagsByCategory(flags, FlagCategories.DISCOVERED),
    ending: getFlagsByCategory(flags, FlagCategories.ENDING),
  };

  // Statistics
  const totalCommonFlags = Object.keys(CommonFlags).length;
  const setCommonFlags = countSetFlags(
    flags,
    Object.values(CommonFlags)
  );

  const handleAddCustomFlag = () => {
    if (!customFlag) {
      setFlagValidation('Flag name cannot be empty');
      return;
    }

    if (!isValidFlagName(customFlag)) {
      setFlagValidation('Invalid flag format. Use category:name (e.g., story:custom_flag)');
      return;
    }

    if (hasFlag(customFlag)) {
      setFlagValidation('Flag is already set');
      return;
    }

    setFlag(customFlag);
    setCustomFlag('');
    setFlagValidation(null);
  };

  // Clear validation when input changes
  useEffect(() => {
    if (customFlag) {
      setFlagValidation(null);
    }
  }, [customFlag]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-green-400 mb-1">
            Flag System Demo
          </h1>
          <p className="text-sm text-gray-400">
            Test flag persistence, scene transitions, and flag utilities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Flag Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Scene Navigation */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">
                Scene Navigation
              </h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-400">Current Scene:</span>
                  <span className="ml-2 font-mono text-amber-300">{currentScene}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">History Length:</span>
                  <span className="ml-2 text-purple-300">{sceneHistory.length}</span>
                </div>
                <button
                  onClick={simulateSceneTransition}
                  className="w-full px-4 py-2 bg-amber-600 text-gray-900 rounded-md hover:bg-amber-500 font-semibold text-sm"
                >
                  Simulate Scene Transition
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Flags persist across scene changes
                </p>
              </div>
            </div>

            {/* Common Flags */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                Common Flags
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(CommonFlags).map(([key, flagName]) => {
                  const isSet = hasFlag(flagName);
                  return (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-2 p-2 bg-gray-900/50 rounded"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs text-gray-300 truncate">
                          {flagName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getFlagDescription(flagName)}
                        </div>
                      </div>
                      <button
                        onClick={() => isSet ? unsetFlag(flagName) : setFlag(flagName)}
                        className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          isSet
                            ? 'bg-green-600 text-white hover:bg-green-500'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}
                      >
                        {isSet ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Flag Input */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">
                Add Custom Flag
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customFlag}
                  onChange={(e) => setCustomFlag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomFlag()}
                  placeholder="category:flag_name"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddCustomFlag}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 font-semibold text-sm"
                >
                  Add Flag
                </button>
                {flagValidation && (
                  <p className="text-xs text-red-400">{flagValidation}</p>
                )}
                <p className="text-xs text-gray-500">
                  Format: category:name (e.g., custom:my_flag)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Actions</h3>
              <button
                onClick={resetGame}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 font-semibold text-sm"
              >
                Reset All Flags
              </button>
            </div>
          </div>

          {/* Right Column - Flag Display & Analysis */}
          <div className="lg:col-span-2 space-y-4">
            {/* Statistics */}
            <div className="p-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Flag Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{flags.length}</div>
                  <div className="text-sm text-gray-400">Total Flags Set</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">
                    {setCommonFlags}/{totalCommonFlags}
                  </div>
                  <div className="text-sm text-gray-400">Common Flags</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">
                    {flagsByCategory.story.length}
                  </div>
                  <div className="text-sm text-gray-400">Story Flags</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-400">
                    {sceneHistory.length}
                  </div>
                  <div className="text-sm text-gray-400">Scenes Visited</div>
                </div>
              </div>
            </div>

            {/* Flags by Category */}
            <div className="p-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Flags by Category
              </h2>
              <div className="space-y-4">
                {Object.entries(flagsByCategory).map(([category, categoryFlags]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                      {category} ({categoryFlags.length})
                    </h3>
                    {categoryFlags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {categoryFlags.map((flag) => (
                          <div
                            key={flag}
                            className="group relative inline-flex items-center gap-2 px-3 py-1 bg-green-900/50 text-green-300 rounded text-xs font-mono border border-green-700"
                          >
                            <span>{flag}</span>
                            <button
                              onClick={() => unsetFlag(flag)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                              title="Remove flag"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No flags in this category</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* All Active Flags */}
            <div className="p-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                All Active Flags ({flags.length})
              </h2>
              {flags.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {flags.map((flag) => (
                    <div
                      key={flag}
                      className="group flex items-center justify-between p-3 bg-gray-900/50 rounded hover:bg-gray-900/70 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-mono text-sm text-green-300">{flag}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getFlagDescription(flag)}
                        </div>
                      </div>
                      <button
                        onClick={() => unsetFlag(flag)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No flags set. Toggle some flags to see them here.
                </p>
              )}
            </div>

            {/* Flag Utility Tests */}
            <div className="p-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Flag Utility Tests
              </h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-400">Has all story flags:</span>{' '}
                  <span className={hasAllFlags(flags, [CommonFlags.INTRO_COMPLETE, CommonFlags.MET_WARDEN]) ? 'text-green-400' : 'text-red-400'}>
                    {hasAllFlags(flags, [CommonFlags.INTRO_COMPLETE, CommonFlags.MET_WARDEN]).toString()}
                  </span>
                </div>
                <div className="p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-400">Has any ending flag:</span>{' '}
                  <span className={hasAnyFlag(flags, [CommonFlags.ENDING_ESCAPE_SUCCESS, CommonFlags.ENDING_REFORMED]) ? 'text-green-400' : 'text-red-400'}>
                    {hasAnyFlag(flags, [CommonFlags.ENDING_ESCAPE_SUCCESS, CommonFlags.ENDING_REFORMED]).toString()}
                  </span>
                </div>
                <div className="p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-400">Location flags discovered:</span>{' '}
                  <span className="text-blue-400">
                    {countSetFlags(flags, [
                      CommonFlags.FOUND_COURTYARD,
                      CommonFlags.FOUND_CAFETERIA,
                      CommonFlags.FOUND_LIBRARY,
                      CommonFlags.FOUND_GYM,
                      CommonFlags.FOUND_WORKSHOP,
                    ])} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
