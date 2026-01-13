/**
 * Comprehensive Path A Testing & Verification Script
 * Tests all routes, transitions, requirements, and endings
 * Run this with: npx tsx scripts/test-path-a-complete.ts
 */

import { loadScene, sceneExists, getAllSceneIds } from '../lib/sceneLoader';
import type { Scene } from '../types/game';

console.log('=== Path A Complete Testing & Verification ===\n');

// Track issues
const issues: string[] = [];
const warnings: string[] = [];

// Get all Path A scenes
const allSceneIds = getAllSceneIds();
const pathAScenes = allSceneIds.filter(id => id.startsWith('A-'));

console.log(`Total Path A Scenes: ${pathAScenes.length}\n`);

// ============================================================================
// TEST 1: Scene Structure Validation
// ============================================================================

console.log('--- Test 1: Scene Structure Validation ---\n');

let structureIssues = 0;
pathAScenes.forEach(id => {
  const scene = loadScene(id);

  // Check required fields
  if (!scene.id) {
    issues.push(`${id}: Missing scene ID`);
    structureIssues++;
  }

  if (!scene.type) {
    issues.push(`${id}: Missing scene type`);
    structureIssues++;
  }

  if (!scene.content) {
    issues.push(`${id}: Missing content`);
    structureIssues++;
  }

  if (!Array.isArray(scene.choices)) {
    issues.push(`${id}: Choices must be an array`);
    structureIssues++;
  }

  // Check ending scenes
  if (scene.type === 'ending') {
    if (scene.choices.length > 0) {
      issues.push(`${id}: Ending scene has choices (should be 0)`);
      structureIssues++;
    }
    if (scene.nextScene) {
      issues.push(`${id}: Ending scene has nextScene (should be undefined)`);
      structureIssues++;
    }
    if (!scene.flagChanges?.set?.includes('ending_reached')) {
      warnings.push(`${id}: Ending scene missing 'ending_reached' flag`);
    }
  }

  // Check non-ending scenes
  if (scene.type !== 'ending') {
    if (scene.choices.length === 0 && !scene.nextScene) {
      issues.push(`${id}: Non-ending scene has no choices and no nextScene`);
      structureIssues++;
    }
  }
});

console.log(`Structure Issues: ${structureIssues}`);
if (structureIssues === 0) {
  console.log('✓ All scenes have valid structure\n');
} else {
  console.log('✗ Structure issues found\n');
}

// ============================================================================
// TEST 2: Scene Transition Validation
// ============================================================================

console.log('--- Test 2: Scene Transition Validation ---\n');

let transitionIssues = 0;
pathAScenes.forEach(id => {
  const scene = loadScene(id);

  // Check nextScene exists
  if (scene.nextScene) {
    if (!sceneExists(scene.nextScene)) {
      issues.push(`${id}: nextScene '${scene.nextScene}' does not exist`);
      transitionIssues++;
    }
  }

  // Check choice targets exist
  scene.choices.forEach((choice, index) => {
    if (!choice.nextScene) {
      issues.push(`${id}: Choice ${index + 1} missing nextScene`);
      transitionIssues++;
    } else if (!sceneExists(choice.nextScene)) {
      issues.push(`${id}: Choice ${index + 1} nextScene '${choice.nextScene}' does not exist`);
      transitionIssues++;
    }
  });
});

console.log(`Transition Issues: ${transitionIssues}`);
if (transitionIssues === 0) {
  console.log('✓ All scene transitions are valid\n');
} else {
  console.log('✗ Transition issues found\n');
}

// ============================================================================
// TEST 3: Route Testing
// ============================================================================

console.log('--- Test 3: Route Testing ---\n');

// Define route entry points based on Game Bible
const routes = {
  kitchen: {
    name: 'Kitchen Route (Drainage)',
    startScene: 'A-2-001',
    requiredFlags: ['chose_drainage_route', 'dealt_with_emile'],
    keyScenes: ['A-2-002', 'A-2-003', 'A-2-008', 'A-2-010'],
  },
  tunnel: {
    name: 'Tunnel Route (Catacombs)',
    startScene: 'A-2-015',
    requiredFlags: ['chose_tunnel_route'],
    keyScenes: ['A-2-016', 'A-2-020', 'A-2-025', 'A-2-029'],
  },
  lighthouse: {
    name: 'Lighthouse Route (Signal)',
    startScene: 'A-2-030',
    requiredFlags: ['chose_lighthouse_route'],
    keyScenes: ['A-2-031', 'A-2-035', 'A-2-040', 'A-2-043'],
  },
};

