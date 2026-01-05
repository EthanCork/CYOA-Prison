/**
 * Tests for stats tracking in the game store
 */

import { useGameStore } from '../store';

describe('Stats Store Management', () => {
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
      stats: {
        scenesVisited: 0,
        choicesMade: 0,
        itemsFound: 0,
        relationshipsMaxed: 0,
        relationshipsMinned: 0,
        stageReached: 0,
        pathTaken: null,
        playTimeSeconds: 0,
      },
    });
  });

  describe('Initial State', () => {
    it('should start with zero stats', () => {
      const { stats } = useGameStore.getState();
      expect(stats.scenesVisited).toBe(0);
      expect(stats.choicesMade).toBe(0);
      expect(stats.itemsFound).toBe(0);
      expect(stats.relationshipsMaxed).toBe(0);
      expect(stats.relationshipsMinned).toBe(0);
      expect(stats.stageReached).toBe(0);
      expect(stats.pathTaken).toBeNull();
      expect(stats.playTimeSeconds).toBe(0);
    });

    it('should have stats object in state', () => {
      const state = useGameStore.getState();
      expect(state).toHaveProperty('stats');
      expect(typeof state.stats).toBe('object');
    });
  });

  describe('scenesVisited tracking', () => {
    it('should increment with goToScene', () => {
      const { goToScene } = useGameStore.getState();

      goToScene('scene-2');
      expect(useGameStore.getState().stats.scenesVisited).toBe(2); // X-0-001 + scene-2

      goToScene('scene-3');
      expect(useGameStore.getState().stats.scenesVisited).toBe(3);
    });

    it('should count unique scenes only', () => {
      const { goToScene } = useGameStore.getState();

      goToScene('scene-2');
      goToScene('scene-3');
      goToScene('scene-2'); // Revisit

      // Should only count unique scenes
      expect(useGameStore.getState().stats.scenesVisited).toBe(3);
    });

    it('should track scenes through transitionToScene', () => {
      const { transitionToScene } = useGameStore.getState();

      transitionToScene('scene-2');
      expect(useGameStore.getState().stats.scenesVisited).toBe(2);

      transitionToScene('scene-3');
      expect(useGameStore.getState().stats.scenesVisited).toBe(3);
    });

    it('should handle going back without duplicating count', () => {
      const { goToScene, goBack } = useGameStore.getState();

      goToScene('scene-2');
      goToScene('scene-3');
      goBack(); // Go back to scene-2

      // Scene count should remain same (only unique scenes)
      expect(useGameStore.getState().stats.scenesVisited).toBe(3);
    });
  });

  describe('choicesMade tracking', () => {
    it('should increment when choice is provided', () => {
      const { transitionToScene } = useGameStore.getState();

      const choice = {
        id: 'choice-1',
        text: 'Test choice',
        nextScene: 'scene-2',
      };

      transitionToScene('scene-2', undefined, choice);
      expect(useGameStore.getState().stats.choicesMade).toBe(1);
    });

    it('should not increment without choice', () => {
      const { transitionToScene } = useGameStore.getState();

      transitionToScene('scene-2');
      expect(useGameStore.getState().stats.choicesMade).toBe(0);
    });

    it('should accumulate multiple choices', () => {
      const { transitionToScene } = useGameStore.getState();

      const choice1 = {
        id: 'choice-1',
        text: 'Choice 1',
        nextScene: 'scene-2',
      };
      const choice2 = {
        id: 'choice-2',
        text: 'Choice 2',
        nextScene: 'scene-3',
      };

      transitionToScene('scene-2', undefined, choice1);
      transitionToScene('scene-3', undefined, choice2);

      expect(useGameStore.getState().stats.choicesMade).toBe(2);
    });
  });

  describe('itemsFound tracking', () => {
    it('should increment when adding new item', () => {
      const { addItem } = useGameStore.getState();

      addItem('key');
      expect(useGameStore.getState().stats.itemsFound).toBe(1);

      addItem('map');
      expect(useGameStore.getState().stats.itemsFound).toBe(2);
    });

    it('should not increment for duplicate items', () => {
      const { addItem } = useGameStore.getState();

      addItem('key');
      addItem('key'); // Try to add same item

      expect(useGameStore.getState().stats.itemsFound).toBe(1);
    });

    it('should not decrement when removing items', () => {
      const { addItem, removeItem } = useGameStore.getState();

      addItem('key');
      addItem('map');
      removeItem('key');

      // Should still show 2 items found historically
      expect(useGameStore.getState().stats.itemsFound).toBe(2);
      expect(useGameStore.getState().inventory).toEqual(['map']);
    });
  });

  describe('relationshipsMaxed tracking', () => {
    it('should track when relationship reaches 100', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('ally1', 100);
      expect(useGameStore.getState().stats.relationshipsMaxed).toBe(1);
    });

    it('should track multiple maxed relationships', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('ally1', 100);
      setRelationship('ally2', 100);

      expect(useGameStore.getState().stats.relationshipsMaxed).toBe(2);
    });

    it('should update count via changeRelationship', () => {
      const { changeRelationship } = useGameStore.getState();

      changeRelationship('ally1', 100);
      expect(useGameStore.getState().stats.relationshipsMaxed).toBe(1);
    });

    it('should not count relationships below 100', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('ally1', 99);
      setRelationship('ally2', 50);

      expect(useGameStore.getState().stats.relationshipsMaxed).toBe(0);
    });

    it('should decrease count if relationship drops below 100', () => {
      const { changeRelationship } = useGameStore.getState();

      changeRelationship('ally1', 100);
      expect(useGameStore.getState().stats.relationshipsMaxed).toBe(1);

      changeRelationship('ally1', -10); // Now at 90
      expect(useGameStore.getState().stats.relationshipsMaxed).toBe(0);
    });
  });

  describe('relationshipsMinned tracking', () => {
    it('should track when relationship reaches -100', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('enemy1', -100);
      expect(useGameStore.getState().stats.relationshipsMinned).toBe(1);
    });

    it('should track multiple minned relationships', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('enemy1', -100);
      setRelationship('enemy2', -100);

      expect(useGameStore.getState().stats.relationshipsMinned).toBe(2);
    });

    it('should update count via changeRelationship', () => {
      const { changeRelationship } = useGameStore.getState();

      changeRelationship('enemy1', -100);
      expect(useGameStore.getState().stats.relationshipsMinned).toBe(1);
    });

    it('should not count relationships above -100', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('enemy1', -99);
      setRelationship('enemy2', -50);

      expect(useGameStore.getState().stats.relationshipsMinned).toBe(0);
    });

    it('should track both maxed and minned independently', () => {
      const { setRelationship } = useGameStore.getState();

      setRelationship('ally1', 100);
      setRelationship('ally2', 100);
      setRelationship('enemy1', -100);

      const { stats } = useGameStore.getState();
      expect(stats.relationshipsMaxed).toBe(2);
      expect(stats.relationshipsMinned).toBe(1);
    });
  });

  describe('pathTaken tracking', () => {
    it('should track when path is set', () => {
      const { setPath } = useGameStore.getState();

      setPath('A');
      expect(useGameStore.getState().stats.pathTaken).toBe('A');
    });

    it('should update if path changes', () => {
      const { setPath } = useGameStore.getState();

      setPath('A');
      setPath('B');

      expect(useGameStore.getState().stats.pathTaken).toBe('B');
    });

    it('should track all paths', () => {
      const { setPath } = useGameStore.getState();

      setPath('A');
      expect(useGameStore.getState().stats.pathTaken).toBe('A');

      useGameStore.getState().resetGame();

      setPath('B');
      expect(useGameStore.getState().stats.pathTaken).toBe('B');

      useGameStore.getState().resetGame();

      setPath('C');
      expect(useGameStore.getState().stats.pathTaken).toBe('C');
    });
  });

  describe('stageReached tracking', () => {
    it('should track highest day reached', () => {
      const { setPath, initializeTime, advanceToNextPeriod } = useGameStore.getState();

      setPath('C');
      initializeTime();
      advanceToNextPeriod(); // Morning -> Day (still day 1)

      expect(useGameStore.getState().stats.stageReached).toBe(1);
    });

    it('should increase as days progress', () => {
      const { setPath, initializeTime, advanceToNextPeriod } = useGameStore.getState();

      setPath('C');
      initializeTime(); // Day 1 Morning

      // Advance through Day 1
      advanceToNextPeriod(); // Day
      advanceToNextPeriod(); // Evening
      advanceToNextPeriod(); // Night
      advanceToNextPeriod(); // Day 2 Morning

      expect(useGameStore.getState().stats.stageReached).toBe(2);
    });

    it('should track maximum day reached', () => {
      const { setPath, initializeTime, advanceToNextPeriod } = useGameStore.getState();

      setPath('C');
      initializeTime();

      // Progress to day 3
      for (let i = 0; i < 8; i++) {
        advanceToNextPeriod();
      }

      expect(useGameStore.getState().stats.stageReached).toBe(3);
    });

    it('should not decrease if time not advanced', () => {
      const { setPath, initializeTime, setDayTime, advanceToNextPeriod } =
        useGameStore.getState();

      setPath('C');
      initializeTime();

      // Advance to day 3
      for (let i = 0; i < 8; i++) {
        advanceToNextPeriod();
      }

      const stage = useGameStore.getState().stats.stageReached;
      expect(stage).toBe(3);

      // Manually set back to day 1 (edge case)
      setDayTime(1, 'morning');

      // stageReached should still be 3 (maximum reached)
      expect(useGameStore.getState().stats.stageReached).toBe(3);
    });

    it('should reach maximum of 6', () => {
      const { setPath, initializeTime, advanceToNextPeriod } = useGameStore.getState();

      setPath('C');
      initializeTime();

      // Advance through all days
      for (let i = 0; i < 24; i++) {
        advanceToNextPeriod();
      }

      expect(useGameStore.getState().stats.stageReached).toBe(6);
    });
  });

  describe('resetGame', () => {
    it('should reset all stats', () => {
      const {
        addItem,
        setRelationship,
        setPath,
        initializeTime,
        advanceToNextPeriod,
        resetGame,
        transitionToScene,
      } = useGameStore.getState();

      // Build up stats
      transitionToScene('scene-2');
      addItem('key');
      setRelationship('ally1', 100);
      setRelationship('enemy1', -100);
      setPath('A');
      initializeTime();
      advanceToNextPeriod();

      const choice = {
        id: 'choice-1',
        text: 'Test',
        nextScene: 'scene-3',
      };
      transitionToScene('scene-3', undefined, choice);

      // Verify stats were tracked
      let stats = useGameStore.getState().stats;
      expect(stats.scenesVisited).toBeGreaterThan(0);
      expect(stats.choicesMade).toBeGreaterThan(0);
      expect(stats.itemsFound).toBeGreaterThan(0);
      expect(stats.relationshipsMaxed).toBeGreaterThan(0);
      expect(stats.relationshipsMinned).toBeGreaterThan(0);
      expect(stats.pathTaken).toBe('A');

      // Reset
      resetGame();

      // All stats should be back to zero
      stats = useGameStore.getState().stats;
      expect(stats.scenesVisited).toBe(0);
      expect(stats.choicesMade).toBe(0);
      expect(stats.itemsFound).toBe(0);
      expect(stats.relationshipsMaxed).toBe(0);
      expect(stats.relationshipsMinned).toBe(0);
      expect(stats.stageReached).toBe(0);
      expect(stats.pathTaken).toBeNull();
    });
  });

  describe('Integration scenarios', () => {
    it('should track comprehensive gameplay session', () => {
      const {
        goToScene,
        addItem,
        changeRelationship,
        setPath,
        initializeTime,
        advanceToNextPeriod,
        transitionToScene,
      } = useGameStore.getState();

      // Start Path C
      setPath('C');
      initializeTime();

      // Make some choices and progress
      const choice1 = { id: 'c1', text: 'Choice 1', nextScene: 'C-1-001' };
      transitionToScene('C-1-001', undefined, choice1);

      // Find items
      addItem('map');
      addItem('key');

      // Build relationships
      changeRelationship('guard1', 50);
      changeRelationship('inmate1', 100); // Max out

      // Advance time
      advanceToNextPeriod();
      advanceToNextPeriod();

      // Make another choice
      const choice2 = { id: 'c2', text: 'Choice 2', nextScene: 'C-1-002' };
      transitionToScene('C-1-002', undefined, choice2);

      // Check all stats
      const stats = useGameStore.getState().stats;
      expect(stats.scenesVisited).toBe(3); // X-0-001, C-1-001, C-1-002
      expect(stats.choicesMade).toBe(2);
      expect(stats.itemsFound).toBe(2);
      expect(stats.relationshipsMaxed).toBe(1);
      expect(stats.relationshipsMinned).toBe(0);
      expect(stats.pathTaken).toBe('C');
      expect(stats.stageReached).toBe(1);
    });

    it('should maintain stats across multiple scene transitions', () => {
      const { transitionToScene } = useGameStore.getState();

      const scenes = ['scene-1', 'scene-2', 'scene-3', 'scene-4', 'scene-5'];

      scenes.forEach((sceneId) => {
        const choice = {
          id: `choice-${sceneId}`,
          text: `Go to ${sceneId}`,
          nextScene: sceneId,
        };
        transitionToScene(sceneId, undefined, choice);
      });

      const stats = useGameStore.getState().stats;
      expect(stats.scenesVisited).toBe(6); // initial + 5 scenes
      expect(stats.choicesMade).toBe(5);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid state changes', () => {
      const { addItem, changeRelationship } = useGameStore.getState();

      // Add many items quickly
      for (let i = 0; i < 10; i++) {
        addItem(`item-${i}`);
      }

      // Change many relationships quickly
      for (let i = 0; i < 5; i++) {
        changeRelationship(`char-${i}`, 100);
      }

      const stats = useGameStore.getState().stats;
      expect(stats.itemsFound).toBe(10);
      expect(stats.relationshipsMaxed).toBe(5);
    });

    it('should handle stats without optional playTimeSeconds', () => {
      const stats = useGameStore.getState().stats;
      // Should have playTimeSeconds initialized
      expect(stats).toHaveProperty('playTimeSeconds');
    });
  });
});
