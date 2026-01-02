/**
 * Tests for the game store
 * This file verifies that the Zustand store works correctly
 */

import { useGameStore } from '../store';

// Test basic store creation
const testStoreCreation = () => {
  const store = useGameStore.getState();

  console.log('Initial state:', {
    currentScene: store.currentScene,
    inventory: store.inventory,
    relationships: store.relationships,
    flags: store.flags,
    evidence: store.evidence,
  });

  return store.currentScene === 'intro' &&
    store.inventory.length === 0 &&
    store.flags.length === 0 &&
    store.evidence.length === 0;
};

// Test navigation
const testNavigation = () => {
  const { goToScene } = useGameStore.getState();

  goToScene('cell');
  const newScene = useGameStore.getState().currentScene;

  console.log('Navigation test:', { from: 'intro', to: newScene });

  return newScene === 'cell';
};

// Test inventory management
const testInventory = () => {
  const { addItem, removeItem, hasItem } = useGameStore.getState();

  addItem('spoon');
  addItem('photo');

  const hasSpoon = hasItem('spoon');
  const hasPhoto = hasItem('photo');

  removeItem('spoon');
  const spoonRemoved = !hasItem('spoon');

  console.log('Inventory test:', {
    addedSpoon: hasSpoon,
    addedPhoto: hasPhoto,
    removedSpoon: spoonRemoved,
    currentInventory: useGameStore.getState().inventory,
  });

  return hasSpoon && hasPhoto && spoonRemoved;
};

// Test relationship management
const testRelationships = () => {
  const { changeRelationship, setRelationship, getRelationship } = useGameStore.getState();

  changeRelationship('guard', 10);
  const guardScore1 = getRelationship('guard');

  changeRelationship('guard', 15);
  const guardScore2 = getRelationship('guard');

  setRelationship('inmate', -50);
  const inmateScore = getRelationship('inmate');

  // Test bounds (should cap at 100)
  setRelationship('friend', 150);
  const friendScore = getRelationship('friend');

  console.log('Relationship test:', {
    guardIncremental: guardScore2,
    inmateDirect: inmateScore,
    friendCapped: friendScore,
    relationships: useGameStore.getState().relationships,
  });

  return guardScore1 === 10 && guardScore2 === 25 && inmateScore === -50 && friendScore === 100;
};

// Test flag management
const testFlags = () => {
  const { setFlag, hasFlag } = useGameStore.getState();

  setFlag('day-1-complete');
  setFlag('met-guard');

  const hasDay1 = hasFlag('day-1-complete');
  const hasMetGuard = hasFlag('met-guard');
  const hasNonexistent = hasFlag('nonexistent');

  console.log('Flag test:', {
    hasDay1,
    hasMetGuard,
    hasNonexistent,
    currentFlags: useGameStore.getState().flags,
  });

  return hasDay1 && hasMetGuard && !hasNonexistent;
};

// Test evidence management
const testEvidence = () => {
  const { addEvidence, hasEvidence } = useGameStore.getState();

  addEvidence('fingerprint');
  addEvidence('note');

  const hasFingerprint = hasEvidence('fingerprint');
  const hasNote = hasEvidence('note');
  const hasMissing = hasEvidence('missing');

  console.log('Evidence test:', {
    hasFingerprint,
    hasNote,
    hasMissing,
    currentEvidence: useGameStore.getState().evidence,
  });

  return hasFingerprint && hasNote && !hasMissing;
};

// Test reset functionality
const testReset = () => {
  const { resetGame } = useGameStore.getState();

  resetGame();
  const state = useGameStore.getState();

  console.log('Reset test:', {
    currentScene: state.currentScene,
    inventoryEmpty: state.inventory.length === 0,
    flagsEmpty: state.flags.length === 0,
    evidenceEmpty: state.evidence.length === 0,
  });

  return state.currentScene === 'intro' &&
    state.inventory.length === 0 &&
    state.flags.length === 0 &&
    state.evidence.length === 0;
};

// Run all tests
export const runStoreTests = () => {
  console.log('=== Running Game Store Tests ===\n');

  const tests = [
    { name: 'Store Creation', fn: testStoreCreation },
    { name: 'Navigation', fn: testNavigation },
    { name: 'Inventory', fn: testInventory },
    { name: 'Relationships', fn: testRelationships },
    { name: 'Flags', fn: testFlags },
    { name: 'Evidence', fn: testEvidence },
    { name: 'Reset', fn: testReset },
  ];

  const results = tests.map(test => {
    try {
      const passed = test.fn();
      console.log(`✓ ${test.name}: ${passed ? 'PASSED' : 'FAILED'}\n`);
      return passed;
    } catch (error) {
      console.log(`✗ ${test.name}: ERROR -`, error, '\n');
      return false;
    }
  });

  const allPassed = results.every(r => r);
  console.log(`=== Tests ${allPassed ? 'PASSED' : 'FAILED'} ===`);

  return allPassed;
};
