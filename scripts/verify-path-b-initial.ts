/**
 * Verification script for Path B initial scenes (B-1-001 to B-1-010)
 * Run this with: npx tsx scripts/verify-path-b-initial.ts
 */

import { loadScene, sceneExists, getAllSceneIds } from '../lib/sceneLoader';

console.log('=== Path B Initial Scenes Verification ===\n');

const pathBScenes = getAllSceneIds().filter(id => id.startsWith('B-1-'));

console.log(`Path B Act 1 Scenes Found: ${pathBScenes.length}\n`);

// Test B-1-001 entry point
console.log('--- B-1-001: Social Route Entry ---');
const b1001 = loadScene('B-1-001');
console.log(`✓ Type: ${b1001.type}`);
console.log(`✓ Pages: ${b1001.content.pages?.length}`);
console.log(`✓ Next Scene: ${b1001.nextScene}`);
console.log(`✓ Requires: ${JSON.stringify(b1001.requirements?.flags)}`);
console.log(`✓ Sets flags: ${b1001.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-1-002 Bastian conversation
console.log('--- B-1-002: Approaching Bastian ---');
const b1002 = loadScene('B-1-002');
console.log(`✓ Type: ${b1002.type}`);
console.log(`✓ Choices: ${b1002.choices.length}`);
b1002.choices.forEach((choice, i) => {
  const hasReq = choice.requirements ? ' [REQ]' : '';
  const relChange = choice.relationshipChanges?.bastian ? ` (+${choice.relationshipChanges.bastian})` : '';
  console.log(`  ${i + 1}. → ${choice.nextScene}${hasReq}${relChange}`);
});
console.log();

// Test branching from B-1-002
console.log('--- B-1-003 Branching (Bastian\'s Reaction) ---');
const branches = ['B-1-003A', 'B-1-003B', 'B-1-003C'];
branches.forEach(id => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const relChange = scene.relationshipChanges?.bastian || 0;
    console.log(`✓ ${id}: ${scene.type} (Bastian ${relChange >= 0 ? '+' : ''}${relChange})`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-1-005 conditions
console.log('--- B-1-005: Bastian\'s Conditions ---');
const b1005 = loadScene('B-1-005');
console.log(`✓ Type: ${b1005.type}`);
console.log(`✓ Choices: ${b1005.choices.length}`);
b1005.choices.forEach((choice, i) => {
  const relChange = choice.relationshipChanges?.bastian || 0;
  console.log(`  ${i + 1}. Bastian ${relChange >= 0 ? '+' : ''}${relChange}: ${choice.text.substring(0, 50)}...`);
});
console.log();

// Test B-1-009 recruitment decision
console.log('--- B-1-009: First Recruitment Decision ---');
const b1009 = loadScene('B-1-009');
console.log(`✓ Type: ${b1009.type}`);
console.log(`✓ Choices: ${b1009.choices.length}`);
b1009.choices.forEach((choice, i) => {
  const flags = choice.flagChanges?.set || [];
  console.log(`  ${i + 1}. → ${choice.nextScene} (${flags.join(', ')})`);
});
console.log();

// Test final branching (B-1-010A/B/C)
console.log('--- B-1-010 Final Branches (Commitment) ---');
const finalBranches = ['B-1-010A', 'B-1-010B', 'B-1-010C'];
finalBranches.forEach(id => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const nextFlags = scene.flagChanges?.set || [];
    console.log(`✓ ${id}: → ${scene.nextScene} (${nextFlags.join(', ')})`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Check for broken transitions
console.log('--- Transition Validation ---');
const issues: string[] = [];
pathBScenes.forEach(id => {
  const scene = loadScene(id);

  // Check nextScene
  if (scene.nextScene) {
    if (!sceneExists(scene.nextScene)) {
      issues.push(`${id}: nextScene '${scene.nextScene}' does not exist`);
    }
  }

  // Check choice targets
  scene.choices.forEach((choice, i) => {
    if (!sceneExists(choice.nextScene)) {
      issues.push(`${id}: Choice ${i + 1} nextScene '${choice.nextScene}' does not exist`);
    }
  });
});

if (issues.length === 0) {
  console.log('✓ All transitions valid');
} else {
  console.log(`✗ ${issues.length} transition issues:`);
  issues.forEach(issue => console.log(`  ${issue}`));
}
console.log();

// Check relationship requirements
console.log('--- Relationship Requirements ---');
const b1002Choice1 = b1002.choices[0];
if (b1002Choice1.requirements?.relationships?.bastian === 60) {
  console.log('✓ B-1-002 Choice 1 requires Bastian ≥60');
} else {
  console.log('✗ B-1-002 Choice 1 missing Bastian requirement');
}
console.log();

// Summary
console.log('=== Summary ===\n');
console.log(`Total Path B Scenes: ${pathBScenes.length}`);
console.log(`  Entry: B-1-001 (requires chose_social_path flag)`);
console.log(`  Alliance Formation: B-1-002 to B-1-006`);
console.log(`  Observation & Planning: B-1-007 to B-1-009`);
console.log(`  Recruitment Branches: B-1-010A/B/C`);
console.log();
console.log('Next Scenes to Build:');
console.log(`  B-1-011: Marcel recruitment (from B-1-010A)`);
console.log(`  B-1-016: Viktor recruitment (from B-1-010B)`);
console.log(`  B-1-021: Denis recruitment (from B-1-010C)`);
console.log();

if (issues.length === 0) {
  console.log('✅ PATH B INITIAL SCENES FUNCTIONAL');
  console.log('   Ready for recruitment sequence development');
} else {
  console.log('❌ PATH B HAS ISSUES - Fix before continuing');
}
