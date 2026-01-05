# Inventory Panel Component

## Overview
The InventoryPanel component provides a responsive sidebar interface for displaying and interacting with the player's inventory in "El Palo de Queso".

## Location
- Component: `/components/InventoryPanel.tsx`
- Tests: `/components/__tests__/InventoryPanel.test.tsx`
- Demo: `/app/inventory-demo/page.tsx`
- Icon utilities: `/lib/itemIcons.ts`

## Features

### Display
- Shows all items currently in player's inventory
- Empty state message when no items collected
- Item count badge in header (e.g., "Inventory (5)")
- Scrollable list when many items

### Item Presentation
- **Icon/Emoji**: Each item displays a category-specific or item-specific icon
- **Name**: Clear item name
- **Category**: Color-coded category label (tool, weapon, disguise, medical, evidence, misc)
- **Interactive**: Click to view detailed information

### Item Details View
- Appears below item list when an item is clicked
- Shows:
  - Item icon and name
  - Description (what the item is and how it's used)
  - Location hint (where it can be found)
- Close button to dismiss details
- Click same item again to toggle details off
- Click different item to switch details

### Responsive Design
- **Desktop**: Fixed sidebar, always visible
- **Mobile**: Collapsible panel with toggle button
- **Collapse icon**: ▼ when collapsed, ▲ when expanded
- Header is clickable on mobile to toggle

### Category Colors
Items are color-coded by category for quick identification:
- 🔧 **Tool** (Blue) - Utility items
- ⚔️ **Weapon** (Red) - Combat items
- 👔 **Disguise** (Purple) - Outfits and uniforms
- 💊 **Medical** (Green) - Health and healing
- 📄 **Evidence** (Amber) - Information and documents
- 📦 **Misc** (Gray) - General items

## Usage

### Basic Implementation
```tsx
import InventoryPanel from '@/components/InventoryPanel';

export default function GamePage() {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        {/* Your game content */}
      </div>
      <aside className="w-80">
        <InventoryPanel />
      </aside>
    </div>
  );
}
```

### Mobile-First (Start Collapsed)
```tsx
<InventoryPanel defaultCollapsed={true} />
```

### Custom Styling
```tsx
<InventoryPanel className="max-w-sm shadow-xl" />
```

## Integration with Game Store

The component automatically subscribes to inventory changes from the Zustand store:

```tsx
import { useGameStore } from '@/lib/store';

function YourComponent() {
  const { addItem, removeItem, hasItem } = useGameStore();

  // Add item to inventory
  addItem('rusty_spoon');

  // Item automatically appears in InventoryPanel

  // Remove item
  removeItem('rusty_spoon');

  // Check if player has item
  if (hasItem('guard_keycard')) {
    // Allow special action
  }
}
```

## Item Icons System

### Icon Mapping
Icons are defined in `/lib/itemIcons.ts`:

```tsx
import { getItemIcon, getCategoryIcon, getCategoryColor } from '@/lib/itemIcons';

// Get specific item icon (or fallback to category)
const icon = getItemIcon('rusty_spoon', 'tool'); // "🥄"

// Get category icon
const categoryIcon = getCategoryIcon('weapon'); // "⚔️"

// Get category color class
const color = getCategoryColor('medical'); // "text-green-400"
```

### Customizing Icons
To add or modify item icons, edit `/lib/itemIcons.ts`:

```tsx
const specificIcons: Record<string, string> = {
  // Add your custom item icons here
  custom_item: '🔮',
  // ...
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Optional CSS classes |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed (useful for mobile) |

## Component Architecture

### Sub-components

1. **InventoryItem** - Individual item button
   - Shows icon, name, and category
   - Handles click to view details
   - Visual feedback for selected state

2. **ItemDetails** - Item detail view
   - Full item information display
   - Close button
   - Appears below item list

### State Management
- Uses Zustand store for inventory data
- Local state for:
  - `isCollapsed`: Panel collapse state
  - `selectedItemId`: Currently viewed item

### Data Flow
1. Store provides `inventory` (array of item IDs)
2. Component loads full item data using `getItemById()`
3. Filters out invalid items
4. Renders items with icons and details

## Testing

### Running Tests
```bash
npm test -- components/__tests__/InventoryPanel.test.tsx
```

### Test Coverage (28 tests)
- ✓ Basic rendering
- ✓ Empty state display
- ✓ Item display with icons and categories
- ✓ Item selection and details
- ✓ Mobile collapse functionality
- ✓ Dynamic updates when inventory changes
- ✓ Category styling
- ✓ Accessibility (ARIA labels)

## Demo Page

View the component in action:
```bash
npm run dev
# Navigate to: http://localhost:3000/inventory-demo
```

The demo page includes:
- Add/remove random items
- Add all sample items at once
- Clear inventory
- Live item count display
- Feature testing checklist
- Category color legend

## Accessibility

- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Clear visual feedback for interactions
- High contrast color scheme

## Performance

- Uses Zustand subscription for efficient updates
- Only re-renders when inventory changes
- Cached item data from itemLoader
- Minimal DOM updates with React keys

## Future Enhancements

Potential improvements:
- [ ] Drag and drop to reorder items
- [ ] Item quantity support (stackable items)
- [ ] Search/filter items by name or category
- [ ] Sort by category, name, or recently added
- [ ] Item usage/consumption actions
- [ ] Combine items functionality
- [ ] Item weight/capacity limits
- [ ] Quick actions (use, drop, examine)
