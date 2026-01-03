/**
 * Zustand store for El Palo de Queso game state management
 */

import { create } from 'zustand';
import type { GameState, Scene, Choice } from '@/types';
import {
  applyFlagChanges,
  applyItemChanges,
  applyRelationshipChanges,
  applyEvidenceChanges,
  collectStateChanges,
} from './sceneTransitions';

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

  // Flag actions
  setFlag: (flag: string) => void;
  unsetFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;

  // Evidence actions
  addEvidence: (evidenceId: string) => void;
  removeEvidence: (evidenceId: string) => void;
  hasEvidence: (evidenceId: string) => boolean;

  // Utility actions
  resetGame: () => void;
}

/**
 * Initial game state
 */
const initialState: GameState = {
  currentScene: 'X-0-001',
  sceneHistory: [],
  inventory: [],
  relationships: {},
  flags: [],
  evidence: [],
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
      const newHistory = addToHistory
        ? [...state.sceneHistory, state.currentScene]
        : state.sceneHistory;
      return {
        currentScene: sceneId,
        sceneHistory: newHistory,
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

      // Update scene and add to history
      return {
        currentScene: nextSceneId,
        sceneHistory: [...state.sceneHistory, state.currentScene],
        flags: newFlags,
        inventory: newInventory,
        relationships: newRelationships,
        evidence: newEvidence,
      };
    });
  },

  // Inventory management
  addItem: (itemId: string) => {
    set((state) => {
      if (state.inventory.includes(itemId)) {
        return state; // Item already in inventory
      }
      return { inventory: [...state.inventory, itemId] };
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
      return {
        relationships: {
          ...state.relationships,
          [characterId]: newScore,
        },
      };
    });
  },

  setRelationship: (characterId: string, score: number) => {
    set((state) => ({
      relationships: {
        ...state.relationships,
        [characterId]: Math.max(-100, Math.min(100, score)),
      },
    }));
  },

  getRelationship: (characterId: string) => {
    return get().relationships[characterId] || 0;
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

  // Reset game to initial state
  resetGame: () => {
    set(initialState);
  },
}));
