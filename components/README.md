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

### InventoryPanel
Sidebar component that displays the player's current inventory with item details and mobile-responsive collapsing.

**Features:**
- Displays all items in player's inventory
- Item icons/emojis based on category
- Color-coded by category (tool, weapon, disguise, medical, evidence, misc)
- Click to view detailed item information
- Shows item name, description, and location hint
- Empty state message when no items
- Collapsible on mobile devices
- Item count display in header
- Smooth animations and hover effects

**Props:**
- `className`: Optional custom CSS classes
- `defaultCollapsed`: Whether panel starts collapsed (default: false)

**Usage:**
```tsx
import InventoryPanel from '@/components/InventoryPanel';

// Basic usage
<InventoryPanel />

// Start collapsed (mobile)
<InventoryPanel defaultCollapsed={true} />

// With custom styling
<InventoryPanel className="max-w-md" />
```

**Item Categories & Colors:**
- 🔧 Tool (Blue) - Lockpicks, keys, rope, tools
- ⚔️ Weapon (Red) - Shiv, pipe, glass shard
- 👔 Disguise (Purple) - Uniforms, disguises
- 💊 Medical (Green) - Bandages, medicine, first aid
- 📄 Evidence (Amber) - Maps, documents, plans
- 📦 Misc (Gray) - Currency, personal items

**Integration with Game Store:**
The component automatically subscribes to inventory changes from the Zustand store:
```tsx
import { useGameStore } from '@/lib/store';

// Add items programmatically
const { addItem } = useGameStore();
addItem('rusty_spoon');
addItem('guard_keycard');

// Items will automatically appear in the InventoryPanel
```

### RelationshipPanel
Sidebar component that displays character relationships with visual progress indicators, threshold milestones, and unlock tracking.

**Features:**
- Shows all discovered characters with current relationship scores
- Color-coded by relationship level (red=hostile, yellow=neutral, green=positive)
- Grouped by category (Allies, Antagonists, Neutral, Referenced)
- Visual progress bars showing relationship score (-100 to 100)
- Expandable character cards with detailed information
- Next unlock threshold preview
- Relationship milestone tracking with checkmarks
- Character discovery system (only shows met characters)
- Emoji indicators for relationship status and categories
- Mobile-responsive collapsing
- Debug mode to show all characters

**Props:**
- `className`: Optional custom CSS classes
- `defaultCollapsed`: Whether panel starts collapsed (default: false)
- `showUndiscovered`: Debug mode to show all characters (default: false)

**Usage:**
```tsx
import RelationshipPanel from '@/components/RelationshipPanel';

// Basic usage - shows only discovered characters
<RelationshipPanel />

// Start collapsed (mobile)
<RelationshipPanel defaultCollapsed={true} />

// Debug mode - shows all characters
<RelationshipPanel showUndiscovered={true} />
```

**Character Discovery & Relationships:**
```tsx
import { useGameStore } from '@/lib/store';

// Discover a character (makes them visible in panel)
const { discoverCharacter, changeRelationship } = useGameStore();
discoverCharacter('bastian');

// Change relationship score (+/- values)
changeRelationship('bastian', 10);  // Increase by 10
changeRelationship('viktor', -5);   // Decrease by 5

// Relationships will automatically update in the RelationshipPanel
```

**Relationship Score Colors:**
- 🔥 Red (-100 to -40): Hostile, Enemy
- 🟠 Orange (-40 to -10): Unfriendly
- 🟡 Yellow (-10 to 20): Neutral, Acquaintance
- 💚 Green (20 to 60): Friendly, Good Friend
- 💙 Blue (60 to 100): Trusted Friend, Devoted Ally

**Character Categories:**
- 🤝 Allies: Characters who can help the player
- ⚠️ Antagonists: Characters who oppose the player
- 🔘 Neutral: Characters who can go either way
- 💭 Referenced: Characters mentioned but not directly interactable

**Unlock System:**
Each character has relationship thresholds that unlock new content:
- At certain scores, new story content, items, or abilities become available
- The panel shows a preview of the next unlock
- Expanded view shows all milestones with checkmarks for reached thresholds
- Unlocked content is displayed in the character's expanded details

### EvidencePanel
Sidebar component that displays collected evidence pieces for justice-focused endings. Tracks progress toward building a case against prison corruption.

**Features:**
- Shows all collected evidence with descriptions
- Progress indicator (X/9 evidence found)
- Justice path unlocked indicator (requires ≥5 pieces)
- Category badges (Corruption, Brutality, Innocence, Systemic)
- Expandable evidence cards with full details
- Evidence-specific emoji icons (📷, 💰, 🧬, etc.)
- Progress bar changes color when justice threshold met
- Hints for missing evidence
- Can be hidden until first evidence is found
- Mobile-responsive collapsing

**Props:**
- `className`: Optional custom CSS classes
- `defaultCollapsed`: Whether panel starts collapsed (default: false)
- `hideWhenEmpty`: Hide panel entirely if no evidence collected (default: false)

