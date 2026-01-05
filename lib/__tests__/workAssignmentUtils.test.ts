/**
 * Tests for work assignment utility functions
 */

import {
  getWorkAssignmentInfo,
  getWorkAssignmentColors,
  getWorkAssignmentDisplayName,
  getAllWorkAssignments,
  isValidWorkAssignment,
  getWorkAssignmentItems,
  getWorkAssignmentEvidence,
  getWorkAssignmentCharacters,
  getRecommendedWorkAssignment,
  formatWorkAssignment,
  WORK_ASSIGNMENTS,
} from '../workAssignmentUtils';

describe('Work Assignment Utils', () => {
  describe('WORK_ASSIGNMENTS constant', () => {
    it('should have 6 assignments', () => {
      expect(WORK_ASSIGNMENTS).toHaveLength(6);
    });

    it('should include all expected assignments', () => {
      expect(WORK_ASSIGNMENTS).toContain('kitchen');
      expect(WORK_ASSIGNMENTS).toContain('laundry');
      expect(WORK_ASSIGNMENTS).toContain('yard');
      expect(WORK_ASSIGNMENTS).toContain('infirmary');
      expect(WORK_ASSIGNMENTS).toContain('chapel');
      expect(WORK_ASSIGNMENTS).toContain('library');
    });
  });

  describe('getWorkAssignmentInfo', () => {
    it('should return info for kitchen', () => {
      const info = getWorkAssignmentInfo('kitchen');
      expect(info.id).toBe('kitchen');
      expect(info.name).toBe('Kitchen Duty');
      expect(info.icon).toBe('🍳');
      expect(info.color).toBe('red');
      expect(info.location).toContain('Kitchen');
      expect(info.opportunities.length).toBeGreaterThan(0);
    });

    it('should return info for laundry', () => {
      const info = getWorkAssignmentInfo('laundry');
      expect(info.id).toBe('laundry');
      expect(info.name).toBe('Laundry Service');
      expect(info.icon).toBe('👕');
    });

    it('should return info for yard', () => {
      const info = getWorkAssignmentInfo('yard');
      expect(info.id).toBe('yard');
      expect(info.name).toBe('Yard Maintenance');
      expect(info.icon).toBe('🌿');
    });

    it('should return info for infirmary', () => {
      const info = getWorkAssignmentInfo('infirmary');
      expect(info.id).toBe('infirmary');
      expect(info.name).toBe('Infirmary Assistant');
      expect(info.icon).toBe('⚕️');
    });

    it('should return info for chapel', () => {
      const info = getWorkAssignmentInfo('chapel');
      expect(info.id).toBe('chapel');
      expect(info.name).toBe('Chapel Services');
      expect(info.icon).toBe('⛪');
    });

    it('should return info for library', () => {
      const info = getWorkAssignmentInfo('library');
      expect(info.id).toBe('library');
      expect(info.name).toBe('Library Assistant');
      expect(info.icon).toBe('📚');
    });

    it('should have all required fields', () => {
      const info = getWorkAssignmentInfo('kitchen');
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('description');
      expect(info).toHaveProperty('location');
      expect(info).toHaveProperty('opportunities');
      expect(info).toHaveProperty('icon');
      expect(info).toHaveProperty('color');
    });

    it('should have opportunities array for each assignment', () => {
      WORK_ASSIGNMENTS.forEach((assignment) => {
        const info = getWorkAssignmentInfo(assignment);
        expect(Array.isArray(info.opportunities)).toBe(true);
        expect(info.opportunities.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getWorkAssignmentColors', () => {
    it('should return red colors for kitchen', () => {
      const colors = getWorkAssignmentColors('kitchen');
      expect(colors.bg).toBe('bg-red-100');
      expect(colors.text).toBe('text-red-800');
      expect(colors.border).toBe('border-red-600');
      expect(colors.hover).toBe('hover:bg-red-200');
    });

    it('should return blue colors for laundry', () => {
      const colors = getWorkAssignmentColors('laundry');
      expect(colors.bg).toContain('blue');
    });

    it('should return green colors for yard', () => {
      const colors = getWorkAssignmentColors('yard');
      expect(colors.bg).toContain('green');
    });

    it('should return teal colors for infirmary', () => {
      const colors = getWorkAssignmentColors('infirmary');
      expect(colors.bg).toContain('teal');
    });

    it('should return purple colors for chapel', () => {
      const colors = getWorkAssignmentColors('chapel');
      expect(colors.bg).toContain('purple');
    });

    it('should return amber colors for library', () => {
      const colors = getWorkAssignmentColors('library');
      expect(colors.bg).toContain('amber');
    });

    it('should have all required color properties', () => {
      const colors = getWorkAssignmentColors('kitchen');
      expect(colors).toHaveProperty('bg');
      expect(colors).toHaveProperty('text');
      expect(colors).toHaveProperty('border');
      expect(colors).toHaveProperty('hover');
    });
  });

  describe('getWorkAssignmentDisplayName', () => {
    it('should format kitchen with icon', () => {
      const name = getWorkAssignmentDisplayName('kitchen');
      expect(name).toBe('🍳 Kitchen Duty');
    });

    it('should format library with icon', () => {
      const name = getWorkAssignmentDisplayName('library');
      expect(name).toBe('📚 Library Assistant');
    });

    it('should return placeholder for null', () => {
      const name = getWorkAssignmentDisplayName(null);
      expect(name).toBe('No assignment selected');
    });
  });

  describe('getAllWorkAssignments', () => {
    it('should return all 6 assignments', () => {
      const assignments = getAllWorkAssignments();
      expect(assignments).toHaveLength(6);
    });

    it('should return complete info for each assignment', () => {
      const assignments = getAllWorkAssignments();
      assignments.forEach((assignment) => {
        expect(assignment).toHaveProperty('id');
        expect(assignment).toHaveProperty('name');
        expect(assignment).toHaveProperty('description');
        expect(assignment).toHaveProperty('location');
        expect(assignment).toHaveProperty('opportunities');
        expect(assignment).toHaveProperty('icon');
        expect(assignment).toHaveProperty('color');
      });
    });

    it('should include kitchen, laundry, yard, infirmary, chapel, library', () => {
      const assignments = getAllWorkAssignments();
      const ids = assignments.map((a) => a.id);
      expect(ids).toContain('kitchen');
      expect(ids).toContain('laundry');
      expect(ids).toContain('yard');
      expect(ids).toContain('infirmary');
      expect(ids).toContain('chapel');
      expect(ids).toContain('library');
    });
  });

  describe('isValidWorkAssignment', () => {
    it('should return true for valid assignments', () => {
      expect(isValidWorkAssignment('kitchen')).toBe(true);
      expect(isValidWorkAssignment('laundry')).toBe(true);
      expect(isValidWorkAssignment('yard')).toBe(true);
      expect(isValidWorkAssignment('infirmary')).toBe(true);
      expect(isValidWorkAssignment('chapel')).toBe(true);
      expect(isValidWorkAssignment('library')).toBe(true);
    });

    it('should return false for invalid assignments', () => {
      expect(isValidWorkAssignment('invalid')).toBe(false);
      expect(isValidWorkAssignment('office')).toBe(false);
      expect(isValidWorkAssignment('')).toBe(false);
    });
  });

  describe('getWorkAssignmentItems', () => {
    it('should return items for kitchen', () => {
      const items = getWorkAssignmentItems('kitchen');
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      expect(items).toContain('kitchen_knife');
    });

    it('should return items for laundry', () => {
      const items = getWorkAssignmentItems('laundry');
      expect(items).toContain('guard_uniform');
    });

    it('should return items for yard', () => {
      const items = getWorkAssignmentItems('yard');
      expect(items).toContain('gardening_tools');
    });

    it('should return items for infirmary', () => {
      const items = getWorkAssignmentItems('infirmary');
      expect(items).toContain('sedatives');
    });

    it('should return items for chapel', () => {
      const items = getWorkAssignmentItems('chapel');
      expect(items.length).toBeGreaterThan(0);
    });

    it('should return items for library', () => {
      const items = getWorkAssignmentItems('library');
      expect(items).toContain('legal_books');
    });
  });

  describe('getWorkAssignmentEvidence', () => {
    it('should return evidence for each assignment', () => {
      WORK_ASSIGNMENTS.forEach((assignment) => {
        const evidence = getWorkAssignmentEvidence(assignment);
        expect(Array.isArray(evidence)).toBe(true);
      });
    });

    it('should return library evidence including warden_ledger', () => {
      const evidence = getWorkAssignmentEvidence('library');
      expect(evidence).toContain('warden_ledger');
    });

    it('should return infirmary evidence', () => {
      const evidence = getWorkAssignmentEvidence('infirmary');
      expect(evidence.length).toBeGreaterThan(0);
    });
  });

  describe('getWorkAssignmentCharacters', () => {
    it('should return characters for each assignment', () => {
      WORK_ASSIGNMENTS.forEach((assignment) => {
        const characters = getWorkAssignmentCharacters(assignment);
        expect(Array.isArray(characters)).toBe(true);
      });
    });

    it('should return kitchen characters', () => {
      const characters = getWorkAssignmentCharacters('kitchen');
      expect(characters.length).toBeGreaterThan(0);
    });

    it('should return chapel characters', () => {
      const characters = getWorkAssignmentCharacters('chapel');
      expect(characters.length).toBeGreaterThan(0);
    });
  });

  describe('getRecommendedWorkAssignment', () => {
    it('should recommend library for evidence goal', () => {
      const assignment = getRecommendedWorkAssignment(true, false, false);
      expect(assignment).toBe('library');
    });

    it('should recommend kitchen for social goal', () => {
      const assignment = getRecommendedWorkAssignment(false, true, false);
      expect(assignment).toBe('kitchen');
    });

    it('should recommend yard for stealth goal', () => {
      const assignment = getRecommendedWorkAssignment(false, false, true);
      expect(assignment).toBe('yard');
    });

    it('should return null when no goals', () => {
      const assignment = getRecommendedWorkAssignment(false, false, false);
      expect(assignment).toBeNull();
    });

    it('should prioritize evidence over other goals', () => {
      const assignment = getRecommendedWorkAssignment(true, true, true);
      expect(assignment).toBe('library');
    });

    it('should prioritize social over stealth', () => {
      const assignment = getRecommendedWorkAssignment(false, true, true);
      expect(assignment).toBe('kitchen');
    });
  });

  describe('formatWorkAssignment', () => {
    it('should format kitchen with full details', () => {
      const formatted = formatWorkAssignment('kitchen');
      expect(formatted).toContain('🍳');
      expect(formatted).toContain('Kitchen Duty');
      expect(formatted).toContain('Kitchen');
    });

    it('should format library with full details', () => {
      const formatted = formatWorkAssignment('library');
      expect(formatted).toContain('📚');
      expect(formatted).toContain('Library');
    });

    it('should return placeholder for null', () => {
      const formatted = formatWorkAssignment(null);
      expect(formatted).toBe('No assignment');
    });
  });

  describe('Assignment Uniqueness', () => {
    it('should have unique IDs', () => {
      const assignments = getAllWorkAssignments();
      const ids = assignments.map((a) => a.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds.length).toBe(ids.length);
    });

    it('should have unique names', () => {
      const assignments = getAllWorkAssignments();
      const names = assignments.map((a) => a.name);
      const uniqueNames = [...new Set(names)];
      expect(uniqueNames.length).toBe(names.length);
    });

    it('should have unique icons', () => {
      const assignments = getAllWorkAssignments();
      const icons = assignments.map((a) => a.icon);
      const uniqueIcons = [...new Set(icons)];
      expect(uniqueIcons.length).toBe(icons.length);
    });

    it('should have unique colors', () => {
      const assignments = getAllWorkAssignments();
      const colors = assignments.map((a) => a.color);
      const uniqueColors = [...new Set(colors)];
      expect(uniqueColors.length).toBe(colors.length);
    });
  });
});