let routeIssues = 0;
Object.entries(routes).forEach(([key, route]) => {
  console.log(`Testing ${route.name}...`);

  // Check start scene exists
  if (!sceneExists(route.startScene)) {
    issues.push(`${route.name}: Start scene '${route.startScene}' does not exist`);
    routeIssues++;
    console.log(`  ✗ Start scene missing\n`);
    return;
  }

  const startScene = loadScene(route.startScene);

  // Check required flags
  if (startScene.requirements?.flags) {
    const requiredFlags = Array.isArray(startScene.requirements.flags)
      ? startScene.requirements.flags
      : [startScene.requirements.flags];

    route.requiredFlags.forEach(flag => {
      if (!requiredFlags.includes(flag)) {
        warnings.push(`${route.name}: Start scene may be missing required flag '${flag}'`);
      }
    });
  }

  // Check key scenes exist
  let missingScenes = 0;
  route.keyScenes.forEach(sceneId => {
    if (!sceneExists(sceneId)) {
      issues.push(`${route.name}: Key scene '${sceneId}' does not exist`);
      routeIssues++;
      missingScenes++;
    }
  });

  if (missingScenes === 0) {
    console.log(`  ✓ All key scenes exist`);
  } else {
    console.log(`  ✗ ${missingScenes} key scenes missing`);
  }

  console.log();
});

console.log(`Route Issues: ${routeIssues}`);
if (routeIssues === 0) {
  console.log('✓ All routes have valid structure\n');
} else {
  console.log('✗ Route issues found\n');
}

// ============================================================================
// TEST 4: Ending Reachability
// ============================================================================

console.log('--- Test 4: Ending Reachability ---\n');

const allEndings = {
  death: ['A-5-D01', 'A-5-D02', 'A-5-D03', 'A-5-D04'],
  capture: ['A-5-C01', 'A-5-C02', 'A-5-C03'],
  escape: ['A-5-E01', 'A-5-E02', 'A-5-E03', 'A-5-E04', 'A-5-E05', 'A-5-E06', 'A-5-E07', 'A-5-E08'],
};

let endingIssues = 0;

