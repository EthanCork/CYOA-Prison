# Auto-Actions Documentation

## Overview

Auto-Actions are automatic state changes that occur when a player enters a scene or selects a choice. This system allows scenes to grant items, set flags, modify relationships, and collect evidence without requiring explicit player interaction.

## Key Features

- ✅ **Automatic Application**: State changes happen immediately when entering a scene
- ✅ **Visual Feedback**: Notifications appear showing what changed
- ✅ **Multiple Change Types**: Items, flags, relationships, and evidence
- ✅ **Scene-Level Changes**: Applied when scene is entered
- ✅ **Choice-Level Changes**: Applied when choice is selected
- ✅ **Stacking Notifications**: Multiple changes display as a stack
- ✅ **Real-Time Updates**: UI updates immediately to reflect changes

## How Auto-Actions Work

### Execution Order

1. **Player navigates** to a new scene (or makes a choice)
2. **Scene is loaded** from JSON data
3. **State changes are collected** from scene and/or choice
4. **Changes are applied** to game state automatically
5. **Notifications are shown** to the player
6. **UI updates** to reflect new state

### Scene Entry Flow

```
Player enters scene
       ↓
Scene data loaded
       ↓
collectStateChanges() extracts all changes
       ↓
Changes applied to Zustand store
       ↓
useSceneTransition detects changes
       ↓
StateChangeNotification displays feedback
       ↓
Game state sidebar updates
```

## Defining Auto-Actions

### In Scene Data (JSON)

Auto-actions are defined in the scene's state change properties:

```json
{
  "id": "A-1-005",
  "type": "investigation",
  "content": {
    "text": "You find a hidden stash in the wall!"
  },
  "itemChanges": {
    "add": ["lockpick", "map"],
    "remove": ["old_map"]
  },
  "flagChanges": {
    "set": ["disc:found_stash", "story:chapter_1_progress"],
    "unset": ["quest:search_for_tools"]
  },
  "relationshipChanges": {
    "guard": -5,
    "cellmate": 10
  },
  "evidenceChanges": {
    "add": ["mysterious_note"]
  },
  "choices": [...]
}
```

**What happens**: When the player enters scene `A-1-005`:
1. Gains `lockpick` and `map` items
2. Loses `old_map` item
3. Sets flags `disc:found_stash` and `story:chapter_1_progress`
4. Unsets flag `quest:search_for_tools`
5. Decreases relationship with `guard` by 5
6. Increases relationship with `cellmate` by 10
7. Gains `mysterious_note` evidence

### In Choice Data (JSON)

Choices can also have their own auto-actions:

```json
{
  "text": "Search the guard's office",
  "nextScene": "B-2-010",
  "itemChanges": {
    "add": ["office_key"]
  },
  "flagChanges": {
    "set": ["char:searched_office"]
  },
  "relationshipChanges": {
    "guard": -15
  }
}
```

**What happens**: When the player selects this choice:
1. Navigates to scene `B-2-010`
2. Gains `office_key` item
3. Sets `char:searched_office` flag
4. Decreases relationship with `guard` by 15
5. *Then* any scene-level auto-actions from `B-2-010` are applied

### Combined Changes

Scene-level and choice-level changes are **merged**. If both define changes, all are applied:

```json
// Choice
{
  "text": "Talk to the warden",
  "nextScene": "A-3-001",
  "flagChanges": {
    "set": ["char:approached_warden"]
  }
}

// Scene A-3-001
{
  "id": "A-3-001",
  "flagChanges": {
    "set": ["story:met_warden"]
  },
  "relationshipChanges": {
    "warden": 10
  }
}
```

**Result**: Both `char:approached_warden` and `story:met_warden` flags are set, and warden relationship increases by 10.

## State Change Types

### 1. Item Changes

Add or remove items from the player's inventory:

```json
"itemChanges": {
  "add": ["rusty_key", "bread", "map"],
  "remove": ["old_rusty_key"]
}
```

**Notification**:
- Add: 📦 "Gained: rusty key"
- Remove: 🗑️ "Lost: old rusty key"

**Use Cases**:
- Granting rewards
- Quest item collection
- Upgrading items (remove old, add new)
- Losing items when caught

### 2. Flag Changes

Set or unset boolean flags:

```json
"flagChanges": {
  "set": ["story:intro_complete", "loc:found_courtyard"],
  "unset": ["temp:searching"]
}
```

**Notification**:
- Set: 🚩 "Flag set: story:intro_complete"
- Unset: ⚐ "Flag unset: temp:searching"

**Use Cases**:
- Tracking story progress
- Unlocking content
- Recording discoveries
- Temporary state (unset when no longer needed)

