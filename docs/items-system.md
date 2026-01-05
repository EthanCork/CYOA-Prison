# Items System Documentation

## Overview
The items system for El Palo de Queso manages all collectible items that players can find, use, and trade throughout the game.

## Item Data Structure

Each item has the following properties:
- `id`: Unique identifier (string)
- `name`: Display name (string)
- `description`: Detailed description of the item (string)
- `category`: Item category type (ItemCategory)
- `locationHint`: Hint about where to find the item (string)

## Item Categories

The game includes 6 item categories:

1. **Tool** (17 items, 34.0%)
   - Utility items like lockpicks, keys, rope, wire cutters
   - Used for solving puzzles and accessing areas

2. **Weapon** (5 items, 10.0%)
   - Combat and defense items like shiv, glass shard, metal pipe
   - Used for confrontations and protection

3. **Disguise** (4 items, 8.0%)
   - Uniforms and outfits for blending in
   - Includes guard uniform, janitor outfit, kitchen apron, medical scrubs

4. **Medical** (4 items, 8.0%)
   - Health and healing items
   - Includes bandages, painkillers, antibiotics, first aid kit

5. **Evidence** (6 items, 12.0%)
   - Information and documents
   - Includes prison map, security manual, shift schedule, tunnel plans

6. **Misc** (14 items, 28.0%)
   - General items for trade and utility
   - Includes tobacco, cigarettes, playing cards, soap, etc.

## Total Items: 50

## Item Loader API

### Core Functions

#### `loadAllItems(): Item[]`
Loads all items from the items.json file. Results are cached for performance.

```typescript
import { loadAllItems } from '@/lib/itemLoader';

const allItems = loadAllItems();
console.log(`Total items: ${allItems.length}`);
```

#### `getItemById(itemId: string): Item | undefined`
Retrieves a specific item by its ID.

```typescript
import { getItemById } from '@/lib/itemLoader';

const spoon = getItemById('rusty_spoon');
if (spoon) {
  console.log(spoon.name); // "Rusty Spoon"
  console.log(spoon.category); // "tool"
}
```

#### `getItemsByCategory(category: ItemCategory): Item[]`
Gets all items in a specific category.

```typescript
import { getItemsByCategory } from '@/lib/itemLoader';

const weapons = getItemsByCategory('weapon');
console.log(`Found ${weapons.length} weapons`);
```

#### `searchItems(searchTerm: string): Item[]`
Searches items by name, description, or location hint (case-insensitive).

```typescript
import { searchItems } from '@/lib/itemLoader';

const results = searchItems('workshop');
// Returns all items related to the workshop
```

### Utility Functions

#### `getAllCategories(): ItemCategory[]`
Returns all available item categories.

#### `getItemCountByCategory(): Record<ItemCategory, number>`
Returns count of items in each category.

#### `isValidItemId(itemId: string): boolean`
Validates if an item ID exists.

#### `getTotalItemCount(): number`
Returns total number of items.

#### `clearItemsCache(): void`
Clears the cached items (useful for testing).

## Data File Location

Items are defined in: `/data/items.json`

## Type Definitions

Located in: `/types/game.ts`

```typescript
export type ItemCategory = 'tool' | 'disguise' | 'medical' | 'weapon' | 'evidence' | 'misc';

export interface Item {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  locationHint: string;
}
```

## Verification

Run the item verification script:

```bash
npm run verify:items
```

This displays:
- Total item count
- Items per category
- Category distribution percentages

## Testing

Item loader tests are located in: `/lib/__tests__/itemLoader.test.ts`

Run tests:
```bash
npm test -- lib/__tests__/itemLoader.test.ts
```

Test coverage includes:
- Loading and caching
- ID-based retrieval
- Category filtering
- Search functionality
- Data validation
- All 50 items verified

## Integration with Game State

Items in the player's inventory are tracked as an array of item IDs in the game state:

```typescript
interface GameState {
  inventory: string[]; // Array of item IDs
  // ... other state
}
```

Use the inventory management functions from the game store:
- `addItem(itemId: string)` - Add item to inventory
- `removeItem(itemId: string)` - Remove item from inventory
- `hasItem(itemId: string)` - Check if player has item

## Notable Items

### Key Tools
- `lockpick_set` - Open simple locks
- `master_key` - Opens multiple locks
- `wire_cutters` - Essential for escape
- `rope` - Climbing and binding

### Important Disguises
- `guard_uniform` - Move freely in restricted areas
- `janitor_outfit` - Access maintenance areas
- `medical_scrubs` - Access medical wing

### Critical Evidence
- `prison_map` - Shows prison layout
- `security_manual` - Guard procedures
- `shift_schedule` - Guard rotation times
- `tunnel_plans` - Escape tunnel information

### Prison Currency
- `tobacco_pouch` - Common currency
- `cigarettes` - Premium currency
- `money_cash` - Most valuable
