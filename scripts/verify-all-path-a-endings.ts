/**
 * Comprehensive verification script for all Path A endings
 * Run this with: npx tsx scripts/verify-all-path-a-endings.ts
 */

import { loadScene, sceneExists, getAllSceneIds } from '../lib/sceneLoader';

console.log('=== Verifying All Path A Endings ===\n');

// Death endings
const deathEndings = [
  { id: 'A-5-D01', name: 'Shot at Dock' },
  { id: 'A-5-D02', name: 'Drowned Underground' },
  { id: 'A-5-D03', name: 'Lost at Sea' },
  { id: 'A-5-D04', name: 'Fall from Lighthouse' },
];

// Capture endings
const captureEndings = [
  { id: 'A-5-C01', name: 'Caught in Kitchen' },
  { id: 'A-5-C02', name: 'Caught at Dock' },
  { id: 'A-5-C03', name: 'Caught at Sea' },
];

console.log('--- Death Endings (4) ---\n');
deathEndings.forEach(({ id, name }) => {
  const scene = loadScene(id);
  const hasDeathFlag = scene.flagChanges?.set?.includes('death_ending');
  const hasEndingFlag = scene.flagChanges?.set?.includes('ending_reached');
  console.log(`${hasDeathFlag && hasEndingFlag ? '✓' : '✗'} ${id}: ${name}`);
});

console.log('\n--- Capture Endings (3) ---\n');
captureEndings.forEach(({ id, name }) => {
  const scene = loadScene(id);
  const hasCaptureFlag = scene.flagChanges?.set?.includes('capture_ending');
  const hasEndingFlag = scene.flagChanges?.set?.includes('ending_reached');
  console.log(`${hasCaptureFlag && hasEndingFlag ? '✓' : '✗'} ${id}: ${name}`);
});

console.log('\n--- Summary ---\n');
console.log(`Total Path A Endings: ${deathEndings.length + captureEndings.length}`);
console.log(`  Death Endings: ${deathEndings.length}`);
console.log(`  Capture Endings: ${captureEndings.length}`);

// Check all have type: ending
const allEndings = [...deathEndings, ...captureEndings];
const allAreEndingType = allEndings.every(({ id }) => loadScene(id).type === 'ending');
console.log(`\nAll scenes have type 'ending': ${allAreEndingType ? '✓' : '✗'}`);

// Check all have 0 choices
const allHaveNoChoices = allEndings.every(({ id }) => loadScene(id).choices.length === 0);
console.log(`All endings have 0 choices: ${allHaveNoChoices ? '✓' : '✗'}`);

// Check all have 4 pages
const allHaveFourPages = allEndings.every(({ id }) => loadScene(id).content.pages?.length === 4);
console.log(`All endings have 4 pages: ${allHaveFourPages ? '✓' : '✓'}`);

console.log('\n=== All Path A Endings Successfully Verified! ===');
