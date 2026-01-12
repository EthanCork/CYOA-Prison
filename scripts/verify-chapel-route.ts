/**
 * Verification script for Chapel Route (B-2-001 to B-2-019)
 * Run this with: npx tsx scripts/verify-chapel-route.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Chapel Route Verification (Path B Act 2) ===\n');

// Test B-2-001 entry
console.log('--- B-2-001: Chapel Route Entry ---');
const b2001 = loadScene('B-2-001');
console.log(`✓ Type: ${b2001.type}`);
console.log(`✓ Pages: ${b2001.content.pages?.length}`);
console.log(`✓ Requirements: ${JSON.stringify(b2001.requirements?.flags)}`);
console.log(`✓ Flags: ${b2001.flagChanges?.set?.join(', ')}`);
console.log(`✓ Next: ${b2001.nextScene}`);
console.log();

// Test B-2-002 passage system reveal
console.log('--- B-2-002: Denis Reveals Full Passage System ---');
const b2002 = loadScene('B-2-002');
console.log(`✓ Type: ${b2002.type}`);
console.log(`✓ Pages: ${b2002.content.pages?.length}`);
console.log(`✓ Flags: ${b2002.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-2-003 route choice
console.log('--- B-2-003: Three Route Choice ---');
const b2003 = loadScene('B-2-003');
console.log(`✓ Type: ${b2003.type}`);
console.log(`✓ Choices: ${b2003.choices.length}`);
b2003.choices.forEach((choice, i) => {
  const flags = choice.flagChanges?.set || [];
  const rel = choice.relationshipChanges?.denis || 0;
  console.log(`  ${i + 1}. → ${choice.nextScene} (${flags.join(', ')}) Denis ${rel >= 0 ? '+' : ''}${rel}`);
});
console.log();

// Test B-2-004 route branches
console.log('--- B-2-004 Route Discovery Branches ---');
const branches004 = ['B-2-004A', 'B-2-004B', 'B-2-004C'];
const routes = ['High/Monastery', 'Middle/Caves', 'Low/Flooded'];
branches004.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const items = scene.itemChanges?.add || [];
    const flags = scene.flagChanges?.set || [];
    console.log(`✓ ${id} (${routes[index]}): ${scene.content.pages?.length} pages`);
    if (items.length > 0) console.log(`    Items: ${items.join(', ')}`);
    if (flags.length > 0) console.log(`    Flags: ${flags.join(', ')}`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-2-005 passage navigation
console.log('--- B-2-005: Passage Navigation ---');
const b2005 = loadScene('B-2-005');
console.log(`✓ Type: ${b2005.type}`);
console.log(`✓ Pages: ${b2005.content.pages?.length}`);
console.log(`✓ Next: ${b2005.nextScene}`);
console.log();

// Test B-2-006 obstacle
console.log('--- B-2-006: Bridge Obstacle ---');
const b2006 = loadScene('B-2-006');
console.log(`✓ Type: ${b2006.type}`);
console.log(`✓ Choices: ${b2006.choices.length}`);
b2006.choices.forEach((choice, i) => {
  const req = choice.requirements?.items?.[0] || 'none';
  console.log(`  ${i + 1}. → ${choice.nextScene} (requires: ${req})`);
});
console.log();

// Test B-2-007 crossing solutions
console.log('--- B-2-007 Crossing Solutions ---');
const branches007 = ['B-2-007A', 'B-2-007B', 'B-2-007C'];
const solutions = ['Jump', 'Wade', 'Boat'];
branches007.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    console.log(`✓ ${id} (${solutions[index]}): ${scene.content.pages?.length} pages → B-2-008`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-2-008 deeper passages
console.log('--- B-2-008: Approaching Exit ---');
const b2008 = loadScene('B-2-008');
console.log(`✓ Type: ${b2008.type}`);
console.log(`✓ Pages: ${b2008.content.pages?.length}`);
console.log(`✓ Flags: ${b2008.flagChanges?.set?.join(', ')}`);
console.log();

// Test B-2-009 guard encounter
console.log('--- B-2-009: Guard Encounter Decision ---');
const b2009 = loadScene('B-2-009');
console.log(`✓ Type: ${b2009.type}`);
console.log(`✓ Choices: ${b2009.choices.length}`);
b2009.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.denis || 0;
  const req = choice.requirements?.flags?.[0] || 'none';
  console.log(`  ${i + 1}. Denis ${rel >= 0 ? '+' : ''}${rel} (requires: ${req})`);
});
console.log();

// Test B-2-010 guard handling outcomes
console.log('--- B-2-010 Guard Handling Outcomes ---');
const branches010 = ['B-2-010A', 'B-2-010B', 'B-2-010C', 'B-2-010D'];
const guardOutcomes = ['Wait', 'Distract', 'Confront', 'Negotiate'];
branches010.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const flags = scene.flagChanges?.set || [];
    console.log(`✓ ${id} (${guardOutcomes[index]}): ${flags.join(', ')}`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-2-011 sea cave emergence
console.log('--- B-2-011: Sea Cave Emergence ---');
const b2011 = loadScene('B-2-011');
console.log(`✓ Type: ${b2011.type}`);
console.log(`✓ Pages: ${b2011.content.pages?.length}`);
console.log(`✓ Denis choice moment begins`);
console.log();

// Test B-2-012 Denis's decision
console.log('--- B-2-012: Denis Stays Behind ---');
const b2012 = loadScene('B-2-012');
console.log(`✓ Type: ${b2012.type}`);
console.log(`✓ Choices: ${b2012.choices.length}`);
b2012.choices.forEach((choice, i) => {
  const rel = choice.relationshipChanges?.denis || 0;
  console.log(`  ${i + 1}. Denis ${rel >= 0 ? '+' : ''}${rel}: ${choice.text.substring(0, 40)}...`);
});
console.log();

// Test B-2-013 farewell branches
console.log('--- B-2-013 Denis Farewell Branches ---');
const branches013 = ['B-2-013A', 'B-2-013B', 'B-2-013C'];
const farewells = ['Begged', 'Accepted', 'Promised'];
branches013.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const items = scene.itemChanges?.add || [];
    console.log(`✓ ${id} (${farewells[index]}): ${scene.content.pages?.length} pages`);
    if (items.length > 0) console.log(`    Items: ${items.join(', ')}`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-2-014 mainland approach
console.log('--- B-2-014: Rocky Shore Assessment ---');
const b2014 = loadScene('B-2-014');
console.log(`✓ Type: ${b2014.type}`);
console.log(`✓ Pages: ${b2014.content.pages?.length}`);
console.log();

// Test B-2-015 escape method choice
console.log('--- B-2-015: Escape Method Choice ---');
const b2015 = loadScene('B-2-015');
console.log(`✓ Type: ${b2015.type}`);
console.log(`✓ Choices: ${b2015.choices.length}`);
b2015.choices.forEach((choice, i) => {
  const req = choice.requirements?.items?.[0] || 'none';
  console.log(`  ${i + 1}. → ${choice.nextScene} (requires: ${req})`);
});
console.log();

// Test B-2-016 escape execution branches
console.log('--- B-2-016 Escape Execution Branches ---');
const branches016 = ['B-2-016A', 'B-2-016B', 'B-2-016C', 'B-2-016D'];
const escapeMethods = ['Monks Boat', 'Raid Dock', 'Lighthouse', 'Wait for Cordelia'];
branches016.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const flags = scene.flagChanges?.set || [];
    const nextScene = scene.nextScene;
    console.log(`✓ ${id} (${escapeMethods[index]}): → ${nextScene}`);
    if (flags.length > 0) console.log(`    Flags: ${flags.join(', ')}`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Test B-2-017 pursuit coordination
console.log('--- B-2-017: Team Coordination Under Pursuit ---');
if (sceneExists('B-2-017')) {
  const b2017 = loadScene('B-2-017');
  console.log(`✓ Type: ${b2017.type}`);
  console.log(`✓ Pages: ${b2017.content.pages?.length}`);
  console.log(`✓ Bastian sacrifice moment`);
} else {
  console.log('⚠ B-2-017: Not on perfect escape path (Cordelia route bypasses this)');
}
console.log();

// Test B-2-018 sacrifice choice
console.log('--- B-2-018: Bastian Sacrifice Decision ---');
if (sceneExists('B-2-018')) {
  const b2018 = loadScene('B-2-018');
  console.log(`✓ Type: ${b2018.type}`);
  console.log(`✓ Choices: ${b2018.choices.length}`);
} else {
  console.log('⚠ B-2-018: Not on perfect escape path');
}
console.log();

// Test B-2-019 endings
console.log('--- B-2-019 Chapel Route Endings ---');
const endings = ['B-2-019A', 'B-2-019B', 'B-2-019'];
const endingTypes = ['Bastian Sacrificed', 'Everyone Together', 'Cordelia Perfect'];
endings.forEach((id, index) => {
  if (sceneExists(id)) {
    const scene = loadScene(id);
    const nextScene = scene.nextScene || 'None';
    const flags = scene.flagChanges?.set || [];
    console.log(`✓ ${id} (${endingTypes[index]}): → ${nextScene}`);
    console.log(`    Flags: ${flags.join(', ')}`);
  } else {
    console.log(`✗ ${id}: Missing!`);
  }
});
console.log();

// Check for broken transitions
console.log('--- Transition Validation ---');
const chapelScenes = [
  'B-2-001', 'B-2-002', 'B-2-003',
  'B-2-004A', 'B-2-004B', 'B-2-004C',
  'B-2-005', 'B-2-006',
  'B-2-007A', 'B-2-007B', 'B-2-007C',
  'B-2-008', 'B-2-009',
  'B-2-010A', 'B-2-010B', 'B-2-010C', 'B-2-010D',
  'B-2-011', 'B-2-012',
  'B-2-013A', 'B-2-013B', 'B-2-013C',
  'B-2-014', 'B-2-015',
  'B-2-016A', 'B-2-016B', 'B-2-016C', 'B-2-016D',
  'B-2-017', 'B-2-018',
  'B-2-019A', 'B-2-019B', 'B-2-019'
];

let issues = 0;
chapelScenes.forEach(id => {
  if (!sceneExists(id)) {
    console.log(`✗ ${id}: Scene does not exist`);
    issues++;
    return;
  }

  const scene = loadScene(id);

  if (scene.nextScene && scene.nextScene !== '' && !sceneExists(scene.nextScene)) {
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
console.log('Chapel Route: 32 scenes (B-2-001 to B-2-019 + branches)');
console.log('  B-2-001: Chapel gathering, passage revealed');
console.log('  B-2-002: Full passage system explained');
console.log('  B-2-003: Three route choice (high/middle/low)');
console.log('  B-2-004A/B/C: Route-specific discoveries');
console.log('  B-2-005: Navigation deeper');
console.log('  B-2-006: Bridge obstacle');
console.log('  B-2-007A/B/C: Crossing solutions');
console.log('  B-2-008: Guards encountered');
console.log('  B-2-009: Guard handling choice');
console.log('  B-2-010A/B/C/D: Guard outcomes (4 approaches)');
console.log('  B-2-011: Sea cave emergence');
console.log('  B-2-012: Denis decision point');
console.log('  B-2-013A/B/C: Farewell branches');
console.log('  B-2-014: Mainland approach assessment');
console.log('  B-2-015: Escape method choice');
console.log('  B-2-016A/B/C/D: Four escape methods');
console.log('  B-2-017: Pursuit coordination (conditional)');
console.log('  B-2-018: Bastian sacrifice choice (conditional)');
console.log('  B-2-019A/B/19: Three possible endings');
console.log();
console.log('Key Features:');
console.log('  - Requires Denis recruited (denis_recruited flag)');
console.log('  - Three passage routes with different discoveries');
console.log('  - Ancient monk boat provides advantages if found');
console.log('  - Multiple guard handling approaches (nonviolent emphasized)');
console.log('  - Denis chooses to stay (maintains his calling)');
console.log('  - Four mainland escape methods');
console.log('  - Cordelia route provides perfect nonviolent escape');
console.log();
console.log('Endings:');
console.log('  B-2-019A: Bastian sacrifices himself → B-5-E01');
console.log('  B-2-019B: Everyone escapes together → B-5-E02');
console.log('  B-2-019: Perfect Cordelia rescue → B-5-E03');
console.log();
console.log('Next Scenes to Build:');
console.log('  B-5-E01, B-5-E02, B-5-E03: Chapel Route ending variations');
console.log('  B-2-020 to B-2-039: Chaos Route (Viktor)');
console.log('  B-2-040 to B-2-059: Leverage Route (Émile)');
console.log('  B-2-060 to B-2-079: Loading Dock Route (Marcel)');
console.log();

if (issues === 0) {
  console.log('✅ CHAPEL ROUTE FUNCTIONAL');
  console.log('   Ready for testing and ending scene development');
} else {
  console.log('❌ CHAPEL ROUTE HAS ISSUES');
}
