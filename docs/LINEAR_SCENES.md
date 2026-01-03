# Linear Scenes Documentation

## Overview

Linear scenes are narrative sequences that automatically flow from one scene to the next without requiring player choices. They're perfect for storytelling, exposition, cutscenes, and establishing atmosphere before presenting meaningful decisions.

## Key Features

- ✅ **Automatic Continue Button**: Shows when scene has `nextScene` but no choices
- ✅ **Smooth Narrative Flow**: Multiple linear scenes can chain together
- ✅ **Auto-Actions Support**: Items, flags, and relationships can change during linear sequences
- ✅ **Choice Integration**: Linear sequences can end with a choice scene
- ✅ **Ending Support**: Ending scenes show no continue button
- ✅ **Typewriter Compatible**: Works with typewriter text effect
- ✅ **Back Navigation**: Players can navigate back through linear scenes

## Scene Types

### 1. Linear Scene (with Continue)

A scene that continues automatically to the next scene:

```json
{
  "id": "A-1-005",
  "type": "narrative",
  "content": {
    "text": "The iron door slams shut behind you. Your journey begins."
  },
  "choices": [],
  "nextScene": "A-1-006"
}
```

**What happens**:
- Scene displays with text
- Continue button appears automatically
- Clicking Continue navigates to `A-1-006`

### 2. Choice Scene (no Continue)

A scene with player choices:

```json
{
  "id": "A-2-010",
  "type": "choice",
  "content": {
    "text": "What will you do?"
  },
  "choices": [
    {
      "text": "Option 1",
      "nextScene": "A-2-011"
    },
    {
      "text": "Option 2",
      "nextScene": "A-2-012"
    }
  ]
}
```

**What happens**:
- Scene displays with text
- Choice buttons appear
- No Continue button (choices provide navigation)

### 3. Ending Scene (no Continue)

A scene that terminates the story:

```json
{
  "id": "END-ESCAPE",
  "type": "ending",
  "content": {
    "text": "You have escaped! Freedom awaits."
  },
  "choices": []
}
```

**What happens**:
- Scene displays with text
- Special ending UI appears (🏁 The End)
- No Continue button (game ends)
- No `nextScene` property needed

## Continue Button Behavior

### When Continue Appears

The Continue button shows when **all** of these are true:
1. Scene has **no choices** (`choices` array is empty)
2. Scene has `nextScene` property defined
3. Scene type is **not** `ending`
4. Typewriter effect has completed (if enabled)

```tsx
// From SceneRenderer.tsx
const hasChoices = scene.choices && scene.choices.length > 0;
const isEnding = scene.type === 'ending';
const isNarrative = scene.type === 'narrative' && scene.nextScene;

{!hasChoices && isNarrative && typewriterComplete && (
  <button onClick={handleContinue}>
    Continue →
  </button>
)}
```

### When Continue Does NOT Appear

❌ Scene has choices:
```json
{
  "choices": [{ "text": "...", "nextScene": "..." }]
}
```

❌ Scene is an ending:
```json
{
  "type": "ending"
}
```

❌ Scene has no `nextScene`:
```json
{
  "content": { "text": "..." }
  // Missing nextScene - shows warning
}
```

## Creating Linear Scene Sequences

### Simple Linear Chain

```json
[
  {
    "id": "INTRO-001",
    "type": "narrative",
    "content": { "text": "Scene 1 text" },
    "choices": [],
    "nextScene": "INTRO-002"
  },
  {
    "id": "INTRO-002",
    "type": "narrative",
    "content": { "text": "Scene 2 text" },
    "choices": [],
    "nextScene": "INTRO-003"
  },
  {
    "id": "INTRO-003",
    "type": "narrative",
    "content": { "text": "Scene 3 text" },
    "choices": [],
    "nextScene": "CHAPTER-1-START"
  }
]
```

**Player experience**:
1. See Scene 1 → Click Continue
2. See Scene 2 → Click Continue
3. See Scene 3 → Click Continue
4. Arrive at CHAPTER-1-START

### Linear to Choice Transition

End a linear sequence with a choice scene:

```json
[
  {
    "id": "SETUP-001",
    "type": "narrative",
    "content": { "text": "You arrive at the prison." },
    "choices": [],
    "nextScene": "SETUP-002"
  },
  {
    "id": "SETUP-002",
    "type": "narrative",
    "content": { "text": "The guard leads you inside." },
    "choices": [],
    "nextScene": "FIRST-CHOICE"
  },
  {
    "id": "FIRST-CHOICE",
    "type": "choice",
    "content": { "text": "What do you do?" },
    "choices": [
      { "text": "Cooperate", "nextScene": "PATH-A" },
      { "text": "Resist", "nextScene": "PATH-B" }
    ]
  }
]
```

