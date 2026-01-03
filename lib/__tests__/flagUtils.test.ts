/**
 * Tests for flag utility functions
 */

import {
  createFlagName,
  parseFlagName,
  getFlagsByCategory,
  hasAllFlags,
  hasAnyFlag,
  hasNoFlags,
  countSetFlags,
  getSetFlags,
  getUnsetFlags,
  isValidFlagName,
  CommonFlags,
  getFlagDescription,
} from '../flagUtils';

describe('flagUtils', () => {
  describe('createFlagName', () => {
    it('should create a namespaced flag name', () => {
      expect(createFlagName('story', 'met_warden')).toBe('story:met_warden');
      expect(createFlagName('char', 'befriended_guard')).toBe('char:befriended_guard');
    });
  });

  describe('parseFlagName', () => {
    it('should parse a valid flag name', () => {
      expect(parseFlagName('story:met_warden')).toEqual({
        category: 'story',
        name: 'met_warden',
      });
    });

    it('should return null for invalid flag names', () => {
      expect(parseFlagName('invalid_flag')).toBeNull();
      expect(parseFlagName('too:many:colons')).toBeNull();
    });
  });

  describe('getFlagsByCategory', () => {
    const flags = [
      'story:intro_complete',
      'story:first_day',
      'char:met_guard',
      'loc:found_courtyard',
    ];

    it('should get all flags from a category', () => {
      const storyFlags = getFlagsByCategory(flags, 'story');
      expect(storyFlags).toEqual(['story:intro_complete', 'story:first_day']);
    });

    it('should return empty array for category with no flags', () => {
      expect(getFlagsByCategory(flags, 'quest')).toEqual([]);
    });
  });

  describe('hasAllFlags', () => {
    const currentFlags = ['flag1', 'flag2', 'flag3'];

    it('should return true when all flags are present', () => {
      expect(hasAllFlags(currentFlags, ['flag1', 'flag2'])).toBe(true);
    });

    it('should return false when any flag is missing', () => {
      expect(hasAllFlags(currentFlags, ['flag1', 'flag4'])).toBe(false);
    });

    it('should return true for empty required flags', () => {
      expect(hasAllFlags(currentFlags, [])).toBe(true);
    });
  });

  describe('hasAnyFlag', () => {
    const currentFlags = ['flag1', 'flag2', 'flag3'];

    it('should return true when at least one flag is present', () => {
      expect(hasAnyFlag(currentFlags, ['flag1', 'flag4'])).toBe(true);
    });

    it('should return false when no flags are present', () => {
      expect(hasAnyFlag(currentFlags, ['flag4', 'flag5'])).toBe(false);
    });

    it('should return false for empty check flags', () => {
      expect(hasAnyFlag(currentFlags, [])).toBe(false);
    });
  });

  describe('hasNoFlags', () => {
    const currentFlags = ['flag1', 'flag2', 'flag3'];

    it('should return true when no flags are present', () => {
      expect(hasNoFlags(currentFlags, ['flag4', 'flag5'])).toBe(true);
    });

    it('should return false when any flag is present', () => {
      expect(hasNoFlags(currentFlags, ['flag1', 'flag4'])).toBe(false);
    });

    it('should return true for empty check flags', () => {
      expect(hasNoFlags(currentFlags, [])).toBe(true);
    });
  });

  describe('countSetFlags', () => {
    const currentFlags = ['flag1', 'flag2', 'flag3'];

    it('should count how many flags are set', () => {
      expect(countSetFlags(currentFlags, ['flag1', 'flag2', 'flag4'])).toBe(2);
    });

    it('should return 0 when no flags are set', () => {
      expect(countSetFlags(currentFlags, ['flag4', 'flag5'])).toBe(0);
    });

    it('should return 0 for empty check flags', () => {
      expect(countSetFlags(currentFlags, [])).toBe(0);
    });
  });

  describe('getSetFlags', () => {
    const currentFlags = ['flag1', 'flag2', 'flag3'];

    it('should return flags that are set', () => {
      expect(getSetFlags(currentFlags, ['flag1', 'flag2', 'flag4'])).toEqual([
        'flag1',
        'flag2',
      ]);
    });

    it('should return empty array when no flags are set', () => {
      expect(getSetFlags(currentFlags, ['flag4', 'flag5'])).toEqual([]);
    });
  });

  describe('getUnsetFlags', () => {
    const currentFlags = ['flag1', 'flag2', 'flag3'];

    it('should return flags that are not set', () => {
      expect(getUnsetFlags(currentFlags, ['flag1', 'flag2', 'flag4'])).toEqual(['flag4']);
    });

    it('should return all flags when none are set', () => {
      expect(getUnsetFlags(currentFlags, ['flag4', 'flag5'])).toEqual([
        'flag4',
        'flag5',
      ]);
    });
  });

  describe('isValidFlagName', () => {
    it('should validate correct flag names', () => {
      expect(isValidFlagName('story:met_warden')).toBe(true);
      expect(isValidFlagName('char:befriended_guard')).toBe(true);
    });

    it('should reject invalid flag names', () => {
      expect(isValidFlagName('invalid_flag')).toBe(false);
      expect(isValidFlagName('too:many:colons')).toBe(false);
      expect(isValidFlagName(':no_category')).toBe(false);
      expect(isValidFlagName('no_name:')).toBe(false);
    });
  });

  describe('CommonFlags', () => {
    it('should have predefined common flags', () => {
      expect(CommonFlags.INTRO_COMPLETE).toBe('story:intro_complete');
      expect(CommonFlags.MET_WARDEN).toBe('story:met_warden');
      expect(CommonFlags.BEFRIENDED_GUARD).toBe('char:befriended_guard');
    });

    it('should follow naming convention', () => {
      Object.values(CommonFlags).forEach((flag) => {
        expect(isValidFlagName(flag)).toBe(true);
      });
    });
  });

  describe('getFlagDescription', () => {
    it('should return description for known flags', () => {
      const description = getFlagDescription(CommonFlags.MET_WARDEN);
      expect(description).toContain('warden');
      expect(description.length).toBeGreaterThan(0);
    });

    it('should return default message for unknown flags', () => {
      expect(getFlagDescription('unknown:flag')).toBe('No description available');
    });
  });
});
