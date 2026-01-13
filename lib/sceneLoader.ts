/**
 * Scene Loader - Loads scene data from JSON files
 */

import type { Scene } from '@/types';
import sampleScenes from '@/data/scenes/sample-scenes.json';
import act0Scenes from '@/data/scenes/act-0-opening.json';
import pathATunnels from '@/data/scenes/path-a-tunnels.json';
import pathBSocial from '@/data/scenes/path-b-social.json';
import pathBChapelRoute from '@/data/scenes/path-b-chapel-route.json';
import pathBChaosRoute from '@/data/scenes/path-b-chaos-route.json';
import pathBLeverageRoute from '@/data/scenes/path-b-leverage-route.json';
import pathBLoadingDockRoute from '@/data/scenes/path-b-loading-dock-route.json';
import pathBEndings from '@/data/scenes/path-b-endings.json';

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

  // Load scenes from path-a-tunnels.json (Path A scenes)
  if (pathATunnels && Array.isArray(pathATunnels.scenes)) {
    for (const scene of pathATunnels.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  // Load scenes from path-b-social.json (Path B scenes)
  if (pathBSocial && Array.isArray(pathBSocial.scenes)) {
    for (const scene of pathBSocial.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  // Load scenes from path-b-chapel-route.json (Path B Chapel Route)
  if (pathBChapelRoute && Array.isArray(pathBChapelRoute.scenes)) {
    for (const scene of pathBChapelRoute.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  // Load scenes from path-b-chaos-route.json (Path B Chaos Route)
  if (pathBChaosRoute && Array.isArray(pathBChaosRoute.scenes)) {
    for (const scene of pathBChaosRoute.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  // Load scenes from path-b-leverage-route.json (Path B Leverage Route)
  if (pathBLeverageRoute && Array.isArray(pathBLeverageRoute.scenes)) {
    for (const scene of pathBLeverageRoute.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  // Load scenes from path-b-loading-dock-route.json (Path B Loading Dock Route)
  if (pathBLoadingDockRoute && Array.isArray(pathBLoadingDockRoute.scenes)) {
    for (const scene of pathBLoadingDockRoute.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
    }
  }

  // Load scenes from path-b-endings.json (Path B Endings)
  if (pathBEndings && Array.isArray(pathBEndings.scenes)) {
    for (const scene of pathBEndings.scenes) {
      if (!sceneCache.has(scene.id)) {
        sceneCache.set(scene.id, scene as Scene);
      }
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