### 3. Relationship Changes

Modify relationship scores with characters (delta applied):

```json
"relationshipChanges": {
  "guard": 15,
  "warden": -20,
  "cellmate": 5
}
```

**Notification**:
- Positive: 💚 "guard: +15" (Relationship improved)
- Negative: 💔 "warden: -20" (Relationship worsened)

**Use Cases**:
- Consequences of choices
- Reputation changes
- Trust building/losing
- Faction alignment

**Note**: Relationship scores are clamped to -100 to +100.

### 4. Evidence Changes

Add or remove evidence items:

```json
"evidenceChanges": {
  "add": ["fingerprints", "alibi_witness"],
  "remove": ["false_lead"]
}
```

**Notification**:
- Add: 📋 "Evidence found: fingerprints"
- Remove: 🗑️ "Evidence removed: false lead"

**Use Cases**:
- Investigation progress
- Building a case
- Collecting clues
- Removing red herrings

## Visual Feedback

### Notification System

The `StateChangeNotification` component displays visual feedback:

```tsx
import StateChangeNotification from '@/components/StateChangeNotification';

<StateChangeNotification
  changes={recentStateChanges}
  duration={4000}
  onComplete={clearStateChanges}
/>
```

**Features**:
- Appears in top-right corner
- Stacks multiple notifications
- Color-coded by change type
- Auto-dismisses after duration
- Smooth slide-in animation

**Notification Colors**:
- 🟡 **Items**: Amber border (add), Gray border (remove)
- 🟢 **Flags**: Green border (set), Gray border (unset)
- 💜 **Relationships**: Green border (positive), Red border (negative)
- 🟡 **Evidence**: Yellow border (add), Gray border (remove)

### State Sidebar

The game state sidebar updates immediately:
- **Inventory**: Shows all current items
- **Evidence**: Shows all collected evidence
- **Relationships**: Shows character scores with visual bars
- **Flags**: Shows all active flags

## Implementation

### Using useSceneTransition Hook

The enhanced hook tracks state changes automatically:

```tsx
import { useSceneTransition } from '@/lib/hooks/useSceneTransition';

function MyGame() {
  const {
    scene,
    recentStateChanges,
    clearStateChanges,
    handleChoiceSelected,
    // ... other values
  } = useSceneTransition();

  return (
    <>
      <StateChangeNotification
        changes={recentStateChanges}
        onComplete={clearStateChanges}
      />
      <SceneRenderer
        scene={scene}
        onChoiceSelected={handleChoiceSelected}
      />
    </>
  );
}
```

### Manual State Changes

You can also apply changes programmatically:

```tsx
import { useGameStore } from '@/lib/store';

function MyComponent() {
  const { addItem, setFlag, changeRelationship, addEvidence } = useGameStore();

  const giveReward = () => {
    addItem('gold_coin');
    setFlag('quest:reward_received');
    changeRelationship('quest_giver', 20);
  };

  return <button onClick={giveReward}>Claim Reward</button>;
}
```

## Best Practices

### 1. Use Scene-Level Changes for Environmental Effects

❌ Don't use choices for things that should happen automatically:
```json
{
  "text": "Enter the toxic room",
  "nextScene": "B-3-010",
  "itemChanges": {
    "remove": ["health_pack"]
  }
}
```

✅ Put environmental effects in the scene:
```json
{
  "id": "B-3-010",
  "content": {
    "text": "The toxic air burns your lungs. You use a health pack."
  },
  "itemChanges": {
    "remove": ["health_pack"]
  }
}
```

### 2. Use Choice-Level Changes for Player Actions

✅ Good:
```json
{
  "text": "Give the guard your cigarettes",
  "nextScene": "A-1-010",
  "itemChanges": {
    "remove": ["cigarettes"]
  },
  "relationshipChanges": {
    "guard": 10
  }
}
```

### 3. Provide Context in Scene Text

Always explain why changes are happening:

✅ Good:
```json
{
  "content": {
    "text": "The guard thanks you and slips you a keycard in return."
  },
  "itemChanges": {
    "add": ["keycard"]
  },
  "relationshipChanges": {
    "guard": 5
  }
}
```

❌ Bad:
```json
{
  "content": {
    "text": "The guard nods."
  },
  "itemChanges": {
    "add": ["keycard"]  // Where did this come from?
  }
}
```

### 4. Use Flags for Progress Tracking

Track major story beats with flags:

```json
{
  "id": "INTRO-END",
  "flagChanges": {
    "set": ["story:intro_complete", "story:chapter_1_unlocked"],
    "unset": ["story:in_intro"]
  }
}
```

### 5. Limit Simultaneous Changes

