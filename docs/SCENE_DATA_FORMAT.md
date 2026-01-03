# Scene Data Format

## Overview

Scenes are the fundamental building blocks of the El Palo de Queso narrative experience. Each scene represents a moment in the story where the player receives information and potentially makes choices.

## Scene ID Format

Scene IDs follow a specific naming convention:

```
[PREFIX]-[CHAPTER]-[NUMBER]
```

- **PREFIX**: A letter indicating the scene category
  - `X`: Prologue/Introduction scenes
  - `A-Z`: Main story chapters (A=Chapter 1, B=Chapter 2, etc.)
  - `END`: Ending scenes

- **CHAPTER**: A number indicating the section within that chapter (0-9)

- **NUMBER**: A three-digit sequential number (001-999)

### Examples
- `X-0-001` - First prologue scene
- `A-1-015` - Chapter A (1), section 1, scene 15
- `END-1-ESCAPE` - Ending scene (escape ending)

## Scene Structure

### Basic Scene

```json
{
  "id": "X-0-001",
  "type": "narrative",
  "content": {
    "visual": "/images/backgrounds/prison-exterior.jpg",
    "text": "The narrative text that appears to the player",
    "speaker": null
  },
  "choices": [],
  "nextScene": "X-0-002"
}
```

### Required Fields

- **id** (string): Unique scene identifier following the ID format
- **type** (string): Scene type - one of:
  - `narrative`: Standard story scene with automatic progression
  - `choice`: Scene requiring player decision
  - `dialogue`: Character conversation scene
  - `investigation`: Scene for examining clues/environment
  - `ending`: Terminal scene (game ending)

- **content** (object): The scene's content
  - **text** (string): The main narrative or dialogue text
  - **visual** (string, optional): Path to background image or character sprite
  - **speaker** (string, optional): Name of character speaking (null for narrator)

- **choices** (array): Array of available player choices (can be empty)

### Optional Fields

- **nextScene** (string): Default scene to transition to (for narrative scenes without choices)
- **requirements** (object): Conditions that must be met to access this scene
- **flagChanges** (object): Flags to set/unset when scene is visited
- **itemChanges** (object): Items to add/remove when scene is visited
- **relationshipChanges** (object): Relationship score changes when scene is visited
- **evidenceChanges** (object): Evidence to add/remove when scene is visited

## Choice Structure

```json
{
  "text": "The choice text shown to the player",
  "nextScene": "A-1-015",
  "requirements": {
    "items": ["keycard"],
    "flags": ["met_officer_ramirez"],
    "relationships": {
      "ramirez": 10
    },
    "evidence": ["mysterious_note"]
  },
  "flagChanges": {
    "set": ["chose_cooperation"],
    "unset": ["chose_defiance"]
  },
  "itemChanges": {
    "add": ["prison_map"],
    "remove": ["cigarettes"]
  },
  "relationshipChanges": {
    "ramirez": 5,
    "cellmate": -3
  },
  "evidenceChanges": {
    "add": ["confession_tape"],
    "remove": []
  }
}
```

### Choice Fields

- **text** (string): The choice text displayed to the player
- **nextScene** (string): ID of scene to navigate to when selected
- **requirements** (object, optional): Conditions for choice availability
  - **items** (array): Required inventory items
  - **flags** (array): Required flags (all must be set)
  - **relationships** (object): Minimum relationship scores needed
  - **evidence** (array): Required evidence pieces

- **flagChanges** (object, optional): Flag modifications when choice is selected
  - **set** (array): Flags to activate
  - **unset** (array): Flags to deactivate

- **itemChanges** (object, optional): Inventory modifications
  - **add** (array): Items to add to inventory
  - **remove** (array): Items to remove from inventory

- **relationshipChanges** (object, optional): Relationship score adjustments
  - Key: character ID
  - Value: score change (positive or negative integer)

- **evidenceChanges** (object, optional): Evidence modifications
  - **add** (array): Evidence to collect
  - **remove** (array): Evidence to discard

## Scene Types in Detail

### Narrative Scenes
Automatic progression scenes that advance the story. Typically have no choices and use `nextScene` for progression.

```json
{
  "id": "X-0-001",
  "type": "narrative",
  "content": {
    "visual": "/images/bg.jpg",
    "text": "Story text...",
    "speaker": null
  },
  "choices": [],
  "nextScene": "X-0-002"
}
```

### Choice Scenes
Present meaningful player decisions that branch the narrative.

```json
{
  "id": "A-1-001",
  "type": "choice",
  "content": {
    "visual": "/images/cell.jpg",
    "text": "What will you do?",
    "speaker": null
  },
  "choices": [
    {
      "text": "Option 1",
      "nextScene": "A-1-010"
    },
    {
      "text": "Option 2",
      "nextScene": "A-1-020"
    }
  ]
}
```

### Dialogue Scenes
Character conversations with a specified speaker.

```json
{
  "id": "A-2-005",
  "type": "dialogue",
  "content": {
    "visual": "/images/characters/ramirez.png",
    "text": "I need to tell you something important...",
    "speaker": "Officer Ramirez"
  },
  "choices": [...]
}
```

### Investigation Scenes
Allow players to examine environments or evidence.

```json
{
  "id": "A-1-015",
  "type": "investigation",
  "content": {
    "visual": "/images/cell-detail.jpg",
    "text": "You examine the cell carefully...",
    "speaker": null
  },
  "evidenceChanges": {
    "add": ["mysterious_numbers"]
  },
  "choices": [...]
}
```

### Ending Scenes
Terminal scenes representing game endings. Should have no choices or nextScene.

```json
{
  "id": "END-1-ESCAPE",
  "type": "ending",
  "content": {
    "visual": "/images/freedom.jpg",
    "text": "You've escaped! The story concludes...",
    "speaker": null
  },
  "choices": [],
  "flagChanges": {
    "set": ["ending_reached", "escaped_prison"]
  }
}
```

## Best Practices

1. **Scene IDs**: Always follow the naming convention strictly for maintainability
2. **Narrative Flow**: Ensure every scene has a valid exit (either choices or nextScene)
3. **Dead Ends**: Only ending scenes should have no progression options
4. **Requirements**: Test that required items/flags can actually be obtained before needed
5. **Relationships**: Keep relationship changes realistic (-5 to +10 typically)
6. **Visual Assets**: Use consistent paths and ensure referenced images exist
7. **Text Length**: Keep scene text readable (2-4 sentences for narrative, 1-2 for dialogue)
8. **Choice Count**: Aim for 2-4 choices per scene for optimal player experience
9. **Flag Naming**: Use descriptive snake_case names (e.g., `met_ramirez`, `found_key`)
10. **Evidence IDs**: Keep evidence IDs distinct and meaningful

## Validation

When creating scenes, ensure:
- [ ] ID follows correct format
- [ ] Type is one of the valid types
- [ ] Content has required text field
- [ ] All referenced nextScene IDs exist
- [ ] Requirements reference valid items/flags/characters
- [ ] Relationship changes reference valid character IDs
- [ ] Visual paths point to existing or planned assets
- [ ] Ending scenes have appropriate flags set
- [ ] No orphaned scenes (unreachable from any path)
