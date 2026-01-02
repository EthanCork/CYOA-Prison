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

### StoreDemo
Interactive demo component for testing the Zustand store.
Used in `/store-test` route for development.
