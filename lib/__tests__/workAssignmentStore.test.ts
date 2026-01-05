/**
 * Tests for work assignment management in the game store
 */

import { useGameStore } from '../store';

describe('Work Assignment Store Management', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState({
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
    });
  });

  describe('Initial State', () => {
    it('should start with no work assignment', () => {
      const state = useGameStore.getState();
      expect(state.workAssignment).toBeNull();
    });

    it('should have workAssignment in state', () => {
      const state = useGameStore.getState();
      expect(state).toHaveProperty('workAssignment');
    });
  });

  describe('setWorkAssignment', () => {
    it('should set kitchen assignment', () => {
      useGameStore.getState().setWorkAssignment('kitchen');
      expect(useGameStore.getState().workAssignment).toBe('kitchen');
    });

    it('should set laundry assignment', () => {
      useGameStore.getState().setWorkAssignment('laundry');
      expect(useGameStore.getState().workAssignment).toBe('laundry');
    });

    it('should set yard assignment', () => {
      useGameStore.getState().setWorkAssignment('yard');
      expect(useGameStore.getState().workAssignment).toBe('yard');
    });

    it('should set infirmary assignment', () => {
      useGameStore.getState().setWorkAssignment('infirmary');
      expect(useGameStore.getState().workAssignment).toBe('infirmary');
    });

    it('should set chapel assignment', () => {
      useGameStore.getState().setWorkAssignment('chapel');
      expect(useGameStore.getState().workAssignment).toBe('chapel');
    });

    it('should set library assignment', () => {
      useGameStore.getState().setWorkAssignment('library');
      expect(useGameStore.getState().workAssignment).toBe('library');
    });

    it('should allow changing assignment', () => {
      const { setWorkAssignment } = useGameStore.getState();
      setWorkAssignment('kitchen');
      expect(useGameStore.getState().workAssignment).toBe('kitchen');

      setWorkAssignment('library');
      expect(useGameStore.getState().workAssignment).toBe('library');
    });

    it('should persist assignment through other state changes', () => {
      const { setWorkAssignment, setFlag } = useGameStore.getState();
      setWorkAssignment('infirmary');
      setFlag('test_flag');

      expect(useGameStore.getState().workAssignment).toBe('infirmary');
    });
  });

  describe('getWorkAssignment', () => {
    it('should return null initially', () => {
      const assignment = useGameStore.getState().getWorkAssignment();
      expect(assignment).toBeNull();
    });

    it('should return current assignment after setting', () => {
      const { setWorkAssignment, getWorkAssignment } = useGameStore.getState();
      setWorkAssignment('yard');
      expect(getWorkAssignment()).toBe('yard');
    });

    it('should return updated assignment after changing', () => {
      const { setWorkAssignment, getWorkAssignment } = useGameStore.getState();
      setWorkAssignment('kitchen');
      setWorkAssignment('chapel');
      expect(getWorkAssignment()).toBe('chapel');
    });
  });

  describe('hasWorkAssignment', () => {
    it('should return false when no assignment is set', () => {
      const { hasWorkAssignment } = useGameStore.getState();
      expect(hasWorkAssignment()).toBe(false);
    });

    it('should return true when assignment is set', () => {
      const { setWorkAssignment, hasWorkAssignment } = useGameStore.getState();
      setWorkAssignment('library');
      expect(hasWorkAssignment()).toBe(true);
    });

    it('should update when assignment changes', () => {
      const { setWorkAssignment, hasWorkAssignment } = useGameStore.getState();
      expect(hasWorkAssignment()).toBe(false);

      setWorkAssignment('laundry');
      expect(hasWorkAssignment()).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('should reset assignment to null', () => {
      const { setWorkAssignment, resetGame } = useGameStore.getState();
      setWorkAssignment('kitchen');
      resetGame();

      expect(useGameStore.getState().workAssignment).toBeNull();
    });

    it('should clear assignment along with other state', () => {
      const { setWorkAssignment, addItem, setFlag, setPath, resetGame } = useGameStore.getState();
      setWorkAssignment('infirmary');
      setPath('C');
      addItem('medical_supplies');
      setFlag('assignment_started');

      resetGame();

      const state = useGameStore.getState();
      expect(state.workAssignment).toBeNull();
      expect(state.currentPath).toBeNull();
      expect(state.inventory).toEqual([]);
      expect(state.flags).toEqual([]);
    });
  });

  describe('Assignment Persistence', () => {
    it('should maintain assignment through scene transitions', () => {
      const { setWorkAssignment, goToScene } = useGameStore.getState();
      setWorkAssignment('yard');
      goToScene('C-1-005');

      expect(useGameStore.getState().workAssignment).toBe('yard');
    });

    it('should maintain assignment through inventory changes', () => {
      const { setWorkAssignment, addItem, removeItem } = useGameStore.getState();
      setWorkAssignment('kitchen');
      addItem('kitchen_knife');
      removeItem('kitchen_knife');

      expect(useGameStore.getState().workAssignment).toBe('kitchen');
    });

    it('should maintain assignment through flag changes', () => {
      const { setWorkAssignment, setFlag, unsetFlag } = useGameStore.getState();
      setWorkAssignment('chapel');
      setFlag('met_chaplain');
      unsetFlag('met_chaplain');

      expect(useGameStore.getState().workAssignment).toBe('chapel');
    });

    it('should maintain assignment through time changes', () => {
      const { setWorkAssignment, initializeTime, advanceToNextPeriod } = useGameStore.getState();
      setWorkAssignment('library');
      initializeTime();
      advanceToNextPeriod();

      expect(useGameStore.getState().workAssignment).toBe('library');
    });
  });

  describe('Path C Integration', () => {
    it('should set assignment when on Path C', () => {
      const { setPath, setWorkAssignment } = useGameStore.getState();
      setPath('C');
      setWorkAssignment('library');

      expect(useGameStore.getState().currentPath).toBe('C');
      expect(useGameStore.getState().workAssignment).toBe('library');
    });

    it('should allow setting assignment before path', () => {
      const { setWorkAssignment, setPath } = useGameStore.getState();
      setWorkAssignment('infirmary');
      setPath('C');

      expect(useGameStore.getState().workAssignment).toBe('infirmary');
      expect(useGameStore.getState().currentPath).toBe('C');
    });

    it('should support Day 1 assignment selection', () => {
      const { setPath, initializeTime, setWorkAssignment } = useGameStore.getState();

      setPath('C');
      initializeTime(); // Day 1, Morning
      setWorkAssignment('yard');

      const state = useGameStore.getState();
      expect(state.currentPath).toBe('C');
      expect(state.dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
      expect(state.workAssignment).toBe('yard');
    });
  });

  describe('Assignment Workflow', () => {
    it('should simulate typical Day 1 selection flow', () => {
      const { setPath, initializeTime, setWorkAssignment, getWorkAssignment, hasWorkAssignment } =
        useGameStore.getState();

      // Start Path C
      setPath('C');
      initializeTime();

      // Initially no assignment
      expect(hasWorkAssignment()).toBe(false);

      // Player selects assignment
      setWorkAssignment('kitchen');

      // Assignment is now set
      expect(hasWorkAssignment()).toBe(true);
      expect(getWorkAssignment()).toBe('kitchen');
    });

    it('should maintain assignment throughout gameplay', () => {
      const {
        setPath,
        initializeTime,
        setWorkAssignment,
        advanceToNextPeriod,
        addItem,
        addEvidence,
      } = useGameStore.getState();

      // Set up game
      setPath('C');
      initializeTime();
      setWorkAssignment('library');

      // Simulate Day 1 progression
      addItem('legal_books');
      advanceToNextPeriod(); // Morning -> Day

      // Assignment persists
      expect(useGameStore.getState().workAssignment).toBe('library');

      // Continue into Day 2
      advanceToNextPeriod(); // Day -> Evening
      advanceToNextPeriod(); // Evening -> Night
      advanceToNextPeriod(); // Night -> Day 2 Morning

      addEvidence('warden_ledger');

      // Assignment still persists
      expect(useGameStore.getState().workAssignment).toBe('library');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple assignment changes', () => {
      const { setWorkAssignment } = useGameStore.getState();

      setWorkAssignment('kitchen');
      setWorkAssignment('laundry');
      setWorkAssignment('yard');
      setWorkAssignment('library');

      expect(useGameStore.getState().workAssignment).toBe('library');
    });

    it('should work with all 6 assignments', () => {
      const { setWorkAssignment, getWorkAssignment } = useGameStore.getState();
      const assignments = ['kitchen', 'laundry', 'yard', 'infirmary', 'chapel', 'library'] as const;

      assignments.forEach((assignment) => {
        setWorkAssignment(assignment);
        expect(getWorkAssignment()).toBe(assignment);
      });
    });
  });
});
