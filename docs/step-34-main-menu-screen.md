# Step 34: Main Menu Screen

## Overview

Implemented a dark, atmospheric title screen and main menu for "El Palo de Queso: A Prison Escape in 58 Endings" with full integration to the game's save/load systems.

## Implementation Summary

### 1. MainMenu Component

Created a comprehensive main menu component ([components/MainMenu.tsx](../components/MainMenu.tsx)) featuring:

#### Visual Design
- Dark gradient background (gray-900 → gray-800 → black)
- Atmospheric vignette effect for prison atmosphere
- Large, bold title with gradient text effect
- Subtitle highlighting the 58 endings
- Shadow effects for depth and atmosphere
- Responsive layout centered on screen

#### Menu Options

**New Game Button**
- Red gradient styling (red-900 to red-700)
- Integrates with NewGameButton component
- Shows confirmation if player has progress
- Navigates to `/game` on confirmation

**Continue Button**
- Blue gradient styling
- Enabled only when auto-save exists
- Shows "(Auto-Save)" label when available
- Loads auto-save and continues game
- Disabled state (gray) when no auto-save

**Load Game Button**
- Purple gradient styling
- Opens SaveLoadMenu modal
- Allows loading from manual save slots
- Cancel button to close modal

**Settings Button** (optional)
- Gray gradient styling
- Opens settings modal with:
  - Text Speed selection
  - Auto-Save toggle
  - Sound Effects checkbox
- Can be hidden with `showSettingsButton={false}`

#### Props

```typescript
interface MainMenuProps {
  /** Callback when game starts */
  onStartGame?: () => void;
  /** Show settings button */
  showSettingsButton?: boolean;
}
```

### 2. Page Route

