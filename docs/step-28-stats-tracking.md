# Step 28: Game Stats Tracking

## Overview
Implemented comprehensive game statistics tracking system for end-game display. Stats are automatically tracked as the player progresses through the game.

## Features Implemented

### 1. Stats Types (`types/game.ts`)
Added `GameStats` interface with 8 tracked statistics:
- `scenesVisited`: Number of unique scenes encountered
- `choicesMade`: Total decisions made
- `itemsFound`: New items added to inventory
- `relationshipsMaxed`: Characters at 100 relationship score
- `relationshipsMinned`: Characters at -100 relationship score
- `stageReached`: Highest day reached (Path C)
- `pathTaken`: Which story path was chosen (A/B/C)
- `playTimeSeconds`: Optional play time tracking

### 2. Automatic Stat Tracking (`lib/store.ts`)
Stats are automatically updated by existing store actions:
- **`goToScene()`** - Tracks unique scenes visited using Set
- **`transitionToScene()`** - Tracks both scenes visited and choices made
- **`addItem()`** - Increments itemsFound for new items (no duplicates)
- **`changeRelationship()` & `setRelationship()`** - Tracks relationships at ±100
- **`setPath()`** - Records which path was taken
- **`advanceToNextPeriod()`** - Tracks highest day reached
- **`resetGame()`** - Resets all stats to zero

### 3. Stats Utility Functions (`lib/statsUtils.ts`)
Created 25+ utility functions for stats analysis and display:

#### Formatting Functions
- `formatNumber()` - Format with commas (1,234,567)
- `formatPlayTime()` - Convert seconds to h/m/s
- `getPathDisplayName()` - "Path A: Power"
- `getPathIcon()` - Get emoji for path
- `getPathColor()` - Get color for path

#### Analysis Functions
- `getCompletionPercentage()` - Calculate % complete
- `getEngagementLevel()` - Cautious → Engaged → Invested → Completionist
- `getCollectorRank()` - Minimalist → Novice → Skilled → Expert → Master
- `getRelationshipMastery()` - Analyze allies vs enemies
- `getStageDescription()` - Describe progress through days
- `calculateGameScore()` - Weighted score calculation
- `getGameRank()` - Newcomer → Survivor → Strategist → Master Planner → Legend

#### Milestone System
- `checkMilestones()` - Check which achievements are unlocked
- `getAchievedMilestones()` - Get list of unlocked achievements
- 11 total milestones:
  - First Choice, Decision Maker (10 choices)
  - First Find, Master Collector (20+ items)
  - First Ally, Diplomat (3+ maxed)
  - First Enemy, Antagonist (3+ minned)
  - Midpoint (Day 3), The End (Day 6)
  - Completionist (100+ choices)

### 4. StatsPanel Component (`components/StatsPanel.tsx`)
Display component with two modes:

#### Full View
- Overall rank and score display
- 4 stat cards: Scenes, Choices, Items, Relationships
- Progress indicators with bars
- Story progress (day reached)
- Play time display
- Achievement grid (11 milestones)

#### Compact View
- Minimal 2x2 grid
- Just the core numbers
- Perfect for sidebar display

Props:
- `className` - Custom styling
- `compact` - Compact mode toggle
- `showMilestones` - Show/hide achievements

### 5. Comprehensive Tests
Created 85 passing tests across 2 test files:

#### `lib/__tests__/statsUtils.test.ts` (53 tests)
- Formatting functions (numbers, time)
- Path display functions
- Completion percentage calculations
- Engagement, collector, and relationship analysis
- Stage descriptions and game scoring
- Milestone checking and achievement tracking

#### `lib/__tests__/statsStore.test.ts` (32 tests)
- Initial state verification
- Scene tracking (unique count, history)
- Choice tracking (with/without choices)
- Item tracking (duplicates handled)
- Relationship tracking (maxed and minned)
- Path tracking
- Stage progression tracking
- Reset game functionality
- Integration scenarios
- Edge cases

