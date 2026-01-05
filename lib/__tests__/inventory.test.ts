/**
 * Tests for inventory state management
 * Phase 2 - Step 16: Inventory State Setup
 */

import { useGameStore } from '../store';

describe('Inventory State Management', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetGame();
  });

  describe('addItem', () => {
    it('should add an item to the inventory', () => {
      const { addItem } = useGameStore.getState();

      addItem('rusty_spoon');

      expect(useGameStore.getState().inventory).toContain('rusty_spoon');
      expect(useGameStore.getState().inventory).toHaveLength(1);
    });

    it('should add multiple different items to the inventory', () => {
      const { addItem } = useGameStore.getState();

      addItem('rusty_spoon');
      addItem('loose_brick');
      addItem('tobacco_pouch');

      const inventory = useGameStore.getState().inventory;
      expect(inventory).toContain('rusty_spoon');
      expect(inventory).toContain('loose_brick');
      expect(inventory).toContain('tobacco_pouch');
      expect(inventory).toHaveLength(3);
    });

    it('should not add duplicate items', () => {
      const { addItem } = useGameStore.getState();

      addItem('rusty_spoon');
      addItem('rusty_spoon');
      addItem('rusty_spoon');

      const inventory = useGameStore.getState().inventory;
      expect(inventory).toHaveLength(1);
      expect(inventory).toEqual(['rusty_spoon']);
    });

    it('should maintain existing items when adding new ones', () => {
      const { addItem } = useGameStore.getState();

      addItem('item1');
      addItem('item2');

      addItem('item3');

      const inventoryAfter = useGameStore.getState().inventory;
      expect(inventoryAfter).toContain('item1');
      expect(inventoryAfter).toContain('item2');
      expect(inventoryAfter).toContain('item3');
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the inventory', () => {
      const { addItem, removeItem } = useGameStore.getState();

      addItem('rusty_spoon');
      expect(useGameStore.getState().inventory).toContain('rusty_spoon');

      removeItem('rusty_spoon');
      expect(useGameStore.getState().inventory).not.toContain('rusty_spoon');
      expect(useGameStore.getState().inventory).toHaveLength(0);
    });

    it('should only remove the specified item', () => {
      const { addItem, removeItem } = useGameStore.getState();

      addItem('item1');
      addItem('item2');
      addItem('item3');

      removeItem('item2');

      const inventory = useGameStore.getState().inventory;
      expect(inventory).toContain('item1');
      expect(inventory).not.toContain('item2');
      expect(inventory).toContain('item3');
      expect(inventory).toHaveLength(2);
    });

    it('should handle removing non-existent items gracefully', () => {
      const { addItem, removeItem } = useGameStore.getState();

      addItem('item1');

      expect(() => {
        removeItem('non_existent_item');
      }).not.toThrow();

      expect(useGameStore.getState().inventory).toEqual(['item1']);
    });

    it('should handle removing from empty inventory', () => {
      const { removeItem } = useGameStore.getState();

      expect(() => {
        removeItem('any_item');
      }).not.toThrow();

      expect(useGameStore.getState().inventory).toHaveLength(0);
    });
  });

  describe('hasItem', () => {
    it('should return true when item is in inventory', () => {
      const { addItem, hasItem } = useGameStore.getState();

      addItem('rusty_spoon');

      expect(hasItem('rusty_spoon')).toBe(true);
    });

    it('should return false when item is not in inventory', () => {
      const { hasItem } = useGameStore.getState();

      expect(hasItem('rusty_spoon')).toBe(false);
    });

    it('should return false after item is removed', () => {
      const { addItem, removeItem, hasItem } = useGameStore.getState();

      addItem('rusty_spoon');
      expect(hasItem('rusty_spoon')).toBe(true);

      removeItem('rusty_spoon');
      expect(hasItem('rusty_spoon')).toBe(false);
    });

    it('should correctly check multiple items', () => {
      const { addItem, hasItem } = useGameStore.getState();

      addItem('item1');
      addItem('item3');

      expect(hasItem('item1')).toBe(true);
      expect(hasItem('item2')).toBe(false);
      expect(hasItem('item3')).toBe(true);
    });
  });

  describe('Inventory persistence across state changes', () => {
    it('should maintain inventory when navigating scenes', () => {
      const { addItem, goToScene } = useGameStore.getState();

      addItem('rusty_spoon');
      addItem('loose_brick');

      goToScene('A-1-001');

      const inventory = useGameStore.getState().inventory;
      expect(inventory).toContain('rusty_spoon');
      expect(inventory).toContain('loose_brick');
      expect(inventory).toHaveLength(2);
    });

    it('should maintain inventory when going back', () => {
      const { addItem, goToScene, goBack } = useGameStore.getState();

      addItem('item1');
      goToScene('scene1');
      addItem('item2');
      goToScene('scene2');

      goBack();

      const inventory = useGameStore.getState().inventory;
      expect(inventory).toContain('item1');
      expect(inventory).toContain('item2');
    });
  });

  describe('Inventory initial state', () => {
    it('should start with an empty inventory', () => {
      const { inventory } = useGameStore.getState();

      expect(inventory).toEqual([]);
      expect(inventory).toHaveLength(0);
    });
  });

  describe('Inventory reset', () => {
    it('should clear inventory when game is reset', () => {
      const { addItem, resetGame } = useGameStore.getState();

      addItem('item1');
      addItem('item2');
      addItem('item3');

      resetGame();

      expect(useGameStore.getState().inventory).toEqual([]);
      expect(useGameStore.getState().inventory).toHaveLength(0);
    });
  });

  describe('Complex inventory scenarios', () => {
    it('should handle adding and removing items in sequence', () => {
      const { addItem, removeItem, hasItem } = useGameStore.getState();

      addItem('item1');
      addItem('item2');
      removeItem('item1');
      addItem('item3');
      removeItem('item2');
      addItem('item4');

      const inventory = useGameStore.getState().inventory;
      expect(hasItem('item1')).toBe(false);
      expect(hasItem('item2')).toBe(false);
      expect(hasItem('item3')).toBe(true);
      expect(hasItem('item4')).toBe(true);
      expect(inventory).toHaveLength(2);
    });

    it('should handle typical game progression inventory changes', () => {
      const { addItem, removeItem, hasItem } = useGameStore.getState();

      // Find a loose brick in cell
      addItem('loose_brick');
      expect(hasItem('loose_brick')).toBe(true);

      // Trade it for a spoon
      removeItem('loose_brick');
      addItem('rusty_spoon');
      expect(hasItem('loose_brick')).toBe(false);
      expect(hasItem('rusty_spoon')).toBe(true);

      // Find more items
      addItem('tobacco_pouch');
      addItem('playing_cards');

      // Use the spoon (consume it)
      removeItem('rusty_spoon');

      const inventory = useGameStore.getState().inventory;
      expect(inventory).toHaveLength(2);
      expect(hasItem('tobacco_pouch')).toBe(true);
      expect(hasItem('playing_cards')).toBe(true);
    });
  });

  describe('Inventory with game items from data file', () => {
    it('should work with all item IDs from the items data file', () => {
      const { addItem, hasItem } = useGameStore.getState();

      const itemIds = [
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
      ];

      itemIds.forEach(itemId => {
        addItem(itemId);
        expect(hasItem(itemId)).toBe(true);
      });

      expect(useGameStore.getState().inventory).toHaveLength(itemIds.length);
    });
  });
});
