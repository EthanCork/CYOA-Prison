# Step 37: Scene History & Back Button

## Overview

Implemented a comprehensive scene history system for "El Palo de Queso" allowing players to view previously visited scenes and navigate backward through their journey.

## Implementation Summary

### 1. History Limit (20 Scenes)

Updated game store ([lib/store.ts](../lib/store.ts)) to limit scene history:

**Implementation:**
```typescript
goToScene: (sceneId: string, addToHistory = true) => {
  set((state) => {
    let newHistory = addToHistory
      ? [...state.sceneHistory, state.currentScene]
      : state.sceneHistory;

    // Limit history to last 20 scenes
    const MAX_HISTORY_LENGTH = 20;
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
    }

    return {
      currentScene: sceneId,
      sceneHistory: newHistory,
      // ... stats tracking
    };
  });
},
```

**Features:**
- Automatically maintains last 20 scenes visited
- Oldest scenes removed when limit exceeded
- Preserves most recent navigation path
- No manual management required

### 2. BackButton Component

Created back button component ([components/BackButton.tsx](../components/BackButton.tsx)):

**Features:**
- Returns to immediately previous scene
- Automatically enabled/disabled based on history
- Icon with optional text label
- Customizable styling
- Callback support

**Props:**
```typescript
interface BackButtonProps {
  className?: string;
  variant?: 'full' | 'icon';
  onBack?: () => void;
}
```

**Visual Design:**
- Left arrow icon (SVG)
- "Back" text label (optional)
- Disabled state when no history
- Hover effects
- Helpful title attribute

### 3. SceneHistory Component

Created scene history panel ([components/SceneHistory.tsx](../components/SceneHistory.tsx)):

**Features:**
- Two display variants: panel and inline
- Shows current scene highlighted
- Lists previous scenes in reverse order (most recent first)
- Step count for each historical scene
- Scene count display
- Scrollable for long lists
- Reference-only display (not clickable)

**Props:**
```typescript
interface SceneHistoryProps {
  maxItems?: number;
  variant?: 'panel' | 'inline';
  interactive?: boolean;
  className?: string;
}
```

**Panel Variant:**
- Full-featured display with title
- Current scene highlighted in blue
- Previous scene marked as "Previous"
- Older scenes show step count
- Scrollable list (max-height 384px)
- Scene count summary
- Reference note

**Inline Variant:**
- Compact breadcrumb-style display
- Shows last 5 scenes
- Arrow separators
- Ellipsis for overflow
- Suitable for header/footer

### 4. Demo Page

Created interactive demo ([app/history-demo/page.tsx](../app/history-demo/page.tsx)):

