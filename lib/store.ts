/**
 * Zustand store for El Palo de Queso game state management
 */

import { create } from 'zustand';
import type { GameState, GameStats, Scene, Choice, DayTime, TimeOfDay, WorkAssignment } from '@/types';
import {
  applyFlagChanges,
  applyItemChanges,
  applyRelationshipChanges,
  applyEvidenceChanges,
  collectStateChanges,
} from './sceneTransitions';
import { advanceTime, setTime, getPathCStartTime } from './timeUtils';
import { saveGame, loadGame, deleteSave, autoSave, loadAutoSave, hasAutoSave, deleteAutoSave, type SavedGame } from './saveGame';

/**
 * Game store interface combining state and actions
 */
interface GameStore extends GameState {
  // Navigation actions
  goToScene: (sceneId: string, addToHistory?: boolean) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  clearHistory: () => void;

  // Scene transition with state changes
  transitionToScene: (
    nextSceneId: string,
    currentScene?: Scene,
    choice?: Choice
  ) => void;

  // Inventory actions
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;

  // Relationship actions
  changeRelationship: (characterId: string, delta: number) => void;
  setRelationship: (characterId: string, score: number) => void;
  getRelationship: (characterId: string) => number;

  // Character discovery actions
  discoverCharacter: (characterId: string) => void;
  hasDiscoveredCharacter: (characterId: string) => boolean;

  // Flag actions
  setFlag: (flag: string) => void;
  unsetFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;

  // Evidence actions
  addEvidence: (evidenceId: string) => void;
  removeEvidence: (evidenceId: string) => void;
  hasEvidence: (evidenceId: string) => boolean;

  // Path actions
  setPath: (path: 'A' | 'B' | 'C') => void;
  getPath: () => 'A' | 'B' | 'C' | null;
  isOnPath: (path: 'A' | 'B' | 'C') => boolean;

  // Time actions (Path C)
  initializeTime: () => void;
  advanceToNextPeriod: () => void;
  setDayTime: (day: number, timeOfDay: TimeOfDay) => void;
  getDayTime: () => DayTime | null;
  isTimeOfDay: (timeOfDay: TimeOfDay) => boolean;

  // Work assignment actions (Path C)
  setWorkAssignment: (assignment: WorkAssignment) => void;
  getWorkAssignment: () => WorkAssignment | null;
  hasWorkAssignment: () => boolean;

  // Save/Load actions
  saveToSlot: (slotNumber: number) => SavedGame;
  loadFromSlot: (slotNumber: number) => boolean;
  deleteSlot: (slotNumber: number) => void;

  // Auto-save actions
  performAutoSave: () => SavedGame;
  loadFromAutoSave: () => boolean;
  hasAutoSaveData: () => boolean;

  // Utility actions
  resetGame: () => void;
  startNewGame: (deleteAutoSave?: boolean) => void;
  hasProgress: () => boolean;
}

/**
 * Initial stats
 */
const initialStats: GameStats = {
  scenesVisited: 0,
  choicesMade: 0,
  itemsFound: 0,
  relationshipsMaxed: 0,
  relationshipsMinned: 0,
  stageReached: 0,
  pathTaken: null,
  playTimeSeconds: 0,
};

/**
 * Initial game state
 */
const initialState: GameState = {
  currentScene: 'X-0-001',
  sceneHistory: [],
  currentPath: null,
  dayTime: null,
  workAssignment: null,
  inventory: [],
  relationships: {},
  discoveredCharacters: [],
  flags: [],
  evidence: [],
  stats: { ...initialStats },
};

/**
 * Main game store
 */