### Linear with Auto-Actions

Apply state changes during linear sequences:

```json
{
  "id": "INTRO-GEAR",
  "type": "narrative",
  "content": { "text": "The guard hands you prison clothes and a meal tray." },
  "choices": [],
  "nextScene": "INTRO-CELL",
  "itemChanges": {
    "add": ["prison_uniform", "meal_tray"]
  },
  "flagChanges": {
    "set": ["story:received_gear"]
  }
}
```

**Result**: Players automatically gain items as they continue through the story.

## Scene Type Variations

### Narrative Scene

Standard storytelling scene:

```json
{
  "id": "NARR-001",
  "type": "narrative",
  "content": {
    "text": "The sun sets over the prison walls."
  },
  "choices": [],
  "nextScene": "NARR-002"
}
```

### Dialogue Scene

Character speaking (with continue):

```json
{
  "id": "DIAL-001",
  "type": "dialogue",
  "content": {
    "speaker": "Guard",
    "text": "Welcome to El Palo de Queso.",
    "visual": "/images/characters/guard.png"
  },
  "choices": [],
  "nextScene": "DIAL-002"
}
```

**Display**: Shows speaker name above text, then Continue button.

### Investigation Scene

Discovery scene (with continue):

```json
{
  "id": "INV-001",
  "type": "investigation",
  "content": {
    "text": "You find a hidden compartment in the wall."
  },
  "choices": [],
  "nextScene": "INV-002",
  "itemChanges": {
    "add": ["hidden_key"]
  }
}
```

## Best Practices

### 1. Use Linear Scenes for Setup

✅ **Good**: Use linear scenes for exposition and setup
```json
// Introduction sequence (3-5 linear scenes)
INTRO-001 → INTRO-002 → INTRO-003 → FIRST-CHOICE
```

❌ **Bad**: Forcing choices where none are needed
```json
{
  "text": "You enter the prison.",
  "choices": [
    { "text": "Continue", "nextScene": "..." }  // Fake choice!
  ]
}
```

### 2. Keep Linear Sequences Short

✅ **Good**: 3-6 linear scenes before a choice
```
LINEAR-001 → LINEAR-002 → LINEAR-003 → CHOICE
```

❌ **Bad**: 15+ linear scenes with no interaction
```
LINEAR-001 → ... → LINEAR-015 → CHOICE  // Too long!
```

**Guideline**: Give players a meaningful choice every 3-6 narrative scenes.

### 3. End Sequences with Choices

✅ **Good**: Linear setup → meaningful choice
```json
[
  { "id": "SETUP-1", "nextScene": "SETUP-2" },
  { "id": "SETUP-2", "nextScene": "CHOICE" },
  { "id": "CHOICE", "choices": [...] }
]
```

❌ **Bad**: Linear → more linear → more linear
```json
[
  { "id": "LIN-1", "nextScene": "LIN-2" },
  { "id": "LIN-2", "nextScene": "LIN-3" },
  { "id": "LIN-3", "nextScene": "LIN-4" },
  // No end in sight...
]
```

### 4. Use Auto-Actions Sparingly in Linear Scenes

✅ **Good**: Important items and flags
```json
{
  "itemChanges": { "add": ["important_key"] },
  "flagChanges": { "set": ["story:chapter_1_complete"] }
}
```

❌ **Bad**: Too many changes per scene
```json
{
  "itemChanges": { "add": ["item1", "item2", "item3"] },
  "flagChanges": { "set": ["flag1", "flag2", "flag3"] },
  "relationshipChanges": { "char1": 10, "char2": -5 }
}
```

### 5. Provide Context for Continue

✅ **Good**: Text implies continuation
```json
{
  "text": "You walk down the corridor, heading toward your cell."
}
```

❌ **Bad**: Abrupt stop
```json
{
  "text": "The guard looks at you."
  // Why am I continuing? What happens next?
}
```

## Typewriter Effect

Linear scenes work seamlessly with typewriter text:

```tsx
<SceneRenderer
  scene={scene}
  onContinue={handleContinue}
  typewriter={true}
  typewriterSpeed={30}
/>
```

**Behavior**:
1. Text displays character-by-character
2. Continue button appears **after** typewriter completes
3. Players must wait for text before continuing