**URL:** [http://localhost:3000/history-demo](http://localhost:3000/history-demo)

**Features:**
- Current scene display
- Back button testing
- Random scene navigation
- Multi-scene navigation (5 at once)
- Quick navigation to specific scenes
- Real-time history panel
- Statistics display
- Comprehensive instructions

### 5. Tests

Comprehensive test coverage with 33 passing tests:

#### BackButton Tests ([components/__tests__/BackButton.test.tsx](../components/__tests__/BackButton.test.tsx))
- 16 tests covering:
  - Rendering with icon
  - Full and icon-only variants
  - Enabled/disabled states
  - Navigation functionality
  - Callback execution
  - Multiple back operations
  - Custom styling
  - Title attributes

#### SceneHistory Tests ([components/__tests__/SceneHistory.test.tsx](../components/__tests__/SceneHistory.test.tsx))
- 17 tests covering:
  - Panel variant rendering
  - Inline variant rendering
  - Empty state display
  - Current scene highlighting
  - History list ordering
  - Scene count display
  - 20-scene limit enforcement
  - Overflow handling
  - Custom styling

Run tests with:
```bash
npm test -- components/__tests__/BackButton.test.tsx
npm test -- components/__tests__/SceneHistory.test.tsx
```

## Key Features

### History Tracking
- **Automatic:** History tracked on every scene navigation
- **Limited:** Maintains last 20 scenes only
- **Smart:** Oldest scenes automatically removed
- **Persistent:** History saved with game state
- **Resettable:** Cleared on new game

### Back Navigation
- **Simple:** One-click return to previous scene
- **Safe:** Disabled when no history exists
- **Fast:** Immediate navigation
- **Accurate:** Goes to exact previous scene
- **Reversible:** Can go forward again after

### History Display
- **Current Scene:** Always highlighted in blue
- **Recent First:** Most recent scenes at top
- **Step Count:** Shows how many steps back
- **Reference:** For viewing, not direct navigation
- **Compact:** Inline variant for space-constrained UIs

## Usage Examples

### Basic Back Button
```tsx
import BackButton from '@/components/BackButton';

export default function GameScreen() {
  return (
    <div>
      <BackButton />
      {/* Game content */}
    </div>
  );
}
```

### Icon-Only Back Button
```tsx
<BackButton variant="icon" />
```

### Custom Styled Back Button
```tsx
<BackButton
  className="px-6 py-3 bg-blue-700 hover:bg-blue-600"
  onBack={() => console.log('Went back!')}
/>
```

### Panel History Display
```tsx
import SceneHistory from '@/components/SceneHistory';

export default function HistoryPage() {
  return (
    <div>
      <h1>Scene History</h1>
      <SceneHistory variant="panel" maxItems={20} />
    </div>
  );
}
```

### Inline History (Breadcrumb)
```tsx
<div className="header">
  <SceneHistory variant="inline" />
</div>
```

### Accessing History Programmatically
```typescript
import { useGameStore } from '@/lib/store';

function MyComponent() {
  const { sceneHistory, currentScene, goBack } = useGameStore();

  console.log('Current:', currentScene);
  console.log('History length:', sceneHistory.length);
  console.log('Previous scene:', sceneHistory[sceneHistory.length - 1]);

  // Go back manually
  const handleBack = () => {
    if (sceneHistory.length > 0) {
      goBack();
    }
  };
}
```

## How It Works

### Scene Navigation Flow
```
1. Player at scene A
2. Navigate to scene B
   → Scene A added to history
   → Current scene = B
3. Navigate to scene C
   → Scene B added to history
   → Current scene = C
4. Click Back Button
   → Scene C removed from history (implicit)
   → Current scene = B (from history)
5. Click Back Button
   → Scene B removed from history (implicit)
   → Current scene = A (from history)
```

### History Limit Behavior
```
Scenes visited: 1, 2, 3, ..., 25

History array after scene 25:
[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
 ^                                                                        ^
 oldest (scene 6)                                           most recent (scene 24)
                                                            current = scene 25

Scenes 1-5 and X-0-001 were removed to maintain 20-item limit
```

### goBack Implementation
```typescript
goBack: () => {
  set((state) => {
    if (state.sceneHistory.length === 0) {
      return state; // No history to go back to
    }
    const newHistory = [...state.sceneHistory];
    const previousScene = newHistory.pop()!;
    return {
      currentScene: previousScene,
      sceneHistory: newHistory,
    };
  });
},
```

## Visual Design

### BackButton
**Default State:**
- Gray background (bg-gray-700)
- White text
- Left arrow icon
- Hover: Lighter gray (bg-gray-600)

**Disabled State:**
- Darker gray (bg-gray-800)
- Grayed text (text-gray-600)
- Cursor not-allowed
- No hover effect

### SceneHistory Panel
**Current Scene:**
- Blue background (bg-blue-900/30)
- Blue border (border-blue-700/50)
- Blue text (text-blue-200)
- Blue dot indicator

**Previous Scene:**
- Gray background (bg-gray-700/30)
- "Previous" label
- Gray dot indicator

**Older Scenes:**
- Darker gray background (bg-gray-800/50)
- Step count label (e.g., "2 steps back")
- Gray dot indicator

### Color Coding
- **Blue:** Current scene
- **Light Gray:** Most recent (previous)
- **Dark Gray:** Older scenes
- **Yellow:** Warning notes

## Integration Points

### Save/Load System
History is included in save files:
```typescript
interface SavedGame {
  gameState: {
    sceneHistory: string[];
    currentScene: string;
    // ... other state
  };
}
```

**Behavior:**
- Save captures current history
- Load restores exact history state
- Can continue navigating back after load

### New Game Flow
Starting a new game clears history:
```typescript
startNewGame: () => {
  set(initialState); // sceneHistory: []
}
```

### Auto-Save
History automatically saved on scene transitions when auto-save enabled.

## Accessibility

**BackButton:**
- Semantic button element
- Disabled attribute when no history
- Title attribute for context
- Keyboard accessible
- Screen reader friendly

**SceneHistory:**
- Semantic HTML structure
- Clear labeling
- Scrollable with keyboard
- High contrast colors
- Readable font sizes

## Performance Considerations

**History Limit:**
- Prevents unbounded array growth
- O(1) access to recent history
- O(n) for trimming (max n=20)
- Minimal memory footprint

**Component Rendering:**
- Conditional rendering (empty state)
- Reverse iteration (slice + reverse)
- Virtualization not needed (max 20 items)
- Efficient re-renders

**Storage:**
- History serialized with save data
- JSON array of strings
- Typically < 1KB in saves

## Files Created/Modified

### Modified Files
- [lib/store.ts](../lib/store.ts) - Added 20-scene history limit

### Created Files
- [components/BackButton.tsx](../components/BackButton.tsx) - Back button component
- [components/SceneHistory.tsx](../components/SceneHistory.tsx) - History display component
- [app/history-demo/page.tsx](../app/history-demo/page.tsx) - Interactive demo
- [components/__tests__/BackButton.test.tsx](../components/__tests__/BackButton.test.tsx) - Back button tests
- [components/__tests__/SceneHistory.test.tsx](../components/__tests__/SceneHistory.test.tsx) - History display tests

## Testing the Implementation

1. Visit [http://localhost:3000/history-demo](http://localhost:3000/history-demo)
2. Click "Navigate to Random Scene" several times
3. Watch history panel populate
4. Click "Back Button" to return to previous scenes
5. Try "Navigate 5 Random Scenes" to quickly build history
6. Add 25+ scenes to test the 20-scene limit
7. Verify oldest scenes are removed
8. Test inline variant in compact display

## Common Use Cases

### Navigation Controls
```tsx
<div className="game-controls">
  <BackButton />
  {/* Other controls */}
</div>
```

### Breadcrumb Trail
```tsx
<header>
  <SceneHistory variant="inline" />
</header>
```

### History Sidebar
```tsx
<aside className="sidebar">
  <SceneHistory variant="panel" maxItems={15} />
</aside>
```

### Conditional Back Button
```tsx
const { sceneHistory } = useGameStore();

{sceneHistory.length > 0 && <BackButton />}
```

## Future Enhancements

### Potential Additions
- Jump to specific history point (click to navigate)
- Scene thumbnails/previews in history
- Search/filter history
- Export history log
- Branching visualizations
- Bookmarks/favorites
- History annotations

### Advanced Features
- Time-based history grouping
- Chapter/arc summaries
- Decision point highlighting
- Alternative path suggestions

## Limitations

**Current Constraints:**
- History limited to 20 scenes (by design)
- Reference only (click to navigate disabled)
- No branching visualizations
- Linear path tracking only

**Not Tracked:**
- Choice details within scenes
- Time spent per scene
- Player decisions
- Scene variants

## Summary

Step 37 is complete with:
- ✅ 20-scene history limit in store
- ✅ BackButton component with variants
- ✅ SceneHistory component (panel & inline)
- ✅ Automatic history tracking
- ✅ Back navigation functionality
- ✅ Interactive demo page
- ✅ Comprehensive tests (33 passing)
- ✅ Full documentation

The scene history system provides players with a clear view of their journey and easy navigation to previous scenes!