Don't overwhelm the player with too many changes at once:

❌ Overwhelming:
```json
{
  "itemChanges": {
    "add": ["item1", "item2", "item3", "item4", "item5"]
  },
  "flagChanges": {
    "set": ["flag1", "flag2", "flag3", "flag4"]
  },
  "relationshipChanges": {
    "char1": 10, "char2": -5, "char3": 15
  }
}
```

✅ Better - spread across multiple scenes:
```json
// Scene 1: Find items
{
  "itemChanges": {
    "add": ["item1", "item2"]
  }
}

// Scene 2: Later, more items
{
  "itemChanges": {
    "add": ["item3"]
  }
}
```

### 6. Use Remove for Consumption

When items are used up, remove them:

```json
{
  "text": "Use the lockpick",
  "nextScene": "B-2-005",
  "itemChanges": {
    "remove": ["lockpick"]
  },
  "flagChanges": {
    "set": ["used:lockpick", "loc:door_unlocked"]
  }
}
```

## Testing Auto-Actions

### Interactive Demo

Visit [/auto-actions-demo](http://localhost:3001/auto-actions-demo) to see:
- 7 test scenes demonstrating different auto-action types
- Real-time notifications
- State sidebar updates
- Scene-level and choice-level changes
- Positive and negative changes

### Test Scenes

The demo includes:
1. **AUTO-001**: Basic item and relationship gain
2. **AUTO-002**: Multiple items and flags at once
3. **AUTO-003**: Evidence and relationships (scene + choice changes)
4. **AUTO-004**: Item removal and upgrade
5. **AUTO-005**: Negative changes (getting caught)
6. **AUTO-006**: Complex multi-type changes
7. **AUTO-007**: Ending with final rewards

## Common Patterns

### Quest Completion

```json
{
  "id": "QUEST-COMPLETE-001",
  "content": {
    "text": "You've gathered all the supplies! The informant nods approvingly and hands you a map."
  },
  "itemChanges": {
    "add": ["escape_map"],
    "remove": ["quest_supplies"]
  },
  "flagChanges": {
    "set": ["quest:escape_plan_complete"],
    "unset": ["quest:gathering_supplies"]
  },
  "relationshipChanges": {
    "informant": 25
  }
}
```

### Discovery Scenes

```json
{
  "id": "DISCOVER-SECRET",
  "type": "investigation",
  "content": {
    "text": "Behind the loose brick, you find a hidden passage and an old journal."
  },
  "itemChanges": {
    "add": ["old_journal"]
  },
  "evidenceChanges": {
    "add": ["warden_confession"]
  },
  "flagChanges": {
    "set": ["disc:secret_passage", "loc:hidden_area_unlocked"]
  }
}
```

### Consequence Scenes

```json
{
  "id": "CAUGHT-STEALING",
  "content": {
    "text": "The guards catch you red-handed! They confiscate your contraband and you lose their trust."
  },
  "itemChanges": {
    "remove": ["lockpick", "contraband"]
  },
  "relationshipChanges": {
    "guard": -30,
    "warden": -15
  },
  "flagChanges": {
    "set": ["char:caught_stealing", "char:on_watch_list"],
    "unset": ["char:trusted"]
  }
}
```

### Item Upgrade

```json
{
  "content": {
    "text": "You combine the metal shard with the wooden handle to create a makeshift shiv."
  },
  "itemChanges": {
    "add": ["shiv"],
    "remove": ["metal_shard", "wooden_handle"]
  },
  "flagChanges": {
    "set": ["crafted:shiv"]
  }
}
```

## Debugging

### Development Mode

In development, scene state changes are displayed at the bottom of scenes:

```
Scene State Changes (Dev):
Flags: {"set":["story:intro_complete"]}
Items: {"add":["rusty_key"]}
Relationships: {"guard":10}
```

### Console Logging

State changes are logged when applied:

```javascript
// In sceneTransitions.ts
console.log('Applying flag changes:', flagChanges);
console.log('Applying item changes:', itemChanges);
```

### Notification Duration

Increase notification duration for debugging:

```tsx
<StateChangeNotification
  changes={recentStateChanges}
  duration={10000}  // 10 seconds instead of 4
  onComplete={clearStateChanges}
/>
```

## Related Documentation

- [Scene Data Format](./SCENE_DATA_FORMAT.md) - Complete scene structure
- [Flag System](./FLAG_SYSTEM.md) - Flag naming and management
- [Scene Transitions](./SCENE_DATA_FORMAT.md#state-changes) - How transitions work
- [Choice Requirements](./SCENE_DATA_FORMAT.md#choice-requirements) - Using state to gate choices
