# Flag System Documentation

## Overview

The flag system in El Palo de Queso provides a robust mechanism for tracking boolean game state across scenes. Flags are used to mark story progress, character interactions, discoveries, and achievements that influence available choices and narrative branches.

## Key Features

- ✅ **Persistent State**: Flags persist across all scene transitions
- ✅ **Namespaced Organization**: Flags follow `category:name` convention for clarity
- ✅ **Rich Utilities**: Helper functions for common flag operations
- ✅ **Type-Safe**: Full TypeScript support with predefined common flags
- ✅ **Requirement Checking**: Integrated with choice availability system
- ✅ **Scene Integration**: Flags can be set/unset by scenes and choices

## Flag Naming Convention

All flags follow the format: `category:flag_name`

### Standard Categories

| Category | Prefix | Usage |
|----------|--------|-------|
| Story Progress | `story:` | Main narrative progression |
| Characters | `char:` | Character interactions and relationships |
| Locations | `loc:` | Location discoveries |
| Item Usage | `used:` | Track when items have been used |
| Quests | `quest:` | Mission and quest progress |
| Discoveries | `disc:` | Secrets and knowledge gained |
| Combat | `combat:` | Combat-related events |
| Endings | `ending:` | Ending achievements |

### Examples

```typescript
'story:intro_complete'         // Player completed intro
'char:befriended_guard'        // Player befriended a guard
'loc:found_courtyard'          // Player discovered courtyard
'used:master_key'              // Player used the master key
'quest:accepted_escape_plan'   // Player accepted escape quest
'disc:guard_schedule'          // Player discovered guard schedule
'ending:escape_success'        // Player achieved escape ending
```

## Setting and Unsetting Flags

### In Scene Data (JSON)

Flags can be set when a scene is visited:

```json
{
  "id": "A-1-001",
  "type": "narrative",
  "content": {
    "text": "You enter the courtyard for the first time."
  },
  "flagChanges": {
    "set": ["loc:found_courtyard", "story:day_1_explored"],
    "unset": ["char:hiding_from_guards"]
  },
  "nextScene": "A-1-002"
}
```

### In Choice Data (JSON)

Flags can be set when a choice is selected:

```json
{
  "text": "Talk to the warden",
  "nextScene": "A-2-001",
  "flagChanges": {
    "set": ["story:met_warden", "char:talked_to_authority"]
  }
}
```

### Programmatically (TypeScript/React)

```typescript
import { useGameStore } from '@/lib/store';

function MyComponent() {
  const { setFlag, unsetFlag, hasFlag } = useGameStore();

  // Set a flag
  setFlag('story:custom_event');

  // Unset a flag
  unsetFlag('char:hiding');

  // Check if flag is set
  if (hasFlag('story:intro_complete')) {
    // Do something
  }
}
```

## Flag Utilities

Import from `@/lib/flagUtils`:

### Creation and Parsing

```typescript
import { createFlagName, parseFlagName } from '@/lib/flagUtils';

// Create a namespaced flag
const flag = createFlagName('story', 'met_warden');
// Returns: 'story:met_warden'

// Parse a flag name
const parsed = parseFlagName('story:met_warden');
// Returns: { category: 'story', name: 'met_warden' }
```

### Flag Checking

```typescript
import {
  hasAllFlags,
  hasAnyFlag,
  hasNoFlags
} from '@/lib/flagUtils';

const currentFlags = ['story:intro_complete', 'char:met_guard'];

// Check if ALL flags are present
hasAllFlags(currentFlags, ['story:intro_complete', 'char:met_guard']);
// Returns: true

// Check if ANY flag is present
hasAnyFlag(currentFlags, ['ending:escape', 'ending:reformed']);
// Returns: false

// Check if NO flags are present
hasNoFlags(currentFlags, ['ending:escape', 'ending:reformed']);
// Returns: true
```

### Counting and Filtering

```typescript
import {
  countSetFlags,
  getSetFlags,
  getUnsetFlags,
  getFlagsByCategory
} from '@/lib/flagUtils';

const currentFlags = ['story:intro_complete', 'loc:found_courtyard'];
const possibleFlags = ['story:intro_complete', 'story:met_warden', 'loc:found_courtyard'];

// Count how many flags are set
countSetFlags(currentFlags, possibleFlags);
// Returns: 2

// Get which flags are set
getSetFlags(currentFlags, possibleFlags);
// Returns: ['story:intro_complete', 'loc:found_courtyard']

// Get which flags are NOT set
getUnsetFlags(currentFlags, possibleFlags);
// Returns: ['story:met_warden']

// Get all flags from a category
getFlagsByCategory(currentFlags, 'story');
// Returns: ['story:intro_complete']
```

