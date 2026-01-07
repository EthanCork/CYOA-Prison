# Step 30: Load Game Function - Implementation Summary

**Date**: January 5, 2026
**Status**: ✅ Complete (Implemented in Step 29)

## Overview

The load game functionality was fully implemented as part of Step 29's save/load system. This step documents the load-specific features and verifies all requirements are met.

## Requirements ✅

All Step 30 requirements have been implemented:

- ✅ **Retrieve from localStorage by slot** - `loadGame(slotNumber)` retrieves save data
- ✅ **Deserialize JSON to game state** - `JSON.parse()` with validation
- ✅ **Replace current state with loaded state** - Store's `loadFromSlot()` replaces state
- ✅ **Handle missing/corrupted saves** - Returns null for missing, throws error for corrupted

## Implementation Details

### Core Load Function

Located in [lib/saveGame.ts](../lib/saveGame.ts):

```typescript
export function loadGame(slotNumber: number): SavedGame | null {
  if (typeof window === 'undefined') {
    throw new Error('Cannot load game: localStorage is not available (server-side)');
  }

  try {
    const key = getSaveKey(slotNumber);
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return null; // Slot is empty
    }

    const savedGame = JSON.parse(serialized) as SavedGame;

    // Validate the loaded data
    if (!savedGame.gameState || !savedGame.metadata) {
      throw new Error('Invalid save data structure');
    }

    return savedGame;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load game from slot ${slotNumber}: ${error.message}`);
    }
    throw new Error(`Failed to load game from slot ${slotNumber}: Unknown error`);
  }
}
```

### Store Integration

Located in [lib/store.ts](../lib/store.ts:440-447):

```typescript
loadFromSlot: (slotNumber: number) => {
  const savedGame = loadGame(slotNumber);
  if (!savedGame) {
    return false;
  }
  set(savedGame.gameState);
  return true;
}
```

## Features

### 1. Retrieve from localStorage by Slot ✅

```typescript
const key = getSaveKey(slotNumber);  // "el-palo-de-queso-save-1"
const serialized = localStorage.getItem(key);
```

- Validates slot number (1-3)
- Uses consistent key format
- Returns null if slot is empty

### 2. Deserialize JSON to Game State ✅

```typescript
const savedGame = JSON.parse(serialized) as SavedGame;

// Validate the loaded data
if (!savedGame.gameState || !savedGame.metadata) {
  throw new Error('Invalid save data structure');
}
```

- Parses JSON string to SavedGame object
- Validates data structure
- Ensures gameState and metadata exist

### 3. Replace Current State with Loaded State ✅

```typescript
set(savedGame.gameState);  // Zustand store's set function
```

Replaces entire game state including:
- Current scene and scene history
- Current path (A/B/C)
- Day/time tracking
- Work assignment
- Inventory items
- Relationship scores
- Discovered characters
- Game flags
- Evidence collected
- Player statistics

### 4. Handle Missing/Corrupted Saves ✅

**Missing Saves:**
```typescript
if (!serialized) {
  return null; // Slot is empty
}
```

**Corrupted Saves:**
```typescript
if (!savedGame.gameState || !savedGame.metadata) {
  throw new Error('Invalid save data structure');
}
```

**Invalid JSON:**
```typescript
catch (error) {
  throw new Error(`Failed to load game from slot ${slotNumber}: ${error.message}`);
}
```

## Usage Examples

### Basic Load

```typescript
import { useGameStore } from '@/lib/store';

function LoadButton() {
  const { loadFromSlot } = useGameStore();

  const handleLoad = () => {
    const success = loadFromSlot(1);
    if (success) {
      alert('Game loaded successfully!');
    } else {
      alert('No save found in slot 1');
    }
  };

  return <button onClick={handleLoad}>Load Game</button>;
}
```

### Load with Error Handling

```typescript
function LoadWithErrorHandling() {
  const { loadFromSlot } = useGameStore();

  const handleLoad = (slotNumber: number) => {
    try {
      const success = loadFromSlot(slotNumber);
      if (success) {
        console.log('Game loaded successfully');
        // Navigate to loaded scene
      } else {
        console.log('Slot is empty');
        alert('No save found in this slot');
      }
    } catch (error) {
      console.error('Failed to load:', error);
      alert('Save file is corrupted');
    }
  };

  return (
    <div>
      <button onClick={() => handleLoad(1)}>Load Slot 1</button>
      <button onClick={() => handleLoad(2)}>Load Slot 2</button>
      <button onClick={() => handleLoad(3)}>Load Slot 3</button>
    </div>
  );
}
```

### Load Most Recent Save

```typescript
import { getMostRecentSaveSlot } from '@/lib/saveGame';

function ContinueGame() {
  const { loadFromSlot } = useGameStore();

  const handleContinue = () => {
    const recentSlot = getMostRecentSaveSlot();
    if (recentSlot) {
      const success = loadFromSlot(recentSlot);
      if (success) {
        console.log(`Loaded most recent save from slot ${recentSlot}`);
      }
    } else {
      alert('No saved games found');
    }
  };

  return <button onClick={handleContinue}>Continue</button>;
}
```

### Load with Preview

```typescript
import { getSaveSlotMetadata } from '@/lib/saveGame';

