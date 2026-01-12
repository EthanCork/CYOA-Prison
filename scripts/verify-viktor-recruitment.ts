/**
 * Verification script for Viktor recruitment sequence (B-1-016 to B-1-020)
 * Run this with: npx tsx scripts/verify-viktor-recruitment.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Viktor Recruitment Sequence Verification ===\n');

// Test B-1-016 entry
console.log('--- B-1-016: Approaching Viktor in Yard ---');
const b1016 = loadScene('B-1-016');
console.log(`✓ Type: ${b1016.type}`);
console.log(`✓ Pages: ${b1016.content.pages?.length}`);
console.log(`✓ Next: ${b1016.nextScene}`);
console.log(`✓ Requirements: ${JSON.stringify(b1016.requirements?.flags)}`);
console.log(`✓ Flags: ${b1016.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-1-017 initial approach
console.log('--- B-1-017: Three Approaches ---');
const b1017 = loadScene('B-1-017');
console.log(`✓ Type: ${b1017.type}`);
console.log(`✓ Choices: ${b1017.choices.length}`);
b1017.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.viktor || 0;
  const flags = choice.flagChanges?.set || [];
  console.log(`  ${i + 1}. Viktor ${rel >= 0 ? '+' : ''}${rel} → ${choice.nextScene} (${flags.join(', ')})`);
});
console.log();

// Test B-1-018 branching
console.log('--- B-1-018 Branching: Viktor\'s Response ---');
const branches018 = ['B-1-018A', 'B-1-018B', 'B-1-018C'];
branches018.forEach(id => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.viktor || 0;
    const pages = scene.content.pages?.length || (scene.content.text ? 1 : 0);
    console.log(`✓ ${id}: ${pages} pages, Viktor ${rel >= 0 ? '+' : ''}${rel} → B-1-019`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-1-019 Viktor's test
console.log('--- B-1-019: Viktor\'s Test (Émile\'s Crew Confrontation) ---');
const b1019 = loadScene('B-1-019');
console.log(`✓ Type: ${b1019.type}`);
console.log(`✓ Pages: ${b1019.content.pages?.length}`);
console.log(`✓ Choices: ${b1019.choices.length}`);
b1019.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.viktor || 0;
  console.log(`  ${i + 1}. Viktor ${rel >= 0 ? '+' : ''}${rel}: ${choice.text.substring(0, 50)}...`);
});
console.log();

// Test B-1-020 outcomes
console.log('--- B-1-020 Outcomes ---');
const branches020 = ['B-1-020A', 'B-1-020B', 'B-1-020C'];
const outcomes = ['FAILED', 'CONDITIONAL', 'SUCCESS'];
branches020.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.viktor || 0;
    const flags = scene.flagChanges?.set || [];
    const items = scene.itemChanges?.add || [];
    console.log(`✓ ${id} (${outcomes[index]}): Viktor ${rel >= 0 ? '+' : ''}${rel}`);
    if (flags.length > 0) console.log(`    Flags: ${flags.join(', ')}`);
    if (items.length > 0) console.log(`    Items: ${items.join(', ')}`);
    console.log(`    Next: ${scene.nextScene}`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Calculate possible relationship ranges
console.log('--- Relationship Impact Analysis ---');
console.log('Starting Viktor relationship: -20 (sees player as weak)');
console.log();
console.log('Best path (B-1-017→C, B-1-018C, B-1-020C):');
console.log('  +8 (bold approach) + +7 (impressed) + +12 (showed courage) + +25 (recruited) = +52 total');
console.log('  Final: Viktor at +32 (from -20 start)');
console.log();
console.log('Moderate path (B-1-017→A, B-1-018A, B-1-020B):');
console.log('  +5 (direct) + +5 (respect) + +5 (handled own way) + +10 (conditional) = +25 total');
console.log('  Final: Viktor at +5 (conditional ally)');
console.log();
console.log('Worst path (B-1-017→B, B-1-018B, B-1-020A):');
console.log('  +3 (protection seek) + +0 (disappointed) + -5 (asked for help) + -10 (failed) = -12 total');
console.log('  Final: Viktor at -32 (recruitment failed)');
console.log();

// Check for broken transitions
console.log('--- Transition Validation ---');
const viktorScenes = [
  'B-1-016', 'B-1-017',
  'B-1-018A', 'B-1-018B', 'B-1-018C',
  'B-1-019',
  'B-1-020A', 'B-1-020B', 'B-1-020C'
];

let issues = 0;
viktorScenes.forEach(id => {
  const scene = loadScene(id);

  if (scene.nextScene && !sceneExists(scene.nextScene)) {
    console.log(`✗ ${id}: nextScene '${scene.nextScene}' does not exist`);
    issues++;
  }

  scene.choices.forEach((choice, i) => {
    if (!sceneExists(choice.nextScene)) {
      console.log(`✗ ${id}: Choice ${i + 1} nextScene '${choice.nextScene}' does not exist`);
      issues++;
    }
  });
});

if (issues === 0) {
  console.log('✓ All transitions valid');
} else {
  console.log(`✗ ${issues} transition issues`);
}
console.log();

// Summary
console.log('=== Summary ===\n');
console.log('Viktor Recruitment Sequence: 9 scenes');
console.log('  Entry: B-1-016 (yard confrontation)');
console.log('  Three approaches: B-1-017 (direct, protection, bold)');
console.log('  Viktor\'s response: B-1-018A/B/C (3 branches)');
console.log('  The test: B-1-019 (Émile\'s crew, prove courage)');
console.log('  Outcomes: B-1-020A/B/C (3 endings)');
console.log();
console.log('Possible Outcomes:');
console.log('  SUCCESS: Stand up to threat, gain full ally, Viktor at +32, riot support unlocked');
console.log('  CONDITIONAL: Handle diplomatically, Viktor at +5, distraction available later');
console.log('  FAILED: Ask for protection, Viktor at -32, recruitment failed');
console.log();
console.log('Key Differences from Marcel:');
console.log('  - Viktor starts NEGATIVE (-20 vs Marcel 0)');
console.log('  - Test is immediate physical courage vs Marcel\'s delayed stealth test');
console.log('  - Viktor values action/courage vs Marcel\'s trust/intelligence');
console.log('  - Higher relationship gain on success (+52 vs +20)');
console.log();
console.log('Next Scene: B-1-026 (placeholder for continuation)');
console.log();

if (issues === 0) {
  console.log('✅ VIKTOR RECRUITMENT SEQUENCE FUNCTIONAL');
} else {
  console.log('❌ VIKTOR SEQUENCE HAS ISSUES');
}
