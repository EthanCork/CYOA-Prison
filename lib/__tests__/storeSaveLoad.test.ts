/**
 * Tests for save/load integration with the game store
 */

import { useGameStore } from '../store';

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

describe('Game Store Save/Load Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  describe('saveToSlot', () => {
    it('should save current game state to a slot', () => {
      const store = useGameStore.getState();

      // Modify game state
      store.goToScene('scene-2');
      store.addItem('key');
      store.setFlag('found-key');
      store.changeRelationship('guard', 50);
      store.addEvidence('evidence-1');
      store.setPath('A');

      // Save to slot 1
      const savedGame = store.saveToSlot(1);

      expect(savedGame.gameState.currentScene).toBe('scene-2');
      expect(savedGame.gameState.inventory).toContain('key');
      expect(savedGame.gameState.flags).toContain('found-key');
      expect(savedGame.gameState.relationships['guard']).toBe(50);
      expect(savedGame.gameState.evidence).toContain('evidence-1');
      expect(savedGame.gameState.currentPath).toBe('A');
      expect(savedGame.metadata.slotNumber).toBe(1);
    });

    it('should include timestamp in save metadata', () => {
      const store = useGameStore.getState();
      const before = Date.now();
      const savedGame = store.saveToSlot(1);
      const after = Date.now();

      expect(savedGame.metadata.timestamp).toBeGreaterThanOrEqual(before);
      expect(savedGame.metadata.timestamp).toBeLessThanOrEqual(after);
      expect(savedGame.metadata.dateString).toBeTruthy();
    });

    it('should save complete game state including stats', () => {
      const store = useGameStore.getState();

      // Make some progress
      store.goToScene('scene-2');
      store.transitionToScene('scene-3');
      store.addItem('item-1');
      store.addItem('item-2');

      const savedGame = store.saveToSlot(2);

      expect(savedGame.gameState.stats.scenesVisited).toBeGreaterThan(0);
      expect(savedGame.gameState.stats.itemsFound).toBe(2);
    });

    it('should support multiple save slots', () => {
      const store = useGameStore.getState();

      // Save slot 1
      store.goToScene('scene-1');
      store.saveToSlot(1);

      // Save slot 2
      store.goToScene('scene-2');
      store.saveToSlot(2);

      // Save slot 3
      store.goToScene('scene-3');
      store.saveToSlot(3);

      // Verify all slots are saved
      expect(localStorage.getItem('el-palo-de-queso-save-1')).toBeTruthy();
      expect(localStorage.getItem('el-palo-de-queso-save-2')).toBeTruthy();
      expect(localStorage.getItem('el-palo-de-queso-save-3')).toBeTruthy();
    });
  });

  describe('loadFromSlot', () => {
    it('should load game state from a slot', () => {
      const store = useGameStore.getState();

      // Create and save a game state
      store.goToScene('saved-scene');
      store.addItem('saved-item');
      store.setFlag('saved-flag');
      store.changeRelationship('char1', 75);
      store.setPath('B');
      store.saveToSlot(1);

      // Reset game
      store.resetGame();
      expect(store.currentScene).toBe('X-0-001');
      expect(store.inventory).toEqual([]);

      // Load from slot
      const success = store.loadFromSlot(1);

      expect(success).toBe(true);
      const loadedState = useGameStore.getState();
      expect(loadedState.currentScene).toBe('saved-scene');
      expect(loadedState.inventory).toContain('saved-item');
      expect(loadedState.flags).toContain('saved-flag');
      expect(loadedState.relationships['char1']).toBe(75);
      expect(loadedState.currentPath).toBe('B');
    });

    it('should return false for empty slot', () => {
      const store = useGameStore.getState();
      const success = store.loadFromSlot(1);
      expect(success).toBe(false);
    });

    it('should load correct slot when multiple saves exist', () => {
      const store = useGameStore.getState();

      // Save different states to different slots
      store.goToScene('scene-1');
      store.saveToSlot(1);

      store.goToScene('scene-2');
      store.saveToSlot(2);

      store.goToScene('scene-3');
      store.saveToSlot(3);

      // Load from slot 2
      store.loadFromSlot(2);
      expect(useGameStore.getState().currentScene).toBe('scene-2');

      // Load from slot 1
      store.loadFromSlot(1);
      expect(useGameStore.getState().currentScene).toBe('scene-1');
    });

    it('should restore all game state properties', () => {
      const store = useGameStore.getState();

      // Set up complex game state
      store.goToScene('complex-scene');
      store.addItem('item1');
      store.addItem('item2');
      store.setFlag('flag1');
      store.setFlag('flag2');
      store.changeRelationship('char1', 50);
      store.changeRelationship('char2', -30);
      store.discoverCharacter('char1');
      store.discoverCharacter('char2');
      store.addEvidence('evidence1');
      store.setPath('C');
      store.initializeTime();

      store.saveToSlot(1);
      store.resetGame();

      // Load and verify all properties
      store.loadFromSlot(1);
      const loadedState = useGameStore.getState();

      expect(loadedState.currentScene).toBe('complex-scene');
      expect(loadedState.inventory).toEqual(['item1', 'item2']);
      expect(loadedState.flags).toEqual(['flag1', 'flag2']);
      expect(loadedState.relationships['char1']).toBe(50);
      expect(loadedState.relationships['char2']).toBe(-30);
      expect(loadedState.discoveredCharacters).toEqual(['char1', 'char2']);
      expect(loadedState.evidence).toEqual(['evidence1']);
      expect(loadedState.currentPath).toBe('C');
      expect(loadedState.dayTime).toBeTruthy();
    });
  });

  describe('deleteSlot', () => {
    it('should delete a saved game slot', () => {
      const store = useGameStore.getState();

      store.goToScene('scene-to-delete');
      store.saveToSlot(1);

      expect(localStorage.getItem('el-palo-de-queso-save-1')).toBeTruthy();

      store.deleteSlot(1);

      expect(localStorage.getItem('el-palo-de-queso-save-1')).toBeNull();
      expect(store.loadFromSlot(1)).toBe(false);
    });

    it('should not affect other slots when deleting', () => {
      const store = useGameStore.getState();

      store.saveToSlot(1);
      store.saveToSlot(2);
      store.saveToSlot(3);

      store.deleteSlot(2);

      expect(store.loadFromSlot(1)).toBe(true);
      expect(store.loadFromSlot(2)).toBe(false);
      expect(store.loadFromSlot(3)).toBe(true);
    });

    it('should not throw error when deleting empty slot', () => {
      const store = useGameStore.getState();
      expect(() => store.deleteSlot(1)).not.toThrow();
    });
  });

  describe('Save/Load workflow', () => {
    it('should handle complete save/load/delete workflow', () => {
      const store = useGameStore.getState();

      // Create game progress
      store.goToScene('progress-scene');
      store.addItem('progress-item');

      // Save to multiple slots
      store.saveToSlot(1);

      store.goToScene('later-scene');
      store.saveToSlot(2);

      // Load earlier save
      const loaded = store.loadFromSlot(1);
      expect(loaded).toBe(true);
      expect(useGameStore.getState().currentScene).toBe('progress-scene');

      // Delete save
      store.deleteSlot(1);
      expect(store.loadFromSlot(1)).toBe(false);

      // Slot 2 should still work
      expect(store.loadFromSlot(2)).toBe(true);
      expect(useGameStore.getState().currentScene).toBe('later-scene');
    });

    it('should preserve scene history when saving and loading', () => {
      const store = useGameStore.getState();

      store.goToScene('scene-1');
      store.goToScene('scene-2');
      store.goToScene('scene-3');

      store.saveToSlot(1);
      const historyAfterSave = [...useGameStore.getState().sceneHistory];

      store.resetGame();
      expect(useGameStore.getState().sceneHistory).toEqual([]);

      store.loadFromSlot(1);

      expect(useGameStore.getState().sceneHistory).toEqual(historyAfterSave);
    });
  });
});