### Validation

```typescript
import { isValidFlagName } from '@/lib/flagUtils';

isValidFlagName('story:intro_complete');  // true
isValidFlagName('invalid_flag');          // false (no category)
isValidFlagName('too:many:colons');       // false (too many colons)
```

## Common Flags

Predefined flags for consistency across the game:

```typescript
import { CommonFlags } from '@/lib/flagUtils';

// Story progression
CommonFlags.INTRO_COMPLETE          // 'story:intro_complete'
CommonFlags.FIRST_DAY_COMPLETE      // 'story:first_day_complete'
CommonFlags.MET_WARDEN              // 'story:met_warden'
CommonFlags.MET_CELLMATE            // 'story:met_cellmate'

// Character states
CommonFlags.BEFRIENDED_GUARD        // 'char:befriended_guard'
CommonFlags.ANTAGONIZED_GUARD       // 'char:antagonized_guard'
CommonFlags.TRUSTED_BY_INMATES      // 'char:trusted_by_inmates'
CommonFlags.SUSPICIOUS_TO_GUARDS    // 'char:suspicious_to_guards'

// Location discoveries
CommonFlags.FOUND_COURTYARD         // 'loc:found_courtyard'
CommonFlags.FOUND_CAFETERIA         // 'loc:found_cafeteria'
CommonFlags.FOUND_LIBRARY           // 'loc:found_library'
CommonFlags.FOUND_GYM               // 'loc:found_gym'
CommonFlags.FOUND_WORKSHOP          // 'loc:found_workshop'

// Item usage
CommonFlags.USED_MASTER_KEY         // 'used:master_key'
CommonFlags.USED_LOCKPICK           // 'used:lockpick'
CommonFlags.USED_DISGUISE           // 'used:disguise'

// Quest progress
CommonFlags.ACCEPTED_ESCAPE_PLAN    // 'quest:accepted_escape_plan'
CommonFlags.COMPLETED_RECON         // 'quest:completed_recon'
CommonFlags.GATHERED_SUPPLIES       // 'quest:gathered_supplies'

// Discoveries
CommonFlags.DISCOVERED_SECRET_PASSAGE    // 'disc:secret_passage'
CommonFlags.DISCOVERED_GUARD_SCHEDULE    // 'disc:guard_schedule'
CommonFlags.DISCOVERED_WARDEN_SECRET     // 'disc:warden_secret'

// Endings
CommonFlags.ENDING_ESCAPE_SUCCESS   // 'ending:escape_success'
CommonFlags.ENDING_ESCAPE_FAILED    // 'ending:escape_failed'
CommonFlags.ENDING_REFORMED         // 'ending:reformed'
CommonFlags.ENDING_GANG_LEADER      // 'ending:gang_leader'
```

## Using Flags in Choice Requirements

Flags can control which choices are available to the player:

```json
{
  "text": "Use the secret passage",
  "nextScene": "B-3-015",
  "requirements": {
    "flags": ["disc:secret_passage"],
    "notFlags": ["char:suspicious_to_guards"]
  }
}
```

This choice:
- ✅ **Requires**: `disc:secret_passage` flag to be set
- ✅ **Requires**: `char:suspicious_to_guards` flag to NOT be set

