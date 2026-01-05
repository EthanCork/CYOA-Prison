/**
 * Tests for path tracking in the game store
 */

import { useGameStore } from '../store';

describe('Path Store Management', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState({
      currentScene: 'X-0-001',
      sceneHistory: [],
      currentPath: null,
      inventory: [],
      relationships: {},
      discoveredCharacters: [],
      flags: [],
      evidence: [],
    });
  });

  describe('Initial State', () => {
    it('should start with no path selected', () => {
      const state = useGameStore.getState();
      expect(state.currentPath).toBeNull();
    });

    it('should have currentPath in state', () => {
      const state = useGameStore.getState();
      expect(state).toHaveProperty('currentPath');
    });
  });

  describe('setPath', () => {
    it('should set Path A', () => {
      useGameStore.getState().setPath('A');
      expect(useGameStore.getState().currentPath).toBe('A');
    });

    it('should set Path B', () => {
      useGameStore.getState().setPath('B');
      expect(useGameStore.getState().currentPath).toBe('B');
    });

    it('should set Path C', () => {
      useGameStore.getState().setPath('C');
      expect(useGameStore.getState().currentPath).toBe('C');
    });

    it('should allow changing paths', () => {
      const { setPath } = useGameStore.getState();
      setPath('A');
      expect(useGameStore.getState().currentPath).toBe('A');

      setPath('B');
      expect(useGameStore.getState().currentPath).toBe('B');

      setPath('C');
      expect(useGameStore.getState().currentPath).toBe('C');
    });

    it('should persist path after other state changes', () => {
      const { setPath, setFlag } = useGameStore.getState();
      setPath('A');
      setFlag('test_flag');

      expect(useGameStore.getState().currentPath).toBe('A');
    });
  });

  describe('getPath', () => {
    it('should return null initially', () => {
      const path = useGameStore.getState().getPath();
      expect(path).toBeNull();
    });

    it('should return current path after setting', () => {
      const { setPath, getPath } = useGameStore.getState();
      setPath('A');
      expect(getPath()).toBe('A');
    });

    it('should return updated path after changing', () => {
      const { setPath, getPath } = useGameStore.getState();
      setPath('A');
      setPath('B');
      expect(getPath()).toBe('B');
    });
  });

  describe('isOnPath', () => {
    it('should return false when no path is set', () => {
      const { isOnPath } = useGameStore.getState();
      expect(isOnPath('A')).toBe(false);
      expect(isOnPath('B')).toBe(false);
      expect(isOnPath('C')).toBe(false);
    });

    it('should return true for matching path', () => {
      const { setPath, isOnPath } = useGameStore.getState();
      setPath('A');
      expect(isOnPath('A')).toBe(true);
    });

    it('should return false for non-matching paths', () => {
      const { setPath, isOnPath } = useGameStore.getState();
      setPath('A');
      expect(isOnPath('B')).toBe(false);
      expect(isOnPath('C')).toBe(false);
    });

    it('should update when path changes', () => {
      const { setPath, isOnPath } = useGameStore.getState();
      setPath('A');
      expect(isOnPath('A')).toBe(true);
      expect(isOnPath('B')).toBe(false);

      setPath('B');
      expect(isOnPath('A')).toBe(false);
      expect(isOnPath('B')).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('should reset path to null', () => {
      const { setPath, resetGame } = useGameStore.getState();
      setPath('A');
      resetGame();

      expect(useGameStore.getState().currentPath).toBeNull();
    });

    it('should clear path along with other state', () => {
      const { setPath, addItem, setFlag, resetGame } = useGameStore.getState();
      setPath('B');
      addItem('lockpick');
      setFlag('met_bastian');

      resetGame();

      const state = useGameStore.getState();
      expect(state.currentPath).toBeNull();
      expect(state.inventory).toEqual([]);
      expect(state.flags).toEqual([]);
    });
  });

  describe('Path Persistence', () => {
    it('should maintain path through scene transitions', () => {
      const { setPath, goToScene } = useGameStore.getState();
      setPath('A');
      goToScene('A-1-001');

      expect(useGameStore.getState().currentPath).toBe('A');
    });

    it('should maintain path through inventory changes', () => {
      const { setPath, addItem, removeItem } = useGameStore.getState();
      setPath('B');
      addItem('guard_uniform');
      removeItem('guard_uniform');

      expect(useGameStore.getState().currentPath).toBe('B');
    });

    it('should maintain path through relationship changes', () => {
      const { setPath, changeRelationship } = useGameStore.getState();
      setPath('C');
      changeRelationship('bastian', 10);
      changeRelationship('rosa', -5);

      expect(useGameStore.getState().currentPath).toBe('C');
    });

    it('should maintain path through flag changes', () => {
      const { setPath, setFlag, unsetFlag } = useGameStore.getState();
      setPath('A');
      setFlag('night_access');
      unsetFlag('night_access');

      expect(useGameStore.getState().currentPath).toBe('A');
    });

    it('should maintain path through evidence collection', () => {
      const { setPath, addEvidence } = useGameStore.getState();
      setPath('C');
      addEvidence('warden_ledger');
      addEvidence('guard_brutality_photos');

      expect(useGameStore.getState().currentPath).toBe('C');
    });
  });

  describe('Path Integration with Game Flow', () => {
    it('should allow setting path at selection scene', () => {
      const { goToScene, setPath } = useGameStore.getState();
      goToScene('X-0-014'); // Path selection scene
      setPath('A');

      expect(useGameStore.getState().currentPath).toBe('A');
      expect(useGameStore.getState().currentScene).toBe('X-0-014');
    });

    it('should track path selection in game flow', () => {
      const { goToScene, setPath } = useGameStore.getState();

      // Progress through prologue
      goToScene('X-0-001');
      goToScene('X-0-002');
      goToScene('X-0-014'); // Reach path selection

      expect(useGameStore.getState().currentPath).toBeNull();

      setPath('B'); // Choose social path

      expect(useGameStore.getState().currentPath).toBe('B');
      expect(useGameStore.getState().sceneHistory.length).toBeGreaterThan(0);
    });

    it('should support full playthrough on single path', () => {
      const { setPath, goToScene } = useGameStore.getState();

      // Start game
      goToScene('X-0-001');

      // Reach path selection
      goToScene('X-0-014');
      setPath('A');

      // Continue on Path A
      goToScene('A-1-001');
      goToScene('A-1-002');
      goToScene('A-2-001');

      // Path should remain consistent
      expect(useGameStore.getState().currentPath).toBe('A');
    });
  });

  describe('Path State Validation', () => {
    it('should only accept valid path values', () => {
      const { setPath } = useGameStore.getState();

      setPath('A');
      expect(useGameStore.getState().currentPath).toBe('A');

      setPath('B');
      expect(useGameStore.getState().currentPath).toBe('B');

      setPath('C');
      expect(useGameStore.getState().currentPath).toBe('C');
    });

    it('should handle path as nullable value', () => {
      const { setPath, getPath } = useGameStore.getState();
      expect(getPath()).toBeNull();

      setPath('A');
      expect(useGameStore.getState().currentPath).toBe('A');
    });
  });
});
