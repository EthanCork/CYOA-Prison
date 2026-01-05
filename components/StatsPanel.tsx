'use client';

/**
 * StatsPanel Component
 * Displays comprehensive game statistics and achievements
 */

import { useGameStore } from '@/lib/store';
import {
  formatNumber,
  formatPlayTime,
  getPathDisplayName,
  getPathIcon,
  getStatsSummary,
  getAchievedMilestones,
} from '@/lib/statsUtils';

interface StatsPanelProps {
  className?: string;
  showMilestones?: boolean;
  compact?: boolean;
}

export default function StatsPanel({
  className = '',
  showMilestones = true,
  compact = false,
}: StatsPanelProps) {
  const stats = useGameStore((state) => state.stats);
  const summary = getStatsSummary(stats);
  const milestones = showMilestones ? getAchievedMilestones(stats) : [];

  // Compact version
  if (compact) {
    return (
      <div className={`rounded-lg border-2 border-gray-300 bg-white p-4 ${className}`}>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Game Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Scenes:</span>{' '}
            <span className="font-semibold">{formatNumber(stats.scenesVisited)}</span>
          </div>
          <div>
            <span className="text-gray-600">Choices:</span>{' '}
            <span className="font-semibold">{formatNumber(stats.choicesMade)}</span>
          </div>
          <div>
            <span className="text-gray-600">Items:</span>{' '}
            <span className="font-semibold">{formatNumber(stats.itemsFound)}</span>
          </div>
          <div>
            <span className="text-gray-600">Score:</span>{' '}
            <span className="font-semibold">{formatNumber(summary.score)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div className={`rounded-lg border-2 border-gray-300 bg-white p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Game Statistics</h2>
        {stats.pathTaken && (
          <p className="mt-1 text-sm text-gray-600">
            {getPathIcon(stats.pathTaken)} {getPathDisplayName(stats.pathTaken)}
          </p>
        )}
      </div>

      {/* Overall Score and Rank */}
      <div className="mb-6 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overall Rank</p>
            <p className={`text-2xl font-bold text-${summary.rank.color}-600`}>
              {summary.rank.rank}
            </p>
            <p className="text-sm text-gray-600">{summary.rank.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Score</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(summary.score)}</p>
          </div>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* Scenes Visited */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Scenes Visited</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatNumber(stats.scenesVisited)}
          </p>
          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${summary.completion}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{summary.completion}% Complete</p>
          </div>
        </div>

        {/* Choices Made */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Choices Made</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatNumber(stats.choicesMade)}
          </p>
          <p className={`mt-2 text-sm font-medium text-${summary.engagement.color}-600`}>
            {summary.engagement.level}
          </p>
          <p className="text-xs text-gray-500">{summary.engagement.description}</p>
        </div>

        {/* Items Found */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Items Found</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatNumber(stats.itemsFound)}
          </p>
          <p className={`mt-2 text-sm font-medium text-${summary.collector.color}-600`}>
            {summary.collector.rank}
          </p>
          <p className="text-xs text-gray-500">{summary.collector.description}</p>
        </div>

        {/* Relationships */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Relationships</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              {stats.relationshipsMaxed}
            </span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-2xl font-bold text-red-600">
              {stats.relationshipsMinned}
            </span>
          </div>
          <p className={`mt-2 text-sm font-medium text-${summary.relationships.color}-600`}>
            {summary.relationships.description}
          </p>
        </div>
      </div>

      {/* Progress Info */}
      {stats.stageReached > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Story Progress</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {summary.stage.progress}
            </span>
            <span className="text-sm text-gray-600">{summary.stage.description}</span>
          </div>
        </div>
      )}

      {/* Play Time */}
      {stats.playTimeSeconds !== undefined && stats.playTimeSeconds > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Play Time</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatPlayTime(stats.playTimeSeconds)}
          </p>
        </div>
      )}

      {/* Milestones */}
      {showMilestones && milestones.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-900">
            Achievements ({milestones.length})
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-3"
                title={milestone.description}
              >
                <span className="text-2xl" aria-label={milestone.name}>
                  {milestone.icon}
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-xs font-semibold text-gray-900">
                    {milestone.name}
                  </p>
                  <p className="truncate text-xs text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
