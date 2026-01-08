/**
 * Scene Loader - Loads scene data from JSON files
 */

import type { Scene } from '@/types';
import sampleScenes from '@/data/scenes/sample-scenes.json';
import act0Scenes from '@/data/scenes/act-0-opening.json';

/**
 * Error thrown when a scene cannot be found
 */
export class SceneNotFoundError extends Error {
  constructor(sceneId: string) {
    super(`Scene not found: ${sceneId}`);
    this.name = 'SceneNotFoundError';
  }
}

/**
 * In-memory cache of all loaded scenes
 */
let sceneCache: Map<string, Scene> | null = null;

/**
 * Initialize the scene cache by loading all scenes from JSON files
 */
function initializeSceneCache(): Map<string, Scene> {
  if (sceneCache) {
    return sceneCache;
  }

  sceneCache = new Map<string, Scene>();

  // Load scenes from act-0-opening.json (Act 0 scenes take priority)
  if (act0Scenes && Array.isArray(act0Scenes.scenes)) {
    for (const scene of act0Scenes.scenes) {
      sceneCache.set(scene.id, scene as Scene);
    }
  }

  // Load scenes from sample-scenes.json
  if (sampleScenes && Array.isArray(sampleScenes.scenes)) {
    for (const scene of sampleScenes.scenes) {
      // Only add if not already loaded (act-0 scenes take priority)
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  return sceneCache;
}

/**
 * Load a scene by its ID
 *
 * @param sceneId - The unique identifier for the scene (e.g., "X-0-001", "A-1-015")
 * @returns The scene object
 * @throws {SceneNotFoundError} If the scene ID does not exist
 *
 * @example
 * ```typescript
 * const scene = loadScene("X-0-001");
 * console.log(scene.content.text);
 * ```
 */
export function loadScene(sceneId: string): Scene {
  const cache = initializeSceneCache();
  const scene = cache.get(sceneId);

  if (!scene) {
    throw new SceneNotFoundError(sceneId);
  }

  return scene;
}

/**
 * Check if a scene exists without loading it
 *
 * @param sceneId - The unique identifier for the scene
 * @returns true if the scene exists, false otherwise
 *
 * @example
 * ```typescript
 * if (sceneExists("X-0-001")) {
 *   const scene = loadScene("X-0-001");
 * }
 * ```
 */
export function sceneExists(sceneId: string): boolean {
  const cache = initializeSceneCache();
  return cache.has(sceneId);
}

/**
 * Get all available scene IDs
 *
 * @returns Array of all scene IDs
 *
 * @example
 * ```typescript
 * const allScenes = getAllSceneIds();
 * console.log(`Total scenes: ${allScenes.length}`);
 * ```
 */
export function getAllSceneIds(): string[] {
  const cache = initializeSceneCache();
  return Array.from(cache.keys());
}

/**
 * Reload all scenes from JSON files (useful for development)
 */
export function reloadScenes(): void {
  sceneCache = null;
  initializeSceneCache();
}

/**
 * Get the total number of loaded scenes
 *
 * @returns The count of scenes in the cache
 */
export function getSceneCount(): number {
  const cache = initializeSceneCache();
  return cache.size;
}
