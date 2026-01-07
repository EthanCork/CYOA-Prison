# Step 33: Start New Game Flow

## Overview

Implemented a complete new game initialization system that allows players to start a fresh game with proper state reset and optional confirmation when progress exists.

## Implementation Summary

### 1. Store Functions

Added two new functions to the game store ([lib/store.ts](../lib/store.ts)):

#### `startNewGame(deleteAutoSave?: boolean)`
- Resets all game state to initial values
- Returns player to scene `X-0-001`
- Optionally deletes auto-save data (default: true)
- Handles localStorage errors gracefully

#### `hasProgress()`
- Checks if player has made any progress
- Returns `true` if:
  - Current scene is not `X-0-001`
  - Scene history exists
  - Inventory contains items
  - Any flags are set
  - Any relationships exist

### 2. Components

#### ConfirmDialog ([components/ConfirmDialog.tsx](../components/ConfirmDialog.tsx))
- Reusable confirmation dialog component
- Supports three button styles: `danger`, `warning`, `info`
- Customizable title, message, and button text
- Modal overlay with backdrop
- Fully tested (14 tests passing)

**Props:**
```typescript
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}
```

#### NewGameButton ([components/NewGameButton.tsx](../components/NewGameButton.tsx))
- Smart button component that handles new game flow
- Automatically detects if player has progress
- Shows confirmation dialog only when needed
- Supports custom styling and callbacks
- Fully tested (11 tests passing)

**Props:**
```typescript
interface NewGameButtonProps {
  children?: React.ReactNode;
  className?: string;
  onNewGame?: () => void;
  deleteAutoSave?: boolean;
  alwaysConfirm?: boolean;
}
```

**Usage Examples:**
```tsx
// Basic usage
<NewGameButton>Start Over</NewGameButton>

// Keep auto-save
<NewGameButton deleteAutoSave={false}>
  New Game (Keep Progress)
</NewGameButton>

// Always show confirmation
<NewGameButton alwaysConfirm={true}>
  New Game
</NewGameButton>

// With callback
<NewGameButton
  onNewGame={() => router.push('/intro')}
  className="px-6 py-3 bg-red-600 text-white rounded"
>
  Start Fresh
</NewGameButton>
```

### 3. Demo Page

Created interactive demo at [/new-game-demo](http://localhost:3000/new-game-demo) ([app/new-game-demo/page.tsx](../app/new-game-demo/page.tsx)):

Features:
- Real-time progress status display
- Test actions to simulate game progress
- Three button variants demonstrating different configurations
- Current game state visualization
- Comprehensive testing instructions

### 4. Tests

Comprehensive test suite with 43 passing tests:

#### Store Tests ([lib/__tests__/newGame.test.ts](../lib/__tests__/newGame.test.ts))
- 18 tests covering:
  - `startNewGame()` functionality
  - `hasProgress()` detection
  - Auto-save deletion/preservation
  - Integration with save system
  - Error handling

#### Component Tests
- **ConfirmDialog** ([components/__tests__/ConfirmDialog.test.tsx](../components/__tests__/ConfirmDialog.test.tsx)): 14 tests
- **NewGameButton** ([components/__tests__/NewGameButton.test.tsx](../components/__tests__/NewGameButton.test.tsx)): 11 tests

Run tests with:
```bash
npm test -- lib/__tests__/newGame.test.ts
npm test -- components/__tests__/NewGameButton.test.tsx
npm test -- components/__tests__/ConfirmDialog.test.tsx
```

## Key Features

### Smart Progress Detection
The system automatically detects player progress by checking:
- Current scene location
- Scene history
- Inventory items
- Active flags
- Character relationships

### Confirmation Dialog
When starting a new game with existing progress:
- Shows clear warning message
- Prevents accidental progress loss
- Allows cancellation
- Can be configured to always show or never show

### Auto-Save Management
Two modes for handling auto-save:
1. **Delete auto-save** (default): Fresh start, no saved progress
2. **Keep auto-save**: Allows reverting to previous progress

### Initial State
All state values reset to:
```typescript
{
  currentScene: 'X-0-001',
  sceneHistory: [],
  currentPath: null,
  dayTime: null,
  workAssignment: null,
  inventory: [],
  relationships: {},
  discoveredCharacters: [],
  flags: [],
  evidence: [],
  stats: {
    scenesVisited: 0,
    choicesMade: 0,
    itemsFound: 0,
    relationshipsMaxed: 0,
    relationshipsMinned: 0,
    stageReached: 0,
    pathTaken: null,
    playTimeSeconds: 0,
  }
}
```

## Integration with Existing Systems

### Save/Load System
- Works seamlessly with manual save slots (Steps 29-31)
- Auto-save can be preserved or deleted
- Manual saves remain unaffected

### Auto-Save System
- Respects auto-save settings (Step 32)
- Can choose to delete or preserve auto-save
- No conflicts with auto-save hooks

### Game State
- Resets all Path C specific state (time, work assignment)
- Clears all discovered characters
- Removes all collected evidence
- Resets all relationship scores

## Error Handling

### localStorage Errors
If auto-save deletion fails:
- Error is logged to console
- Game state still resets successfully
- Does not block new game start

### Missing Auto-Save
System gracefully handles:
- No auto-save exists
- Corrupted auto-save data
- localStorage unavailable

## Testing the Implementation

1. Visit [http://localhost:3000/new-game-demo](http://localhost:3000/new-game-demo)
2. Initially at `X-0-001` with no progress
3. Click "New Game" - starts immediately (no confirmation)
4. Use test actions to create progress
5. Click "New Game" again - now shows confirmation
6. Try different button variants
7. Verify state resets correctly

## Files Modified/Created

### Created Files
- [lib/store.ts](../lib/store.ts) - Added `startNewGame()` and `hasProgress()`
- [components/ConfirmDialog.tsx](../components/ConfirmDialog.tsx) - New reusable dialog
- [components/NewGameButton.tsx](../components/NewGameButton.tsx) - New smart button
- [app/new-game-demo/page.tsx](../app/new-game-demo/page.tsx) - Interactive demo
- [lib/__tests__/newGame.test.ts](../lib/__tests__/newGame.test.ts) - Store tests
- [components/__tests__/ConfirmDialog.test.tsx](../components/__tests__/ConfirmDialog.test.tsx) - Dialog tests
- [components/__tests__/NewGameButton.test.tsx](../components/__tests__/NewGameButton.test.tsx) - Button tests

### Modified Files
- [lib/store.ts](../lib/store.ts) - Added new store interface methods and implementations

## Next Steps

### Integration Points
The NewGameButton can be integrated into:
1. Main menu screen
2. Settings/Options menu
3. Game over screen
4. Title screen
5. Debug/Developer menu

### Recommended Usage
```tsx
import NewGameButton from '@/components/NewGameButton';

function MainMenu() {
  return (
    <div>
      <NewGameButton
        onNewGame={() => router.push('/intro')}
        className="menu-button"
      >
        New Game
      </NewGameButton>
    </div>
  );
}
```

## Summary

Step 33 is complete with:
- ✅ New game initialization function (`startNewGame`)
- ✅ Progress detection function (`hasProgress`)
- ✅ Reusable confirmation dialog component
- ✅ Smart new game button component
- ✅ Complete state reset to initial values
- ✅ Optional auto-save deletion
- ✅ Interactive demo page
- ✅ Comprehensive test coverage (43 tests passing)
- ✅ Full documentation

The system provides a polished, user-friendly way to start a new game with proper safeguards against accidental progress loss.
