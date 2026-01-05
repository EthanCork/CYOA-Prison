/**
 * Tests for relationship state management
 * Phase 2 - Step 19: Relationship State Setup
 */

import { useGameStore } from '../store';
import {
  loadAllCharacters,
  getCharacterById,
  getInitialRelationships,
  getRelationshipStatus,
  getAllCharacterIds,
} from '../characterLoader';

describe('Relationship State Management', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetGame();
  });

  describe('Initial NPC Setup', () => {
    it('should have 6 NPCs defined', () => {
      const characters = loadAllCharacters();
      expect(characters).toHaveLength(6);
    });

    it('should have all required NPCs with correct IDs', () => {
      const characterIds = getAllCharacterIds();

      expect(characterIds).toContain('bastian');
      expect(characterIds).toContain('marcel');
      expect(characterIds).toContain('viktor');
      expect(characterIds).toContain('denis');
      expect(characterIds).toContain('emile');
      expect(characterIds).toContain('dr_moreau');
    });

    it('should have correct initial relationship scores', () => {
      const bastian = getCharacterById('bastian');
      const marcel = getCharacterById('marcel');
      const viktor = getCharacterById('viktor');
      const denis = getCharacterById('denis');
      const emile = getCharacterById('emile');
      const drMoreau = getCharacterById('dr_moreau');

      expect(bastian?.initialRelationship).toBe(30);
      expect(marcel?.initialRelationship).toBe(0);
      expect(viktor?.initialRelationship).toBe(-20);
      expect(denis?.initialRelationship).toBe(20);
      expect(emile?.initialRelationship).toBe(-50);
      expect(drMoreau?.initialRelationship).toBe(0);
    });

    it('should have all NPCs with required fields', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char).toHaveProperty('id');
        expect(char).toHaveProperty('name');
        expect(char).toHaveProperty('initialRelationship');
        expect(char).toHaveProperty('description');
        expect(char).toHaveProperty('role');
        expect(char).toHaveProperty('location');
        expect(char).toHaveProperty('traits');
        expect(char).toHaveProperty('background');
      });
    });
  });

  describe('changeRelationship', () => {
    it('should increase relationship score', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('bastian', 10);

      expect(getRelationship('bastian')).toBe(10);
    });

    it('should decrease relationship score', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('viktor', -15);

      expect(getRelationship('viktor')).toBe(-15);
    });

    it('should accumulate relationship changes', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('denis', 10);
      changeRelationship('denis', 5);
      changeRelationship('denis', -3);

      expect(getRelationship('denis')).toBe(12);
    });

    it('should cap relationship at 100', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('bastian', 80);
      changeRelationship('bastian', 50); // Would be 130, capped at 100

      expect(getRelationship('bastian')).toBe(100);
    });

    it('should cap relationship at -100', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('emile', -60);
      changeRelationship('emile', -50); // Would be -110, capped at -100

      expect(getRelationship('emile')).toBe(-100);
    });

    it('should handle relationships for all 6 NPCs', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('bastian', 5);
      changeRelationship('marcel', 10);
      changeRelationship('viktor', -10);
      changeRelationship('denis', 15);
      changeRelationship('emile', -20);
      changeRelationship('dr_moreau', 8);

      expect(getRelationship('bastian')).toBe(5);
      expect(getRelationship('marcel')).toBe(10);
      expect(getRelationship('viktor')).toBe(-10);
      expect(getRelationship('denis')).toBe(15);
      expect(getRelationship('emile')).toBe(-20);
      expect(getRelationship('dr_moreau')).toBe(8);
    });

    it('should maintain correct ranges after multiple changes', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      // Test multiple changes that should stay in range
      changeRelationship('bastian', 30);
      expect(getRelationship('bastian')).toBe(30);

      changeRelationship('bastian', 40);
      expect(getRelationship('bastian')).toBe(70);

      changeRelationship('bastian', -20);
      expect(getRelationship('bastian')).toBe(50);

      // All should be in valid range
      expect(getRelationship('bastian')).toBeGreaterThanOrEqual(-100);
      expect(getRelationship('bastian')).toBeLessThanOrEqual(100);
    });
  });

  describe('getRelationship', () => {
    it('should return 0 for new characters with no relationship', () => {
      const { getRelationship } = useGameStore.getState();

      expect(getRelationship('bastian')).toBe(0);
      expect(getRelationship('marcel')).toBe(0);
    });

    it('should return current relationship score', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('denis', 25);

      expect(getRelationship('denis')).toBe(25);
    });

    it('should return 0 for non-existent characters', () => {
      const { getRelationship } = useGameStore.getState();

      expect(getRelationship('nonexistent_npc')).toBe(0);
    });

    it('should track independent relationships for each NPC', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('bastian', 30);
      changeRelationship('viktor', -40);
      changeRelationship('denis', 20);

      expect(getRelationship('bastian')).toBe(30);
      expect(getRelationship('viktor')).toBe(-40);
      expect(getRelationship('denis')).toBe(20);
      expect(getRelationship('marcel')).toBe(0); // Unchanged
    });
  });

  describe('setRelationship', () => {
    it('should set relationship to specific value', () => {
      const { setRelationship, getRelationship } = useGameStore.getState();

      setRelationship('bastian', 50);

      expect(getRelationship('bastian')).toBe(50);
    });

    it('should override previous relationship score', () => {
      const { changeRelationship, setRelationship, getRelationship } = useGameStore.getState();

      changeRelationship('denis', 30);
      setRelationship('denis', 10);

      expect(getRelationship('denis')).toBe(10);
    });

    it('should cap set values at 100', () => {
      const { setRelationship, getRelationship } = useGameStore.getState();

      setRelationship('bastian', 150);

      expect(getRelationship('bastian')).toBe(100);
    });

    it('should cap set values at -100', () => {
      const { setRelationship, getRelationship } = useGameStore.getState();

      setRelationship('emile', -150);

      expect(getRelationship('emile')).toBe(-100);
    });
  });

  describe('Relationship Score Range', () => {
    it('should always maintain scores between -100 and 100', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      const testCases = [
        { npc: 'bastian', change: 200 },
        { npc: 'viktor', change: -200 },
        { npc: 'denis', change: 95 },
        { npc: 'emile', change: -85 },
      ];

      testCases.forEach(({ npc, change }) => {
        changeRelationship(npc, change);
        const score = getRelationship(npc);
        expect(score).toBeGreaterThanOrEqual(-100);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Relationship Persistence', () => {
    it('should maintain relationships across scene changes', () => {
      const { changeRelationship, getRelationship, goToScene } = useGameStore.getState();

      changeRelationship('bastian', 25);
      changeRelationship('viktor', -15);

      goToScene('A-1-001');

      expect(getRelationship('bastian')).toBe(25);
      expect(getRelationship('viktor')).toBe(-15);
    });

    it('should maintain relationships when going back', () => {
      const { changeRelationship, getRelationship, goToScene, goBack } = useGameStore.getState();

      changeRelationship('denis', 30);
      goToScene('scene1');
      changeRelationship('marcel', 10);
      goToScene('scene2');

      goBack();

      expect(getRelationship('denis')).toBe(30);
      expect(getRelationship('marcel')).toBe(10);
    });
  });

  describe('Game Reset', () => {
    it('should clear all relationships when game is reset', () => {
      const { changeRelationship, getRelationship, resetGame } = useGameStore.getState();

      changeRelationship('bastian', 40);
      changeRelationship('viktor', -30);
      changeRelationship('denis', 25);

      resetGame();

      expect(getRelationship('bastian')).toBe(0);
      expect(getRelationship('viktor')).toBe(0);
      expect(getRelationship('denis')).toBe(0);
    });
  });

  describe('Complex Relationship Scenarios', () => {
    it('should handle typical gameplay relationship progression', () => {
      const { changeRelationship, getRelationship } = useGameStore.getState();

      // Help Bastian multiple times
      changeRelationship('bastian', 10); // Did a favor
      changeRelationship('bastian', 15); // Saved him in a fight
      changeRelationship('bastian', 5);  // Shared food

      expect(getRelationship('bastian')).toBe(30);

      // Conflict with Viktor
      changeRelationship('viktor', -10); // Refused demand
      changeRelationship('viktor', -20); // Beat his gang member
      changeRelationship('viktor', -5);  // Insulted him

      expect(getRelationship('viktor')).toBe(-35);

      // Mixed interactions with Marcel
      changeRelationship('marcel', 5);   // Small talk
      changeRelationship('marcel', -3);  // Accidentally offended
      changeRelationship('marcel', 10);  // Helped with task

      expect(getRelationship('marcel')).toBe(12);
    });

    it('should handle redemption arc (negative to positive)', () => {
      const { setRelationship, changeRelationship, getRelationship } = useGameStore.getState();

      // Start with Viktor hating you
      setRelationship('viktor', -60);

      // Slowly win him over
      changeRelationship('viktor', 20); // Saved his life
      changeRelationship('viktor', 25); // Protected his territory
      changeRelationship('viktor', 30); // Became allies

      expect(getRelationship('viktor')).toBe(15); // Went from -60 to 15
    });

    it('should handle betrayal (positive to negative)', () => {
      const { setRelationship, changeRelationship, getRelationship } = useGameStore.getState();

      // Start as friends with Denis
      setRelationship('denis', 60);

      // Betray him
      changeRelationship('denis', -80); // Major betrayal

      expect(getRelationship('denis')).toBe(-20);
    });
  });

  describe('Relationship Status Descriptions', () => {
    it('should provide correct status descriptions for scores', () => {
      expect(getRelationshipStatus(90)).toBe('Devoted Ally');
      expect(getRelationshipStatus(70)).toBe('Trusted Friend');
      expect(getRelationshipStatus(50)).toBe('Good Friend');
      expect(getRelationshipStatus(30)).toBe('Friendly');
      expect(getRelationshipStatus(15)).toBe('Acquaintance');
      expect(getRelationshipStatus(0)).toBe('Neutral');
      expect(getRelationshipStatus(-15)).toBe('Unfriendly');
      expect(getRelationshipStatus(-30)).toBe('Hostile');
      expect(getRelationshipStatus(-50)).toBe('Enemy');
      expect(getRelationshipStatus(-70)).toBe('Bitter Enemy');
      expect(getRelationshipStatus(-90)).toBe('Mortal Enemy');
    });
  });

  describe('Initial Relationships Setup', () => {
    it('should provide initial relationships for all NPCs', () => {
      const initialRelationships = getInitialRelationships();

      expect(initialRelationships['bastian']).toBe(30);
      expect(initialRelationships['marcel']).toBe(0);
      expect(initialRelationships['viktor']).toBe(-20);
      expect(initialRelationships['denis']).toBe(20);
      expect(initialRelationships['emile']).toBe(-50);
      expect(initialRelationships['dr_moreau']).toBe(0);
    });

    it('should have 6 NPCs in initial relationships', () => {
      const initialRelationships = getInitialRelationships();

      expect(Object.keys(initialRelationships)).toHaveLength(6);
    });
  });
});