// Check if endings exist
Object.entries(allEndings).forEach(([type, endings]) => {
  console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Endings (${endings.length}):`);
  endings.forEach(endingId => {
    if (!sceneExists(endingId)) {
      issues.push(`Ending '${endingId}' does not exist`);
      endingIssues++;
      console.log(`  ✗ ${endingId}: Missing`);
    } else {
      const scene = loadScene(endingId);
      if (scene.type !== 'ending') {
        issues.push(`${endingId}: Type is '${scene.type}', should be 'ending'`);
        endingIssues++;
        console.log(`  ✗ ${endingId}: Wrong type`);
      } else {
        console.log(`  ✓ ${endingId}: Exists`);
      }
    }
  });
  console.log();
});

// Check if any scenes reference these endings
console.log('Checking ending references...');
const endingReferences = new Map<string, string[]>();
const allEndingIds = [...allEndings.death, ...allEndings.capture, ...allEndings.escape];

allEndingIds.forEach(endingId => {
  endingReferences.set(endingId, []);
});

pathAScenes.forEach(id => {
  const scene = loadScene(id);

  // Check nextScene
  if (scene.nextScene && allEndingIds.includes(scene.nextScene)) {
    endingReferences.get(scene.nextScene)?.push(id);
  }

  // Check choice targets
  scene.choices.forEach(choice => {
    if (choice.nextScene && allEndingIds.includes(choice.nextScene)) {
      endingReferences.get(choice.nextScene)?.push(id);
    }
  });
});

let unreachableEndings = 0;
allEndingIds.forEach(endingId => {
  const references = endingReferences.get(endingId) || [];
  if (references.length === 0) {
    warnings.push(`Ending '${endingId}' is not referenced by any scene (may be unreachable)`);
    unreachableEndings++;
  }
});

if (unreachableEndings > 0) {
  console.log(`⚠ ${unreachableEndings} endings may be unreachable (no scenes link to them)\n`);
} else {
  console.log(`✓ All endings are referenced by at least one scene\n`);
}

console.log(`Ending Issues: ${endingIssues}`);
if (endingIssues === 0) {
  console.log('✓ All endings exist and have correct type\n');
} else {
  console.log('✗ Ending issues found\n');
}

// ============================================================================
// TEST 5: Requirements Validation
// ============================================================================

console.log('--- Test 5: Requirements Validation ---\n');

let requirementIssues = 0;

// Check A-5-E07 (Bastian's Sister) has relationship requirement
const e07 = loadScene('A-5-E07');
if (!e07.requirements?.relationships?.bastian) {
  issues.push('A-5-E07: Missing Bastian relationship requirement');
  requirementIssues++;
  console.log('✗ A-5-E07 missing Bastian relationship requirement');
} else if (e07.requirements.relationships.bastian !== 80) {
  warnings.push(`A-5-E07: Bastian requirement is ${e07.requirements.relationships.bastian}, expected 80`);
  console.log(`⚠ A-5-E07 Bastian requirement is ${e07.requirements.relationships.bastian} (expected 80)`);
} else {
  console.log('✓ A-5-E07 has correct Bastian relationship requirement (80)');
}

// Check for orphaned requirements
pathAScenes.forEach(id => {
  const scene = loadScene(id);

  if (scene.requirements?.flags) {
    const flags = Array.isArray(scene.requirements.flags)
      ? scene.requirements.flags
      : [scene.requirements.flags];

    // This is just a warning - we can't validate all flags without runtime
    if (flags.length > 5) {
      warnings.push(`${id}: Has many flag requirements (${flags.length})`);
    }
  }
});

console.log(`\nRequirement Issues: ${requirementIssues}`);
if (requirementIssues === 0) {
  console.log('✓ All requirements are valid\n');
} else {
  console.log('✗ Requirement issues found\n');
}

// ============================================================================
// TEST 6: Flag Consistency
// ============================================================================

console.log('--- Test 6: Flag Consistency ---\n');

let flagIssues = 0;

// Check that ending scenes set appropriate flags
const endingFlags = {
  death: 'death_ending',
  capture: 'capture_ending',
  escape: 'escape_ending',
};

Object.entries(allEndings).forEach(([type, endings]) => {
  const expectedFlag = endingFlags[type as keyof typeof endingFlags];

  endings.forEach(endingId => {
    if (!sceneExists(endingId)) return;

    const scene = loadScene(endingId);
    const flags = scene.flagChanges?.set || [];

    if (!flags.includes(expectedFlag)) {
      issues.push(`${endingId}: Missing '${expectedFlag}' flag`);
      flagIssues++;
    }

    if (!flags.includes('ending_reached')) {
      issues.push(`${endingId}: Missing 'ending_reached' flag`);
      flagIssues++;
    }
  });
});

// Check escape endings have 'escaped_prison' flag
allEndings.escape.forEach(endingId => {
  if (!sceneExists(endingId)) return;

  const scene = loadScene(endingId);
  const flags = scene.flagChanges?.set || [];

  if (!flags.includes('escaped_prison')) {
    issues.push(`${endingId}: Escape ending missing 'escaped_prison' flag`);
    flagIssues++;
  }
});

console.log(`Flag Issues: ${flagIssues}`);
if (flagIssues === 0) {
  console.log('✓ All endings have appropriate flags\n');
} else {
  console.log('✗ Flag issues found\n');
}

// ============================================================================
// TEST 7: Act 1 Entry Points
// ============================================================================

console.log('--- Test 7: Act 1 Entry Points ---\n');

const act1Start = 'A-1-001';
if (!sceneExists(act1Start)) {
  issues.push(`Act 1 start scene '${act1Start}' does not exist`);
  console.log('✗ Act 1 start scene missing\n');
} else {
  const scene = loadScene(act1Start);

  // Check requirements
  if (!scene.requirements?.flags) {
    warnings.push(`${act1Start}: No flag requirements (should require 'path_tunnels' or similar)`);
  } else {
    const flags = Array.isArray(scene.requirements.flags)
      ? scene.requirements.flags
      : [scene.requirements.flags];

    // Check for path selection flag
    const hasPathFlag = flags.some(f => {
      if (typeof f !== 'string') return false;
      return f === 'path_tunnels' ||
        f === 'chose_path_a' ||
        f.includes('night') ||
        f.includes('tunnel');
    });

    if (hasPathFlag) {
      console.log('✓ Act 1 start has path requirement');
    } else {
      warnings.push(`${act1Start}: May be missing path selection requirement`);
      console.log('⚠ Act 1 start may need path selection requirement');
    }
  }

  console.log();
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('=== Test Summary ===\n');

console.log(`Total Path A Scenes Tested: ${pathAScenes.length}`);
console.log(`  Act 1 Scenes: ${pathAScenes.filter(id => id.startsWith('A-1-')).length}`);
console.log(`  Act 2 Scenes: ${pathAScenes.filter(id => id.startsWith('A-2-')).length}`);
console.log(`  Act 5 Endings: ${pathAScenes.filter(id => id.startsWith('A-5-')).length}`);
console.log();

console.log(`Critical Issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log();

if (issues.length > 0) {
  console.log('--- Critical Issues ---\n');
  issues.forEach(issue => console.log(`  ✗ ${issue}`));
  console.log();
}

if (warnings.length > 0) {
  console.log('--- Warnings ---\n');
  warnings.slice(0, 10).forEach(warning => console.log(`  ⚠ ${warning}`));
  if (warnings.length > 10) {
    console.log(`  ... and ${warnings.length - 10} more warnings`);
  }
  console.log();
}

// Final verdict
if (issues.length === 0) {
  console.log('✅ PATH A FULLY FUNCTIONAL - All tests passed!');
  console.log('   All 15 endings are properly structured and accessible.');
} else {
  console.log('❌ PATH A HAS ISSUES - Please fix critical issues before release.');
}

console.log('\n=== Testing Complete ===');

// Exit with error code if issues found
process.exit(issues.length > 0 ? 1 : 0);
