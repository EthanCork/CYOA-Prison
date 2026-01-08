# Interactive Hotspot System

## Overview

The interactive hotspot system allows players to click on specific areas of the background image to examine objects, collect items, or discover clues. This creates a more immersive visual novel experience where observation and curiosity are rewarded.

## Key Features

- **Visual Discovery**: Instead of text-based choices like "Look at the wall", players click directly on the wall
- **Conditional Visibility**: Hotspots can be hidden until certain flags are set or items are collected
- **One-Time Interactions**: Hotspots can disappear after being examined once
- **Multiple Action Types**: examine, take, talk, use, navigate
- **Hover Feedback**: Hotspots glow when hovered, showing an interactive label
- **Popup Examination**: Examined items show detailed text in a centered popup overlay

## Type Definitions

### Hotspot
```typescript
interface Hotspot {
  id: string;                    // Unique identifier
  label: string;                 // Shown on hover
  position: {
    x: number;                   // 0-100 (% from left)
    y: number;                   // 0-100 (% from top)
    width: number;               // 0-100 (% of screen width)
    height: number;              // 0-100 (% of screen height)
  };
  requirements?: ChoiceRequirements;  // Conditions to show this hotspot
  action: HotspotAction;
}
```

### HotspotAction
```typescript
interface HotspotAction {
  type: 'examine' | 'take' | 'talk' | 'use' | 'navigate';
  text?: string;                 // Examination text (shown in popup)
  nextScene?: string;            // Navigate to scene
  flagChanges?: {
    set?: string[];
    unset?: string[];
  };
  itemChanges?: {
    add?: string[];
    remove?: string[];
  };
  evidenceChanges?: {
    add?: string[];
    remove?: string[];
  };
  oneTime?: boolean;             // Disappear after interaction
}
```

## Usage Examples

### Example 1: Cell Wall Scratches (Examine + Collect Evidence)

```json
{
  "id": "A-1-001",
  "type": "narrative",
  "content": {
    "visual": "/images/backgrounds/cell-interior.jpg",
    "text": "Your new home. A small cell with stone walls, a metal bunk, and a tiny barred window. The door slams shut behind you with a hollow clang.",
    "speaker": null
  },
  "hotspots": [
    {
      "id": "wall_scratches",
      "label": "Examine Wall",
      "position": {
        "x": 15,
        "y": 30,
        "width": 20,
        "height": 25
      },
      "action": {
        "type": "examine",
        "text": "The stone wall bears countless scratches - desperate tallies marking days, months, years. But one set stands out: a sequence of numbers carved deeper than the rest.\n\n4-7-1-9-2-3\n\nSomeone wanted this remembered.",
        "evidenceChanges": {
          "add": ["mysterious_numbers"]
        },
        "flagChanges": {
          "set": ["examined_wall_scratches", "knows_number_sequence"]
        },
        "oneTime": true
      }
    },
    {
      "id": "window_view",
      "label": "Look Out Window",
      "position": {
        "x": 70,
        "y": 10,
        "width": 15,
        "height": 20
      },
      "action": {
        "type": "examine",
        "text": "Through the narrow window, you can see the prison yard below. Guard towers watch from every corner. In the distance, the ocean churns against jagged rocks.\n\nNo one has ever escaped Île de Pierre. But everyone tries."
      }
    }
  ],
  "choices": [],
  "nextScene": "A-1-002"
}
```

### Example 2: Conditional Hotspot (Requires Item)

```json
{
  "id": "A-2-010",
  "type": "investigation",
  "content": {
    "visual": "/images/backgrounds/guard-office.jpg",
    "text": "The guard's office is empty for now. You don't have much time.",
    "speaker": null
  },
  "hotspots": [
    {
      "id": "locked_drawer",
      "label": "Locked Drawer",
      "position": {
        "x": 40,
        "y": 55,
        "width": 12,
        "height": 15
      },
      "action": {
        "type": "examine",
        "text": "The drawer is locked. You'd need a key or lockpick to open it."
      }
    },
    {
      "id": "open_drawer",
      "label": "Open Drawer",
      "position": {
        "x": 40,
        "y": 55,
        "width": 12,
        "height": 15
      },
      "requirements": {
        "items": ["guard_key"]
      },
      "action": {
        "type": "take",
        "text": "You unlock the drawer with the guard's key. Inside you find the shift schedule and a master passkey!",
        "itemChanges": {
          "add": ["master_passkey", "shift_schedule"]
        },
        "evidenceChanges": {
          "add": ["guard_corruption"]
        },
        "flagChanges": {
          "set": ["accessed_guard_office", "has_master_key"]
        },
        "oneTime": true
      }
    }
  ],
  "choices": [],
  "nextScene": "A-2-011"
}
```

