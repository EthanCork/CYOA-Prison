'use client';

/**
 * Stats Tracking Demo
 * Demonstrates game statistics tracking and display
 */

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import StatsPanel from '@/components/StatsPanel';
import { getStatsSummary, getAchievedMilestones } from '@/lib/statsUtils';

export default function StatsDemoPage() {
  const [isClient, setIsClient] = useState(false);
  const stats = useGameStore((state) => state.stats);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Store actions
  const goToScene = useGameStore((state) => state.goToScene);
  const transitionToScene = useGameStore((state) => state.transitionToScene);
  const addItem = useGameStore((state) => state.addItem);
  const changeRelationship = useGameStore((state) => state.changeRelationship);
  const setPath = useGameStore((state) => state.setPath);
  const initializeTime = useGameStore((state) => state.initializeTime);
  const advanceToNextPeriod = useGameStore((state) => state.advanceToNextPeriod);
  const resetGame = useGameStore((state) => state.resetGame);

  if (!isClient) {
    return <div className="p-8">Loading...</div>;
  }

  const summary = getStatsSummary(stats);
  const milestones = getAchievedMilestones(stats);

  // Simulation functions
  const simulateChoices = (count: number) => {
    for (let i = 0; i < count; i++) {
      const choice = {
        id: `sim-choice-${Date.now()}-${i}`,
        text: `Simulated choice ${i + 1}`,
        nextScene: `sim-scene-${i}`,
      };
      transitionToScene(`sim-scene-${i}`, undefined, choice);
    }
  };

  const simulateItems = (count: number) => {
    for (let i = 0; i < count; i++) {
      addItem(`sim-item-${Date.now()}-${i}`);
    }
  };

  const simulateRelationships = () => {
    changeRelationship('ally-1', 100); // Max out
    changeRelationship('ally-2', 100);
    changeRelationship('friend-1', 50);
    changeRelationship('enemy-1', -100); // Min out
    changeRelationship('enemy-2', -100);
  };

  const simulateFullGameplay = () => {
    // Select Path C
    setPath('C');
    initializeTime();

    // Make 25 choices and visit scenes
    simulateChoices(25);

    // Find 10 items
    simulateItems(10);

    // Build relationships
    simulateRelationships();

    // Progress through multiple days
    for (let i = 0; i < 12; i++) {
      advanceToNextPeriod();
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Stats Tracking Demo</h1>
        <p className="text-lg text-gray-600">
          Interactive demonstration of the game statistics system
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Simulation Controls</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Individual actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Individual Actions</h3>

            <button
              onClick={() => goToScene(`scene-${Date.now()}`)}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
            >
              Visit New Scene
            </button>

            <button
              onClick={() => simulateChoices(1)}
              className="w-full rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white transition hover:bg-purple-600"
            >
              Make a Choice
            </button>

            <button
              onClick={() => simulateItems(1)}
              className="w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600"
            >
              Find an Item
            </button>

            <button
              onClick={() => {
                const charId = `char-${Date.now()}`;
                changeRelationship(charId, 100);
              }}
              className="w-full rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white transition hover:bg-teal-600"
            >
              Max Out Relationship
            </button>

            <button
              onClick={() => {
                const charId = `char-${Date.now()}`;
                changeRelationship(charId, -100);
              }}
              className="w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
            >
              Min Out Relationship
            </button>
          </div>

          {/* Batch actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Batch Actions</h3>

            <button
              onClick={() => simulateChoices(10)}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
            >
              Make 10 Choices
            </button>

            <button
              onClick={() => simulateItems(5)}
              className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
            >
              Find 5 Items
            </button>

            <button
              onClick={simulateRelationships}
              className="w-full rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
            >
              Build Multiple Relationships
            </button>

            <button
              onClick={() => {
                setPath('C');
                initializeTime();
                for (let i = 0; i < 8; i++) {
                  advanceToNextPeriod();
                }
              }}
              className="w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white transition hover:bg-amber-600"
            >
              Progress to Day 3
            </button>

            <button
              onClick={simulateFullGameplay}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-semibold text-white transition hover:from-purple-700 hover:to-pink-700"
            >
              Simulate Full Gameplay
            </button>
          </div>
        </div>

        {/* Reset button */}
        <div className="mt-6 border-t-2 border-gray-300 pt-4">
          <button
            onClick={resetGame}
            className="w-full rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition hover:bg-gray-800"
          >
            Reset All Stats
          </button>
        </div>
      </div>

      {/* Stats Display */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Stats Panel (Full View)</h2>
        <StatsPanel showMilestones={true} />
      </div>

      {/* Compact Stats Display */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Stats Panel (Compact View)</h2>
        <StatsPanel compact={true} showMilestones={false} />
      </div>

      {/* Raw Stats Data */}
      <div className="mb-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Raw Stats Data</h2>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Scenes Visited</p>
            <p className="text-2xl font-bold text-blue-600">{stats.scenesVisited}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Choices Made</p>
            <p className="text-2xl font-bold text-purple-600">{stats.choicesMade}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Items Found</p>
            <p className="text-2xl font-bold text-green-600">{stats.itemsFound}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Allies (100)</p>
            <p className="text-2xl font-bold text-teal-600">{stats.relationshipsMaxed}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Enemies (-100)</p>
            <p className="text-2xl font-bold text-red-600">{stats.relationshipsMinned}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Stage Reached</p>
            <p className="text-2xl font-bold text-amber-600">{stats.stageReached}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Path Taken</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pathTaken || 'None'}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="font-semibold text-gray-600">Play Time</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.playTimeSeconds || 0}s
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Calculated Stats Summary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <p className="text-sm font-semibold text-gray-600">Completion</p>
            <p className="text-3xl font-bold text-blue-600">{summary.completion}%</p>
          </div>
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <p className="text-sm font-semibold text-gray-600">Engagement Level</p>
            <p className={`text-2xl font-bold text-${summary.engagement.color}-600`}>
              {summary.engagement.level}
            </p>
            <p className="text-xs text-gray-500">{summary.engagement.description}</p>
          </div>
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <p className="text-sm font-semibold text-gray-600">Collector Rank</p>
            <p className={`text-2xl font-bold text-${summary.collector.color}-600`}>
              {summary.collector.rank}
            </p>
            <p className="text-xs text-gray-500">{summary.collector.description}</p>
          </div>
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <p className="text-sm font-semibold text-gray-600">Relationships</p>
            <p className={`text-2xl font-bold text-${summary.relationships.color}-600`}>
              {summary.relationships.description}
            </p>
          </div>
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <p className="text-sm font-semibold text-gray-600">Story Progress</p>
            <p className="text-2xl font-bold text-gray-900">{summary.stage.progress}</p>
            <p className="text-xs text-gray-500">{summary.stage.description}</p>
          </div>
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <p className="text-sm font-semibold text-gray-600">Overall Rank</p>
            <p className={`text-2xl font-bold text-${summary.rank.color}-600`}>
              {summary.rank.rank}
            </p>
            <p className="text-xs text-gray-500">Score: {summary.score}</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Achievements ({milestones.length}/11)
        </h2>
        {milestones.length === 0 ? (
          <p className="text-gray-500">
            No achievements yet. Start playing to unlock achievements!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-lg border border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4"
              >
                <div className="mb-2 text-center text-4xl">{milestone.icon}</div>
                <p className="text-center text-sm font-bold text-gray-900">
                  {milestone.name}
                </p>
                <p className="text-center text-xs text-gray-600">{milestone.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="mt-8 rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-blue-900">How Stats Tracking Works</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="mb-2 font-semibold text-blue-800">Automatic Tracking</h3>
            <p>
              Stats are automatically updated as you play the game. No manual tracking needed!
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-blue-800">Tracked Stats</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Scenes Visited:</strong> Unique scenes encountered (uses Set for
                uniqueness)
              </li>
              <li>
                <strong>Choices Made:</strong> Total decisions made through transitionToScene
              </li>
              <li>
                <strong>Items Found:</strong> New items added to inventory (no duplicates)
              </li>
              <li>
                <strong>Relationships Maxed:</strong> Characters at 100 relationship score
              </li>
              <li>
                <strong>Relationships Minned:</strong> Characters at -100 relationship score
              </li>
              <li>
                <strong>Stage Reached:</strong> Highest day reached (Path C only)
              </li>
              <li>
                <strong>Path Taken:</strong> Which story path was chosen (A/B/C)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-blue-800">Milestones</h3>
            <p>
              11 achievement milestones unlock as you progress. Milestones include first
              choice, reaching day 3/6, maxing relationships, and completionist challenges.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-blue-800">Score Calculation</h3>
            <p>
              Overall score is weighted: scenes×1 + choices×2 + items×3 + maxed
              relationships×5 + minned relationships×3 + stage×10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
