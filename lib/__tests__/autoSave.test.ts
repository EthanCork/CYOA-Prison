/**
 * Tests for auto-save functionality
 */

import { useGameStore } from '../store';
import {
  autoSave,
  loadAutoSave,
  hasAutoSave,
  deleteAutoSave,
  AUTO_SAVE_SLOT,
} from '../saveGame';
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

describe('Auto-Save System', () => {
  const mockGameState: GameState = {
    currentScene: 'test-scene',
    sceneHistory: ['prev-scene'],
    currentPath: 'A',
    dayTime: null,
    workAssignment: null,
    inventory: ['item1'],
    relationships: { char1: 50 },
    discoveredCharacters: ['char1'],
    flags: ['flag1'],
    evidence: ['evidence1'],
    stats: {
      scenesVisited: 10,
      choicesMade: 5,
      itemsFound: 1,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 1,
      pathTaken: 'A',
      playTimeSeconds: 120,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  describe('autoSave', () => {
    it('should save game state to auto-save slot', () => {
      const result = autoSave(mockGameState);

      expect(result.gameState).toEqual(mockGameState);
      expect(result.metadata.slotNumber).toBe(0); // Auto-save uses slot 0
      expect(result.metadata.currentScene).toBe('test-scene');
      expect(result.version).toBe('1.0.0');
    });

    it('should save to separate localStorage key', () => {
      autoSave(mockGameState);

      const key = `el-palo-de-queso-save-${AUTO_SAVE_SLOT}`;
      const saved = localStorage.getItem(key);

      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed.gameState.currentScene).toBe('test-scene');
    });

    it('should include timestamp in auto-save', () => {
      const before = Date.now();
      const result = autoSave(mockGameState);
      const after = Date.now();

      expect(result.metadata.timestamp).toBeGreaterThanOrEqual(before);
      expect(result.metadata.timestamp).toBeLessThanOrEqual(after);
      expect(result.metadata.dateString).toBeTruthy();
    });

    it('should overwrite previous auto-save', () => {
      const state1 = { ...mockGameState, currentScene: 'scene-1' };
      const state2 = { ...mockGameState, currentScene: 'scene-2' };

      autoSave(state1);
      autoSave(state2);

      const loaded = loadAutoSave();
      expect(loaded?.gameState.currentScene).toBe('scene-2');
    });
  });

  describe('loadAutoSave', () => {
    it('should load auto-saved game state', () => {
      autoSave(mockGameState);
      const loaded = loadAutoSave();

      expect(loaded).not.toBeNull();
      expect(loaded?.gameState).toEqual(mockGameState);
    });

    it('should return null if no auto-save exists', () => {
      const loaded = loadAutoSave();
      expect(loaded).toBeNull();
    });

    it('should not interfere with manual saves', () => {
      // Save to manual slot
      const store = useGameStore.getState();
      store.goToScene('manual-scene');
      store.saveToSlot(1);

      // Auto-save different state
      store.goToScene('auto-scene');
      store.performAutoSave();

      // Load manual save should still work
      store.loadFromSlot(1);
      expect(useGameStore.getState().currentScene).toBe('manual-scene');

      // Load auto-save should also work
      store.loadFromAutoSave();
      expect(useGameStore.getState().currentScene).toBe('auto-scene');
    });
  });

  describe('hasAutoSave', () => {
    it('should return false when no auto-save exists', () => {
      expect(hasAutoSave()).toBe(false);
    });

    it('should return true when auto-save exists', () => {
      autoSave(mockGameState);
      expect(hasAutoSave()).toBe(true);
    });
  });

  describe('deleteAutoSave', () => {
    it('should delete auto-save', () => {
      autoSave(mockGameState);
      expect(hasAutoSave()).toBe(true);

      deleteAutoSave();
      expect(hasAutoSave()).toBe(false);
    });

    it('should not delete manual saves', () => {
      const store = useGameStore.getState();
      store.saveToSlot(1);
      autoSave(mockGameState);

      deleteAutoSave();

      // Manual save should still exist
      const loaded = store.loadFromSlot(1);
      expect(loaded).toBe(true);
    });
  });

  describe('Store integration', () => {
    it('should auto-save through store', () => {
      const store = useGameStore.getState();
      store.goToScene('store-test-scene');
      store.addItem('store-item');

      const result = store.performAutoSave();

      expect(result.gameState.currentScene).toBe('store-test-scene');
      expect(result.gameState.inventory).toContain('store-item');
    });

    it('should load auto-save through store', () => {
      const store = useGameStore.getState();
      store.goToScene('saved-scene');
      store.performAutoSave();

      store.resetGame();
      expect(store.currentScene).toBe('X-0-001');

      const success = store.loadFromAutoSave();
      expect(success).toBe(true);
      expect(useGameStore.getState().currentScene).toBe('saved-scene');
    });

    it('should check auto-save exists through store', () => {
      const store = useGameStore.getState();

      expect(store.hasAutoSaveData()).toBe(false);

      store.performAutoSave();

      expect(store.hasAutoSaveData()).toBe(true);
    });
  });

  describe('Auto-save vs Manual Save separation', () => {
    it('should not overwrite manual saves', () => {
      const store = useGameStore.getState();

      // Save to manual slot 1
      store.goToScene('manual-1');
      store.saveToSlot(1);

      // Save to manual slot 2
      store.goToScene('manual-2');
      store.saveToSlot(2);

      // Auto-save
      store.goToScene('auto-save');
      store.performAutoSave();

      // All should be independent
      store.loadFromSlot(1);
      expect(useGameStore.getState().currentScene).toBe('manual-1');

      store.loadFromSlot(2);
      expect(useGameStore.getState().currentScene).toBe('manual-2');

      store.loadFromAutoSave();
      expect(useGameStore.getState().currentScene).toBe('auto-save');
    });

    it('should use separate localStorage keys', () => {
      const store = useGameStore.getState();

      store.goToScene('manual');
      store.saveToSlot(1);

      store.goToScene('auto');
      store.performAutoSave();

      // Check separate keys exist
      expect(localStorage.getItem('el-palo-de-queso-save-1')).toBeTruthy();
      expect(localStorage.getItem('el-palo-de-queso-save-auto')).toBeTruthy();
    });
  });

  describe('Metadata tracking', () => {
    it('should track auto-save metadata', () => {
      const store = useGameStore.getState();
      store.goToScene('metadata-test');
      store.setPath('B');

      const result = store.performAutoSave();

      expect(result.metadata.currentScene).toBe('metadata-test');
      expect(result.metadata.currentPath).toBe('B');
      expect(result.metadata.timestamp).toBeGreaterThan(0);
    });

    it('should update metadata on each auto-save', async () => {
      const store = useGameStore.getState();

      store.goToScene('scene-1');
      const save1 = store.performAutoSave();

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      store.goToScene('scene-2');
      const save2 = store.performAutoSave();

      expect(save2.metadata.timestamp).toBeGreaterThan(save1.metadata.timestamp);
      expect(save2.metadata.currentScene).toBe('scene-2');
    });
  });
});