### Example 3: Character Interaction Hotspot

```json
{
  "id": "B-1-005",
  "type": "dialogue",
  "content": {
    "visual": "/images/backgrounds/workshop.jpg",
    "text": "The prison workshop is busy with inmates crafting furniture and goods for sale.",
    "speaker": null
  },
  "hotspots": [
    {
      "id": "talk_to_jacques",
      "label": "Talk to Jacques",
      "position": {
        "x": 25,
        "y": 40,
        "width": 15,
        "height": 30
      },
      "action": {
        "type": "navigate",
        "nextScene": "B-1-006-jacques-dialogue"
      }
    },
    {
      "id": "steal_tools",
      "label": "Tools",
      "position": {
        "x": 65,
        "y": 60,
        "width": 10,
        "height": 12
      },
      "requirements": {
        "notFlags": ["guard_watching"]
      },
      "action": {
        "type": "take",
        "text": "You discreetly pocket a small file and a screwdriver. These could be useful.",
        "itemChanges": {
          "add": ["metal_file", "screwdriver"]
        },
        "flagChanges": {
          "set": ["stole_workshop_tools"]
        },
        "oneTime": true
      }
    }
  ],
  "choices": [
    {
      "text": "Continue working",
      "nextScene": "B-1-007"
    }
  ]
}
```

## Visual Design

### Hotspot States

1. **Inactive**: Completely invisible, no indication it exists
2. **Hover**: Glows with amber border, shows label above hotspot
3. **Clicked (Examine)**: Shows popup overlay with detailed text
4. **Interacted (One-Time)**: Disappears permanently

### CSS Styling

- **Hover Effect**: Amber glow with shadow
- **Border**: 2px solid amber-400
- **Background**: Semi-transparent amber (20% opacity)
- **Label**: Black background with amber text
- **Popup**: Centered, dark gray with amber border

## Integration with Game Systems

### Flags
- Set flags when hotspots are examined
- Use flags to track player knowledge
- Unlock new dialogue options based on discovered clues

### Items & Evidence
- Collect physical items (keys, tools, documents)
- Gather evidence (for justice endings)
- Items can unlock new hotspots or scene access

### Requirements
- Hide hotspots until player has certain items
- Show hotspots only if flags are set
- Create investigation puzzles with sequential discoveries

## Best Practices

1. **Meaningful Interactions**: Every hotspot should provide value
   - Story information
   - Items or evidence
   - Character development
   - Puzzle clues

2. **Visual Clarity**: Position hotspots on obvious interactive elements
   - Objects that look examinable
   - Characters you can talk to
   - Doors you can open

3. **Reward Curiosity**: Hidden hotspots for observant players
   - Small details that reveal backstory
   - Optional items that make the game easier
   - Alternative solutions to problems

4. **Avoid Pixel Hunting**: Don't make hotspots too small
   - Minimum 8-10% width/height for clickability
   - Use clear labels on hover
   - Logical placement on interactive-looking objects

5. **One-Time vs Repeatable**:
   - **One-Time**: Collecting items, discovering clues
   - **Repeatable**: Examining scenery, talking to characters

## Example Scenarios

### Prison Cell Investigation
- **Wall scratches**: Discover number code (evidence)
- **Bunk bed**: Find hidden shiv (item)
- **Loose stone**: Access secret hiding spot (navigate to new scene)
- **Window**: Observe guard patrol patterns (flag: knows_patrol_schedule)

### Escape Planning
- **Guard schedule**: Read rotation times (evidence)
- **Maintenance key**: Steal from hook (item)
- **Ventilation grate**: Inspect escape route (navigate or examine)
- **Guard uniform**: Take disguise (item, requires distraction flag)

### Investigation Scene
- **Victim's desk**: Find incriminating letter (evidence)
- **Safe**: Needs combination from earlier clue (requires flag)
- **Photo frame**: Hidden document behind it (one-time discovery)
- **Bookshelf**: Secret passage (navigate, requires correct book sequence)

## Technical Implementation

The system is fully implemented with:
- Type definitions in `/types/game.ts`
- Visual rendering in `/components/VisualNovelScene.tsx`
- State management in `/app/game-full-demo/page.tsx`
- Requirement checking via existing `checkChoiceRequirements` function

Hotspots are added directly to scene JSON files in the `hotspots` array.

## Future Enhancements

- **Cursor change** on hover (magnifying glass, hand, etc.)
- **Ambient sound effects** on interaction
- **Animation** when hotspots appear/disappear
- **Minimap** showing discovered hotspots
- **Combination puzzles** requiring multiple hotspot interactions
- **Item usage** on hotspots (use key on door, etc.)