Created menu page at [/menu](http://localhost:3000/menu) ([app/menu/page.tsx](../app/menu/page.tsx)):
- Simple wrapper around MainMenu component
- Provides callback for game start event
- Can be extended with additional logic

### 3. Styling Enhancements

Added atmospheric CSS utilities ([app/globals.css](../app/globals.css)):

```css
/* Text shadow for dramatic effect */
.text-shadow-lg {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8),
               0 2px 10px rgba(0, 0, 0, 0.6);
}

/* Pulsing glow animation for active elements */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
}
```

### 4. Integration with Game Systems

#### Save/Load Integration
- **Auto-Save Detection**: Checks `hasAutoSaveData()` to enable/disable Continue
- **Load Auto-Save**: Calls `loadFromAutoSave()` on Continue
- **Manual Saves**: Opens SaveLoadMenu for slot-based loading
- **New Game**: Uses NewGameButton with progress detection

#### Navigation
- Uses Next.js router for navigation
- Routes to `/game` when starting/continuing
- Maintains game state through transitions

#### State Management
- Connects to Zustand game store
- Checks for existing progress
- Loads save data before navigation

### 5. Tests

Comprehensive test suite with 17 passing tests ([components/__tests__/MainMenu.test.tsx](../components/__tests__/MainMenu.test.tsx)):

**Rendering Tests:**
- Title and subtitle display
- All menu buttons present
- Footer message
- Atmospheric elements

**State Tests:**
- Continue button disabled without auto-save
- Continue button enabled with auto-save
- Auto-save label visibility

**Interaction Tests:**
- Load Game menu opening/closing
- Settings modal opening/closing
- New Game navigation and callback
- Continue game flow and state restoration
- Settings button visibility toggle

Run tests with:
```bash
npm test -- components/__tests__/MainMenu.test.tsx
```

## Key Features

### Atmospheric Prison Theme
- Dark color palette (blacks, grays)
- Gradient backgrounds for depth
- Vignette effect creating focus
- Shadow effects for drama
- Prison-themed visual language

### Smart Continue Button
Automatically detects auto-save:
```typescript
const canContinue = hasAutoSaveData();
```
- Enabled when auto-save exists
- Disabled with gray styling when no save
- Shows helpful label "(Auto-Save)"

### Modal System
Two modal types:
1. **Load Game Modal**: Full SaveLoadMenu with cancel option
2. **Settings Modal**: In-component settings configuration

Both use consistent styling:
- Black transparent backdrop
- Centered positioning
- Gray-800 background
- Border and shadow effects

### Settings Options (Placeholder)
Current settings include:
- **Text Speed**: Slow, Medium, Fast, Instant
- **Auto-Save**: Enabled, Disabled
- **Sound Effects**: Checkbox toggle

*Note: Settings are currently UI-only, functional implementation in future steps*

## Usage Examples

### Basic Usage
```tsx
import MainMenu from '@/components/MainMenu';

export default function MenuPage() {
  return <MainMenu />;
}
```

### With Callback
```tsx
import MainMenu from '@/components/MainMenu';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handleGameStart = () => {
    console.log('Starting game...');
    // Additional setup logic here
  };

  return <MainMenu onStartGame={handleGameStart} />;
}
```

### Without Settings
```tsx
<MainMenu showSettingsButton={false} />
```

## Navigation Flow

```
Main Menu
├── New Game → Confirmation (if progress) → /game
├── Continue → Load Auto-Save → /game
├── Load Game → SaveLoadMenu Modal
│   ├── Load Slot → /game
│   └── Cancel → Close Modal
└── Settings → Settings Modal
    └── Close → Close Modal
```

## Visual Hierarchy

1. **Title** (Largest, Center)
   - "EL PALO DE QUESO" in gradient
   - Subtitle below in gray-400

2. **Menu Buttons** (Centered, Vertical Stack)
   - New Game (Red) - Primary action
   - Continue (Blue/Gray) - Secondary action
   - Load Game (Purple) - Tertiary action
   - Settings (Gray) - Utility action

3. **Footer** (Smallest, Bottom)
   - "Use headphones for the best experience"

## Color Coding

- **Red**: Destructive/New (New Game)
- **Blue**: Continue/Primary (Continue)
- **Purple**: Load/Secondary (Load Game)
- **Gray**: Utility (Settings, Disabled)

## Accessibility

- Disabled states clearly indicated
- Hover states for all interactive elements
- Consistent spacing and sizing
- High contrast text
- Semantic HTML structure

## Browser Compatibility

Uses standard CSS features:
- Gradients (well-supported)
- Flexbox (well-supported)
- CSS animations (well-supported)
- Tailwind classes (compiled to standard CSS)

## Performance Considerations

- Minimal JavaScript
- CSS-only animations
- Lazy modals (only rendered when open)
- Optimized background effects

## Files Created/Modified

### Created Files
- [components/MainMenu.tsx](../components/MainMenu.tsx) - Main menu component
- [app/menu/page.tsx](../app/menu/page.tsx) - Menu page route
- [components/__tests__/MainMenu.test.tsx](../components/__tests__/MainMenu.test.tsx) - Component tests

### Modified Files
- [app/globals.css](../app/globals.css) - Added atmospheric styling utilities

## Testing the Implementation

1. Visit [http://localhost:3000/menu](http://localhost:3000/menu)
2. Observe the atmospheric dark theme
3. Try clicking each button:
   - **New Game**: Should navigate to /game (no confirmation if fresh)
   - **Continue**: Should be disabled initially
   - **Load Game**: Opens save/load modal
   - **Settings**: Opens settings modal
4. Create some progress and return to menu
5. **Continue** should now be enabled with "(Auto-Save)" label
6. Click **New Game** - should show confirmation dialog

## Future Enhancements

### Potential Additions
- Background music/sound
- Animated title effects
- Achievement/stats preview
- Quick stats display (playtime, endings found)
- Difficulty selection
- Language selection
- Volume sliders
- Accessibility options
- Credits button
- Prison bar animation overlay

### Settings Implementation
Current settings are UI-only. Future steps will:
- Create settings store/context
- Wire up text speed to game engine
- Implement auto-save toggle functionality
- Add sound effect system
- Persist settings to localStorage

## Integration Points

The MainMenu can be used as:
1. **Entry Point**: Default app route
2. **Pause Menu**: In-game menu overlay
3. **Game Over Screen**: With modified messaging
4. **Credits Screen**: With additional content

## Summary

Step 34 is complete with:
- ✅ MainMenu component with all options
- ✅ Dark, atmospheric prison theme
- ✅ Game title and subtitle display
- ✅ New Game integration
- ✅ Continue (auto-save) functionality
- ✅ Load Game modal
- ✅ Settings modal (UI)
- ✅ Page route at /menu
- ✅ Atmospheric styling and effects
- ✅ Full save/load system integration
- ✅ Smart button state management
- ✅ Comprehensive tests (17 passing)
- ✅ Complete documentation

The main menu provides a polished, atmospheric entry point to "El Palo de Queso" with seamless integration to all game systems.
