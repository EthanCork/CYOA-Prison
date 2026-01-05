/**
 * Stats utility functions for game statistics tracking and display
 */

import type { GameStats, GamePath } from '@/types';

/**
 * Format a number with commas for display
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format play time in seconds to human-readable format
 */
export function formatPlayTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Get path display name
 */
export function getPathDisplayName(path: GamePath): string {
  const pathNames: Record<GamePath, string> = {
    A: 'Path A: Power',
    B: 'Path B: Trust',
    C: 'Path C: Justice',
  };
  return pathNames[path];
}

/**
 * Get path icon
 */
export function getPathIcon(path: GamePath): string {
  const pathIcons: Record<GamePath, string> = {
    A: '👑',
    B: '🤝',
    C: '⚖️',
  };
  return pathIcons[path];
}

/**
 * Get path color
 */
export function getPathColor(path: GamePath): string {
  const pathColors: Record<GamePath, string> = {
    A: 'red',
    B: 'blue',
    C: 'green',
  };
  return pathColors[path];
}

/**
 * Get completion percentage based on scenes visited
 * Assumes ~100 total scenes in the game
 */
export function getCompletionPercentage(scenesVisited: number, totalScenes: number = 100): number {
  return Math.min(100, Math.round((scenesVisited / totalScenes) * 100));
}

/**
 * Get engagement level based on choices made
 */
export function getEngagementLevel(choicesMade: number): {
  level: string;
  description: string;
  color: string;
} {
  if (choicesMade < 10) {
    return {
      level: 'Cautious',
      description: 'Taking a careful approach',
      color: 'gray',
    };
  } else if (choicesMade < 30) {
    return {
      level: 'Engaged',
      description: 'Actively exploring options',
      color: 'blue',
    };
  } else if (choicesMade < 60) {
    return {
      level: 'Invested',
      description: 'Deeply involved in the story',
      color: 'purple',
    };
  } else {
    return {
      level: 'Completionist',
      description: 'Exploring every possibility',
      color: 'amber',
    };
  }
}

/**
 * Get collector rank based on items found
 */
export function getCollectorRank(itemsFound: number): {
  rank: string;
  description: string;
  color: string;
} {
  if (itemsFound === 0) {
    return {
      rank: 'Minimalist',
      description: 'Traveling light',
      color: 'gray',
    };
  } else if (itemsFound < 5) {
    return {
      rank: 'Novice Collector',
      description: 'Starting to gather resources',
      color: 'blue',
    };
  } else if (itemsFound < 10) {
    return {
      rank: 'Skilled Collector',
      description: 'Building a useful inventory',
      color: 'green',
    };
  } else if (itemsFound < 20) {
    return {
      rank: 'Expert Collector',
      description: 'Finding valuable items',
      color: 'purple',
    };
  } else {
    return {
      rank: 'Master Collector',
      description: 'Found everything worth finding',
      color: 'amber',
    };
  }
}

/**
 * Get relationship mastery description
 */
export function getRelationshipMastery(maxed: number, minned: number): {
  description: string;
  color: string;
} {
  const total = maxed + minned;

  if (total === 0) {
    return {
      description: 'Neutral with everyone',
      color: 'gray',
    };
  } else if (maxed > minned) {
    return {
      description: `${maxed} strong ${maxed === 1 ? 'ally' : 'allies'}`,
      color: 'green',
    };
  } else if (minned > maxed) {
    return {
      description: `${minned} dangerous ${minned === 1 ? 'enemy' : 'enemies'}`,
      color: 'red',
    };
  } else {
    return {
      description: `${maxed} allies, ${minned} enemies`,
      color: 'purple',
    };
  }
}

/**
 * Get progress description for stage reached
 */
export function getStageDescription(stageReached: number): {
  description: string;
  progress: string;
} {
  if (stageReached === 0) {
    return {
      description: 'Just beginning',
      progress: 'Day 1',
    };
  } else if (stageReached < 3) {
    return {
      description: 'Early days',
      progress: `Day ${stageReached}`,
    };
  } else if (stageReached < 5) {
    return {
      description: 'Making progress',
      progress: `Day ${stageReached}`,
    };
  } else if (stageReached < 6) {
    return {
      description: 'Nearly there',
      progress: `Day ${stageReached}`,
    };
  } else {
    return {
      description: 'Reached the end',
      progress: 'Day 6',
    };
  }
}

/**
 * Calculate overall game score
 * Weighted combination of different stats
 */
export function calculateGameScore(stats: GameStats): number {
  const weights = {
    scenesVisited: 1,
    choicesMade: 2,
    itemsFound: 3,
    relationshipsMaxed: 5,
    relationshipsMinned: 3,
    stageReached: 10,
  };

  const score =
    stats.scenesVisited * weights.scenesVisited +
    stats.choicesMade * weights.choicesMade +
    stats.itemsFound * weights.itemsFound +
    stats.relationshipsMaxed * weights.relationshipsMaxed +
    stats.relationshipsMinned * weights.relationshipsMinned +
    stats.stageReached * weights.stageReached;

  return score;
}

