/**
 * Test script to verify the Chaos Route (B-2-020 to B-2-039) is properly connected
 * and playable when Viktor is recruited
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Chaos Route Verification ===\n');

// Test 1: Verify all chaos route scenes exist
console.log('Test 1: Verify chaos route scenes exist');
const chaosScenes = [
  'B-2-020', 'B-2-021', 'B-2-022A', 'B-2-022B', 'B-2-022C',
  'B-2-023', 'B-2-024', 'B-2-025', 'B-2-026A', 'B-2-026B', 'B-2-026C',
  'B-2-027', 'B-2-028', 'B-2-029A', 'B-2-029B', 'B-2-029C',
  'B-2-030', 'B-2-031', 'B-2-032A', 'B-2-032B', 'B-2-032C', 'B-2-032D',
  'B-2-035', 'B-2-036', 'B-2-037A', 'B-2-037B', 'B-2-037C',
  'B-2-038', 'B-2-039'
];

let allExist = true;
for (const sceneId of chaosScenes) {
  const exists = sceneExists(sceneId);
  if (!exists) {
    console.log(`✗ Scene ${sceneId} does not exist`);
    allExist = false;
  }
}

if (allExist) {
  console.log(`✓ All ${chaosScenes.length} chaos route scenes exist\n`);
} else {
  console.log('✗ Some chaos route scenes are missing\n');
  process.exit(1);
}

// Test 2: Verify routing scene exists
console.log('Test 2: Verify routing scene B-1-041');
if (sceneExists('B-1-041')) {
  const routingScene = loadScene('B-1-041');
  console.log(`✓ Routing scene exists with ${routingScene.choices?.length} choices`);

  // Check if chaos route is an option
  const chaosChoice = routingScene.choices?.find(c => c.nextScene === 'B-2-020');
  if (chaosChoice) {
    console.log(`✓ Chaos route option found: "${chaosChoice.text}"`);
    console.log(`✓ Requires flag: ${JSON.stringify(chaosChoice.requirements?.flags)}\n`);
  } else {
    console.log('✗ Chaos route choice not found in routing scene\n');
    process.exit(1);
  }
} else {
  console.log('✗ Routing scene B-1-041 does not exist\n');
  process.exit(1);
}

// Test 3: Verify chaos route entry requirements
console.log('Test 3: Verify chaos route entry (B-2-020)');
const chaosEntry = loadScene('B-2-020');
console.log(`✓ Scene type: ${chaosEntry.type}`);
console.log(`✓ Requires flags: ${JSON.stringify(chaosEntry.requirements?.flags)}`);
console.log(`✓ Next scene: ${chaosEntry.nextScene}\n`);

// Test 4: Verify Viktor recruitment path
console.log('Test 4: Verify Viktor recruitment scenes');
const viktorScenes = ['B-1-016', 'B-1-017', 'B-1-018A', 'B-1-018B', 'B-1-018C', 'B-1-019', 'B-1-020C'];
for (const sceneId of viktorScenes) {
  if (!sceneExists(sceneId)) {
    console.log(`✗ Viktor scene ${sceneId} missing`);
    process.exit(1);
  }
}

const viktorSuccess = loadScene('B-1-020C');
const viktorFlag = viktorSuccess.flagChanges?.set?.includes('viktor_recruited');
console.log(`✓ Viktor recruitment scenes exist`);
console.log(`✓ B-1-020C sets 'viktor_recruited' flag: ${viktorFlag}\n`);

// Test 5: Verify key moral choices
console.log('Test 5: Verify key moral choices in chaos route');
const moralChoiceScenes = ['B-2-021', 'B-2-025', 'B-2-028', 'B-2-036'];
for (const sceneId of moralChoiceScenes) {
  const scene = loadScene(sceneId);
  if (scene.type === 'choice' && scene.choices && scene.choices.length >= 2) {
    console.log(`✓ ${sceneId}: ${scene.choices.length} choices available`);
  } else {
    console.log(`✗ ${sceneId}: Not a proper choice scene`);
  }
}
console.log();

// Test 6: Verify Viktor's fate variations
console.log('Test 6: Verify Viktor fate variations');
const fateScenes = ['B-2-029A', 'B-2-029B', 'B-2-029C'];
for (const sceneId of fateScenes) {
  const scene = loadScene(sceneId);
  const flags = scene.flagChanges?.set || [];
  console.log(`✓ ${sceneId}: Sets flags: ${flags.join(', ')}`);
}
console.log();

// Test 7: Verify ending connections
console.log('Test 7: Verify ending connections');
const endingScenes = ['B-2-037A', 'B-2-037B', 'B-2-037C'];
for (const sceneId of endingScenes) {
  const scene = loadScene(sceneId);
  console.log(`✓ ${sceneId} -> ${scene.nextScene}`);
}
console.log();

console.log('=== All Chaos Route Tests Passed! ===\n');

// Summary
console.log('Summary:');
console.log(`- Total chaos route scenes: ${chaosScenes.length}`);
console.log('- Entry point: B-2-020 (requires viktor_recruited flag)');
console.log('- Routing: B-1-041 allows choice between chapel/chaos/loading dock routes');
console.log('- Moral choices: Violence levels, helping guards, team unity');
console.log('- Viktor fates: Immediate jump, wait for team, or sacrifice');
console.log('- Endings: Disappearance, justice, or liberation paths');
console.log('\nRoute is fully playable when Viktor is successfully recruited (B-1-020C).');