### 6. Interactive Demo (`app/stats-demo/page.tsx`)
Comprehensive demo with:
- Individual action buttons (visit scene, make choice, find item, etc.)
- Batch action buttons (10 choices, 5 items, full gameplay simulation)
- Full stats panel display
- Compact stats panel display
- Raw stats data grid
- Calculated summary display
- Achievement showcase
- Documentation section

## Technical Implementation

### Unique Scene Counting
```typescript
const allVisitedScenes = new Set([...state.sceneHistory, state.currentScene, nextSceneId]);
const scenesVisited = allVisitedScenes.size;
```
Uses Set to automatically handle uniqueness.

### Relationship Tracking
```typescript
const relationshipsMaxed = Object.values(updatedRelationships).filter(
  (score) => score === 100
).length;
const relationshipsMinned = Object.values(updatedRelationships).filter(
  (score) => score === -100
).length;
```
Counts relationships at exactly ±100.

### Stage Tracking (Highest Day)
```typescript
const stageReached = nextTime
  ? Math.max(state.stats.stageReached, nextTime.day)
  : state.stats.stageReached;
```
Tracks maximum day reached, never decreases.

### Score Calculation (Weighted)
```typescript
const score =
  stats.scenesVisited * 1 +
  stats.choicesMade * 2 +
  stats.itemsFound * 3 +
  stats.relationshipsMaxed * 5 +
  stats.relationshipsMinned * 3 +
  stats.stageReached * 10;
```
Higher weights for more impactful stats.

## Files Created/Modified

### Created
- `lib/statsUtils.ts` - 25+ utility functions (370 lines)
- `components/StatsPanel.tsx` - Display component (175 lines)
- `lib/__tests__/statsUtils.test.ts` - 53 tests (512 lines)
- `lib/__tests__/statsStore.test.ts` - 32 tests (498 lines)
- `app/stats-demo/page.tsx` - Interactive demo (434 lines)
- `docs/step-28-stats-tracking.md` - This documentation

### Modified
- `types/game.ts` - Added GameStats interface
- `types/index.ts` - Export GameStats type
- `lib/store.ts` - Added automatic stat tracking to 7 functions

## Test Results
```
✓ lib/__tests__/statsUtils.test.ts (53 tests)
✓ lib/__tests__/statsStore.test.ts (32 tests)

Test Suites: 2 passed
Tests:       85 passed
Time:        0.54s
```

## Usage Examples

### Access Current Stats
```typescript
const stats = useGameStore((state) => state.stats);
```

### Display Stats Panel
```typescript
// Full view with achievements
<StatsPanel showMilestones={true} />

// Compact view
<StatsPanel compact={true} showMilestones={false} />
```

### Get Stats Summary
```typescript
import { getStatsSummary } from '@/lib/statsUtils';

const summary = getStatsSummary(stats);
console.log(summary.rank.rank); // "Strategist"
console.log(summary.score); // 245
```

### Check Achievements
```typescript
import { getAchievedMilestones } from '@/lib/statsUtils';

const achievements = getAchievedMilestones(stats);
console.log(achievements.length); // 5 achievements unlocked
```

## Demo Access
Visit `/stats-demo` to see:
- Live stat tracking
- Simulation controls
- Full and compact displays
- Raw data view
- Calculated summaries
- Achievement showcase

## Key Benefits

1. **Automatic Tracking** - No manual stat updates needed
2. **Comprehensive** - 8 core stats + 11 milestones
3. **Well-Tested** - 85 passing tests
4. **Flexible Display** - Full and compact modes
5. **Gamification** - Ranks, levels, and achievements
6. **Performance** - Efficient Set-based uniqueness tracking

## Next Steps
- Stats can be displayed at game end
- Add playTimeSeconds tracking with timer
- Consider adding more milestones
- Export stats to JSON for save system
- Add stats comparison between playthroughs

## Verification

### Build Status
✓ No TypeScript errors
✓ No linting errors in Step 28 files
✓ All tests passing

### Demo Status
✓ Interactive controls work
✓ Stats update in real-time
✓ Achievements unlock correctly
✓ Full and compact modes render properly