See [Choice Requirements](./SCENE_DATA_FORMAT.md#choice-requirements) for more details.

## State Management Integration

The flag system is fully integrated with the Zustand game store:

```typescript
import { useGameStore } from '@/lib/store';

const {
  flags,           // string[] - All active flags
  setFlag,         // (flag: string) => void
  unsetFlag,       // (flag: string) => void
  hasFlag,         // (flag: string) => boolean
} = useGameStore();
```

## Flag Persistence

Flags persist throughout the game session in these scenarios:

1. ✅ **Scene transitions** - Flags remain active when moving between scenes
2. ✅ **Back navigation** - Flags persist when using back button
3. ✅ **Choice selection** - Flags set by choices stay active
4. ✅ **Scene entry** - Flags set when entering a scene stay active

Flags are cleared only when:
- ❌ Game is reset (`resetGame()`)
- ❌ Page is refreshed (no localStorage yet - future enhancement)

## Testing the Flag System

### Interactive Demos

1. **Flag System Demo**: [/flag-demo](http://localhost:3001/flag-demo)
   - Toggle all common flags
   - Add custom flags
   - View flags by category
   - Test flag utility functions
   - Simulate scene transitions

2. **Flag Persistence Demo**: [/flag-persistence-demo](http://localhost:3001/flag-persistence-demo)
   - Navigate through test scenes
   - Watch flags being set automatically
   - Verify flags persist across navigation
   - Test flag-based choice requirements

### Verification Script

```bash
npm run verify:flags
```

This runs comprehensive tests on all flag utilities.

## Best Practices

### 1. Use Namespaced Flags

❌ Bad:
```typescript
setFlag('met_warden');  // No category
```

✅ Good:
```typescript
setFlag('story:met_warden');  // Clear category
```

### 2. Use CommonFlags Constants

❌ Bad:
```typescript
if (hasFlag('story:intro_complete')) { ... }  // Magic string
```

✅ Good:
```typescript
import { CommonFlags } from '@/lib/flagUtils';
if (hasFlag(CommonFlags.INTRO_COMPLETE)) { ... }  // Type-safe constant
```

### 3. Document Custom Flags

When creating new flags in scenes, add them to `CommonFlags` if they'll be reused:

```typescript
// In lib/flagUtils.ts
export const CommonFlags = {
  // ... existing flags
  MY_NEW_FLAG: 'story:my_new_flag',
} as const;

// And add description
export const FlagDescriptions: Record<string, string> = {
  // ... existing descriptions
  [CommonFlags.MY_NEW_FLAG]: 'Description of what this flag means',
};
```

### 4. Use Specific Categories

Choose the most specific category for your flag:

```typescript
// Story progression
'story:chapter_1_complete'

// Character states (prefer this over generic 'char')
'char:garcia_trusts_player'

// Locations (prefer this over generic 'found')
'loc:discovered_hidden_room'
```

### 5. Prefer Positive Flags

❌ Avoid negative flags:
```typescript
'char:not_suspicious'  // Confusing double-negative
```

✅ Use positive flags:
```typescript
'char:trusted'  // Clear meaning
```

Then use `notFlags` in requirements:
```json
{
  "requirements": {
    "notFlags": ["char:suspicious"]
  }
}
```

## Common Patterns

### Achievement Tracking

```typescript
// Track location discovery progress
const allLocations = [
  CommonFlags.FOUND_COURTYARD,
  CommonFlags.FOUND_CAFETERIA,
  CommonFlags.FOUND_LIBRARY,
  CommonFlags.FOUND_GYM,
  CommonFlags.FOUND_WORKSHOP,
];

const discovered = countSetFlags(flags, allLocations);
console.log(`Discovered ${discovered}/${allLocations.length} locations`);
```

### Multiple Ending Paths

```json
{
  "id": "ENDING-CHECK",
  "choices": [
    {
      "text": "Escape through tunnel",
      "nextScene": "END-ESCAPE",
      "requirements": {
        "flags": ["disc:secret_passage", "quest:gathered_supplies"],
        "notFlags": ["char:suspicious_to_guards"]
      }
    },
    {
      "text": "Request early release",
      "nextScene": "END-REFORMED",
      "requirements": {
        "flags": ["char:reformed", "story:warden_approves"],
        "relationships": { "warden": 75 }
      }
    }
  ]
}
```

### Mutually Exclusive Paths

```typescript
// Ensure player can only choose one faction
if (hasFlag('quest:joined_rebels')) {
  // Rebel path active, lock guard path
  setFlag('quest:cannot_join_guards');
}
```

## Debugging Flags

In development mode, the Scene Renderer shows all state changes:

```tsx
// Automatically shown in dev mode
{process.env.NODE_ENV === 'development' && scene.flagChanges && (
  <div>Flags set: {scene.flagChanges.set?.join(', ')}</div>
)}
```

Use the flag demos for interactive debugging:
- View all active flags in real-time
- See flags organized by category
- Test flag requirements on choices

## Future Enhancements

Potential improvements for the flag system:

- [ ] **LocalStorage persistence** - Save flags between sessions
- [ ] **Flag history tracking** - Track when flags were set
- [ ] **Flag analytics** - Track most common flag combinations
- [ ] **Save/Load system** - Export/import flag state
- [ ] **Flag aliases** - Support multiple names for same flag
- [ ] **String-valued flags** - Support flags with values beyond boolean
- [ ] **Conditional flags** - Flags that auto-set based on other flags

## Related Documentation

- [Scene Data Format](./SCENE_DATA_FORMAT.md) - How to use flags in scenes
- [Choice Requirements](./SCENE_DATA_FORMAT.md#choice-requirements) - Using flags to control choices
- [Scene Transitions](./SCENE_DATA_FORMAT.md#state-changes) - How flags change during transitions
