/**
 * Save/Load system for El Palo de Queso
 * Handles saving and loading game state to/from localStorage with multiple save slots
 */

import type { GameState } from '@/types';

/**
 * Maximum number of save slots available
 */
export const MAX_SAVE_SLOTS = 3;

/**
 * Auto-save slot number (separate from manual saves)
 */
export const AUTO_SAVE_SLOT = 'auto';

/**
 * Save slot metadata
 */
export interface SaveSlot {
  /** Slot number (1-3) */
  slotNumber: number;
  /** Timestamp when the save was created */
  timestamp: number;
  /** Human-readable date string */
  dateString: string;
  /** Current scene ID for quick reference */
  currentScene: string;
  /** Current path for quick reference */
  currentPath: 'A' | 'B' | 'C' | null;
  /** Day and time for quick reference (Path C only) */
  dayTime: { day: number; timeOfDay: string } | null;
  /** Play time in seconds */
  playTimeSeconds: number;
}

/**
 * Saved game data structure
 */
export interface SavedGame {
  /** Save slot metadata */
  metadata: SaveSlot;
  /** Complete game state */
  gameState: GameState;
  /** Version of the save format (for future compatibility) */
  version: string;
}

/**
 * Current save format version
 */
const SAVE_VERSION = '1.0.0';

/**
 * LocalStorage key prefix for save slots
 */
const SAVE_KEY_PREFIX = 'el-palo-de-queso-save';

/**
 * Get the localStorage key for a specific save slot
 */
function getSaveKey(slotNumber: number): string {
  if (slotNumber < 1 || slotNumber > MAX_SAVE_SLOTS) {
    throw new Error(`Invalid save slot number: ${slotNumber}. Must be between 1 and ${MAX_SAVE_SLOTS}`);
  }
  return `${SAVE_KEY_PREFIX}-${slotNumber}`;
}

/**
 * Format a timestamp as a human-readable date string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Save game state to a specific slot
 * @param slotNumber - Slot number (1-3)
 * @param gameState - Current game state to save
 * @returns The saved game data
 */
export function saveGame(slotNumber: number, gameState: GameState): SavedGame {
  if (typeof window === 'undefined') {
    throw new Error('Cannot save game: localStorage is not available (server-side)');
  }

  const timestamp = Date.now();

  const savedGame: SavedGame = {
    metadata: {
      slotNumber,
      timestamp,
      dateString: formatTimestamp(timestamp),
      currentScene: gameState.currentScene,
      currentPath: gameState.currentPath,
      dayTime: gameState.dayTime,
      playTimeSeconds: gameState.stats.playTimeSeconds || 0,
    },
    gameState,
    version: SAVE_VERSION,
  };

  try {
    const key = getSaveKey(slotNumber);
    const serialized = JSON.stringify(savedGame);
    localStorage.setItem(key, serialized);
    return savedGame;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save game: ${error.message}`);
    }
    throw new Error('Failed to save game: Unknown error');
  }
}

/**
 * Load game state from a specific slot
 * @param slotNumber - Slot number (1-3)
 * @returns The loaded game data, or null if the slot is empty
 */
export function loadGame(slotNumber: number): SavedGame | null {
  if (typeof window === 'undefined') {
    throw new Error('Cannot load game: localStorage is not available (server-side)');
  }

  try {
    const key = getSaveKey(slotNumber);
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return null; // Slot is empty
    }

    const savedGame = JSON.parse(serialized) as SavedGame;

    // Validate the loaded data
    if (!savedGame.gameState || !savedGame.metadata) {
      throw new Error('Invalid save data structure');
    }

    return savedGame;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load game from slot ${slotNumber}: ${error.message}`);
    }
    throw new Error(`Failed to load game from slot ${slotNumber}: Unknown error`);
  }
}

/**
 * Delete a saved game from a specific slot
 * @param slotNumber - Slot number (1-3)
 */
