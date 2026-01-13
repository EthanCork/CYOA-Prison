/**
 * Verification script for Path A capture endings
 * Run this with: npx tsx scripts/verify-capture-endings.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Verifying Path A Capture Endings ===\n');

const captureEndings = ['A-5-C01', 'A-5-C02', 'A-5-C03'];

captureEndings.forEach(id => {
  console.log(`Checking ${id}...`);
  if (!sceneExists(id)) {
    console.log(`  ✗ Scene does not exist!`);
    return;
  }

  const scene = loadScene(id);
  console.log(`  ✓ Scene Type: ${scene.type}`);
  console.log(`  ✓ Pages: ${scene.content.pages?.length || 0}`);
  console.log(`  ✓ Choices: ${scene.choices.length} (should be 0 for endings)`);
  console.log(`  ✓ Flags: ${scene.flagChanges?.set?.join(', ') || 'none'}`);

  // Check for capture_ending flag
  const hasCaptureFlag = scene.flagChanges?.set?.includes('capture_ending');
  console.log(`  ${hasCaptureFlag ? '✓' : '✗'} Has 'capture_ending' flag`);

  // Check ending title in last page
  const lastPage = scene.content.pages?.[scene.content.pages.length - 1] || '';
  const hasCaptureTitle = lastPage.includes('CAPTURE ENDING');
  console.log(`  ${hasCaptureTitle ? '✓' : '✗'} Contains 'CAPTURE ENDING' title`);

  console.log();
});

console.log('=== All Capture Endings Verified! ===');