/**
 * Get rank based on game score
 */
export function getGameRank(score: number): {
  rank: string;
  description: string;
  color: string;
} {
  if (score < 50) {
    return {
      rank: 'Newcomer',
      description: 'Just starting your journey',
      color: 'gray',
    };
  } else if (score < 150) {
    return {
      rank: 'Survivor',
      description: 'Finding your way',
      color: 'blue',
    };
  } else if (score < 300) {
    return {
      rank: 'Strategist',
      description: 'Playing smart',
      color: 'green',
    };
  } else if (score < 500) {
    return {
      rank: 'Master Planner',
      description: 'Excellent execution',
      color: 'purple',
    };
  } else {
    return {
      rank: 'Legend',
      description: 'Peak performance',
      color: 'amber',
    };
  }
}

/**
 * Get stat summary for display
 */
export function getStatsSummary(stats: GameStats): {
  completion: number;
  engagement: ReturnType<typeof getEngagementLevel>;
  collector: ReturnType<typeof getCollectorRank>;
  relationships: ReturnType<typeof getRelationshipMastery>;
  stage: ReturnType<typeof getStageDescription>;
  score: number;
  rank: ReturnType<typeof getGameRank>;
} {
  const completion = getCompletionPercentage(stats.scenesVisited);
  const engagement = getEngagementLevel(stats.choicesMade);
  const collector = getCollectorRank(stats.itemsFound);
  const relationships = getRelationshipMastery(
    stats.relationshipsMaxed,
    stats.relationshipsMinned
  );
  const stage = getStageDescription(stats.stageReached);
  const score = calculateGameScore(stats);
  const rank = getGameRank(score);

  return {
    completion,
    engagement,
    collector,
    relationships,
    stage,
    score,
    rank,
  };
}

/**
 * Check if player has achieved specific milestones
 */
export interface GameMilestones {
  firstChoice: boolean;
  tenChoices: boolean;
  firstItem: boolean;
  firstAlly: boolean;
  firstEnemy: boolean;
  reachedDay3: boolean;
  reachedDay6: boolean;
  completionist: boolean; // Made 100+ choices
  collector: boolean; // Found 20+ items
  diplomat: boolean; // Maxed 3+ relationships
  antagonist: boolean; // Minned 3+ relationships
}

export function checkMilestones(stats: GameStats): GameMilestones {
  return {
    firstChoice: stats.choicesMade >= 1,
    tenChoices: stats.choicesMade >= 10,
    firstItem: stats.itemsFound >= 1,
    firstAlly: stats.relationshipsMaxed >= 1,
    firstEnemy: stats.relationshipsMinned >= 1,
    reachedDay3: stats.stageReached >= 3,
    reachedDay6: stats.stageReached >= 6,
    completionist: stats.choicesMade >= 100,
    collector: stats.itemsFound >= 20,
    diplomat: stats.relationshipsMaxed >= 3,
    antagonist: stats.relationshipsMinned >= 3,
  };
}

/**
 * Get milestone display info
 */
export interface MilestoneInfo {
  id: keyof GameMilestones;
  name: string;
  description: string;
  icon: string;
}

export const MILESTONE_INFO: Record<keyof GameMilestones, Omit<MilestoneInfo, 'id'>> = {
  firstChoice: {
    name: 'First Choice',
    description: 'Made your first decision',
    icon: '🎯',
  },
  tenChoices: {
    name: 'Decision Maker',
    description: 'Made 10 choices',
    icon: '🔟',
  },
  firstItem: {
    name: 'First Find',
    description: 'Found your first item',
    icon: '🔍',
  },
  firstAlly: {
    name: 'First Ally',
    description: 'Maxed a relationship',
    icon: '🤝',
  },
  firstEnemy: {
    name: 'First Enemy',
    description: 'Made an enemy',
    icon: '⚔️',
  },
  reachedDay3: {
    name: 'Midpoint',
    description: 'Reached Day 3',
    icon: '📅',
  },
  reachedDay6: {
    name: 'The End',
    description: 'Reached the final day',
    icon: '🏁',
  },
  completionist: {
    name: 'Completionist',
    description: 'Made 100+ choices',
    icon: '💯',
  },
  collector: {
    name: 'Master Collector',
    description: 'Found 20+ items',
    icon: '🎒',
  },
  diplomat: {
    name: 'Diplomat',
    description: 'Maxed 3+ relationships',
    icon: '🕊️',
  },
  antagonist: {
    name: 'Antagonist',
    description: 'Made 3+ enemies',
    icon: '😈',
  },
};

/**
 * Get all achieved milestones with their info
 */
export function getAchievedMilestones(stats: GameStats): MilestoneInfo[] {
  const milestones = checkMilestones(stats);
  const achieved: MilestoneInfo[] = [];

  for (const [id, isAchieved] of Object.entries(milestones)) {
    if (isAchieved) {
      const info = MILESTONE_INFO[id as keyof GameMilestones];
      achieved.push({
        id: id as keyof GameMilestones,
        ...info,
      });
    }
  }

  return achieved;
}
