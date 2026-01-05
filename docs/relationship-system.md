# Relationship System Documentation

## Overview
The relationship system for El Palo de Queso tracks the player's standing with 6 key NPCs (Non-Player Characters) throughout the game. Relationship scores range from -100 to +100 and influence available dialogue options, quest paths, and story outcomes.

## NPCs

### 1. Bastian (Initial: +30)
- **Role:** Veteran Inmate
- **Location:** Cell Block A
- **Traits:** Resourceful, Cautious, Loyal
- **Status:** Friendly
- **Description:** A fellow inmate who has been at El Palo de Queso for several years. He knows the ins and outs of the prison and can be a valuable ally if you maintain his trust.

### 2. Marcel (Initial: 0)
- **Role:** Loner
- **Location:** Cell Block B
- **Traits:** Reserved, Observant, Unpredictable
- **Status:** Neutral
- **Description:** A quiet inmate who keeps to himself. You haven't had much interaction with him yet, so your relationship is neutral.

### 3. Viktor (Initial: -20)
- **Role:** Gang Lieutenant
- **Location:** Cell Block C
- **Traits:** Aggressive, Territorial, Intimidating
- **Status:** Unfriendly
- **Description:** A member of the dominant prison gang. He views you with suspicion and has made it clear you're not welcome in his territory.

### 4. Denis (Initial: +20)
- **Role:** Kitchen Worker
- **Location:** Kitchen / Cafeteria
- **Traits:** Kind, Helpful, Optimistic
- **Status:** Friendly
- **Description:** A friendly inmate who works in the kitchen. He helped you out when you first arrived and seems genuinely kind despite the harsh environment.

### 5. Émile (Initial: -50)
- **Role:** Enforcer
- **Location:** Yard / Cell Block D
- **Traits:** Violent, Ruthless, Feared
- **Status:** Enemy
- **Description:** A dangerous inmate with a violent reputation. He's made it clear he doesn't like you and has threatened you multiple times.

### 6. Dr. Moreau (Initial: 0)
- **Role:** Prison Doctor
- **Location:** Infirmary
- **Traits:** Professional, Detached, Knowledgeable
- **Status:** Neutral
- **Description:** The prison doctor who runs the infirmary. Professional but distant, he treats inmates with clinical detachment.

## Relationship Score System

### Score Range
- **Minimum:** -100 (Mortal Enemy)
- **Maximum:** +100 (Devoted Ally)
- **Starting Range:** -50 to +30 (varies by NPC)

### Relationship Status Levels

| Score Range | Status | Description |
|-------------|--------|-------------|
| 80 to 100 | Devoted Ally | Will risk themselves for you |
| 60 to 79 | Trusted Friend | Reliable and supportive |
| 40 to 59 | Good Friend | Generally helpful |
| 20 to 39 | Friendly | Positive relationship |
| 10 to 19 | Acquaintance | Knows you, neutral positive |
| -10 to 9 | Neutral | No strong feelings |
| -20 to -11 | Unfriendly | Dislikes you |
| -40 to -21 | Hostile | Actively opposes you |
| -60 to -41 | Enemy | Will harm you if possible |
| -80 to -61 | Bitter Enemy | Seeks your downfall |
| -100 to -81 | Mortal Enemy | Will kill you given the chance |

## Store Functions

### changeRelationship(characterId, delta)
Changes a character's relationship score by a delta amount.

```typescript
import { useGameStore } from '@/lib/store';

const { changeRelationship } = useGameStore();

// Increase relationship
changeRelationship('bastian', 10); // Bastian likes you more

// Decrease relationship
changeRelationship('viktor', -15); // Viktor dislikes you more

// Changes accumulate
changeRelationship('denis', 5);
changeRelationship('denis', 10);
// Denis relationship is now +15 from initial
```

**Parameters:**
- `characterId` (string): ID of the character ('bastian', 'marcel', etc.)
- `delta` (number): Amount to change (-100 to +100)

**Behavior:**
- Automatically caps at -100 and +100
- Changes accumulate over time
- Survives scene transitions and navigation

### getRelationship(characterId)
Gets the current relationship score for a character.

```typescript
import { useGameStore } from '@/lib/store';

const { getRelationship } = useGameStore();

const bastianScore = getRelationship('bastian');
console.log(bastianScore); // Returns current score (e.g., 45)

// Use in conditionals
if (getRelationship('viktor') < -30) {
  // Viktor is hostile - show different dialogue
}
```

**Parameters:**
- `characterId` (string): ID of the character

**Returns:**
- `number`: Current relationship score (defaults to 0 if not set)

### setRelationship(characterId, score)
Sets a character's relationship score to a specific value.

```typescript
import { useGameStore } from '@/lib/store';

const { setRelationship } = useGameStore();

// Set specific value
setRelationship('marcel', 50);

// Useful for major story events
setRelationship('emile', -80); // Major betrayal
```

**Parameters:**
- `characterId` (string): ID of the character
- `score` (number): New relationship score

**Behavior:**
- Automatically caps at -100 and +100
- Overrides previous score completely

## Character Loader Functions

### loadAllCharacters()
Loads all NPC data from the characters.json file.

```typescript
import { loadAllCharacters } from '@/lib/characterLoader';

const characters = loadAllCharacters();
// Returns array of 6 Character objects
```

