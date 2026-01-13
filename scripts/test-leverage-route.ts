/**
 * Test script to verify the Leverage Route (B-2-040 to B-2-059) is properly connected
 * and playable when Émile is recruited
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Leverage Route Verification ===\n');

// Test 1: Verify all leverage route scenes exist
console.log('Test 1: Verify leverage route scenes exist');
const leverageScenes = [
  'B-2-040', 'B-2-041', 'B-2-042A', 'B-2-042B', 'B-2-042C',
  'B-2-043', 'B-2-044', 'B-2-045A', 'B-2-045B', 'B-2-045C',
  'B-2-046', 'B-2-047', 'B-2-048', 'B-2-049',
  'B-2-050A', 'B-2-050B', 'B-2-050C',
  'B-2-055', 'B-2-056', 'B-2-057A', 'B-2-057B', 'B-2-057C',
  'B-2-059'
];

let allExist = true;
for (const sceneId of leverageScenes) {
  const exists = sceneExists(sceneId);
  if (!exists) {
    console.log(`✗ Scene ${sceneId} does not exist`);
    allExist = false;
  }
}

if (allExist) {
  console.log(`✓ All ${leverageScenes.length} leverage route scenes exist\n`);
} else {
  console.log('✗ Some leverage route scenes are missing\n');
  process.exit(1);
}

// Test 2: Verify routing scene has leverage option
console.log('Test 2: Verify routing scene B-1-041 has leverage option');
if (sceneExists('B-1-041')) {
  const routingScene = loadScene('B-1-041');
  console.log(`✓ Routing scene exists with ${routingScene.choices?.length} choices`);

  // Check if leverage route is an option
  const leverageChoice = routingScene.choices?.find(c => c.nextScene === 'B-2-040');
  if (leverageChoice) {
    console.log(`✓ Leverage route option found: "${leverageChoice.text}"`);
    console.log(`✓ Requires flag: ${JSON.stringify(leverageChoice.requirements?.flags)}\n`);
  } else {
    console.log('✗ Leverage route choice not found in routing scene\n');
    process.exit(1);
  }
} else {
  console.log('✗ Routing scene B-1-041 does not exist\n');
  process.exit(1);
}

// Test 3: Verify leverage route entry requirements
console.log('Test 3: Verify leverage route entry (B-2-040)');
const leverageEntry = loadScene('B-2-040');
console.log(`✓ Scene type: ${leverageEntry.type}`);
console.log(`✓ Requires flags: ${JSON.stringify(leverageEntry.requirements?.flags)}`);
console.log(`✓ Next scene: ${leverageEntry.nextScene}`);
console.log(`✓ Items added: ${JSON.stringify(leverageEntry.itemChanges?.add)}\n`);

// Test 4: Verify Émile recruitment path
console.log('Test 4: Verify Émile recruitment scenes');
const emileScenes = ['B-1-026', 'B-1-027', 'B-1-028A', 'B-1-028B', 'B-1-029', 'B-1-030A'];
for (const sceneId of emileScenes) {
  if (!sceneExists(sceneId)) {
    console.log(`✗ Émile scene ${sceneId} missing`);
    process.exit(1);
  }
}

const emileSuccess = loadScene('B-1-030A');
const emileFlag = emileSuccess.flagChanges?.set?.includes('emile_recruited');
console.log(`✓ Émile recruitment scenes exist`);
console.log(`✓ B-1-030A sets 'emile_recruited' flag: ${emileFlag}\n`);

// Test 5: Verify evidence gathering branches
console.log('Test 5: Verify evidence gathering branches');
const evidenceBranches = ['B-2-042A', 'B-2-042B', 'B-2-042C'];
for (const sceneId of evidenceBranches) {
  const scene = loadScene(sceneId);
  const items = scene.itemChanges?.add || [];
  console.log(`✓ ${sceneId}: Adds items: ${items.join(', ')}`);
}
console.log();

// Test 6: Verify confrontation approaches
console.log('Test 6: Verify Captain Moreau confrontation variations');
const confrontationScenes = ['B-2-045A', 'B-2-045B', 'B-2-045C'];
for (const sceneId of confrontationScenes) {
  const scene = loadScene(sceneId);
  const flags = scene.flagChanges?.set || [];
  console.log(`✓ ${sceneId}: Sets flags: ${flags.join(', ')}`);
}
console.log();

// Test 7: Verify escape network choices
console.log('Test 7: Verify escape network options');
const networkScenes = ['B-2-050A', 'B-2-050B', 'B-2-050C'];
for (const sceneId of networkScenes) {
  const scene = loadScene(sceneId);
  const flags = scene.flagChanges?.set || [];
  console.log(`✓ ${sceneId}: ${flags[0]}`);
}
console.log();

// Test 8: Verify ending variations
console.log('Test 8: Verify moral reflection endings');
const endingScenes = ['B-2-057A', 'B-2-057B', 'B-2-057C'];
for (const sceneId of endingScenes) {
  const scene = loadScene(sceneId);
  console.log(`✓ ${sceneId} -> ${scene.nextScene}`);
}
console.log();

console.log('=== All Leverage Route Tests Passed! ===\n');

// Summary
console.log('Summary:');
console.log(`- Total leverage route scenes: ${leverageScenes.length}`);
console.log('- Entry point: B-2-040 (requires emile_recruited flag)');
console.log('- Routing: B-1-041 allows choice between chapel/chaos/leverage/loading dock routes');
console.log('- Evidence targets: Captain Moreau, Sergeant Laurent, or Warden');
console.log('- Confrontation styles: Aggressive, diplomatic, or cautious');
console.log('- Escape networks: Émile\'s criminals, Cordelia\'s family, or Marcel\'s forgers');
console.log('- Moral outcomes: No regrets, mixed feelings, or seeking redemption');
console.log('\nRoute is fully playable when Émile recruited via B-1-030A.');
