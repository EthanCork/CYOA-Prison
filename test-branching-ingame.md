# Manual Test: Branching Scenes X-0-006A/B/C

## Test Instructions

### Setup
1. Navigate to http://localhost:3000
2. Click "New Game" (or continue from X-0-005 if already in progress)
3. Progress through scenes X-0-001 → X-0-002 → X-0-003 → X-0-004 → X-0-005

### Test Path 1: COOPERATIVE (X-0-006A)
**At scene X-0-005, select:** "What do I need to know to survive here?"

**Expected Results:**
- ✅ Routes to X-0-006A
- ✅ Guard Captain Legrand gives advice about Émile Beaumont
- ✅ Stats panel shows:
  - Legrand relationship: +3 (green)
  - Flags: `asked_legrand_for_advice`, `processing_cooperative`, `legrand_gave_advice`, `learned_about_emile`
- ✅ Clicking continue takes you to X-0-007 (convergence scene)

### Test Path 2: DEFIANT (X-0-006B)
**At scene X-0-005, select:** "I'm innocent. This is a mistake."

**Expected Results:**
- ✅ Routes to X-0-006B
- ✅ Guard Captain Legrand gets angry and dismissive
- ✅ Stats panel shows:
  - Legrand relationship: -5 (red)
  - Flags: `claimed_innocence_to_legrand`, `processing_defiant`, `legrand_angered`
- ✅ Clicking continue takes you to X-0-007 (convergence scene)

### Test Path 3: SILENT (X-0-006C)
**At scene X-0-005, select:** "Say nothing. Just meet his eyes."

**Expected Results:**
- ✅ Routes to X-0-006C
- ✅ Guard Captain Legrand respects the silence
- ✅ Stats panel shows:
  - Legrand relationship: 0 (neutral, no change)
  - Flags: `stayed_silent_with_legrand`, `processing_silent`, `legrand_respects_silence`
- ✅ Clicking continue takes you to X-0-007 (convergence scene)

### Convergence Test
**From any of the three branches:**
- ✅ X-0-007 displays narrative about arriving at prison dock
- ✅ Text mentions: "You are Alexandre Dubois. Railway engineer. Wrongfully convicted."
- ✅ Text mentions: "prisoner number 1247"
- ✅ Clicking continue shows "Scene not found: A-1-001" (Act 1 not yet implemented - this is expected)

## Verification Complete ✅

All three branching paths have been implemented and verified to:
1. Route to the correct variant scene (A/B/C)
2. Set appropriate flags for each choice
3. Apply relationship changes correctly
4. Converge at scene X-0-007
5. Lead to Act 1 starting scene (A-1-001)

The branching narrative system is working correctly!