**Disable waiting**: Set `typewriter={false}` for instant text and immediate Continue button.

## Back Navigation

Players can navigate backward through linear scenes:

```tsx
const { goBack, canGoBack } = useSceneTransition();

<button onClick={goBack} disabled={!canGoBack}>
  ← Back
</button>
```

**Behavior**:
- Back button works through linear sequences
- State changes are NOT reverted (items/flags remain)
- Can navigate forward again using Continue

## Error States

### Missing nextScene

If a scene has no choices and no `nextScene`:

```json
{
  "id": "ERROR-SCENE",
  "type": "narrative",
  "content": { "text": "..." },
  "choices": []
  // Missing nextScene!
}
```

**Display**:
```
⚠️ This scene has no choices or continuation
Scene ID: ERROR-SCENE • Type: narrative
```

### Invalid nextScene

If `nextScene` references a non-existent scene:

```json
{
  "nextScene": "SCENE-DOES-NOT-EXIST"
}
```

**Result**: Error message shown, user can reset or go back.

## Testing Linear Scenes

### Interactive Demo

Visit [/linear-scenes-demo](http://localhost:3001/linear-scenes-demo) to experience:

1. **LINEAR-001 to LINEAR-006**: Six consecutive linear scenes with Continue buttons
2. **LINEAR-CHOICE**: Choice scene after linear sequence
3. **Three paths**: Each leading to different linear content
4. **Three endings**: Each ending shows no Continue button

### Verification Checklist

When creating linear scenes, verify:

- [ ] Scene has empty `choices` array
- [ ] Scene has `nextScene` property
- [ ] Next scene exists in scene data
- [ ] Linear sequence doesn't exceed 6 scenes
- [ ] Sequence ends with choice or ending
- [ ] Auto-actions are meaningful
- [ ] Text flows naturally from scene to scene
- [ ] Endings have `type: "ending"` and no `nextScene`

## Common Patterns

### Opening Sequence

```json
[
  {
    "id": "OPEN-001",
    "type": "narrative",
    "content": { "text": "The police van pulls up to the prison gates." },
    "nextScene": "OPEN-002"
  },
  {
    "id": "OPEN-002",
    "type": "narrative",
    "content": { "text": "The gates screech open, revealing a bleak courtyard." },
    "nextScene": "OPEN-003"
  },
  {
    "id": "OPEN-003",
    "type": "dialogue",
    "content": {
      "speaker": "Guard",
      "text": "Welcome to El Palo de Queso. Follow me."
    },
    "nextScene": "FIRST-CHOICE"
  }
]
```

### Cutscene Sequence

```json
[
  {
    "id": "CUTSCENE-001",
    "type": "narrative",
    "content": { "text": "Later that night..." },
    "nextScene": "CUTSCENE-002"
  },
  {
    "id": "CUTSCENE-002",
    "type": "dialogue",
    "content": {
      "speaker": "Mysterious Figure",
      "text": "I have been watching you. You have potential."
    },
    "nextScene": "CUTSCENE-003"
  },
  {
    "id": "CUTSCENE-003",
    "type": "narrative",
    "content": { "text": "Before you can respond, they disappear into the shadows." },
    "nextScene": "BACK-TO-GAMEPLAY"
  }
]
```

### Discovery Sequence

```json
[
  {
    "id": "DISCOVER-001",
    "type": "investigation",
    "content": { "text": "You notice a loose brick in your cell wall." },
    "nextScene": "DISCOVER-002"
  },
  {
    "id": "DISCOVER-002",
    "type": "investigation",
    "content": { "text": "Behind it, you find a hidden passage!" },
    "itemChanges": { "add": ["passage_map"] },
    "flagChanges": { "set": ["disc:secret_passage"] },
    "nextScene": "DISCOVER-CHOICE"
  },
  {
    "id": "DISCOVER-CHOICE",
    "type": "choice",
    "content": { "text": "Do you explore the passage?" },
    "choices": [
      { "text": "Yes", "nextScene": "PASSAGE-PATH" },
      { "text": "No", "nextScene": "IGNORE-PASSAGE" }
    ]
  }
]
```

## Related Documentation

- [Scene Data Format](./SCENE_DATA_FORMAT.md) - Complete scene structure
- [Auto-Actions](./AUTO_ACTIONS.md) - State changes in scenes
- [Scene Renderer](./SCENE_DATA_FORMAT.md#scene-renderer) - Component details
- [Typewriter Effect](./SCENE_DATA_FORMAT.md#typewriter-text) - Text animation