export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...initialState,

  // Navigation
  goToScene: (sceneId: string, addToHistory = true) => {
    set((state) => {
      let newHistory = addToHistory
        ? [...state.sceneHistory, state.currentScene]
        : state.sceneHistory;

      // Limit history to last 20 scenes
      const MAX_HISTORY_LENGTH = 20;
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
      }

      // Track unique scenes visited
      const allVisitedScenes = new Set([...newHistory, sceneId]);
      const scenesVisited = allVisitedScenes.size;

      return {
        currentScene: sceneId,
        sceneHistory: newHistory,
        stats: {
          ...state.stats,
          scenesVisited,
        },
      };
    });
  },

  goBack: () => {
    set((state) => {
      if (state.sceneHistory.length === 0) {
        return state; // No history to go back to
      }
      const newHistory = [...state.sceneHistory];
      const previousScene = newHistory.pop()!;
      return {
        currentScene: previousScene,
        sceneHistory: newHistory,
      };
    });
  },

  canGoBack: () => {
    return get().sceneHistory.length > 0;
  },

  clearHistory: () => {
    set({ sceneHistory: [] });
  },

  // Scene transition with automatic state changes
  transitionToScene: (
    nextSceneId: string,
    currentScene?: Scene,
    choice?: Choice
  ) => {
    set((state) => {
      // Collect all state changes from scene and choice
      const stateChanges = currentScene
        ? collectStateChanges(currentScene, choice)
        : {};

      // Apply all state changes
      const newFlags = applyFlagChanges(state.flags, stateChanges.flags);
      const newInventory = applyItemChanges(state.inventory, stateChanges.items);
      const newRelationships = applyRelationshipChanges(
        state.relationships,
        stateChanges.relationships
      );
      const newEvidence = applyEvidenceChanges(
        state.evidence,
        stateChanges.evidence
      );

      // Track choice made and unique scenes visited
      const allVisitedScenes = new Set([...state.sceneHistory, state.currentScene, nextSceneId]);
      const scenesVisited = allVisitedScenes.size;
      const choicesMade = choice ? state.stats.choicesMade + 1 : state.stats.choicesMade;

      // Update scene and add to history
      return {
        currentScene: nextSceneId,
        sceneHistory: [...state.sceneHistory, state.currentScene],
        flags: newFlags,
        inventory: newInventory,
        relationships: newRelationships,
        evidence: newEvidence,
        stats: {
          ...state.stats,
          scenesVisited,
          choicesMade,
        },
      };
    });
  },

  // Inventory management
  addItem: (itemId: string) => {
    set((state) => {
      if (state.inventory.includes(itemId)) {
        return state; // Item already in inventory
      }
      return {
        inventory: [...state.inventory, itemId],
        stats: {
          ...state.stats,
          itemsFound: state.stats.itemsFound + 1,
        },
      };
    });
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      inventory: state.inventory.filter((item) => item !== itemId),
    }));
  },

  hasItem: (itemId: string) => {
    return get().inventory.includes(itemId);
  },

  // Relationship management
  changeRelationship: (characterId: string, delta: number) => {
    set((state) => {
      const currentScore = state.relationships[characterId] || 0;
      const newScore = Math.max(-100, Math.min(100, currentScore + delta));

      // Calculate maxed and minned relationships
      const updatedRelationships = {
        ...state.relationships,
        [characterId]: newScore,
      };
      const relationshipsMaxed = Object.values(updatedRelationships).filter(
        (score) => score === 100
      ).length;
      const relationshipsMinned = Object.values(updatedRelationships).filter(
        (score) => score === -100
      ).length;

      return {
        relationships: updatedRelationships,
        stats: {
          ...state.stats,
          relationshipsMaxed,
          relationshipsMinned,
        },
      };
    });
  },

  setRelationship: (characterId: string, score: number) => {
    set((state) => {
      const clampedScore = Math.max(-100, Math.min(100, score));
      const updatedRelationships = {
        ...state.relationships,
        [characterId]: clampedScore,
      };

      // Calculate maxed and minned relationships
      const relationshipsMaxed = Object.values(updatedRelationships).filter(
        (score) => score === 100
      ).length;
      const relationshipsMinned = Object.values(updatedRelationships).filter(
        (score) => score === -100
      ).length;

      return {
        relationships: updatedRelationships,
        stats: {
          ...state.stats,
          relationshipsMaxed,
          relationshipsMinned,
        },
      };
    });
  },

  getRelationship: (characterId: string) => {
    return get().relationships[characterId] || 0;
  },

  // Character discovery
  discoverCharacter: (characterId: string) => {
    set((state) => {
      if (state.discoveredCharacters.includes(characterId)) {
        return state; // Character already discovered
      }
      return {
        discoveredCharacters: [...state.discoveredCharacters, characterId],
      };
    });
  },

  hasDiscoveredCharacter: (characterId: string) => {
    return get().discoveredCharacters.includes(characterId);
  },

  // Flag management
  setFlag: (flag: string) => {
    set((state) => {
      if (state.flags.includes(flag)) {
        return state; // Flag already set
      }
      return { flags: [...state.flags, flag] };
    });
  },

  unsetFlag: (flag: string) => {
    set((state) => ({
      flags: state.flags.filter((f) => f !== flag),
    }));
  },

  hasFlag: (flag: string) => {
    return get().flags.includes(flag);
  },

  // Evidence management
  addEvidence: (evidenceId: string) => {
    set((state) => {
      if (state.evidence.includes(evidenceId)) {
        return state; // Evidence already collected
      }
      return { evidence: [...state.evidence, evidenceId] };
    });
  },

  removeEvidence: (evidenceId: string) => {
    set((state) => ({
      evidence: state.evidence.filter((item) => item !== evidenceId),
    }));
  },

  hasEvidence: (evidenceId: string) => {
    return get().evidence.includes(evidenceId);
  },

  // Path management
  setPath: (path: 'A' | 'B' | 'C') => {
    set((state) => ({
      currentPath: path,
      stats: {
        ...state.stats,
        pathTaken: path,
      },
    }));
  },

  getPath: () => {
    return get().currentPath;
  },

  isOnPath: (path: 'A' | 'B' | 'C') => {
    return get().currentPath === path;
  },

  // Time management (Path C)
  initializeTime: () => {
    set({ dayTime: getPathCStartTime() });
  },

  advanceToNextPeriod: () => {
    set((state) => {
      if (!state.dayTime) {
        return state; // No time to advance
      }
      const nextTime = advanceTime(state.dayTime);

      // Track the highest day reached as stageReached
      const stageReached = nextTime
        ? Math.max(state.stats.stageReached, nextTime.day)
        : state.stats.stageReached;

      return {
        dayTime: nextTime,
        stats: {
          ...state.stats,
          stageReached,
        },
      };
    });
  },

  setDayTime: (day: number, timeOfDay: TimeOfDay) => {
    const newTime = setTime(day, timeOfDay);
    set({ dayTime: newTime });
  },

  getDayTime: () => {
    return get().dayTime;
  },

  isTimeOfDay: (timeOfDay: TimeOfDay) => {
    const dayTime = get().dayTime;
    return dayTime ? dayTime.timeOfDay === timeOfDay : false;
  },

  // Work assignment management (Path C)
  setWorkAssignment: (assignment: WorkAssignment) => {
    set({ workAssignment: assignment });
  },

  getWorkAssignment: () => {
    return get().workAssignment;
  },

  hasWorkAssignment: () => {
    return get().workAssignment !== null;
  },

  // Save/Load
  saveToSlot: (slotNumber: number) => {
    const state = get();
    const gameState: GameState = {
      currentScene: state.currentScene,
      sceneHistory: state.sceneHistory,
      currentPath: state.currentPath,
      dayTime: state.dayTime,
      workAssignment: state.workAssignment,
      inventory: state.inventory,
      relationships: state.relationships,
      discoveredCharacters: state.discoveredCharacters,
      flags: state.flags,
      evidence: state.evidence,
      stats: state.stats,
    };
    return saveGame(slotNumber, gameState);
  },

  loadFromSlot: (slotNumber: number) => {
    const savedGame = loadGame(slotNumber);
    if (!savedGame) {
      return false;
    }
    set(savedGame.gameState);
    return true;
  },

  deleteSlot: (slotNumber: number) => {
    deleteSave(slotNumber);
  },

  // Auto-save
  performAutoSave: () => {
    const state = get();
    const gameState: GameState = {
      currentScene: state.currentScene,
      sceneHistory: state.sceneHistory,
      currentPath: state.currentPath,
      dayTime: state.dayTime,
      workAssignment: state.workAssignment,
      inventory: state.inventory,
      relationships: state.relationships,
      discoveredCharacters: state.discoveredCharacters,
      flags: state.flags,
      evidence: state.evidence,
      stats: state.stats,
    };
    return autoSave(gameState);
  },

  loadFromAutoSave: () => {
    const savedGame = loadAutoSave();
    if (!savedGame) {
      return false;
    }
    set(savedGame.gameState);
    return true;
  },

  hasAutoSaveData: () => {
    return hasAutoSave();
  },

  // Reset game to initial state
  resetGame: () => {
    set(initialState);
  },

  // Start new game with optional auto-save deletion
  startNewGame: (deleteAutoSaveData = true) => {
    set(initialState);
    if (deleteAutoSaveData) {
      try {
        deleteAutoSave();
      } catch (error) {
        console.error('Failed to delete auto-save:', error);
      }
    }
  },

  // Check if player has made progress
  hasProgress: () => {
    const state = get();
    return (
      state.currentScene !== 'X-0-001' ||
      state.sceneHistory.length > 0 ||
      state.inventory.length > 0 ||
      state.flags.length > 0 ||
      Object.keys(state.relationships).length > 0
    );
  },
}));
