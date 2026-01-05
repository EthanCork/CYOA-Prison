/**
 * Verification script for relationship system
 * Displays NPCs and their initial relationship scores
 */

import {
  loadAllCharacters,
  getInitialRelationships,
  getRelationshipStatus,
} from '../lib/characterLoader';

console.log('=== Relationship System Verification ===\n');

const characters = loadAllCharacters();
const initialRelationships = getInitialRelationships();

console.log(`Total NPCs: ${characters.length}\n`);

console.log('NPCs with Initial Relationships:\n');

characters.forEach(char => {
  const score = char.initialRelationship;
  const status = getRelationshipStatus(score);
  const scoreDisplay = score > 0 ? `+${score}` : score.toString();
  const indicator = score > 0 ? '✓' : score < 0 ? '✗' : '○';

  console.log(`${indicator} ${char.name.padEnd(15)} : ${scoreDisplay.padStart(4)} - ${status}`);
  console.log(`   Role: ${char.role}`);
  console.log(`   Location: ${char.location}`);
  console.log(`   Traits: ${char.traits.join(', ')}`);
  console.log('');
});

console.log('Relationship Score Range: -100 to +100');
console.log('');

console.log('Relationship Status Levels:');
console.log('  100 to  80: Devoted Ally');
console.log('   79 to  60: Trusted Friend');
console.log('   59 to  40: Good Friend');
console.log('   39 to  20: Friendly');
console.log('   19 to  10: Acquaintance');
console.log('    9 to -10: Neutral');
console.log('  -11 to -20: Unfriendly');
console.log('  -21 to -40: Hostile');
console.log('  -41 to -60: Enemy');
console.log('  -61 to -80: Bitter Enemy');
console.log('  -81 to-100: Mortal Enemy');
console.log('');

console.log('✓ Relationship system loaded successfully!');