**Usage:**
```tsx
import EvidencePanel from '@/components/EvidencePanel';

// Basic usage - shows empty state if no evidence
<EvidencePanel />

// Hide until first evidence is found (Path C only)
<EvidencePanel hideWhenEmpty={true} />

// Start collapsed (mobile)
<EvidencePanel defaultCollapsed={true} />
```

**Evidence Collection:**
```tsx
import { useGameStore } from '@/lib/store';

// Collect evidence during investigation scenes
const { addEvidence } = useGameStore();
addEvidence('warden_ledger');
addEvidence('guard_brutality_photos');

// Evidence will automatically appear in the EvidencePanel
```

**Justice Path Requirements:**
- **Minimum Evidence**: 5 pieces (out of 9 total)
- Once threshold is met, panel shows "✓ Enough evidence for justice path"
- Progress bar changes from amber to green
- Can be used in scene requirements to gate justice endings:

```typescript
{
  requirements: {
    evidence: ['warden_ledger', 'guard_brutality_photos', 'innocence_dna_report']
  }
}
```

**Evidence Categories:**
- 💰 **Corruption**: Financial crimes, bribes, embezzlement
- ⚠️ **Brutality**: Guard violence, torture, abuse
- 🧬 **Innocence**: DNA evidence, proof of wrongful conviction
- 📋 **Systemic**: Missing prisoners, conspiracies, cover-ups

**Progress Tracking:**
```tsx
import { getEvidenceProgress, hasEnoughEvidenceForJustice } from '@/lib/evidenceLoader';

const progress = getEvidenceProgress(collectedEvidence);
// { collected: 5, total: 9, percentage: 56 }

const canPursueJustice = hasEnoughEvidenceForJustice(collectedEvidence);
// true if ≥5 pieces collected
```

### PathIndicator
Displays the player's current path selection (A, B, or C) with visual styling and path information.

**Features:**
- Shows current path icon, name, and approach
- Color-coded by path (blue=Night, green=Social, amber=Justice)
- Optional full description display
- Compact mode for minimal display
- Placeholder state when no path is selected
- Can be hidden until path is selected
- Accessible with ARIA labels
- Responsive design

**Props:**
- `className`: Optional custom CSS classes
- `compact`: Show minimal version (default: false)
- `hideWhenUnselected`: Hide if no path selected (default: false)
- `showDescription`: Show full path description (default: false)

**Usage:**
```tsx
import PathIndicator from '@/components/PathIndicator';

// Full display with description
<PathIndicator showDescription={true} />

// Compact badge display
<PathIndicator compact={true} />

// Hide until path is selected
<PathIndicator hideWhenUnselected={true} />
```

**Path Types:**
- 🌙 **Path A (Night)**: Stealth and infiltration approach
- 🤝 **Path B (Social)**: Social manipulation and alliances
- ⚖️ **Path C (Day/Justice)**: Investigation and evidence gathering

**Integration with Game Store:**
```tsx
import { useGameStore } from '@/lib/store';

// Get current path
const { currentPath } = useGameStore();
// currentPath is 'A' | 'B' | 'C' | null

// Set path at branching point (scene X-0-014)
const { setPath } = useGameStore();
setPath('A'); // Choose stealth path
```

### PathSelector
Interactive component for choosing one of three main story paths. Displays path information and provides recommendations based on collected items, evidence, and relationships.

**Features:**
- Displays all three paths with full descriptions
- Path recommendation system based on game state
- Visual selection with color-coded cards
- Confirmation before setting path
- Shows which path is recommended with ⭐ badge
- Can change path after initial selection
- Click to select, button to confirm
- Responsive card layout

**Props:**
- `onPathSelected`: Callback when path is confirmed (receives path 'A' | 'B' | 'C')
- `className`: Optional custom CSS classes
- `showRecommendation`: Show recommended path (default: true)

**Usage:**
```tsx
import PathSelector from '@/components/PathSelector';

<PathSelector
  onPathSelected={(path) => {
    console.log(`Player chose path ${path}`);
    // Navigate to first path-specific scene
    goToScene(`${path}-1-001`);
  }}
  showRecommendation={true}
/>
```

**Recommendation Logic:**
The component analyzes current game state to suggest a path:
- **Path A**: Recommended if player has stealth items (lockpick, dark clothes)
- **Path B**: Recommended if player has high relationships (≥50 score with multiple NPCs)
- **Path C**: Recommended if player has collected evidence

**Path Selection Scene:**
- Scene ID: `X-0-014` (defined in `getPathSelectionSceneId()`)
- This is the branching point where paths diverge
- Before this scene: Only shared (X-) scenes accessible
- After this scene: Path-specific scenes become available

**Path-Based Scene Access:**
```tsx
import { canAccessScene } from '@/lib/pathUtils';

// Check if player can access a scene
const canAccess = canAccessScene('A-1-015', currentPath);
// Returns true only if currentPath is 'A' or scene is shared (X-)

// Shared scenes (X-) are accessible from all paths
const sharedAccess = canAccessScene('X-2-010', 'B'); // Always true
```

### StoreDemo
Interactive demo component for testing the Zustand store.
Used in `/store-test` route for development.