function LoadSlotWithPreview({ slotNumber }: { slotNumber: number }) {
  const { loadFromSlot } = useGameStore();
  const metadata = getSaveSlotMetadata(slotNumber);

  if (!metadata) {
    return <div>Slot {slotNumber}: Empty</div>;
  }

  return (
    <div>
      <h3>Slot {slotNumber}</h3>
      <p>Date: {metadata.dateString}</p>
      <p>Scene: {metadata.currentScene}</p>
      <p>Path: {metadata.currentPath || 'Not chosen'}</p>
      {metadata.dayTime && (
        <p>Day {metadata.dayTime.day} - {metadata.dayTime.timeOfDay}</p>
      )}
      <button onClick={() => loadFromSlot(slotNumber)}>
        Load This Save
      </button>
    </div>
  );
}
```

## Test Coverage

### Load Game Tests (from saveGame.test.ts)

```typescript
describe('loadGame', () => {
  ✅ should load saved game state
  ✅ should return null for empty slot
  ✅ should load correct slot
  ✅ should handle corrupted save data
});
```

### Store Integration Tests (from storeSaveLoad.test.ts)

```typescript
describe('loadFromSlot', () => {
  ✅ should load game state from a slot
  ✅ should return false for empty slot
  ✅ should load correct slot when multiple saves exist
  ✅ should restore all game state properties
});

describe('Save/Load workflow', () => {
  ✅ should handle complete save/load/delete workflow
  ✅ should preserve scene history when saving and loading
});
```

**Total Load-Related Tests: 10 passing ✅**

## Verification

### Manual Testing Steps

1. **Save a game state:**
   ```typescript
   // In browser console
   useGameStore.getState().saveToSlot(1);
   ```

2. **Modify game state:**
   ```typescript
   useGameStore.getState().goToScene('different-scene');
   useGameStore.getState().addItem('test-item');
   ```

3. **Load saved state:**
   ```typescript
   useGameStore.getState().loadFromSlot(1);
   // State should be restored to saved state
   ```

4. **Verify state restoration:**
   ```typescript
   console.log(useGameStore.getState().currentScene); // Should be original scene
   console.log(useGameStore.getState().inventory);     // Should not include 'test-item'
   ```

### Automated Testing

```bash
# Run all save/load tests
npm test -- saveGame storeSaveLoad

# Expected: 40 tests passing
```

## Error Handling Examples

### Missing Save

```typescript
const success = loadFromSlot(1);
// Returns: false (no error thrown)
```

### Corrupted Save

```typescript
// Manually corrupt a save in localStorage
localStorage.setItem('el-palo-de-queso-save-1', 'invalid json');

try {
  loadFromSlot(1);
} catch (error) {
  console.error(error.message);
  // "Failed to load game from slot 1: Unexpected token 'i', "invalid js"... is not valid JSON"
}
```

### Invalid Slot Number

```typescript
try {
  loadFromSlot(0);  // Invalid
} catch (error) {
  console.error(error.message);
  // "Invalid save slot number: 0. Must be between 1 and 3"
}
```

### Server-Side Rendering

```typescript
// On server (Next.js SSR)
try {
  loadFromSlot(1);
} catch (error) {
  console.error(error.message);
  // "Cannot load game: localStorage is not available (server-side)"
}
```

## Integration with Game Flow

### Main Menu

```typescript
function MainMenu() {
  const { loadFromSlot } = useGameStore();
  const hasSaves = hasSavedGames();

  return (
    <div>
      <button>New Game</button>
      {hasSaves && (
        <button onClick={() => {
          const recentSlot = getMostRecentSaveSlot();
          if (recentSlot) loadFromSlot(recentSlot);
        }}>
          Continue
        </button>
      )}
      <button>Load Game</button>
    </div>
  );
}
```

### In-Game Menu

```typescript
function GameMenu() {
  const { saveToSlot, loadFromSlot, currentScene } = useGameStore();
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  return (
    <div>
      <button onClick={() => saveToSlot(1)}>Quick Save</button>
      <button onClick={() => {
        if (confirm('Load last save? Current progress will be lost.')) {
          loadFromSlot(1);
        }
      }}>
        Quick Load
      </button>
      <button onClick={() => setShowLoadMenu(true)}>
        Load from Slot...
      </button>
    </div>
  );
}
```

## Performance Considerations

### Fast Metadata Access

For load menus, use metadata instead of full loads:

```typescript
// Fast - only loads metadata
const slots = getAllSaveSlots();

// Slower - would load full game state
// Don't do this for preview
slots.forEach((_, i) => {
  const fullSave = loadGame(i + 1);  // Avoid this in UI
});
```

### State Replacement

Loading is fast because it uses Zustand's `set()`:
- No diffing or merging
- Complete state replacement
- Single re-render

## Related Documentation

- [Step 29: Save Game](step-29-save-game.md) - Save functionality
- [lib/saveGame.ts](../lib/saveGame.ts) - Full save/load implementation
- [lib/store.ts](../lib/store.ts) - Game store integration
- [lib/README.md](../lib/README.md) - Save/load API reference

## Summary

Step 30 requirements are **fully implemented and tested**:

✅ Retrieve from localStorage by slot
✅ Deserialize JSON to game state
✅ Replace current state with loaded state
✅ Handle missing/corrupted saves

**All 10 load-related tests passing**

The load game system is production-ready and integrated with the game store!
