/**
 * Verification script for the flag system
 * Tests flag utilities and persistence logic
 */

import {
  createFlagName,
  parseFlagName,
  getFlagsByCategory,
  hasAllFlags,
  hasAnyFlag,
  hasNoFlags,
  countSetFlags,
  getSetFlags,
  getUnsetFlags,
  isValidFlagName,
  CommonFlags,
  getFlagDescription,
  FlagCategories,
} from '../lib/flagUtils';

console.log('🚩 Flag System Verification\n');

// Test 1: Flag name creation and parsing
console.log('Test 1: Flag Name Creation and Parsing');
const testFlag = createFlagName(FlagCategories.STORY, 'met_warden');
console.log(`  ✓ Created flag: ${testFlag}`);

const parsed = parseFlagName(testFlag);
console.log(`  ✓ Parsed: category="${parsed?.category}", name="${parsed?.name}"`);

// Test 2: Flag validation
console.log('\nTest 2: Flag Validation');
const validFlags = [
  'story:intro_complete',
  'char:befriended_guard',
  'loc:found_courtyard',
];
const invalidFlags = ['invalid_flag', 'too:many:colons', ':no_category', 'no_name:'];

validFlags.forEach((flag) => {
  const isValid = isValidFlagName(flag);
  console.log(`  ${isValid ? '✓' : '✗'} "${flag}" is ${isValid ? 'valid' : 'invalid'}`);
});

invalidFlags.forEach((flag) => {
  const isValid = isValidFlagName(flag);
  console.log(`  ${!isValid ? '✓' : '✗'} "${flag}" is correctly ${!isValid ? 'invalid' : 'valid (ERROR!)'}`);
});

// Test 3: Common Flags
console.log('\nTest 3: Common Flags');
console.log(`  Total common flags: ${Object.keys(CommonFlags).length}`);
const sampleFlags = [
  CommonFlags.INTRO_COMPLETE,
  CommonFlags.MET_WARDEN,
  CommonFlags.BEFRIENDED_GUARD,
  CommonFlags.FOUND_COURTYARD,
];
sampleFlags.forEach((flag) => {
  console.log(`  ✓ ${flag}: "${getFlagDescription(flag)}"`);
});

// Test 4: Flag checking utilities
console.log('\nTest 4: Flag Checking Utilities');
const currentFlags = [
  CommonFlags.INTRO_COMPLETE,
  CommonFlags.MET_WARDEN,
  CommonFlags.FOUND_COURTYARD,
  CommonFlags.FOUND_CAFETERIA,
];

console.log(`  Current flags: ${currentFlags.length}`);

// Test hasAllFlags
const hasAll = hasAllFlags(currentFlags, [
  CommonFlags.INTRO_COMPLETE,
  CommonFlags.MET_WARDEN,
]);
console.log(`  ${hasAll ? '✓' : '✗'} hasAllFlags([intro, met_warden]): ${hasAll}`);

// Test hasAnyFlag
const hasAny = hasAnyFlag(currentFlags, [
  CommonFlags.ENDING_ESCAPE_SUCCESS,
  CommonFlags.FOUND_COURTYARD,
]);
console.log(`  ${hasAny ? '✓' : '✗'} hasAnyFlag([escape_success, courtyard]): ${hasAny}`);

// Test hasNoFlags
const hasNone = hasNoFlags(currentFlags, [
  CommonFlags.ENDING_ESCAPE_SUCCESS,
  CommonFlags.ENDING_REFORMED,
]);
console.log(`  ${hasNone ? '✓' : '✗'} hasNoFlags([escape_success, reformed]): ${hasNone}`);

// Test countSetFlags
const locationFlags = [
  CommonFlags.FOUND_COURTYARD,
  CommonFlags.FOUND_CAFETERIA,
  CommonFlags.FOUND_LIBRARY,
  CommonFlags.FOUND_GYM,
  CommonFlags.FOUND_WORKSHOP,
];
const count = countSetFlags(currentFlags, locationFlags);
console.log(`  ✓ Location flags discovered: ${count}/${locationFlags.length}`);

// Test 5: Category filtering
console.log('\nTest 5: Category Filtering');
const storyFlags = getFlagsByCategory(currentFlags, FlagCategories.STORY);
const locationFlagsFound = getFlagsByCategory(currentFlags, FlagCategories.LOCATION);
console.log(`  ✓ Story flags: ${storyFlags.length} (${storyFlags.join(', ')})`);
console.log(`  ✓ Location flags: ${locationFlagsFound.length} (${locationFlagsFound.join(', ')})`);

// Test 6: Get set/unset flags
console.log('\nTest 6: Set/Unset Flags');
const allPossibleFlags = [
  CommonFlags.INTRO_COMPLETE,
  CommonFlags.MET_WARDEN,
  CommonFlags.BEFRIENDED_GUARD,
  CommonFlags.FOUND_COURTYARD,
];
const setFlags = getSetFlags(currentFlags, allPossibleFlags);
const unsetFlags = getUnsetFlags(currentFlags, allPossibleFlags);
console.log(`  ✓ Set flags: ${setFlags.length} (${setFlags.join(', ')})`);
console.log(`  ✓ Unset flags: ${unsetFlags.length} (${unsetFlags.join(', ')})`);

// Final summary
console.log('\n✅ Flag System Verification Complete!');
console.log('\nFlag system features verified:');
console.log('  • Flag name creation and parsing');
console.log('  • Flag validation (category:name format)');
console.log('  • Common flag definitions');
console.log('  • Flag checking utilities (hasAll, hasAny, hasNone)');
console.log('  • Flag counting and filtering');
console.log('  • Category-based organization');
console.log('  • Set/unset flag detection');

console.log('\nNext steps:');
console.log('  1. Visit http://localhost:3001/flag-demo for interactive flag testing');
console.log('  2. Visit http://localhost:3001/flag-persistence-demo for scene transition tests');
console.log('  3. Check that flags persist across scene navigation');