export function deleteSave(slotNumber: number): void {
  if (typeof window === 'undefined') {
    throw new Error('Cannot delete save: localStorage is not available (server-side)');
  }

  try {
    const key = getSaveKey(slotNumber);
    localStorage.removeItem(key);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete save: ${error.message}`);
    }
    throw new Error('Failed to delete save: Unknown error');
  }
}

/**
 * Get metadata for a specific save slot without loading the full game state
 * @param slotNumber - Slot number (1-3)
 * @returns Save slot metadata, or null if the slot is empty
 */
export function getSaveSlotMetadata(slotNumber: number): SaveSlot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = getSaveKey(slotNumber);
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return null;
    }

    const savedGame = JSON.parse(serialized) as SavedGame;
    return savedGame.metadata;
  } catch (error) {
    console.error(`Failed to load metadata for slot ${slotNumber}:`, error);
    return null;
  }
}

/**
 * Get metadata for all save slots
 * @returns Array of save slot metadata (null for empty slots)
 */
export function getAllSaveSlots(): (SaveSlot | null)[] {
  const slots: (SaveSlot | null)[] = [];

  for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
    slots.push(getSaveSlotMetadata(i));
  }

  return slots;
}

/**
 * Check if a save slot is empty
 * @param slotNumber - Slot number (1-3)
 * @returns True if the slot is empty, false if it contains a save
 */
export function isSaveSlotEmpty(slotNumber: number): boolean {
  return getSaveSlotMetadata(slotNumber) === null;
}

/**
 * Get the most recent save slot
 * @returns The slot number of the most recent save, or null if no saves exist
 */
export function getMostRecentSaveSlot(): number | null {
  const slots = getAllSaveSlots();

  let mostRecentSlot: number | null = null;
  let mostRecentTimestamp = 0;

  slots.forEach((slot, index) => {
    if (slot && slot.timestamp > mostRecentTimestamp) {
      mostRecentTimestamp = slot.timestamp;
      mostRecentSlot = index + 1;
    }
  });

  return mostRecentSlot;
}

/**
 * Check if any save slots have data
 * @returns True if at least one save exists
 */
export function hasSavedGames(): boolean {
  return getMostRecentSaveSlot() !== null;
}

/**
 * Export a saved game as a JSON string (for backup/sharing)
 * @param slotNumber - Slot number (1-3)
 * @returns JSON string of the saved game
 */
export function exportSave(slotNumber: number): string | null {
  const savedGame = loadGame(slotNumber);
  if (!savedGame) {
    return null;
  }
  return JSON.stringify(savedGame, null, 2);
}

/**
 * Import a saved game from a JSON string
 * @param slotNumber - Slot number (1-3) to import into
 * @param jsonString - JSON string of the saved game
 */
export function importSave(slotNumber: number, jsonString: string): void {
  try {
    const savedGame = JSON.parse(jsonString) as SavedGame;

    // Validate the structure
    if (!savedGame.gameState || !savedGame.metadata) {
      throw new Error('Invalid save data structure');
    }

    // Update slot number and timestamp
    savedGame.metadata.slotNumber = slotNumber;
    savedGame.metadata.timestamp = Date.now();
    savedGame.metadata.dateString = formatTimestamp(savedGame.metadata.timestamp);

    const key = getSaveKey(slotNumber);
    localStorage.setItem(key, JSON.stringify(savedGame));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to import save: ${error.message}`);
    }
    throw new Error('Failed to import save: Unknown error');
  }
}

/**
 * Auto-save game state (uses separate auto-save slot)
 * @param gameState - Current game state to auto-save
 * @returns The saved game data
 */
export function autoSave(gameState: GameState): SavedGame {
  if (typeof window === 'undefined') {
    throw new Error('Cannot auto-save: localStorage is not available (server-side)');
  }

  const timestamp = Date.now();

  const savedGame: SavedGame = {
    metadata: {
      slotNumber: 0, // Auto-save uses slot 0
      timestamp,
      dateString: formatTimestamp(timestamp),
      currentScene: gameState.currentScene,
      currentPath: gameState.currentPath,
      dayTime: gameState.dayTime,
      playTimeSeconds: gameState.stats.playTimeSeconds || 0,
    },
    gameState,
    version: SAVE_VERSION,
  };

  try {
    const key = `${SAVE_KEY_PREFIX}-${AUTO_SAVE_SLOT}`;
    const serialized = JSON.stringify(savedGame);
    localStorage.setItem(key, serialized);
    return savedGame;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to auto-save: ${error.message}`);
    }
    throw new Error('Failed to auto-save: Unknown error');
  }
}

/**
 * Load auto-saved game state
 * @returns The loaded auto-save data, or null if no auto-save exists
 */
export function loadAutoSave(): SavedGame | null {
  if (typeof window === 'undefined') {
    throw new Error('Cannot load auto-save: localStorage is not available (server-side)');
  }

  try {
    const key = `${SAVE_KEY_PREFIX}-${AUTO_SAVE_SLOT}`;
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return null; // No auto-save exists
    }

    const savedGame = JSON.parse(serialized) as SavedGame;

    // Validate the loaded data
    if (!savedGame.gameState || !savedGame.metadata) {
      throw new Error('Invalid auto-save data structure');
    }

    return savedGame;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load auto-save: ${error.message}`);
    }
    throw new Error('Failed to load auto-save: Unknown error');
  }
}

/**
 * Check if an auto-save exists
 * @returns True if an auto-save exists
 */
export function hasAutoSave(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const key = `${SAVE_KEY_PREFIX}-${AUTO_SAVE_SLOT}`;
  return localStorage.getItem(key) !== null;
}

/**
 * Delete the auto-save
 */
export function deleteAutoSave(): void {
  if (typeof window === 'undefined') {
    throw new Error('Cannot delete auto-save: localStorage is not available (server-side)');
  }

  try {
    const key = `${SAVE_KEY_PREFIX}-${AUTO_SAVE_SLOT}`;
    localStorage.removeItem(key);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete auto-save: ${error.message}`);
    }
    throw new Error('Failed to delete auto-save: Unknown error');
  }
}
