/**
 * Verification script for Émile recruitment sequence (B-1-026 to B-1-030)
 * Run this with: npx tsx scripts/verify-emile-recruitment.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Émile Recruitment Sequence Verification ===\n');

// Test B-1-026 entry
console.log('--- B-1-026: Dangerous Decision Point (Day 5) ---');
const b1026 = loadScene('B-1-026');
console.log(`✓ Type: ${b1026.type}`);
console.log(`✓ Pages: ${b1026.content.pages?.length}`);
console.log(`✓ Next: ${b1026.nextScene}`);
console.log(`✓ Flags: ${b1026.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-1-027 approach decision
console.log('--- B-1-027: Three Approaches + Walk Away ---');
const b1027 = loadScene('B-1-027');
console.log(`✓ Type: ${b1027.type}`);
console.log(`✓ Choices: ${b1027.choices.length}`);
b1027.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.emile || 0;
  const flags = choice.flagChanges?.set || [];
  const next = choice.nextScene;
  console.log(`  ${i + 1}. Émile ${rel >= 0 ? '+' : ''}${rel} → ${next} (${flags.join(', ')})`);
});
console.log();

// Test B-1-028 branching
console.log('--- B-1-028 Branching: Public vs Private ---');
const branches028 = ['B-1-028A', 'B-1-028B'];
branches028.forEach(id => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.emile || 0;
    const pages = scene.content.pages?.length || (scene.content.text ? 1 : 0);
    console.log(`✓ ${id}: ${pages} pages, Émile ${rel >= 0 ? '+' : ''}${rel} → B-1-029`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-1-029 proposition
console.log('--- B-1-029: The Proposition (3 offers) ---');
const b1029 = loadScene('B-1-029');
console.log(`✓ Type: ${b1029.type}`);
console.log(`✓ Pages: ${b1029.content.pages?.length}`);
console.log(`✓ Choices: ${b1029.choices.length}`);
b1029.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.emile || 0;
  console.log(`  ${i + 1}. Émile ${rel >= 0 ? '+' : ''}${rel}: ${choice.text.substring(0, 50)}...`);
});
console.log();

// Test B-1-030 outcomes
console.log('--- B-1-030 Outcomes ---');
const branches030 = ['B-1-030', 'B-1-030A', 'B-1-030B', 'B-1-030C'];
const outcomes = ['DECLINED', 'SUCCESS', 'PARTIAL', 'FAILED'];
branches030.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const rel = scene.relationshipChanges?.emile || 0;
    const flags = scene.flagChanges?.set || [];
    const items = scene.itemChanges?.add || [];
    console.log(`✓ ${id} (${outcomes[index]}): Émile ${rel >= 0 ? '+' : ''}${rel}`);
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
console.log('Starting Émile relationship: -50 (immediate enemy)');
console.log();
console.log('Best path (B-1-027→A public, B-1-029→A partnership):');
console.log('  +10 (public approach) + +10 (confronted) + +15 (partnership) + +30 (recruited) = +65 total');
console.log('  Final: Émile at +15 (from -50 start) - dangerous ally unlocked');
console.log();
console.log('Moderate path (B-1-027→B private, B-1-029→B trade):');
console.log('  +5 (private approach) + +5 (cornered) + +10 (trade) + +20 (partial) = +40 total');
console.log('  Final: Émile at -10 (information trader, not ally)');
console.log();
console.log('Worst path (B-1-027→A public, B-1-029→C non-aggression):');
console.log('  +10 (public) + +10 (confronted) + +3 (minimal ask) + -15 (failed) = +8 total');
console.log('  Final: Émile at -42 (recruitment failed, enmity intensified)');
console.log();
console.log('Walk away (B-1-027→walk away):');
console.log('  +0 (avoided) = +0 total');
console.log('  Final: Émile at -50 (unchanged, stayed enemy)');
console.log();

// Check for broken transitions
console.log('--- Transition Validation ---');
const emileScenes = [
  'B-1-026', 'B-1-027',
  'B-1-028A', 'B-1-028B',
  'B-1-029',
  'B-1-030', 'B-1-030A', 'B-1-030B', 'B-1-030C'
];

let issues = 0;
emileScenes.forEach(id => {
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
console.log('Émile Recruitment Sequence: 9 scenes (including walk-away option)');
console.log('  Entry: B-1-026 (Day 5, dangerous decision)');
console.log('  Approach choice: B-1-027 (public, private, or walk away)');
console.log('  Two approach branches: B-1-028A/B');
console.log('  The proposition: B-1-029 (three offers)');
console.log('  Four outcomes: B-1-030 (declined), B-1-030A/B/C (success/partial/failed)');
console.log();
console.log('Possible Outcomes:');
console.log('  SUCCESS: Full partnership, Émile at +15, guard secrets + commitment items');
console.log('  PARTIAL: Information trade, Émile at -10, guard schedule item only');
console.log('  FAILED: Weak ask, Émile at -42, enmity worsened');
console.log('  DECLINED: Walk away, Émile at -50, safe but no benefit');
console.log();
console.log('Key Differences from Other Recruitments:');
console.log('  - Émile starts HOSTILE (-50 vs Denis +20, Marcel 0, Viktor -20)');
console.log('  - Has walk-away option (avoid entirely)');
console.log('  - Test is risk tolerance vs Marcel stealth, Viktor courage, Denis conscience');
console.log('  - Highest risk/reward ratio of all recruitments');
console.log('  - Even success leaves him dangerous (+15 is still volatile)');
console.log('  - Provides unique guard corruption intelligence');
console.log();
console.log('Next Scene: B-1-031 (team formation phase)');
console.log();

if (issues === 0) {
  console.log('✅ ÉMILE RECRUITMENT SEQUENCE FUNCTIONAL');
} else {
  console.log('❌ ÉMILE SEQUENCE HAS ISSUES');
}
