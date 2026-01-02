# Library

This directory contains utility functions and game logic for "El Palo de Queso".

## Purpose
- Helper functions
- Game engine logic
- State management utilities
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
