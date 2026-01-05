/**
 * Tests for time tracking in the game store
 */

import { useGameStore } from '../store';

describe('Time Store Management', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState({
      currentScene: 'X-0-001',
      sceneHistory: [],
      currentPath: null,
      dayTime: null,
      inventory: [],
      relationships: {},
      discoveredCharacters: [],
      flags: [],
      evidence: [],
    });
  });

  describe('Initial State', () => {
    it('should start with no time set', () => {
      const state = useGameStore.getState();
      expect(state.dayTime).toBeNull();
    });

    it('should have dayTime in state', () => {
      const state = useGameStore.getState();
      expect(state).toHaveProperty('dayTime');
    });
  });

  describe('initializeTime', () => {
    it('should set time to day 1 morning', () => {
      useGameStore.getState().initializeTime();
      const dayTime = useGameStore.getState().dayTime;
      expect(dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
    });

    it('should work multiple times', () => {
      const { initializeTime, advanceToNextPeriod } = useGameStore.getState();

      initializeTime();
      advanceToNextPeriod();
      advanceToNextPeriod();

      // Re-initialize should reset to day 1 morning
      initializeTime();
      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
    });
  });

  describe('advanceToNextPeriod', () => {
    beforeEach(() => {
      useGameStore.getState().initializeTime();
    });

    it('should advance from morning to day', () => {
      useGameStore.getState().advanceToNextPeriod();
      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'day' });
    });

    it('should advance from day to evening', () => {
      const { advanceToNextPeriod } = useGameStore.getState();
      advanceToNextPeriod(); // morning -> day
      advanceToNextPeriod(); // day -> evening
      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'evening' });
    });

    it('should advance from evening to night', () => {
      const { advanceToNextPeriod } = useGameStore.getState();
      advanceToNextPeriod(); // morning -> day
      advanceToNextPeriod(); // day -> evening
      advanceToNextPeriod(); // evening -> night
      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'night' });
    });

    it('should advance from night to next day morning', () => {
      const { advanceToNextPeriod } = useGameStore.getState();
      advanceToNextPeriod(); // day 1 morning -> day
      advanceToNextPeriod(); // day -> evening
      advanceToNextPeriod(); // evening -> night
      advanceToNextPeriod(); // night -> day 2 morning
      expect(useGameStore.getState().dayTime).toEqual({ day: 2, timeOfDay: 'morning' });
    });

    it('should handle multiple day progressions', () => {
      const { advanceToNextPeriod } = useGameStore.getState();

      // Advance through entire day 1 and into day 2
      for (let i = 0; i < 8; i++) {
        advanceToNextPeriod();
      }

      // Should be at day 3 morning
      expect(useGameStore.getState().dayTime).toEqual({ day: 3, timeOfDay: 'morning' });
    });

    it('should set to null at end of day 6', () => {
      const { setDayTime, advanceToNextPeriod } = useGameStore.getState();

      setDayTime(6, 'night');
      advanceToNextPeriod();

      expect(useGameStore.getState().dayTime).toBeNull();
    });

    it('should do nothing when time is null', () => {
      useGameStore.setState({ dayTime: null });
      useGameStore.getState().advanceToNextPeriod();
      expect(useGameStore.getState().dayTime).toBeNull();
    });
  });

  describe('setDayTime', () => {
    it('should set specific day and time', () => {
      useGameStore.getState().setDayTime(3, 'evening');
      expect(useGameStore.getState().dayTime).toEqual({ day: 3, timeOfDay: 'evening' });
    });

    it('should set day 1 morning', () => {
      useGameStore.getState().setDayTime(1, 'morning');
      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
    });

    it('should set day 6 night', () => {
      useGameStore.getState().setDayTime(6, 'night');
      expect(useGameStore.getState().dayTime).toEqual({ day: 6, timeOfDay: 'night' });
    });

    it('should set to null for invalid day', () => {
      useGameStore.getState().setDayTime(7, 'morning');
      expect(useGameStore.getState().dayTime).toBeNull();
    });

    it('should allow changing existing time', () => {
      const { setDayTime } = useGameStore.getState();
      setDayTime(2, 'morning');
      setDayTime(4, 'evening');
      expect(useGameStore.getState().dayTime).toEqual({ day: 4, timeOfDay: 'evening' });
    });
  });

  describe('getDayTime', () => {
    it('should return null initially', () => {
      const dayTime = useGameStore.getState().getDayTime();
      expect(dayTime).toBeNull();
    });

    it('should return current time after initialization', () => {
      const { initializeTime, getDayTime } = useGameStore.getState();
      initializeTime();
      expect(getDayTime()).toEqual({ day: 1, timeOfDay: 'morning' });
    });

    it('should return updated time after advancing', () => {
      const { initializeTime, advanceToNextPeriod, getDayTime } = useGameStore.getState();
      initializeTime();
      advanceToNextPeriod();
      expect(getDayTime()).toEqual({ day: 1, timeOfDay: 'day' });
    });
  });

  describe('isTimeOfDay', () => {
    beforeEach(() => {
      useGameStore.getState().setDayTime(2, 'evening');
    });

    it('should return true for matching time of day', () => {
      expect(useGameStore.getState().isTimeOfDay('evening')).toBe(true);
    });

    it('should return false for non-matching time of day', () => {
      expect(useGameStore.getState().isTimeOfDay('morning')).toBe(false);
      expect(useGameStore.getState().isTimeOfDay('day')).toBe(false);
      expect(useGameStore.getState().isTimeOfDay('night')).toBe(false);
    });

    it('should return false when time is not set', () => {
      useGameStore.setState({ dayTime: null });
      expect(useGameStore.getState().isTimeOfDay('morning')).toBe(false);
    });

    it('should update when time changes', () => {
      const { setDayTime, isTimeOfDay } = useGameStore.getState();

      setDayTime(3, 'morning');
      expect(isTimeOfDay('morning')).toBe(true);

      setDayTime(3, 'night');
      expect(isTimeOfDay('night')).toBe(true);
      expect(isTimeOfDay('morning')).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('should reset time to null', () => {
      const { initializeTime, resetGame } = useGameStore.getState();
      initializeTime();
      resetGame();
      expect(useGameStore.getState().dayTime).toBeNull();
    });

    it('should clear time along with other state', () => {
      const { initializeTime, addItem, setFlag, setPath, resetGame } = useGameStore.getState();
      initializeTime();
      setPath('C');
      addItem('evidence_folder');
      setFlag('investigation_started');

      resetGame();

      const state = useGameStore.getState();
      expect(state.dayTime).toBeNull();
      expect(state.currentPath).toBeNull();
      expect(state.inventory).toEqual([]);
      expect(state.flags).toEqual([]);
    });
  });

  describe('Time Persistence', () => {
    it('should maintain time through scene transitions', () => {
      const { initializeTime, goToScene } = useGameStore.getState();
      initializeTime();
      goToScene('C-1-001');

      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
    });

    it('should maintain time through inventory changes', () => {
      const { setDayTime, addItem, removeItem } = useGameStore.getState();
      setDayTime(3, 'day');
      addItem('document');
      removeItem('document');

      expect(useGameStore.getState().dayTime).toEqual({ day: 3, timeOfDay: 'day' });
    });

    it('should maintain time through flag changes', () => {
      const { setDayTime, setFlag, unsetFlag } = useGameStore.getState();
      setDayTime(2, 'evening');
      setFlag('met_judge');
      unsetFlag('met_judge');

      expect(useGameStore.getState().dayTime).toEqual({ day: 2, timeOfDay: 'evening' });
    });

    it('should maintain time through evidence collection', () => {
      const { setDayTime, addEvidence } = useGameStore.getState();
      setDayTime(4, 'night');
      addEvidence('warden_ledger');
      addEvidence('guard_brutality_photos');

      expect(useGameStore.getState().dayTime).toEqual({ day: 4, timeOfDay: 'night' });
    });
  });

  describe('Path C Integration', () => {
    it('should initialize time when starting Path C', () => {
      const { setPath, initializeTime } = useGameStore.getState();
      setPath('C');
      initializeTime();

      expect(useGameStore.getState().currentPath).toBe('C');
      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
    });

    it('should allow time tracking independently of path', () => {
      const { initializeTime, setPath } = useGameStore.getState();
      initializeTime();

      // Path can be set after time
      setPath('C');

      expect(useGameStore.getState().dayTime).toEqual({ day: 1, timeOfDay: 'morning' });
      expect(useGameStore.getState().currentPath).toBe('C');
    });

    it('should support full Path C playthrough', () => {
      const { setPath, initializeTime, advanceToNextPeriod } = useGameStore.getState();

      setPath('C');
      initializeTime();

      // Simulate 3 days of gameplay (12 periods)
      for (let i = 0; i < 12; i++) {
        advanceToNextPeriod();
      }

      expect(useGameStore.getState().currentPath).toBe('C');
      expect(useGameStore.getState().dayTime).toEqual({ day: 4, timeOfDay: 'morning' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid time advancement', () => {
      const { initializeTime, advanceToNextPeriod } = useGameStore.getState();
      initializeTime();

      for (let i = 0; i < 100; i++) {
        advanceToNextPeriod();
      }

      // Should stop at null after day 6 night
      expect(useGameStore.getState().dayTime).toBeNull();
    });

    it('should handle time set to boundaries', () => {
      const { setDayTime } = useGameStore.getState();

      setDayTime(1, 'morning');
      expect(useGameStore.getState().dayTime).not.toBeNull();

      setDayTime(6, 'night');
      expect(useGameStore.getState().dayTime).not.toBeNull();
    });

    it('should handle invalid time settings gracefully', () => {
      const { setDayTime } = useGameStore.getState();

      setDayTime(0, 'morning');
      expect(useGameStore.getState().dayTime).toBeNull();

      setDayTime(7, 'evening');
      expect(useGameStore.getState().dayTime).toBeNull();
    });
  });
});
