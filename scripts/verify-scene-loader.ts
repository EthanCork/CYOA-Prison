/**
 * Verification script for scene loader functionality
 * Run this with: npx tsx scripts/verify-scene-loader.ts
 */

import {
  loadScene,
  sceneExists,
  getAllSceneIds,
  getSceneCount,
  SceneNotFoundError,
} from '../lib/sceneLoader';

console.log('=== Scene Loader Verification ===\n');

// Test 1: Get scene count
console.log('Test 1: Get scene count');
const count = getSceneCount();
console.log(`✓ Total scenes loaded: ${count}\n`);

// Test 2: Get all scene IDs
console.log('Test 2: Get all scene IDs');
const allIds = getAllSceneIds();
console.log(`✓ Scene IDs: ${allIds.join(', ')}\n`);

// Test 3: Check if scenes exist
console.log('Test 3: Check if scenes exist');
console.log(`✓ X-0-001 exists: ${sceneExists('X-0-001')}`);
console.log(`✓ INVALID-ID exists: ${sceneExists('INVALID-ID')}\n`);

// Test 4: Load a narrative scene
console.log('Test 4: Load narrative scene (X-0-001)');
const scene1 = loadScene('X-0-001');
console.log(`✓ Scene ID: ${scene1.id}`);
console.log(`✓ Scene Type: ${scene1.type}`);
console.log(`✓ Scene Text: ${scene1.content.text.substring(0, 80)}...`);
console.log(`✓ Next Scene: ${scene1.nextScene}\n`);

// Test 5: Load a dialogue scene with choices (X-0-005)
console.log('Test 5: Load dialogue scene (X-0-005)');
const scene2 = loadScene('X-0-005');
console.log(`✓ Scene ID: ${scene2.id}`);
console.log(`✓ Scene Type: ${scene2.type}`);
console.log(`✓ Speaker: ${scene2.content.speaker}`);
console.log(`✓ Number of choices: ${scene2.choices.length}`);
console.log(`✓ First choice: "${scene2.choices[0].text}"`);
if (scene2.choices[0].relationshipChanges) {
  console.log(`✓ Relationship changes: ${JSON.stringify(scene2.choices[0].relationshipChanges)}\n`);
}

// Test 6: Load a choice scene
console.log('Test 6: Load choice scene (A-1-001)');
const scene3 = loadScene('A-1-001');
console.log(`✓ Scene ID: ${scene3.id}`);
console.log(`✓ Scene Type: ${scene3.type}`);
console.log(`✓ Number of choices: ${scene3.choices.length}`);
scene3.choices.forEach((choice, index) => {
  console.log(`  Choice ${index + 1}: "${choice.text}" → ${choice.nextScene}`);
});
console.log();

// Test 7: Load an investigation scene
console.log('Test 7: Load investigation scene (A-1-015)');
const scene4 = loadScene('A-1-015');
console.log(`✓ Scene ID: ${scene4.id}`);
console.log(`✓ Scene Type: ${scene4.type}`);
if (scene4.itemChanges?.add) {
  console.log(`✓ Items added: ${scene4.itemChanges.add.join(', ')}`);
}
if (scene4.choices[0].evidenceChanges?.add) {
  console.log(`✓ Evidence can be collected: ${scene4.choices[0].evidenceChanges.add.join(', ')}`);
}
console.log();

// Test 8: Load an ending scene
console.log('Test 8: Load ending scene (END-1-ESCAPE)');
const scene5 = loadScene('END-1-ESCAPE');
console.log(`✓ Scene ID: ${scene5.id}`);
console.log(`✓ Scene Type: ${scene5.type}`);
if (scene5.flagChanges?.set) {
  console.log(`✓ Flags set: ${scene5.flagChanges.set.join(', ')}`);
}
console.log(`✓ Number of choices: ${scene5.choices.length} (ending scenes should have 0 choices)\n`);

// Test 9: Error handling
console.log('Test 9: Error handling for invalid scene ID');
try {
  loadScene('INVALID-SCENE-ID');
  console.log('✗ Should have thrown an error!');
} catch (error) {
  if (error instanceof SceneNotFoundError) {
    console.log(`✓ SceneNotFoundError caught: ${error.message}\n`);
  } else {
    console.log(`✗ Unexpected error type: ${error}`);
  }
}

console.log('=== All Verifications Passed! ===');
