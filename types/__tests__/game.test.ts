/**
 * Type tests for game types
 * This file verifies that types are correctly defined and can be used
 */

import type {
  Scene,
  GameState,
  Choice,
  Character,
  Item,
  Evidence,
} from '../game';

// Test Scene type
const testScene: Scene = {
  id: 'test-scene',
  content: 'This is a test scene.',
  choices: [
    {
      text: 'Continue',
      nextScene: 'next-scene',
    },
  ],
  flags: ['test-flag'],
  items: ['test-item'],
  relationships: {
    'character-1': 10,
  },
  evidence: ['test-evidence'],
};

// Test Choice type with requirements
const testChoice: Choice = {
  text: 'Use item',
  nextScene: 'item-scene',
  requirements: {
    items: ['key'],
    flags: ['door-unlocked'],
    relationships: {
      guard: 50,
    },
    evidence: ['fingerprint'],
  },
};

// Test Character type
const testCharacter: Character = {
  id: 'guard-1',
  name: 'Prison Guard',
  relationshipScore: 25,
  description: 'A stern but fair guard.',
};

// Test GameState type
const testGameState: GameState = {
  currentScene: 'cell',
  inventory: ['spoon', 'photo'],
  relationships: {
    'guard-1': 25,
    'inmate-1': -10,
  },
  flags: ['day-1-complete'],
  evidence: ['fingerprint', 'note'],
};

// Test Item type
const testItem: Item = {
  id: 'spoon',
  name: 'Metal Spoon',
  description: 'A sturdy metal spoon that could be useful.',
};

// Test Evidence type
const testEvidence: Evidence = {
  id: 'fingerprint',
  name: 'Fingerprint',
  description: 'A fingerprint found at the scene.',
};

// Export to prevent unused variable errors
export {
  testScene,
  testChoice,
  testCharacter,
  testGameState,
  testItem,
  testEvidence,
};
