/**
 * Item loader utility for El Palo de Queso
 * Loads and manages item data from JSON files
 */

import type { Item, ItemCategory } from '@/types';
import itemsData from '@/data/items.json';

/**
 * Interface for the items JSON structure
 */
interface ItemsJSON {
  items: Item[];
}

/**
 * Cached items for performance
 */
let itemsCache: Item[] | null = null;

/**
 * Load all items from the items.json file
 * @returns Array of all items
 */
export function loadAllItems(): Item[] {
  if (itemsCache) {
    return itemsCache;
  }

  const data = itemsData as ItemsJSON;
  itemsCache = data.items;
  return itemsCache;
}

/**
 * Get a specific item by its ID
 * @param itemId - The unique identifier of the item
 * @returns The item if found, undefined otherwise
 */
export function getItemById(itemId: string): Item | undefined {
  const items = loadAllItems();
  return items.find(item => item.id === itemId);
}

/**
 * Get all items in a specific category
 * @param category - The category to filter by
 * @returns Array of items in the specified category
 */
export function getItemsByCategory(category: ItemCategory): Item[] {
  const items = loadAllItems();
  return items.filter(item => item.category === category);
}

/**
 * Search items by name or description
 * @param searchTerm - The term to search for (case-insensitive)
 * @returns Array of items matching the search term
 */
export function searchItems(searchTerm: string): Item[] {
  const items = loadAllItems();
  const lowerSearchTerm = searchTerm.toLowerCase();

  return items.filter(item =>
    item.name.toLowerCase().includes(lowerSearchTerm) ||
    item.description.toLowerCase().includes(lowerSearchTerm) ||
    item.locationHint.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Get all available item categories
 * @returns Array of all item categories
 */
export function getAllCategories(): ItemCategory[] {
  return ['tool', 'disguise', 'medical', 'weapon', 'evidence', 'misc'];
}

/**
 * Get count of items in each category
 * @returns Object mapping categories to item counts
 */
export function getItemCountByCategory(): Record<ItemCategory, number> {
  const items = loadAllItems();
  const counts: Record<ItemCategory, number> = {
    tool: 0,
    disguise: 0,
    medical: 0,
    weapon: 0,
    evidence: 0,
    misc: 0,
  };

  items.forEach(item => {
    counts[item.category]++;
  });

  return counts;
}

/**
 * Validate that an item ID exists
 * @param itemId - The item ID to validate
 * @returns True if the item exists, false otherwise
 */
export function isValidItemId(itemId: string): boolean {
  return getItemById(itemId) !== undefined;
}

/**
 * Get total number of items
 * @returns Total count of all items
 */
export function getTotalItemCount(): number {
  return loadAllItems().length;
}

/**
 * Clear the items cache (useful for testing)
 */
export function clearItemsCache(): void {
  itemsCache = null;
}
