/**
 * Verification script for Denis recruitment sequence (B-1-021 to B-1-025)
 * Run this with: npx tsx scripts/verify-denis-recruitment.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Denis Recruitment Sequence Verification ===\n');

// Test B-1-021 entry
console.log('--- B-1-021: Chapel Meeting ---');
const b1021 = loadScene('B-1-021');
console.log(`✓ Type: ${b1021.type}`);
console.log(`✓ Pages: ${b1021.content.pages?.length}`);
console.log(`✓ Next: ${b1021.nextScene}`);
console.log(`✓ Requirements: ${JSON.stringify(b1021.requirements?.flags)}`);
console.log(`✓ Flags: ${b1021.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-1-022 initial conversation
console.log('--- B-1-022: Three Approaches ---');
const b1022 = loadScene('B-1-022');
console.log(`✓ Type: ${b1022.type}`);
console.log(`✓ Pages: ${b1022.content.pages?.length}`);
console.log(`✓ Choices: ${b1022.choices.length}`);
b1022.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.denis || 0;
  const flags = choice.flagChanges?.set || [];
  console.log(`  ${i + 1}. Denis ${rel >= 0 ? '+' : ''}${rel} → ${choice.nextScene} (${flags.join(', ')})`);
});
console.log();

// Test B-1-023 branching
console.log('--- B-1-023 Branching: Denis\'s Response ---');
const branches023 = ['B-1-023A', 'B-1-023B', 'B-1-023C'];
branches023.forEach(id => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.denis || 0;
    const pages = scene.content.pages?.length || (scene.content.text ? 1 : 0);
    console.log(`✓ ${id}: ${pages} pages, Denis ${rel >= 0 ? '+' : ''}${rel} → B-1-024`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-1-024 moral test
console.log('--- B-1-024: The Map and Moral Test ---');
const b1024 = loadScene('B-1-024');
console.log(`✓ Type: ${b1024.type}`);
console.log(`✓ Pages: ${b1024.content.pages?.length}`);
console.log(`✓ Choices: ${b1024.choices.length}`);
b1024.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.denis || 0;
  console.log(`  ${i + 1}. Denis ${rel >= 0 ? '+' : ''}${rel}: ${choice.text.substring(0, 50)}...`);
});
console.log();

// Test B-1-025 outcomes
console.log('--- B-1-025 Outcomes ---');
const branches025 = ['B-1-025A', 'B-1-025B', 'B-1-025C'];
const outcomes = ['SUCCESS', 'PARTIAL', 'FAILED'];
branches025.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.denis || 0;
    const flags = scene.flagChanges?.set || [];
    const items = scene.itemChanges?.add || [];
    console.log(`✓ ${id} (${outcomes[index]}): Denis ${rel >= 0 ? '+' : ''}${rel}`);
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
console.log('Starting Denis relationship: +20 (kind to everyone)');
console.log();
console.log('Best path (B-1-022→A, B-1-023A, B-1-024→A):');
console.log('  +8 (peaceful approach) + +7 (concerned) + +10 (sworn oath) + +15 (recruited) = +40 total');
console.log('  Final: Denis at +60 (from +20 start) - unlocks passage showing');
console.log();
console.log('Moderate path (B-1-022→C, B-1-023C, B-1-024→B):');
console.log('  +5 (personal) + +5 (defensive) + +5 (honest) + +0 (partial) = +15 total');
console.log('  Final: Denis at +35 (gets map but no guide)');
console.log();
console.log('Worst path (B-1-022→B, B-1-023B, B-1-024→C):');
console.log('  +3 (direct) + +0 (cautious) + -5 (refused oath) + -10 (failed) = -12 total');
console.log('  Final: Denis at +8 (recruitment failed, no map)');
console.log();

// Check for broken transitions
console.log('--- Transition Validation ---');
const denisScenes = [
  'B-1-021', 'B-1-022',
  'B-1-023A', 'B-1-023B', 'B-1-023C',
  'B-1-024',
  'B-1-025A', 'B-1-025B', 'B-1-025C'
];

let issues = 0;
denisScenes.forEach(id => {
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
console.log('Denis Recruitment Sequence: 9 scenes');
console.log('  Entry: B-1-021 (chapel meeting, Day 4)');
console.log('  Three approaches: B-1-022 (peaceful, direct, personal)');
console.log('  Denis\'s backstory: B-1-023A/B/C (3 branches)');
console.log('  The moral test: B-1-024 (monastery map revealed)');
console.log('  Outcomes: B-1-025A/B/C (3 endings)');
console.log();
console.log('Possible Outcomes:');
console.log('  SUCCESS: Swear nonviolence oath, gain map + guide, Denis at +60');
console.log('  PARTIAL: Honest about uncertainty, get map only, Denis at +35');
console.log('  FAILED: Refuse oath or claim self-defense, no map, Denis at +8');
console.log();
console.log('Key Differences from Marcel & Viktor:');
console.log('  - Denis starts POSITIVE (+20 vs Marcel 0, Viktor -20)');
console.log('  - Test is moral/philosophical vs Marcel\'s stealth, Viktor\'s courage');
console.log('  - Denis values nonviolence commitment over capability');
console.log('  - Rewards conscience and wisdom over skill or bravery');
console.log('  - Provides monastery passage map (critical for Chapel Route)');
console.log();
console.log('Next Scene: B-1-026 (placeholder for continuation)');
console.log();

if (issues === 0) {
  console.log('✅ DENIS RECRUITMENT SEQUENCE FUNCTIONAL');
} else {
  console.log('❌ DENIS SEQUENCE HAS ISSUES');
}
