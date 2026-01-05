/**
 * Tests for expanded character system with 12 characters
 * Phase 2 - Step 20: Character Data File
 */

import {
  loadAllCharacters,
  getCharacterById,
  getCharactersByCategory,
  getUnlockedContent,
  getNextUnlock,
  hasReachedThreshold,
  getAllies,
  getAntagonists,
  getNeutralCharacters,
  getReferencedCharacters,
  getTotalCharacterCount,
  clearCharactersCache,
} from '../characterLoader';

describe('Expanded Character System (12 Characters)', () => {
  beforeEach(() => {
    clearCharactersCache();
  });

  describe('Total Character Count', () => {
    it('should have exactly 12 characters', () => {
      const characters = loadAllCharacters();
      expect(characters).toHaveLength(12);
    });

    it('should return 12 from getTotalCharacterCount', () => {
      expect(getTotalCharacterCount()).toBe(12);
    });
  });

  describe('Character Categories', () => {
    it('should have allies category', () => {
      const allies = getAllies();
      expect(allies.length).toBeGreaterThan(0);
      allies.forEach(char => {
        expect(char.category).toBe('ally');
      });
    });

    it('should have antagonists category', () => {
      const antagonists = getAntagonists();
      expect(antagonists.length).toBeGreaterThan(0);
      antagonists.forEach(char => {
        expect(char.category).toBe('antagonist');
      });
    });

    it('should have neutral characters', () => {
      const neutralChars = getNeutralCharacters();
      expect(neutralChars.length).toBeGreaterThan(0);
      neutralChars.forEach(char => {
        expect(char.category).toBe('neutral');
      });
    });

    it('should have referenced characters', () => {
      const referenced = getReferencedCharacters();
      expect(referenced.length).toBeGreaterThan(0);
      referenced.forEach(char => {
        expect(char.category).toBe('referenced');
      });
    });

    it('should categorize all characters correctly', () => {
      const allies = getAllies();
      const antagonists = getAntagonists();
      const neutralChars = getNeutralCharacters();
      const referenced = getReferencedCharacters();

      const total = allies.length + antagonists.length + neutralChars.length + referenced.length;
      expect(total).toBe(12);
    });
  });

  describe('New Characters', () => {
    it('should include Lucía (librarian)', () => {
      const lucia = getCharacterById('lucia');
      expect(lucia).toBeDefined();
      expect(lucia?.name).toBe('Lucía');
      expect(lucia?.role).toBe('Librarian');
      expect(lucia?.category).toBe('ally');
    });

    it('should include Warden Vásquez', () => {
      const warden = getCharacterById('warden_vasquez');
      expect(warden).toBeDefined();
      expect(warden?.name).toBe('Warden Vásquez');
      expect(warden?.role).toBe('Warden');
      expect(warden?.category).toBe('antagonist');
    });

    it('should include Padre Ramón', () => {
      const padre = getCharacterById('padre_ramon');
      expect(padre).toBeDefined();
      expect(padre?.name).toBe('Padre Ramón');
      expect(padre?.role).toBe('Chaplain');
      expect(padre?.category).toBe('ally');
    });

    it('should include Carlos El Serpiente', () => {
      const carlos = getCharacterById('carlos');
      expect(carlos).toBeDefined();
      expect(carlos?.name).toBe("Carlos 'El Serpiente'");
      expect(carlos?.role).toBe('Gang Leader');
      expect(carlos?.category).toBe('antagonist');
    });

    it('should include Officer Ramírez', () => {
      const officer = getCharacterById('officer_ramirez');
      expect(officer).toBeDefined();
      expect(officer?.name).toBe('Officer Ramírez');
      expect(officer?.role).toBe('Prison Guard');
      expect(officer?.category).toBe('neutral');
    });

    it('should include María (outside)', () => {
      const maria = getCharacterById('maria');
      expect(maria).toBeDefined();
      expect(maria?.name).toBe('María');
      expect(maria?.role).toBe('Family (Outside)');
      expect(maria?.category).toBe('referenced');
    });
  });

  describe('Relationship Thresholds', () => {
    it('should have relationship thresholds for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.relationshipThresholds).toBeDefined();
        expect(typeof char.relationshipThresholds).toBe('object');
        expect(Object.keys(char.relationshipThresholds).length).toBeGreaterThan(0);
      });
    });

    it('should have valid numeric thresholds', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        Object.values(char.relationshipThresholds).forEach(threshold => {
          expect(typeof threshold).toBe('number');
          expect(threshold).toBeGreaterThanOrEqual(-100);
          expect(threshold).toBeLessThanOrEqual(100);
        });
      });
    });

    it('should have correct thresholds for Bastian', () => {
      const bastian = getCharacterById('bastian');
      expect(bastian?.relationshipThresholds.trusted).toBe(50);
      expect(bastian?.relationshipThresholds.friend).toBe(70);
      expect(bastian?.relationshipThresholds.devotedAlly).toBe(90);
    });

    it('should have ascending thresholds', () => {
      const bastian = getCharacterById('bastian');
      const thresholds = Object.values(bastian!.relationshipThresholds);

      for (let i = 1; i < thresholds.length; i++) {
        expect(thresholds[i]).toBeGreaterThan(thresholds[i - 1]);
      }
    });
  });

  describe('Unlocks System', () => {
    it('should have unlocks for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.unlocks).toBeDefined();
        expect(typeof char.unlocks).toBe('object');
        expect(Object.keys(char.unlocks).length).toBeGreaterThan(0);
      });
    });

    it('should have unlock descriptions as strings', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        Object.values(char.unlocks).forEach(description => {
          expect(typeof description).toBe('string');
          expect(description.length).toBeGreaterThan(0);
        });
      });
    });

    it('should match unlock thresholds to unlock content', () => {
      const bastian = getCharacterById('bastian');

      expect(bastian?.unlocks['50']).toBeDefined();
      expect(bastian?.unlocks['70']).toBeDefined();
      expect(bastian?.unlocks['90']).toBeDefined();
    });
  });

  describe('getUnlockedContent', () => {
    it('should return empty array for score below all thresholds', () => {
      const unlocked = getUnlockedContent('bastian', 40);
      expect(unlocked).toEqual([]);
    });

    it('should return content for score at first threshold', () => {
      const unlocked = getUnlockedContent('bastian', 50);
      expect(unlocked.length).toBe(1);
      expect(unlocked[0]).toContain('prison secrets');
    });

    it('should return multiple unlocks for higher scores', () => {
      const unlocked = getUnlockedContent('bastian', 80);
      expect(unlocked.length).toBe(2);
    });

    it('should return all unlocks at maximum score', () => {
      const unlocked = getUnlockedContent('bastian', 100);
      expect(unlocked.length).toBe(3);
    });

    it('should work with negative thresholds', () => {
      const unlocked = getUnlockedContent('emile', -15);
      expect(unlocked.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array for invalid character', () => {
      const unlocked = getUnlockedContent('nonexistent', 100);
      expect(unlocked).toEqual([]);
    });
  });

  describe('getNextUnlock', () => {
    it('should return first unlock for low score', () => {
      const nextUnlock = getNextUnlock('bastian', 0);

      expect(nextUnlock).toBeDefined();
      expect(nextUnlock?.threshold).toBe(50);
      expect(nextUnlock?.description).toContain('prison secrets');
    });

    it('should return second unlock after reaching first', () => {
      const nextUnlock = getNextUnlock('bastian', 50);

      expect(nextUnlock).toBeDefined();
      expect(nextUnlock?.threshold).toBe(70);
    });

    it('should return null when all content is unlocked', () => {
      const nextUnlock = getNextUnlock('bastian', 100);
      expect(nextUnlock).toBeNull();
    });

    it('should return null for invalid character', () => {
      const nextUnlock = getNextUnlock('nonexistent', 50);
      expect(nextUnlock).toBeNull();
    });

    it('should work with negative thresholds', () => {
      const nextUnlock = getNextUnlock('emile', -100);
      expect(nextUnlock).toBeDefined();
      expect(nextUnlock?.threshold).toBeLessThan(0);
    });
  });

  describe('hasReachedThreshold', () => {
    it('should return true when threshold is reached', () => {
      expect(hasReachedThreshold('bastian', 'trusted', 50)).toBe(true);
      expect(hasReachedThreshold('bastian', 'trusted', 60)).toBe(true);
    });

    it('should return false when threshold is not reached', () => {
      expect(hasReachedThreshold('bastian', 'trusted', 40)).toBe(false);
    });

    it('should return false for non-existent threshold', () => {
      expect(hasReachedThreshold('bastian', 'nonexistent', 100)).toBe(false);
    });

    it('should return false for invalid character', () => {
      expect(hasReachedThreshold('nonexistent', 'trusted', 50)).toBe(false);
    });

    it('should work with multiple thresholds', () => {
      expect(hasReachedThreshold('bastian', 'trusted', 50)).toBe(true);
      expect(hasReachedThreshold('bastian', 'friend', 50)).toBe(false);
      expect(hasReachedThreshold('bastian', 'devotedAlly', 50)).toBe(false);
    });
  });

  describe('Character Breakdown', () => {
    it('should have at least 3 allies', () => {
      const allies = getAllies();
      expect(allies.length).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 antagonists', () => {
      const antagonists = getAntagonists();
      expect(antagonists.length).toBeGreaterThanOrEqual(3);
    });

    it('should include expected allies', () => {
      const allies = getAllies();
      const allyIds = allies.map(a => a.id);

      expect(allyIds).toContain('bastian');
      expect(allyIds).toContain('denis');
      expect(allyIds).toContain('lucia');
      expect(allyIds).toContain('padre_ramon');
    });

    it('should include expected antagonists', () => {
      const antagonists = getAntagonists();
      const antagonistIds = antagonists.map(a => a.id);

      expect(antagonistIds).toContain('viktor');
      expect(antagonistIds).toContain('emile');
      expect(antagonistIds).toContain('warden_vasquez');
      expect(antagonistIds).toContain('carlos');
    });

    it('should include expected neutral characters', () => {
      const neutralChars = getNeutralCharacters();
      const neutralIds = neutralChars.map(n => n.id);

      expect(neutralIds).toContain('marcel');
      expect(neutralIds).toContain('dr_moreau');
      expect(neutralIds).toContain('officer_ramirez');
    });

    it('should include referenced character María', () => {
      const referenced = getReferencedCharacters();
      const referencedIds = referenced.map(r => r.id);

      expect(referencedIds).toContain('maria');
    });
  });

  describe('Initial Relationship Distribution', () => {
    it('should have variety in initial relationships', () => {
      const characters = loadAllCharacters();
      const initialScores = characters.map(c => c.initialRelationship);

      const hasPositive = initialScores.some(s => s > 0);
      const hasNeutral = initialScores.some(s => s === 0);
      const hasNegative = initialScores.some(s => s < 0);

      expect(hasPositive).toBe(true);
      expect(hasNeutral).toBe(true);
      expect(hasNegative).toBe(true);
    });

    it('should have appropriate initial scores for categories', () => {
      const allies = getAllies();
      const antagonists = getAntagonists();

      // Most allies should start positive or neutral
      const allyScores = allies.map(a => a.initialRelationship);
      const avgAllyScore = allyScores.reduce((sum, score) => sum + score, 0) / allyScores.length;
      expect(avgAllyScore).toBeGreaterThanOrEqual(0);

      // Most antagonists should start negative or neutral
      const antagonistScores = antagonists.map(a => a.initialRelationship);
      const avgAntagonistScore = antagonistScores.reduce((sum, score) => sum + score, 0) / antagonistScores.length;
      expect(avgAntagonistScore).toBeLessThanOrEqual(0);
    });
  });

  describe('Character Completeness', () => {
    it('should have all required fields for each character', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.id).toBeDefined();
        expect(char.name).toBeDefined();
        expect(char.initialRelationship).toBeDefined();
        expect(char.description).toBeDefined();
        expect(char.role).toBeDefined();
        expect(char.category).toBeDefined();
        expect(char.location).toBeDefined();
        expect(char.traits).toBeDefined();
        expect(char.background).toBeDefined();
        expect(char.relationshipThresholds).toBeDefined();
        expect(char.unlocks).toBeDefined();
      });
    });

    it('should have non-empty required string fields', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.id.length).toBeGreaterThan(0);
        expect(char.name.length).toBeGreaterThan(0);
        expect(char.description.length).toBeGreaterThan(0);
        expect(char.role.length).toBeGreaterThan(0);
        expect(char.location.length).toBeGreaterThan(0);
        expect(char.background.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one trait per character', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.traits.length).toBeGreaterThan(0);
      });
    });
  });
});