### getCharacterById(characterId)
Gets detailed information about a specific character.

```typescript
import { getCharacterById } from '@/lib/characterLoader';

const bastian = getCharacterById('bastian');
console.log(bastian?.name); // "Bastian"
console.log(bastian?.role); // "Veteran Inmate"
console.log(bastian?.traits); // ["Resourceful", "Cautious", "Loyal"]
```

### getInitialRelationships()
Gets the initial relationship scores for all characters.

```typescript
import { getInitialRelationships } from '@/lib/characterLoader';

const initial = getInitialRelationships();
// Returns: { bastian: 30, marcel: 0, viktor: -20, ... }
```

### getRelationshipStatus(score)
Converts a numeric score to a status description.

```typescript
import { getRelationshipStatus } from '@/lib/characterLoader';

const status = getRelationshipStatus(45);
// Returns: "Good Friend"

const enemyStatus = getRelationshipStatus(-55);
// Returns: "Enemy"
```

### getCharactersByLocation(location)
Finds characters at a specific location.

```typescript
import { getCharactersByLocation } from '@/lib/characterLoader';

const kitchenChars = getCharactersByLocation('Kitchen');
// Returns array with Denis
```

## Usage in Scenes

### Choice Requirements
Use relationship scores as requirements for choices:

```json
{
  "text": "Ask Bastian for help",
  "nextScene": "B-2-015",
  "requirements": {
    "relationships": {
      "bastian": 40
    }
  }
}
```

### Relationship Changes in Choices
Modify relationships based on player choices:

```json
{
  "text": "Stand up for Denis",
  "nextScene": "A-3-010",
  "relationshipChanges": {
    "denis": 15,
    "viktor": -10
  }
}
```

### Scene-Based Changes
Apply relationship changes when entering a scene:

```json
{
  "id": "A-2-005",
  "type": "dialogue",
  "content": {
    "text": "You helped Bastian in the yard...",
    "speaker": "Bastian"
  },
  "relationshipChanges": {
    "bastian": 20
  }
}
```

## Testing

### Running Tests
```bash
# Relationship state tests
npm test -- lib/__tests__/relationships.test.ts

# Character loader tests
npm test -- lib/__tests__/characterLoader.test.ts

# All relationship tests
npm test -- lib/__tests__/relationships.test.ts lib/__tests__/characterLoader.test.ts
```

### Test Coverage
- **29 relationship tests** - State management, ranges, persistence
- **46 character loader tests** - Data loading, searching, validation
- **Total: 75 tests** - All passing ✓

### Verification Script
```bash
npm run verify:relationships
```

Shows:
- All 6 NPCs with initial scores
- Relationship status for each
- Score range reference
- Status level breakdown

## Integration Example

```typescript
'use client';

import { useGameStore } from '@/lib/store';
import { getCharacterById, getRelationshipStatus } from '@/lib/characterLoader';

export default function RelationshipDisplay() {
  const { getRelationship, changeRelationship } = useGameStore();

  const handleHelpBastian = () => {
    changeRelationship('bastian', 15);
  };

  const bastian = getCharacterById('bastian');
  const score = getRelationship('bastian');
  const status = getRelationshipStatus(score);

  return (
    <div>
      <h2>{bastian?.name}</h2>
      <p>Role: {bastian?.role}</p>
      <p>Relationship: {score} ({status})</p>
      <button onClick={handleHelpBastian}>
        Help Bastian (+15)
      </button>
    </div>
  );
}
```

## Data Files

### Character Data
Location: `/data/characters.json`

Structure:
```json
{
  "characters": [
    {
      "id": "bastian",
      "name": "Bastian",
      "initialRelationship": 30,
      "description": "...",
      "role": "Veteran Inmate",
      "location": "Cell Block A",
      "traits": ["Resourceful", "Cautious", "Loyal"],
      "background": "..."
    }
  ]
}
```

## Type Definitions

```typescript
export interface Character {
  id: string;
  name: string;
  initialRelationship: number;
  description: string;
  role: string;
  location: string;
  traits: string[];
  background: string;
}
```

## Best Practices

1. **Gradual Changes**: Use small increments (+5, +10) for most interactions
2. **Major Events**: Use larger changes (+30, -40) for significant story moments
3. **Consistency**: Keep relationship changes consistent with character personalities
4. **Consequences**: Reflect relationship levels in dialogue and available options
5. **Balance**: Ensure both positive and negative paths are viable
6. **Feedback**: Show players when relationships change significantly

## Common Patterns

### Friendship Arc
```typescript
// Start neutral or slightly negative
setRelationship('viktor', -20);

// Build trust through multiple interactions
changeRelationship('viktor', 10); // Helped in fight
changeRelationship('viktor', 15); // Protected territory
changeRelationship('viktor', 20); // Saved life

// Viktor is now friendly (25 total)
```

### Betrayal Arc
```typescript
// Start positive
setRelationship('denis', 40);

// Player betrays
changeRelationship('denis', -70);

// Denis is now hostile (-30 total)
```

### Redemption Arc
```typescript
// Start as enemy
setRelationship('emile', -60);

// Slowly rebuild
changeRelationship('emile', 20); // Saved life
changeRelationship('emile', 25); // Shared resources
changeRelationship('emile', 30); // Protected from guards

// Émile is now friendly (15 total)
```
