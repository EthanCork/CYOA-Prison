# Library

This directory contains utility functions and game logic for "El Palo de Queso".

## Purpose
- Helper functions
- Game engine logic
- State management utilities
- Scene loading and management
- Common algorithms

## Game Store (Zustand)

The game store (`store.ts`) manages all game state using Zustand.

### State Properties
- `currentScene`: Current scene ID
- `inventory`: Array of item IDs
- `relationships`: Character relationship scores
- `flags`: Set game flags
- `evidence`: Collected evidence IDs

### Actions

**Navigation**
- `goToScene(sceneId)`: Navigate to a scene

**Inventory**
- `addItem(itemId)`: Add item to inventory
- `removeItem(itemId)`: Remove item from inventory
- `hasItem(itemId)`: Check if item exists

**Relationships**
- `changeRelationship(characterId, delta)`: Modify relationship score
- `setRelationship(characterId, score)`: Set relationship score directly
- `getRelationship(characterId)`: Get current relationship score

**Flags**
- `setFlag(flag)`: Set a game flag
- `hasFlag(flag)`: Check if flag is set

**Evidence**
- `addEvidence(evidenceId)`: Add evidence
- `hasEvidence(evidenceId)`: Check if evidence collected

**Save/Load**
- `saveToSlot(slotNumber)`: Save current game state to a slot (1-3)
- `loadFromSlot(slotNumber)`: Load game state from a slot (returns true if successful)
- `deleteSlot(slotNumber)`: Delete a saved game from a slot

**Utility**
- `resetGame()`: Reset to initial state

### Usage
```typescript
import { useGameStore } from '@/lib/store';

function MyComponent() {
  const { currentScene, goToScene } = useGameStore();
  // Use state and actions...
}
```

## Scene Loader

The scene loader (`sceneLoader.ts`) provides functions to load and access scene data from JSON files.

### Functions

**Loading Scenes**
- `loadScene(sceneId)`: Load a scene by ID, throws `SceneNotFoundError` if not found
- `sceneExists(sceneId)`: Check if a scene exists without loading it
- `getAllSceneIds()`: Get array of all available scene IDs
- `getSceneCount()`: Get total number of loaded scenes
- `reloadScenes()`: Reload all scenes from JSON files (development only)

### Error Handling
- `SceneNotFoundError`: Thrown when attempting to load a non-existent scene

### Usage
```typescript
import { loadScene, sceneExists, SceneNotFoundError } from '@/lib/sceneLoader';

// Check if scene exists
if (sceneExists('X-0-001')) {
  const scene = loadScene('X-0-001');
  console.log(scene.content.text);
}

// Error handling
try {
  const scene = loadScene(sceneId);
  // Use scene...
} catch (error) {
  if (error instanceof SceneNotFoundError) {
    console.error('Scene not found:', error.message);
  }
}

// Get all scenes
const allScenes = getAllSceneIds();
console.log(`Total scenes: ${allScenes.length}`);
```

### Scene Data Location
Scenes are stored in `/data/scenes/` as JSON files. The loader automatically caches all scenes on first use for optimal performance.

## Save/Load System

The save/load system (`saveGame.ts`) provides localStorage-based game save functionality with support for multiple save slots.

### Features
- **Multiple Save Slots**: Support for 3 independent save slots
- **Timestamp Tracking**: Each save includes timestamp and human-readable date
- **Complete State Serialization**: Saves entire game state including inventory, relationships, flags, evidence, and stats
- **Metadata**: Quick access to save slot info without loading full game state
- **Import/Export**: Export saves as JSON for backup/sharing

### Constants
- `MAX_SAVE_SLOTS`: Number of available save slots (3)

### Core Functions

**Saving and Loading**
- `saveGame(slotNumber, gameState)`: Save game state to a slot
- `loadGame(slotNumber)`: Load game state from a slot (returns SavedGame or null)
- `deleteSave(slotNumber)`: Delete a saved game

**Metadata Access**
- `getSaveSlotMetadata(slotNumber)`: Get save metadata without loading full state
- `getAllSaveSlots()`: Get metadata for all save slots
- `isSaveSlotEmpty(slotNumber)`: Check if a slot is empty
- `getMostRecentSaveSlot()`: Get the slot number of the most recent save
- `hasSavedGames()`: Check if any saves exist

**Import/Export**
- `exportSave(slotNumber)`: Export save as JSON string
- `importSave(slotNumber, jsonString)`: Import save from JSON string

### Data Structures

**SaveSlot Metadata**
```typescript
{
  slotNumber: number;        // Slot number (1-3)
  timestamp: number;         // Unix timestamp
  dateString: string;        // Human-readable date
  currentScene: string;      // Scene ID for quick reference
  currentPath: 'A' | 'B' | 'C' | null;
  dayTime: { day: number; timeOfDay: string } | null;
  playTimeSeconds: number;
}
```

**SavedGame**
```typescript
{
  metadata: SaveSlot;        // Save slot metadata
  gameState: GameState;      // Complete game state
  version: string;           // Save format version
}
```

### Usage with Game Store

```typescript
import { useGameStore } from '@/lib/store';

function SaveLoadButtons() {
  const { saveToSlot, loadFromSlot, deleteSlot } = useGameStore();

  const handleSave = () => {
    const savedGame = saveToSlot(1);
    console.log('Game saved:', savedGame.metadata.dateString);
  };

  const handleLoad = () => {
    const success = loadFromSlot(1);
    if (success) {
      console.log('Game loaded successfully');
    } else {
      console.log('No save found in slot 1');
    }
  };

  const handleDelete = () => {
    deleteSlot(1);
    console.log('Save deleted');
  };

  return (
    <>
      <button onClick={handleSave}>Save Game</button>
      <button onClick={handleLoad}>Load Game</button>
      <button onClick={handleDelete}>Delete Save</button>
    </>
  );
}
```

### Direct Usage (without Store)

```typescript
import {
  saveGame,
  loadGame,
  getAllSaveSlots,
  getMostRecentSaveSlot
} from '@/lib/saveGame';

// Get all save slots
const slots = getAllSaveSlots();
slots.forEach((slot, index) => {
  if (slot) {
    console.log(`Slot ${index + 1}:`, slot.dateString);
  } else {
    console.log(`Slot ${index + 1}: Empty`);
  }
});

// Load most recent save
const recentSlot = getMostRecentSaveSlot();
if (recentSlot) {
  const savedGame = loadGame(recentSlot);
  console.log('Loaded most recent save:', savedGame);
}

// Manual save
const gameState = useGameStore.getState();
saveGame(1, gameState);
```

### Error Handling

All save/load functions throw descriptive errors if operations fail:
- Invalid slot numbers (not 1-3)
- localStorage access issues
- Corrupted save data
- Server-side rendering (no localStorage available)

```typescript
try {
  saveToSlot(1);
} catch (error) {
  console.error('Failed to save:', error.message);
}
```
