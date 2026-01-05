/**
 * Tests for character loader functionality
 * Phase 2 - Step 19: Relationship State Setup
 */

import {
  loadAllCharacters,
  getCharacterById,
  getInitialRelationships,
  getCharactersByLocation,
  getCharactersByRole,
  searchCharacters,
  isValidCharacterId,
  getTotalCharacterCount,
  getRelationshipStatus,
  getAllCharacterIds,
  clearCharactersCache,
} from '../characterLoader';

describe('Character Loader', () => {
  beforeEach(() => {
    clearCharactersCache();
  });

  describe('loadAllCharacters', () => {
    it('should load all characters from the JSON file', () => {
      const characters = loadAllCharacters();

      expect(characters).toBeDefined();
      expect(Array.isArray(characters)).toBe(true);
      expect(characters.length).toBe(6);
    });

    it('should cache characters on subsequent calls', () => {
      const characters1 = loadAllCharacters();
      const characters2 = loadAllCharacters();

      expect(characters1).toBe(characters2); // Same reference
    });

    it('should load characters with all required properties', () => {
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

    it('should have unique character IDs', () => {
      const characters = loadAllCharacters();
      const ids = characters.map(char => char.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(characters.length);
    });
  });

  describe('getCharacterById', () => {
    it('should return a character when given a valid ID', () => {
      const char = getCharacterById('bastian');

      expect(char).toBeDefined();
      expect(char?.id).toBe('bastian');
      expect(char?.name).toBe('Bastian');
    });

    it('should return undefined for invalid character ID', () => {
      const char = getCharacterById('nonexistent_character');

      expect(char).toBeUndefined();
    });

    it('should return correct character for all 6 NPCs', () => {
      const bastian = getCharacterById('bastian');
      const marcel = getCharacterById('marcel');
      const viktor = getCharacterById('viktor');
      const denis = getCharacterById('denis');
      const emile = getCharacterById('emile');
      const drMoreau = getCharacterById('dr_moreau');

      expect(bastian?.name).toBe('Bastian');
      expect(marcel?.name).toBe('Marcel');
      expect(viktor?.name).toBe('Viktor');
      expect(denis?.name).toBe('Denis');
      expect(emile?.name).toBe('Émile');
      expect(drMoreau?.name).toBe('Dr. Moreau');
    });
  });

  describe('getInitialRelationships', () => {
    it('should return initial relationships for all characters', () => {
      const relationships = getInitialRelationships();

      expect(relationships).toBeDefined();
      expect(Object.keys(relationships)).toHaveLength(6);
    });

    it('should have correct initial scores', () => {
      const relationships = getInitialRelationships();

      expect(relationships['bastian']).toBe(30);
      expect(relationships['marcel']).toBe(0);
      expect(relationships['viktor']).toBe(-20);
      expect(relationships['denis']).toBe(20);
      expect(relationships['emile']).toBe(-50);
      expect(relationships['dr_moreau']).toBe(0);
    });

    it('should have all scores within valid range', () => {
      const relationships = getInitialRelationships();

      Object.values(relationships).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(-100);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getCharactersByLocation', () => {
    it('should return characters at specific location', () => {
      const kitchenChars = getCharactersByLocation('Kitchen');

      expect(kitchenChars.length).toBeGreaterThan(0);
      expect(kitchenChars.some(char => char.id === 'denis')).toBe(true);
    });

    it('should handle case-insensitive location search', () => {
      const cellBlockA = getCharactersByLocation('cell block a');

      expect(cellBlockA.some(char => char.id === 'bastian')).toBe(true);
    });

    it('should return empty array for non-existent location', () => {
      const chars = getCharactersByLocation('Nonexistent Location');

      expect(chars).toEqual([]);
    });

    it('should find characters by partial location match', () => {
      const cellBlockChars = getCharactersByLocation('Cell Block');

      expect(cellBlockChars.length).toBeGreaterThan(0);
    });
  });

  describe('getCharactersByRole', () => {
    it('should return characters with specific role', () => {
      const doctors = getCharactersByRole('Doctor');

      expect(doctors.length).toBeGreaterThan(0);
      expect(doctors.some(char => char.id === 'dr_moreau')).toBe(true);
    });

    it('should handle case-insensitive role search', () => {
      const inmates = getCharactersByRole('inmate');

      expect(inmates.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent role', () => {
      const chars = getCharactersByRole('Nonexistent Role');

      expect(chars).toEqual([]);
    });
  });

  describe('searchCharacters', () => {
    it('should find characters by name', () => {
      const results = searchCharacters('Bastian');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(char => char.id === 'bastian')).toBe(true);
    });

    it('should find characters by description', () => {
      const results = searchCharacters('kitchen');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(char => char.id === 'denis')).toBe(true);
    });

    it('should find characters by role', () => {
      const results = searchCharacters('enforcer');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(char => char.id === 'emile')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const resultsLower = searchCharacters('viktor');
      const resultsUpper = searchCharacters('VIKTOR');
      const resultsMixed = searchCharacters('ViKtOr');

      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBe(resultsMixed.length);
    });

    it('should return empty array for no matches', () => {
      const results = searchCharacters('xyznonexistentquery123');

      expect(results).toEqual([]);
    });
  });

  describe('isValidCharacterId', () => {
    it('should return true for valid character IDs', () => {
      expect(isValidCharacterId('bastian')).toBe(true);
      expect(isValidCharacterId('marcel')).toBe(true);
      expect(isValidCharacterId('viktor')).toBe(true);
      expect(isValidCharacterId('denis')).toBe(true);
      expect(isValidCharacterId('emile')).toBe(true);
      expect(isValidCharacterId('dr_moreau')).toBe(true);
    });

    it('should return false for invalid character IDs', () => {
      expect(isValidCharacterId('nonexistent_character')).toBe(false);
      expect(isValidCharacterId('')).toBe(false);
      expect(isValidCharacterId('invalid123')).toBe(false);
    });
  });

  describe('getTotalCharacterCount', () => {
    it('should return the total number of characters', () => {
      const count = getTotalCharacterCount();

      expect(count).toBe(6);
      expect(count).toBe(loadAllCharacters().length);
    });
  });

  describe('getRelationshipStatus', () => {
    it('should return correct status for very high scores', () => {
      expect(getRelationshipStatus(90)).toBe('Devoted Ally');
      expect(getRelationshipStatus(80)).toBe('Devoted Ally');
    });

    it('should return correct status for high scores', () => {
      expect(getRelationshipStatus(70)).toBe('Trusted Friend');
      expect(getRelationshipStatus(60)).toBe('Trusted Friend');
    });

    it('should return correct status for moderately high scores', () => {
      expect(getRelationshipStatus(50)).toBe('Good Friend');
      expect(getRelationshipStatus(40)).toBe('Good Friend');
    });

    it('should return correct status for positive scores', () => {
      expect(getRelationshipStatus(30)).toBe('Friendly');
      expect(getRelationshipStatus(20)).toBe('Friendly');
      expect(getRelationshipStatus(15)).toBe('Acquaintance');
      expect(getRelationshipStatus(10)).toBe('Acquaintance');
    });

    it('should return correct status for neutral scores', () => {
      expect(getRelationshipStatus(5)).toBe('Neutral');
      expect(getRelationshipStatus(0)).toBe('Neutral');
      expect(getRelationshipStatus(-5)).toBe('Neutral');
    });

    it('should return correct status for negative scores', () => {
      expect(getRelationshipStatus(-15)).toBe('Unfriendly');
      expect(getRelationshipStatus(-30)).toBe('Hostile');
      expect(getRelationshipStatus(-50)).toBe('Enemy');
      expect(getRelationshipStatus(-70)).toBe('Bitter Enemy');
      expect(getRelationshipStatus(-90)).toBe('Mortal Enemy');
    });

    it('should handle boundary values correctly', () => {
      expect(getRelationshipStatus(100)).toBe('Devoted Ally');
      expect(getRelationshipStatus(-100)).toBe('Mortal Enemy');
    });
  });

  describe('getAllCharacterIds', () => {
    it('should return all 6 character IDs', () => {
      const ids = getAllCharacterIds();

      expect(ids).toHaveLength(6);
      expect(ids).toContain('bastian');
      expect(ids).toContain('marcel');
      expect(ids).toContain('viktor');
      expect(ids).toContain('denis');
      expect(ids).toContain('emile');
      expect(ids).toContain('dr_moreau');
    });
  });

  describe('clearCharactersCache', () => {
    it('should clear the cache', () => {
      const chars1 = loadAllCharacters();
      clearCharactersCache();
      const chars2 = loadAllCharacters();

      // Same content after cache clear
      expect(chars1).toEqual(chars2);
      // Verify characters are still loaded correctly
      expect(chars2.length).toBe(6);
    });
  });

  describe('Character data validation', () => {
    it('should have non-empty names for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.name.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty descriptions for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.description.length).toBeGreaterThan(0);
      });
    });

    it('should have valid initial relationship scores', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.initialRelationship).toBeGreaterThanOrEqual(-100);
        expect(char.initialRelationship).toBeLessThanOrEqual(100);
      });
    });

    it('should have role and location for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.role.length).toBeGreaterThan(0);
        expect(char.location.length).toBeGreaterThan(0);
      });
    });

    it('should have traits array for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(Array.isArray(char.traits)).toBe(true);
        expect(char.traits.length).toBeGreaterThan(0);
      });
    });

    it('should have background story for all characters', () => {
      const characters = loadAllCharacters();

      characters.forEach(char => {
        expect(char.background.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Specific character verification', () => {
    it('should have Bastian with correct initial relationship', () => {
      const bastian = getCharacterById('bastian');
      expect(bastian?.initialRelationship).toBe(30);
    });

    it('should have Marcel with neutral initial relationship', () => {
      const marcel = getCharacterById('marcel');
      expect(marcel?.initialRelationship).toBe(0);
    });

    it('should have Viktor with negative initial relationship', () => {
      const viktor = getCharacterById('viktor');
      expect(viktor?.initialRelationship).toBe(-20);
    });

    it('should have Denis with positive initial relationship', () => {
      const denis = getCharacterById('denis');
      expect(denis?.initialRelationship).toBe(20);
    });

    it('should have Émile with very negative initial relationship', () => {
      const emile = getCharacterById('emile');
      expect(emile?.initialRelationship).toBe(-50);
    });

    it('should have Dr. Moreau with neutral initial relationship', () => {
      const drMoreau = getCharacterById('dr_moreau');
      expect(drMoreau?.initialRelationship).toBe(0);
    });
  });
});
