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
