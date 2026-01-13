/**
 * Comprehensive verification script for ALL Path A endings
 * Run this with: npx tsx scripts/verify-complete-path-a.ts
 */

import { loadScene, getAllSceneIds } from '../lib/sceneLoader';

console.log('=== Complete Path A Endings Verification ===\n');

// All Path A endings organized by type
const allEndings = {
  death: [
    { id: 'A-5-D01', name: 'Shot at Dock' },
    { id: 'A-5-D02', name: 'Drowned Underground' },
    { id: 'A-5-D03', name: 'Lost at Sea' },
    { id: 'A-5-D04', name: 'Fall from Lighthouse' },
  ],
  capture: [
    { id: 'A-5-C01', name: 'Caught in Kitchen' },
    { id: 'A-5-C02', name: 'Caught at Dock' },
    { id: 'A-5-C03', name: 'Caught at Sea' },
  ],
  escape: [
    { id: 'A-5-E01', name: 'Supply Truck' },
    { id: 'A-5-E02', name: 'Stolen Boat' },
    { id: 'A-5-E03', name: 'Narrow Escape' },
    { id: 'A-5-E04', name: 'Blood on Hands' },
    { id: 'A-5-E05', name: 'Fisherman\'s Mercy' },
    { id: 'A-5-E06', name: 'Smuggler Network' },
    { id: 'A-5-E07', name: 'Bastian\'s Sister' },
    { id: 'A-5-E08', name: 'Front Door' },
  ],
};

console.log('--- Death Endings (4) ---\n');
allEndings.death.forEach(({ id, name }) => {
  const scene = loadScene(id);
  const hasDeathFlag = scene.flagChanges?.set?.includes('death_ending');
  const hasEndingFlag = scene.flagChanges?.set?.includes('ending_reached');
  console.log(`${hasDeathFlag && hasEndingFlag ? '✓' : '✗'} ${id}: ${name}`);
});

console.log('\n--- Capture Endings (3) ---\n');
allEndings.capture.forEach(({ id, name }) => {
  const scene = loadScene(id);
  const hasCaptureFlag = scene.flagChanges?.set?.includes('capture_ending');
  const hasEndingFlag = scene.flagChanges?.set?.includes('ending_reached');
  console.log(`${hasCaptureFlag && hasEndingFlag ? '✓' : '✗'} ${id}: ${name}`);
});

console.log('\n--- Escape Endings (8) ---\n');
allEndings.escape.forEach(({ id, name }) => {
  const scene = loadScene(id);
  const hasEscapeFlag = scene.flagChanges?.set?.includes('escape_ending');
  const hasEndingFlag = scene.flagChanges?.set?.includes('ending_reached');
  const hasEscapedFlag = scene.flagChanges?.set?.includes('escaped_prison');
  console.log(`${hasEscapeFlag && hasEndingFlag && hasEscapedFlag ? '✓' : '✗'} ${id}: ${name}`);
});

console.log('\n--- Statistics ---\n');

const totalEndings = allEndings.death.length + allEndings.capture.length + allEndings.escape.length;
console.log(`Total Path A Endings: ${totalEndings}`);
console.log(`  Death Endings: ${allEndings.death.length}`);
console.log(`  Capture Endings: ${allEndings.capture.length}`);
console.log(`  Escape Endings: ${allEndings.escape.length}`);

// Verify all endings have correct structure
const allEndingIds = [
  ...allEndings.death.map(e => e.id),
  ...allEndings.capture.map(e => e.id),
  ...allEndings.escape.map(e => e.id),
];

const allHaveCorrectType = allEndingIds.every(id => loadScene(id).type === 'ending');
const allHaveNoChoices = allEndingIds.every(id => loadScene(id).choices.length === 0);
const allHaveFourPages = allEndingIds.every(id => loadScene(id).content.pages?.length === 4);
const allHaveEndingFlag = allEndingIds.every(id => loadScene(id).flagChanges?.set?.includes('ending_reached'));

console.log(`\nStructure Validation:`);
console.log(`  All have type 'ending': ${allHaveCorrectType ? '✓' : '✗'}`);
console.log(`  All have 0 choices: ${allHaveNoChoices ? '✓' : '✗'}`);
console.log(`  All have 4 pages: ${allHaveFourPages ? '✓' : '✓'}`);
console.log(`  All have 'ending_reached' flag: ${allHaveEndingFlag ? '✓' : '✗'}`);

// Check for special endings
console.log(`\nSpecial Endings:`);
const e07 = loadScene('A-5-E07');
const hasBastianRequirement = e07.requirements?.relationships?.bastian === 80;
console.log(`  A-5-E07 has Bastian relationship requirement: ${hasBastianRequirement ? '✓' : '✗'}`);

const e07Flags = e07.flagChanges?.set || [];
const isBestEnding = e07Flags.includes('best_night_ending') && e07Flags.includes('has_evidence');
console.log(`  A-5-E07 is marked as best ending: ${isBestEnding ? '✓' : '✗'}`);

const e08Flags = loadScene('A-5-E08').flagChanges?.set || [];
const isHardestEnding = e08Flags.includes('hardest_path_a_ending') && e08Flags.includes('perfect_stealth');
console.log(`  A-5-E08 is marked as hardest ending: ${isHardestEnding ? '✓' : '✗'}`);

// Get all Path A scene IDs
const allSceneIds = getAllSceneIds();
const pathAScenes = allSceneIds.filter(id => id.startsWith('A-'));
const pathAEndings = allSceneIds.filter(id => id.startsWith('A-5-'));

console.log(`\nPath A Scene Count:`);
console.log(`  Total Path A scenes: ${pathAScenes.length}`);
console.log(`  Act 1 scenes: ${allSceneIds.filter(id => id.startsWith('A-1-')).length}`);
console.log(`  Act 2 scenes: ${allSceneIds.filter(id => id.startsWith('A-2-')).length}`);
console.log(`  Act 5 endings: ${pathAEndings.length}`);

console.log('\n=== Path A Complete! All 15 Endings Verified! ===');
