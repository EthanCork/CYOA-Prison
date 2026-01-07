/**
 * Tests for new game initialization
 */

import { useGameStore } from '../store';
import { hasAutoSave, autoSave, deleteAutoSave } from '../saveGame';
import type { GameState } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('New Game Flow', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  describe('startNewGame', () => {
    it('should reset game to initial state', () => {
      const store = useGameStore.getState();

      // Make some progress
      store.goToScene('test-scene');
      store.addItem('test-item');
      store.setFlag('test-flag');
      store.changeRelationship('char1', 50);
      store.setPath('A');

      // Start new game
      store.startNewGame();

      // Verify reset to initial state
      expect(useGameStore.getState().currentScene).toBe('X-0-001');
      expect(useGameStore.getState().sceneHistory).toEqual([]);
      expect(useGameStore.getState().inventory).toEqual([]);
      expect(useGameStore.getState().flags).toEqual([]);
      expect(useGameStore.getState().relationships).toEqual({});
      expect(useGameStore.getState().currentPath).toBeNull();
    });

    it('should reset stats to initial values', () => {
      const store = useGameStore.getState();

      // Make some progress
      store.goToScene('scene-1');
      store.goToScene('scene-2');
      store.addItem('item-1');
      store.changeRelationship('char1', 100);

      // Start new game
      store.startNewGame();

      const stats = useGameStore.getState().stats;
      expect(stats.scenesVisited).toBe(0);
      expect(stats.choicesMade).toBe(0);
      expect(stats.itemsFound).toBe(0);
      expect(stats.relationshipsMaxed).toBe(0);
      expect(stats.relationshipsMinned).toBe(0);
      expect(stats.stageReached).toBe(0);
      expect(stats.pathTaken).toBeNull();
      expect(stats.playTimeSeconds).toBe(0);
    });

    it('should delete auto-save by default', () => {
      const store = useGameStore.getState();

      // Create auto-save
      store.goToScene('test-scene');
      store.performAutoSave();
      expect(hasAutoSave()).toBe(true);

      // Start new game (default: delete auto-save)
      store.startNewGame();

      expect(hasAutoSave()).toBe(false);
    });

    it('should keep auto-save when deleteAutoSave is false', () => {
      const store = useGameStore.getState();

      // Create auto-save
      store.goToScene('test-scene');
      store.performAutoSave();
      expect(hasAutoSave()).toBe(true);

      // Start new game without deleting auto-save
      store.startNewGame(false);

      expect(hasAutoSave()).toBe(true);
      expect(useGameStore.getState().currentScene).toBe('X-0-001');
    });

    it('should handle missing auto-save gracefully', () => {
      const store = useGameStore.getState();

      expect(hasAutoSave()).toBe(false);

      // Should not throw error
      expect(() => store.startNewGame()).not.toThrow();
      expect(useGameStore.getState().currentScene).toBe('X-0-001');
    });
  });

  describe('hasProgress', () => {
    it('should return false for initial state', () => {
      const store = useGameStore.getState();
      expect(store.hasProgress()).toBe(false);
    });

    it('should return true when scene has changed', () => {
      const store = useGameStore.getState();
      store.goToScene('different-scene');
      expect(store.hasProgress()).toBe(true);
    });

    it('should return true when scene history exists', () => {
      const store = useGameStore.getState();

      // Navigate away
      store.goToScene('other-scene');

      // Verify history was added and we have progress
      expect(useGameStore.getState().sceneHistory.length).toBeGreaterThan(0);
      expect(store.hasProgress()).toBe(true);
    });

    it('should return true when inventory has items', () => {
      const store = useGameStore.getState();
      store.addItem('test-item');
      expect(store.hasProgress()).toBe(true);
    });

    it('should return true when flags are set', () => {
      const store = useGameStore.getState();
      store.setFlag('test-flag');
      expect(store.hasProgress()).toBe(true);
    });

    it('should return true when relationships exist', () => {
      const store = useGameStore.getState();
      store.changeRelationship('char1', 10);
      expect(store.hasProgress()).toBe(true);
    });

    it('should return false after starting new game', () => {
      const store = useGameStore.getState();

      // Make progress
      store.goToScene('test-scene');
      store.addItem('test-item');
      expect(store.hasProgress()).toBe(true);

      // Reset
      store.startNewGame();
      expect(store.hasProgress()).toBe(false);
    });
  });

  describe('Integration tests', () => {
    it('should allow starting new game multiple times', () => {
      const store = useGameStore.getState();

      // First playthrough
      store.goToScene('scene-1');
      store.addItem('item-1');
      expect(store.hasProgress()).toBe(true);

      store.startNewGame();
      expect(store.hasProgress()).toBe(false);

      // Second playthrough
      store.goToScene('scene-2');
      store.addItem('item-2');
      expect(store.hasProgress()).toBe(true);

      store.startNewGame();
      expect(store.hasProgress()).toBe(false);
    });

    it('should not interfere with manual saves', () => {
      const store = useGameStore.getState();

      // Save to slot
      store.goToScene('manual-save-scene');
      store.saveToSlot(1);

      // Start new game
      store.startNewGame();
      expect(store.currentScene).toBe('X-0-001');

      // Load manual save should still work
      const loaded = store.loadFromSlot(1);
      expect(loaded).toBe(true);
      expect(useGameStore.getState().currentScene).toBe('manual-save-scene');
    });

    it('should preserve time and work assignment state on reset', () => {
      const store = useGameStore.getState();

      // Set Path C specific state
      store.setPath('C');
      store.initializeTime();
      store.setWorkAssignment('kitchen');

      // Start new game
      store.startNewGame();

      // Verify reset
      expect(useGameStore.getState().currentPath).toBeNull();
      expect(useGameStore.getState().dayTime).toBeNull();
      expect(useGameStore.getState().workAssignment).toBeNull();
    });

    it('should reset discovered characters', () => {
      const store = useGameStore.getState();

      store.discoverCharacter('char1');
      store.discoverCharacter('char2');
      expect(useGameStore.getState().discoveredCharacters.length).toBe(2);

      store.startNewGame();
      expect(useGameStore.getState().discoveredCharacters).toEqual([]);
    });

    it('should reset evidence', () => {
      const store = useGameStore.getState();

      store.addEvidence('evidence1');
      store.addEvidence('evidence2');
      expect(useGameStore.getState().evidence.length).toBe(2);

      store.startNewGame();
      expect(useGameStore.getState().evidence).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const store = useGameStore.getState();

      // Mock localStorage error
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('localStorage error');
      });

      // Create auto-save
      store.performAutoSave();

      // Should not throw, but log error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => store.startNewGame()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      // Restore
      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });
});
