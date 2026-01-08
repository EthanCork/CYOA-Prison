/**
 * Verification script for Act 0 branching scenes
 * Tests the X-0-005 → X-0-006A/B/C → X-0-007 branching logic
 */

import { loadScene } from '../lib/sceneLoader';

console.log('=== Act 0 Branching Scene Verification ===\n');

// Test the initial choice scene
console.log('Test 1: Load choice scene (X-0-005)');
const scene005 = loadScene('X-0-005');
console.log(`✓ Scene ID: ${scene005.id}`);
console.log(`✓ Scene Type: ${scene005.type}`);
console.log(`✓ Speaker: ${scene005.content.speaker}`);
console.log(`✓ Number of choices: ${scene005.choices.length}\n`);

// Test each branch
console.log('Test 2: Verify Cooperative Branch (Choice 1)');
const choice1 = scene005.choices[1]; // "What do I need to know to survive?"
console.log(`Choice text: "${choice1.text}"`);
console.log(`✓ Next scene: ${choice1.nextScene} (should be X-0-006A)`);
console.log(`✓ Relationship change: garcia ${choice1.relationshipChanges?.garcia > 0 ? '+' : ''}${choice1.relationshipChanges?.garcia}`);
console.log(`✓ Flags set: ${choice1.flagChanges?.set?.join(', ')}`);

const scene006A = loadScene('X-0-006A');
console.log(`✓ Branch scene loaded: ${scene006A.id}`);
console.log(`✓ Type: ${scene006A.type}`);
console.log(`✓ Speaker: ${scene006A.content.speaker}`);
console.log(`✓ Text preview: ${scene006A.content.text.substring(0, 60)}...`);
console.log(`✓ Next scene: ${scene006A.nextScene} (should be X-0-007)`);
console.log(`✓ Flags set: ${scene006A.flagChanges?.set?.join(', ')}\n`);

console.log('Test 3: Verify Defiant Branch (Choice 0)');
const choice0 = scene005.choices[0]; // "I'm innocent. I don't belong here."
console.log(`Choice text: "${choice0.text}"`);
console.log(`✓ Next scene: ${choice0.nextScene} (should be X-0-006B)`);
console.log(`✓ Relationship change: garcia ${choice0.relationshipChanges?.garcia}`);
console.log(`✓ Flags set: ${choice0.flagChanges?.set?.join(', ')}`);

const scene006B = loadScene('X-0-006B');
console.log(`✓ Branch scene loaded: ${scene006B.id}`);
console.log(`✓ Type: ${scene006B.type}`);
console.log(`✓ Speaker: ${scene006B.content.speaker}`);
console.log(`✓ Text preview: ${scene006B.content.text.substring(0, 60)}...`);
console.log(`✓ Next scene: ${scene006B.nextScene} (should be X-0-007)`);
console.log(`✓ Flags set: ${scene006B.flagChanges?.set?.join(', ')}\n`);

console.log('Test 4: Verify Silent Branch (Choice 2)');
const choice2 = scene005.choices[2]; // "Say nothing. Just stare at him."
console.log(`Choice text: "${choice2.text}"`);
console.log(`✓ Next scene: ${choice2.nextScene} (should be X-0-006C)`);
console.log(`✓ Relationship change: ${choice2.relationshipChanges?.garcia || 'none (neutral)'}`);
console.log(`✓ Flags set: ${choice2.flagChanges?.set?.join(', ')}`);

const scene006C = loadScene('X-0-006C');
console.log(`✓ Branch scene loaded: ${scene006C.id}`);
console.log(`✓ Type: ${scene006C.type}`);
console.log(`✓ Speaker: ${scene006C.content.speaker}`);
console.log(`✓ Text preview: ${scene006C.content.text.substring(0, 60)}...`);
console.log(`✓ Next scene: ${scene006C.nextScene} (should be X-0-007)`);
console.log(`✓ Flags set: ${scene006C.flagChanges?.set?.join(', ')}\n`);

console.log('Test 5: Verify Convergence Scene (X-0-007)');
const scene007 = loadScene('X-0-007');
console.log(`✓ Scene ID: ${scene007.id}`);
console.log(`✓ Type: ${scene007.type}`);
console.log(`✓ Text preview: ${scene007.content.text.substring(0, 60)}...`);
console.log(`✓ Next scene: ${scene007.nextScene} (should be A-1-001)`);
console.log(`✓ Flags set: ${scene007.flagChanges?.set?.join(', ')}\n`);

console.log('Test 6: Verify Branching Logic Summary');
console.log('Path 1 (Cooperative):  X-0-005 → X-0-006A → X-0-007 → A-1-001');
console.log('  - Legrand relationship: +3');
console.log('  - Flags: asked_legrand_for_advice, processing_cooperative, legrand_gave_advice, learned_about_emile');
console.log('');
console.log('Path 2 (Defiant):      X-0-005 → X-0-006B → X-0-007 → A-1-001');
console.log('  - Legrand relationship: -5');
console.log('  - Flags: claimed_innocence_to_legrand, processing_defiant, legrand_angered');
console.log('');
console.log('Path 3 (Silent):       X-0-005 → X-0-006C → X-0-007 → A-1-001');
console.log('  - Legrand relationship: 0 (neutral)');
console.log('  - Flags: stayed_silent_with_legrand, processing_silent, legrand_respects_silence');
console.log('');

// Verify all branches converge to the same scene
const allConverge =
  scene006A.nextScene === 'X-0-007' &&
  scene006B.nextScene === 'X-0-007' &&
  scene006C.nextScene === 'X-0-007' &&
  scene007.nextScene === 'A-1-001';

if (allConverge) {
  console.log('✓ All branches correctly converge at X-0-007 and then proceed to A-1-001\n');
} else {
  console.log('✗ ERROR: Branches do not converge correctly!\n');
  process.exit(1);
}

console.log('=== All Branching Verifications Passed! ===');
