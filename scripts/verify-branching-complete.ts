/**
 * Verification Script: Processing Branch Scenes X-0-006A/B/C
 * Tests that all three processing choices lead to correct variants and converge
 */

import actZeroScenes from '../data/scenes/act-0-opening.json';

console.log('='.repeat(80));
console.log('VERIFICATION: Processing Branch Scenes (X-0-006A/B/C)');
console.log('='.repeat(80));
console.log();

// Get all scenes
const scenes = actZeroScenes.scenes;
const sceneMap = new Map(scenes.map(s => [s.id, s]));

// Test Scene X-0-005: The branching point
console.log('📍 BRANCHING POINT: Scene X-0-005');
console.log('-'.repeat(80));
const scene005 = sceneMap.get('X-0-005');

if (!scene005) {
  console.error('❌ ERROR: Scene X-0-005 not found!');
  process.exit(1);
}

console.log(`Scene ID: ${scene005.id}`);
console.log(`Type: ${scene005.type}`);
console.log(`Speaker: ${scene005.content.speaker}`);
console.log(`Text preview: ${scene005.content.text.substring(0, 100)}...`);
console.log(`Number of choices: ${scene005.choices?.length || 0}`);
console.log();

if (!scene005.choices || scene005.choices.length !== 3) {
  console.error('❌ ERROR: Scene X-0-005 should have exactly 3 choices!');
  process.exit(1);
}

console.log('✅ Scene X-0-005 has 3 choices as expected');
console.log();

// Test each branching path
console.log('🔀 BRANCHING PATHS ANALYSIS');
console.log('='.repeat(80));
console.log();

const paths = [
  {
    name: 'Path 1: COOPERATIVE',
    choiceIndex: 1,
    expectedNext: 'X-0-006A',
    expectedFlags: ['asked_legrand_for_advice', 'processing_cooperative'],
    expectedRelationship: { character: 'legrand', change: 3 },
  },
  {
    name: 'Path 2: DEFIANT',
    choiceIndex: 0,
    expectedNext: 'X-0-006B',
    expectedFlags: ['claimed_innocence_to_legrand', 'processing_defiant'],
    expectedRelationship: { character: 'legrand', change: -5 },
  },
  {
    name: 'Path 3: SILENT',
    choiceIndex: 2,
    expectedNext: 'X-0-006C',
    expectedFlags: ['stayed_silent_with_legrand', 'processing_silent'],
    expectedRelationship: null,
  },
];

let allTestsPassed = true;

for (const path of paths) {
  console.log(`${path.name}`);
  console.log('-'.repeat(80));

  const choice = scene005.choices![path.choiceIndex];

  // Test 1: Choice text
  console.log(`Choice text: "${choice.text}"`);

  // Test 2: Next scene
  if (choice.nextScene === path.expectedNext) {
    console.log(`✅ Routes to correct scene: ${choice.nextScene}`);
  } else {
    console.error(
      `❌ ERROR: Expected route to ${path.expectedNext}, got ${choice.nextScene}`
    );
    allTestsPassed = false;
  }

  // Test 3: Flags set
  const flagsSet = choice.flagChanges?.set || [];
  const allFlagsPresent = path.expectedFlags.every((flag) =>
    flagsSet.includes(flag)
  );

  if (allFlagsPresent) {
    console.log(`✅ Sets correct flags: ${flagsSet.join(', ')}`);
  } else {
    console.error(
      `❌ ERROR: Expected flags ${path.expectedFlags.join(', ')}, got ${flagsSet.join(', ')}`
    );
    allTestsPassed = false;
  }

  // Test 4: Relationship changes
  if (path.expectedRelationship) {
    const relChanges = choice.relationshipChanges || {};
    const actualChange = relChanges[path.expectedRelationship.character];

    if (actualChange === path.expectedRelationship.change) {
      console.log(
        `✅ Changes ${path.expectedRelationship.character} relationship by ${actualChange}`
      );
    } else {
      console.error(
        `❌ ERROR: Expected relationship change ${path.expectedRelationship.change}, got ${actualChange}`
      );
      allTestsPassed = false;
    }
  } else {
    if (!choice.relationshipChanges || Object.keys(choice.relationshipChanges).length === 0) {
      console.log(`✅ No relationship changes (as expected)`);
    } else {
      console.error(
        `❌ ERROR: Expected no relationship changes, but found some`
      );
      allTestsPassed = false;
    }
  }

  // Test 5: Branch scene exists and content
  const branchScene = sceneMap.get(path.expectedNext);
  if (!branchScene) {
    console.error(`❌ ERROR: Branch scene ${path.expectedNext} not found!`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Branch scene ${path.expectedNext} exists`);
    console.log(`   Type: ${branchScene.type}`);
    console.log(`   Speaker: ${branchScene.content.speaker}`);
    console.log(`   Text preview: ${branchScene.content.text.substring(0, 80)}...`);

    // Test 6: Branch scene leads to convergence point
    if (branchScene.nextScene === 'X-0-007') {
      console.log(`✅ Converges to X-0-007`);
    } else {
      console.error(
        `❌ ERROR: Expected convergence to X-0-007, got ${branchScene.nextScene}`
      );
      allTestsPassed = false;
    }

    // Test 7: Branch scene sets additional flags
    const branchFlags = branchScene.flagChanges?.set || [];
    if (branchFlags.length > 0) {
      console.log(`✅ Sets additional flags in branch: ${branchFlags.join(', ')}`);
    }
  }

  console.log();
}

// Test convergence scene X-0-007
console.log('🔗 CONVERGENCE POINT: Scene X-0-007');
console.log('='.repeat(80));
const scene007 = sceneMap.get('X-0-007');

if (!scene007) {
  console.error('❌ ERROR: Convergence scene X-0-007 not found!');
  allTestsPassed = false;
} else {
  console.log(`✅ Convergence scene X-0-007 exists`);
  console.log(`   Type: ${scene007.type}`);
  console.log(`   Next scene: ${scene007.nextScene}`);
  console.log(`   Text preview: ${scene007.content.text.substring(0, 100)}...`);

  if (scene007.nextScene === 'A-1-001') {
    console.log(`✅ Leads to Act 1 (A-1-001)`);
  } else {
    console.error(
      `❌ ERROR: Expected next scene A-1-001, got ${scene007.nextScene}`
    );
    allTestsPassed = false;
  }
}

console.log();
console.log('='.repeat(80));

if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED - Branching structure is correct!');
  console.log();
  console.log('Summary:');
  console.log('  - Scene X-0-005 has 3 distinct choices');
  console.log('  - Each choice routes to its own branch scene (A/B/C)');
  console.log('  - Each branch sets appropriate flags');
  console.log('  - Cooperative path improves Legrand relationship (+3)');
  console.log('  - Defiant path damages Legrand relationship (-5)');
  console.log('  - Silent path neutral (no relationship change)');
  console.log('  - All three branches converge at X-0-007');
  console.log('  - X-0-007 leads to Act 1 (A-1-001)');
  console.log();
  console.log('The branching narrative structure is working correctly! 🎉');
} else {
  console.error('❌ SOME TESTS FAILED - Please review the errors above');
  process.exit(1);
}

console.log('='.repeat(80));
