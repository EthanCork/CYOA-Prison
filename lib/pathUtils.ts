/**
 * Path utility functions for El Palo de Queso
 * Manages the three main story paths (A, B, C)
 */

import type { GamePath } from '@/types';

/**
 * Path information and metadata
 */
export interface PathInfo {
  id: GamePath;
  name: string;
  description: string;
  approach: string;
  icon: string;
  color: string;
}

/**
 * Get information about a specific path
 * @param path - The path identifier ('A', 'B', or 'C')
 * @returns Path information object
 */
export function getPathInfo(path: 'A' | 'B' | 'C'): PathInfo {
  const paths: Record<'A' | 'B' | 'C', PathInfo> = {
    A: {
      id: 'A',
      name: 'Path A: Night',
      description: 'Escape under cover of darkness through stealth and cunning',
      approach: 'Stealth and infiltration',
      icon: '🌙',
      color: 'blue',
    },
    B: {
      id: 'B',
      name: 'Path B: Social',
      description: 'Build alliances and manipulate relationships to gain freedom',
      approach: 'Social manipulation and alliances',
      icon: '🤝',
      color: 'green',
    },
    C: {
      id: 'C',
      name: 'Path C: Day (Justice)',
      description: 'Gather evidence to expose corruption and achieve legal freedom',
      approach: 'Investigation and evidence gathering',
      icon: '⚖️',
      color: 'amber',
    },
  };

  return paths[path];
}

/**
 * Get all available paths
 * @returns Array of all path information
 */
export function getAllPaths(): PathInfo[] {
  return [getPathInfo('A'), getPathInfo('B'), getPathInfo('C')];
}

/**
 * Get path name with icon
 * @param path - The path identifier
 * @returns Formatted path name
 */
export function getPathDisplayName(path: 'A' | 'B' | 'C' | null): string {
  if (!path) return 'No path selected';
  const info = getPathInfo(path);
  return `${info.icon} ${info.name}`;
}

/**
 * Get Tailwind color classes for a path
 * @param path - The path identifier
 * @returns Object with Tailwind color class names
 */
export function getPathColors(path: 'A' | 'B' | 'C'): {
  bg: string;
  text: string;
  border: string;
  hover: string;
} {
  const colors: Record<'A' | 'B' | 'C', ReturnType<typeof getPathColors>> = {
    A: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-600',
      hover: 'hover:bg-blue-200',
    },
    B: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-600',
      hover: 'hover:bg-green-200',
    },
    C: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-600',
      hover: 'hover:bg-amber-200',
    },
  };

  return colors[path];
}

/**
 * Check if a scene belongs to a specific path
 * @param sceneId - The scene ID (format: X-0-001 or A-1-015)
 * @param path - The path to check
 * @returns True if scene belongs to the path
 */
export function isSceneOnPath(sceneId: string, path: 'A' | 'B' | 'C'): boolean {
  return sceneId.startsWith(`${path}-`);
}

/**
 * Check if a scene is shared across all paths
 * @param sceneId - The scene ID
 * @returns True if scene is shared (starts with X-)
 */
export function isSharedScene(sceneId: string): boolean {
  return sceneId.startsWith('X-');
}

/**
 * Get the path from a scene ID
 * @param sceneId - The scene ID
 * @returns The path ('A', 'B', 'C') or null if shared/unknown
 */
export function getPathFromSceneId(sceneId: string): GamePath {
  const firstChar = sceneId.charAt(0);
  if (firstChar === 'A' || firstChar === 'B' || firstChar === 'C') {
    return firstChar as GamePath;
  }
  return null;
}

/**
 * Validate if player can access a scene based on their current path
 * @param sceneId - The scene to check
 * @param currentPath - Player's current path
 * @returns True if player can access the scene
 */
export function canAccessScene(sceneId: string, currentPath: GamePath): boolean {
  // Shared scenes (X-) are accessible to all
  if (isSharedScene(sceneId)) {
    return true;
  }

  // If no path selected yet, can only access shared scenes
  if (!currentPath) {
    return false;
  }

  // Path-specific scenes require matching path
  return isSceneOnPath(sceneId, currentPath);
}

/**
 * Get recommended path based on collected items/evidence/relationships
 * @param hasEvidence - Whether player has collected evidence
 * @param highRelationships - Number of characters with high relationships
 * @param hasStealthItems - Whether player has stealth-related items
 * @returns Suggested path
 */
export function getRecommendedPath(
  hasEvidence: boolean,
  highRelationships: number,
  hasStealthItems: boolean
): 'A' | 'B' | 'C' | null {
  const scores = {
    A: hasStealthItems ? 2 : 0,
    B: highRelationships * 1.5,
    C: hasEvidence ? 3 : 0,
  };

  const maxScore = Math.max(scores.A, scores.B, scores.C);

  if (maxScore === 0) return null;

  if (scores.C === maxScore) return 'C';
  if (scores.B === maxScore) return 'B';
  return 'A';
}

/**
 * Get path selection scene ID (the branching point)
 * @returns Scene ID where paths diverge
 */
export function getPathSelectionSceneId(): string {
  return 'X-0-014';
}
