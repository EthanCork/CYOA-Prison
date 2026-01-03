# Components

This directory contains reusable React components for "El Palo de Queso".

## Purpose
- UI components
- Game-specific components
- Shared/common components

## Components

### GameLayout
Main game layout component with dark prison theme.

**Features:**
- Full-screen responsive design
- Dark gradient background (gray-900 to gray-800)
- Three main sections:
  - Scene text area (prose styling, backdrop blur)
  - Choices section (interactive buttons)
  - Inventory sidebar (items, evidence, relationships)
- Mobile-friendly (stacks vertically on small screens)
- Amber accent colors for prison atmosphere

**Props:**
- `children`: Custom scene content
- `sceneText`: Scene text (fallback if no children)
- `location`: Location indicator for the scene
- `mood`: Mood/atmosphere indicator
- `typewriter`: Enable typewriter effect (default: false)
- `choices`: Custom choices component
- `inventory`: Custom inventory component
- `showInventory`: Toggle inventory sidebar (default: true)

**Usage:**
```tsx
import GameLayout from '@/components/GameLayout';

<GameLayout
  sceneText="Your scene text here..."
  location="Cell"
  mood="Mysterious"
/>
```

### SceneText
Displays narrative text with enhanced readability and optional typewriter effect.

**Features:**
- Optimized typography (serif font, proper line height)
- Location and mood indicators with icons
- Optional typewriter animation
- Skip button for typewriter effect
- Accessible and readable on all screen sizes

**Props:**
- `text`: Main narrative text (required)
- `location`: Optional location indicator
- `mood`: Optional mood/atmosphere indicator
- `typewriter`: Enable typewriter effect (default: false)
- `typewriterSpeed`: Speed in ms per character (default: 30)
- `onComplete`: Callback when typewriter completes

**Usage:**
```tsx
import SceneText from '@/components/SceneText';

<SceneText
  text="Your narrative text here..."
  location="Prison Cell"
  mood="Tense"
  typewriter={true}
  typewriterSpeed={25}
  onComplete={() => console.log('Done!')}
/>
```

### ChoiceButton
Interactive button component for displaying player choices with support for disabled states and dark theme styling.

**Features:**
- Dark theme styling with amber accents
- Hover effects with animated arrow
- Disabled/locked state with lock icon
- Optional index number badges
- Lock reason display for disabled choices
- Click callbacks for scene transitions
- Development metadata tooltips (shows state changes on hover)
- Fully accessible with ARIA labels

**Props:**
- `choice`: Choice data object (required)
- `onClick`: Callback when clicked (receives choice object)
- `disabled`: Whether choice is locked (default: false)
- `lockReason`: Reason text shown when disabled
- `index`: Optional number badge to display
- `className`: Custom CSS classes

**Usage:**
```tsx
import ChoiceButton from '@/components/ChoiceButton';

// Basic usage
<ChoiceButton
  choice={{
    text: "Continue forward",
    nextScene: "A-1-001"
  }}
  onClick={(choice) => handleChoice(choice)}
  index={1}
/>

// Locked choice
<ChoiceButton
  choice={{
    text: "Use the master key",
    nextScene: "B-1-001",
    requirements: { items: ['master_key'] }
  }}
  disabled={true}
  lockReason="Requires: Master Key"
/>
```

### SceneRenderer
Complete scene rendering component that combines SceneText and ChoiceButton to display full scenes with interactive choices.

**Features:**
- Renders scene text at the top
- Renders choice buttons at the bottom
- Auto-continue button for narrative scenes with nextScene
- Special ending display with flags
- Speaker names for dialogue scenes
- Scene type badges (narrative, dialogue, choice, investigation, ending)
- Optional typewriter effect
- Development metadata display
- Handles all scene types appropriately

**Props:**
- `scene`: Scene data object (required)
- `onChoiceSelected`: Callback when a choice is clicked (receives Choice object)
- `onContinue`: Callback for auto-continue (receives next scene ID string)
- `typewriter`: Enable typewriter effect (default: false)
- `typewriterSpeed`: Typewriter speed in ms (default: 30)
- `showChoiceNumbers`: Show numbered badges on choices (default: true)
- `className`: Custom CSS classes

**Usage:**
```tsx
import SceneRenderer from '@/components/SceneRenderer';
import { loadScene } from '@/lib/sceneLoader';

const scene = loadScene('X-0-001');

<SceneRenderer
  scene={scene}
  onChoiceSelected={(choice) => {
    // Handle scene transition
    const nextScene = loadScene(choice.nextScene);
    setCurrentScene(nextScene);
  }}
  onContinue={(nextSceneId) => {
    // Handle auto-continue for narrative scenes
    const nextScene = loadScene(nextSceneId);
    setCurrentScene(nextScene);
  }}
  typewriter={true}
  showChoiceNumbers={true}
/>
```

**Scene Type Handling:**
- **Narrative**: Shows text + "Continue" button (uses nextScene)
- **Dialogue**: Shows speaker name + text + choices
- **Choice**: Shows text + multiple choice buttons
- **Investigation**: Shows text + choices (with evidence/items)
- **Ending**: Shows text + special ending display with flags

### StoreDemo
Interactive demo component for testing the Zustand store.
Used in `/store-test` route for development.
