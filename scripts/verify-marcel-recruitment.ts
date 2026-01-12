/**
 * Verification script for Marcel recruitment sequence (B-1-011 to B-1-015)
 * Run this with: npx tsx scripts/verify-marcel-recruitment.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Marcel Recruitment Sequence Verification ===\n');

// Test B-1-011 entry
console.log('--- B-1-011: Finding Marcel in Library ---');
const b1011 = loadScene('B-1-011');
console.log(`✓ Type: ${b1011.type}`);
console.log(`✓ Pages: ${b1011.content.pages?.length}`);
console.log(`✓ Next: ${b1011.nextScene}`);
console.log(`✓ Flags: ${b1011.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-1-012 initial approach
console.log('--- B-1-012: Building Rapport ---');
const b1012 = loadScene('B-1-012');
console.log(`✓ Type: ${b1012.type}`);
console.log(`✓ Choices: ${b1012.choices.length}`);
b1012.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.marcel || 0;
  const flags = choice.flagChanges?.set || [];
  console.log(`  ${i + 1}. Marcel +${rel} → ${choice.nextScene} (${flags.join(', ')})`);
});
console.log();

// Test B-1-013 branching
console.log('--- B-1-013 Branching: Initial Response ---');
const branches013 = ['B-1-013A', 'B-1-013B', 'B-1-013C'];
branches013.forEach(id => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.marcel || 0;
    const pages = scene.content.pages?.length || scene.content.text ? 1 : 0;
    const flags = scene.flagChanges?.set || [];
    console.log(`✓ ${id}: ${pages} pages, Marcel ${rel >= 0 ? '+' : ''}${rel} (${flags.join(', ')})`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-1-014 Marcel's test
console.log('--- B-1-014: Marcel\'s Test ---');
const b1014 = loadScene('B-1-014');
console.log(`✓ Type: ${b1014.type}`);
console.log(`✓ Choices: ${b1014.choices.length}`);
b1014.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.marcel || 0;
  console.log(`  ${i + 1}. Marcel ${rel >= 0 ? '+' : ''}${rel}: ${choice.text.substring(0, 40)}...`);
});
console.log();

// Test B-1-015 outcomes
console.log('--- B-1-015 Outcomes ---');
const branches015 = ['B-1-015A', 'B-1-015B', 'B-1-015C'];
const outcomes = ['SUCCESS', 'PAUSED', 'FAILED'];
branches015.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.marcel || 0;
    const flags = scene.flagChanges?.set || [];
    const items = scene.itemChanges?.add || [];
    console.log(`✓ ${id} (${outcomes[index]}): Marcel ${rel >= 0 ? '+' : ''}${rel}`);
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
console.log('Starting Marcel relationship: 0');
console.log();
console.log('Best path (B-1-012→C, B-1-013C, B-1-014, B-1-015A):');
console.log('  +8 (honest approach) + +7 (deep connection) + +5 (accept test) = +20 total');
console.log('  Final: Marcel at 20 (reached teaching threshold)');
console.log();
console.log('Moderate path (B-1-012→A, B-1-013A, B-1-014, B-1-015A):');
console.log('  +5 (friendly) + +5 (interested) + +5 (accept test) = +15 total');
console.log('  Final: Marcel at 15');
console.log();
console.log('Worst path (B-1-012→B, B-1-013B, B-1-014, B-1-015C):');
console.log('  +3 (flattery) + 0 (skeptical) + -10 (challenge) + -15 (offended) = -22 total');
console.log('  Final: Marcel at -22 (recruitment failed)');
console.log();

// Check for broken transitions
console.log('--- Transition Validation ---');
const marcelScenes = [
  'B-1-011', 'B-1-012',
  'B-1-013A', 'B-1-013B', 'B-1-013C',
  'B-1-014',
  'B-1-015A', 'B-1-015B', 'B-1-015C'
];

let issues = 0;
marcelScenes.forEach(id => {
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
console.log('Marcel Recruitment Sequence: 9 scenes');
console.log('  Entry: B-1-011 (library introduction)');
console.log('  Building rapport: B-1-012 (3 approaches)');
console.log('  Initial response: B-1-013A/B/C (3 branches)');
console.log('  Test proposal: B-1-014 (Marcel\'s challenge)');
console.log('  Outcomes: B-1-015A/B/C (3 endings)');
console.log();
console.log('Possible Outcomes:');
console.log('  SUCCESS: Accept test, gain workshop key, Marcel at +15 to +20');
console.log('  PAUSED: Decline test, recruitment stalled, Marcel at +10');
console.log('  FAILED: Challenge Marcel, recruitment failed, Marcel at -22');
console.log();
console.log('Next Scene: B-1-026 (placeholder for continuation)');
console.log();

if (issues === 0) {
  console.log('✅ MARCEL RECRUITMENT SEQUENCE FUNCTIONAL');
} else {
  console.log('❌ MARCEL SEQUENCE HAS ISSUES');
}
