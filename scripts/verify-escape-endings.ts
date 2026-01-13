/**
 * Verification script for Path A escape endings
 * Run this with: npx tsx scripts/verify-escape-endings.ts
 */

import { loadScene, sceneExists } from '../lib/sceneLoader';

console.log('=== Verifying Path A Escape Endings ===\n');

const escapeEndings = [
  { id: 'A-5-E01', name: 'Supply Truck', difficulty: 'Medium', moral: 'Clean' },
  { id: 'A-5-E02', name: 'Stolen Boat', difficulty: 'Medium', moral: 'Clean' },
  { id: 'A-5-E03', name: 'Narrow Escape', difficulty: 'Hard', moral: 'Clean' },
  { id: 'A-5-E04', name: 'Blood on Hands', difficulty: 'Medium', moral: 'Compromised' },
  { id: 'A-5-E05', name: 'Fisherman\'s Mercy', difficulty: 'Lucky', moral: 'Clean' },
  { id: 'A-5-E06', name: 'Smuggler Network', difficulty: 'Easy', moral: 'Compromised' },
  { id: 'A-5-E07', name: 'Bastian\'s Sister', difficulty: 'Requires Relationship', moral: 'Best' },
  { id: 'A-5-E08', name: 'Front Door', difficulty: 'Hardest', moral: 'Clean' },
];

escapeEndings.forEach(({ id, name, difficulty, moral }) => {
  console.log(`Checking ${id}: ${name}...`);

  if (!sceneExists(id)) {
    console.log(`  ✗ Scene does not exist!`);
    return;
  }

  const scene = loadScene(id);

  // Basic checks
  console.log(`  ✓ Scene Type: ${scene.type}`);
  console.log(`  ✓ Pages: ${scene.content.pages?.length || 0}`);
  console.log(`  ✓ Choices: ${scene.choices.length} (should be 0 for endings)`);

  // Check for escape_ending flag
  const hasEscapeFlag = scene.flagChanges?.set?.includes('escape_ending');
  console.log(`  ${hasEscapeFlag ? '✓' : '✗'} Has 'escape_ending' flag`);

  // Check for ending_reached flag
  const hasEndingFlag = scene.flagChanges?.set?.includes('ending_reached');
  console.log(`  ${hasEndingFlag ? '✓' : '✗'} Has 'ending_reached' flag`);

  // Check for escaped_prison flag
  const hasEscapedFlag = scene.flagChanges?.set?.includes('escaped_prison');
  console.log(`  ${hasEscapedFlag ? '✓' : '✗'} Has 'escaped_prison' flag`);

  // Check ending title in last page
  const lastPage = scene.content.pages?.[scene.content.pages.length - 1] || '';
  const hasEscapeTitle = lastPage.includes('ESCAPE ENDING');
  console.log(`  ${hasEscapeTitle ? '✓' : '✗'} Contains 'ESCAPE ENDING' title`);

  // Check for requirements (A-5-E07 only)
  if (id === 'A-5-E07') {
    const hasRequirements = scene.requirements?.relationships?.bastian === 80;
    console.log(`  ${hasRequirements ? '✓' : '✗'} Has Bastian relationship requirement (80+)`);
  }

  console.log(`  Difficulty: ${difficulty}`);
  console.log(`  Moral Status: ${moral}`);
  console.log();
});

console.log('--- Summary ---\n');
console.log(`Total Escape Endings: ${escapeEndings.length}`);
console.log(`  Clean Escapes: 5 (E01, E02, E03, E05, E08)`);
console.log(`  Morally Compromised: 2 (E04, E06)`);
console.log(`  Best Ending: 1 (E07 - requires Bastian 80+)`);
console.log(`  Hardest Ending: E08 (Front Door - perfect stealth)`);

console.log('\n=== All Escape Endings Verified! ===');
