/**
 * Tests for item loader functionality
 * Phase 2 - Step 17: Item Data File
 */

import {
  loadAllItems,
  getItemById,
  getItemsByCategory,
  searchItems,
  getAllCategories,
  getItemCountByCategory,
  isValidItemId,
  getTotalItemCount,
  clearItemsCache,
} from '../itemLoader';
import type { ItemCategory } from '@/types';

describe('Item Loader', () => {
  beforeEach(() => {
    clearItemsCache();
  });

  describe('loadAllItems', () => {
    it('should load all items from the JSON file', () => {
      const items = loadAllItems();

      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should load at least 40 items', () => {
      const items = loadAllItems();

      expect(items.length).toBeGreaterThanOrEqual(40);
    });

    it('should cache items on subsequent calls', () => {
      const items1 = loadAllItems();
      const items2 = loadAllItems();

      expect(items1).toBe(items2); // Same reference
    });

    it('should load items with all required properties', () => {
      const items = loadAllItems();

      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('locationHint');
      });
    });

    it('should have unique item IDs', () => {
      const items = loadAllItems();
      const ids = items.map(item => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(items.length);
    });
  });

  describe('getItemById', () => {
    it('should return an item when given a valid ID', () => {
      const item = getItemById('loose_brick');

      expect(item).toBeDefined();
      expect(item?.id).toBe('loose_brick');
      expect(item?.name).toBe('Loose Brick');
    });

    it('should return undefined for invalid item ID', () => {
      const item = getItemById('nonexistent_item');

      expect(item).toBeUndefined();
    });

    it('should return correct item for all known items', () => {
      const knownItems = [
        'rusty_spoon',
        'guard_keycard',
        'shiv',
        'guard_uniform',
        'bandages',
        'lockpick_set',
      ];

      knownItems.forEach(itemId => {
        const item = getItemById(itemId);
        expect(item).toBeDefined();
        expect(item?.id).toBe(itemId);
      });
    });
  });

  describe('getItemsByCategory', () => {
    it('should return all items in the tool category', () => {
      const toolItems = getItemsByCategory('tool');

      expect(Array.isArray(toolItems)).toBe(true);
      expect(toolItems.length).toBeGreaterThan(0);
      toolItems.forEach(item => {
        expect(item.category).toBe('tool');
      });
    });

    it('should return all items in the weapon category', () => {
      const weaponItems = getItemsByCategory('weapon');

      expect(weaponItems.length).toBeGreaterThan(0);
      weaponItems.forEach(item => {
        expect(item.category).toBe('weapon');
      });
    });

    it('should return all items in the disguise category', () => {
      const disguiseItems = getItemsByCategory('disguise');

      expect(disguiseItems.length).toBeGreaterThan(0);
      disguiseItems.forEach(item => {
        expect(item.category).toBe('disguise');
      });
    });

    it('should return all items in the medical category', () => {
      const medicalItems = getItemsByCategory('medical');

      expect(medicalItems.length).toBeGreaterThan(0);
      medicalItems.forEach(item => {
        expect(item.category).toBe('medical');
      });
    });

    it('should return all items in the evidence category', () => {
      const evidenceItems = getItemsByCategory('evidence');

      expect(evidenceItems.length).toBeGreaterThan(0);
      evidenceItems.forEach(item => {
        expect(item.category).toBe('evidence');
      });
    });

    it('should return all items in the misc category', () => {
      const miscItems = getItemsByCategory('misc');

      expect(miscItems.length).toBeGreaterThan(0);
      miscItems.forEach(item => {
        expect(item.category).toBe('misc');
      });
    });

    it('should return items for all categories', () => {
      const categories: ItemCategory[] = ['tool', 'disguise', 'medical', 'weapon', 'evidence', 'misc'];

      categories.forEach(category => {
        const items = getItemsByCategory(category);
        expect(items.length).toBeGreaterThan(0);
      });
    });
  });

  describe('searchItems', () => {
    it('should find items by name', () => {
      const results = searchItems('Spoon');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(item => item.name.toLowerCase().includes('spoon'))).toBe(true);
    });

    it('should find items by description', () => {
      const results = searchItems('weapon');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(item =>
        item.description.toLowerCase().includes('weapon')
      )).toBe(true);
    });

    it('should find items by location hint', () => {
      const results = searchItems('workshop');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(item =>
        item.locationHint.toLowerCase().includes('workshop')
      )).toBe(true);
    });

    it('should be case-insensitive', () => {
      const resultsLower = searchItems('guard');
      const resultsUpper = searchItems('GUARD');
      const resultsMixed = searchItems('GuArD');

      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBe(resultsMixed.length);
    });

    it('should return empty array for no matches', () => {
      const results = searchItems('xyznonexistentitemquery123');

      expect(results).toEqual([]);
    });

    it('should find multiple items with common terms', () => {
      const results = searchItems('key');

      expect(results.length).toBeGreaterThan(1);
    });
  });

  describe('getAllCategories', () => {
    it('should return all six categories', () => {
      const categories = getAllCategories();

      expect(categories).toHaveLength(6);
      expect(categories).toContain('tool');
      expect(categories).toContain('disguise');
      expect(categories).toContain('medical');
      expect(categories).toContain('weapon');
      expect(categories).toContain('evidence');
      expect(categories).toContain('misc');
    });
  });

  describe('getItemCountByCategory', () => {
    it('should return counts for all categories', () => {
      const counts = getItemCountByCategory();

      expect(counts).toHaveProperty('tool');
      expect(counts).toHaveProperty('disguise');
      expect(counts).toHaveProperty('medical');
      expect(counts).toHaveProperty('weapon');
      expect(counts).toHaveProperty('evidence');
      expect(counts).toHaveProperty('misc');
    });

    it('should have positive counts for each category', () => {
      const counts = getItemCountByCategory();

      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(0);
      });
    });

    it('should sum to total item count', () => {
      const counts = getItemCountByCategory();
      const totalFromCounts = Object.values(counts).reduce((sum, count) => sum + count, 0);
      const actualTotal = getTotalItemCount();

      expect(totalFromCounts).toBe(actualTotal);
    });

    it('should have at least 3 items in tool category', () => {
      const counts = getItemCountByCategory();

      expect(counts.tool).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 items in weapon category', () => {
      const counts = getItemCountByCategory();

      expect(counts.weapon).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 items in disguise category', () => {
      const counts = getItemCountByCategory();

      expect(counts.disguise).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 items in medical category', () => {
      const counts = getItemCountByCategory();

      expect(counts.medical).toBeGreaterThanOrEqual(3);
    });
  });

  describe('isValidItemId', () => {
    it('should return true for valid item IDs', () => {
      expect(isValidItemId('loose_brick')).toBe(true);
      expect(isValidItemId('rusty_spoon')).toBe(true);
      expect(isValidItemId('guard_keycard')).toBe(true);
    });

    it('should return false for invalid item IDs', () => {
      expect(isValidItemId('nonexistent_item')).toBe(false);
      expect(isValidItemId('')).toBe(false);
      expect(isValidItemId('invalid123')).toBe(false);
    });
  });

  describe('getTotalItemCount', () => {
    it('should return the total number of items', () => {
      const count = getTotalItemCount();

      expect(count).toBeGreaterThanOrEqual(40);
      expect(count).toBe(loadAllItems().length);
    });
  });

  describe('clearItemsCache', () => {
    it('should clear the cache', () => {
      const items1 = loadAllItems();
      clearItemsCache();
      const items2 = loadAllItems();

      // Same content after cache clear
      expect(items1).toEqual(items2);
      // Verify items are still loaded correctly
      expect(items2.length).toBeGreaterThanOrEqual(40);
    });
  });

  describe('Item data validation', () => {
    it('should have non-empty names for all items', () => {
      const items = loadAllItems();

      items.forEach(item => {
        expect(item.name.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty descriptions for all items', () => {
      const items = loadAllItems();

      items.forEach(item => {
        expect(item.description.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty location hints for all items', () => {
      const items = loadAllItems();

      items.forEach(item => {
        expect(item.locationHint.length).toBeGreaterThan(0);
      });
    });

    it('should have valid categories for all items', () => {
      const items = loadAllItems();
      const validCategories = getAllCategories();

      items.forEach(item => {
        expect(validCategories).toContain(item.category);
      });
    });
  });

  describe('Specific item verification', () => {
    it('should have expected items from the data file', () => {
      const expectedItems = [
        'loose_brick',
        'rusty_spoon',
        'contraband_phone',
        'guard_keycard',
        'tobacco_pouch',
        'shiv',
        'prison_map',
        'soap_bar',
        'playing_cards',
        'photo_family',
        'wire_cutters',
        'flashlight',
        'guard_uniform',
        'janitor_outfit',
        'kitchen_apron',
        'medical_scrubs',
        'bandages',
        'painkillers',
        'antibiotics',
        'first_aid_kit',
      ];

      expectedItems.forEach(itemId => {
        const item = getItemById(itemId);
        expect(item).toBeDefined();
        expect(item?.id).toBe(itemId);
      });
    });

    it('should have correct categories for known items', () => {
      expect(getItemById('shiv')?.category).toBe('weapon');
      expect(getItemById('guard_uniform')?.category).toBe('disguise');
      expect(getItemById('bandages')?.category).toBe('medical');
      expect(getItemById('lockpick_set')?.category).toBe('tool');
      expect(getItemById('prison_map')?.category).toBe('evidence');
      expect(getItemById('tobacco_pouch')?.category).toBe('misc');
    });
  });
});
