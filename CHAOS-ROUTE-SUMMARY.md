# Chaos Route B-2 Implementation Summary

## Overview
Successfully implemented the Chaos Route (B-2-020 to B-2-039) for Path B: The Conspiracy. This route is triggered when Viktor is recruited and provides a violent, riot-based escape sequence.

## Implementation Details

### Files Created/Modified
1. **NEW FILE**: `/data/scenes/path-b-chaos-route.json`
   - 29 new scenes (B-2-020 to B-2-039)
   - Riot mechanics and chaos sequences
   - Moral choice system during violence
   - Multiple Viktor fate variations

2. **MODIFIED**: `/lib/sceneLoader.ts`
   - Added import for `path-b-chaos-route.json`
   - Integrated chaos route scenes into scene cache

3. **MODIFIED**: `/data/scenes/path-b-social.json`
   - Updated B-1-040A and B-1-040B to route to B-1-041
   - Added B-1-041 routing scene for method selection

4. **NEW FILE**: `/scripts/test-chaos-route.ts`
   - Comprehensive test suite for chaos route verification

## Scene Structure

### Entry Requirements
- **Scene**: B-2-020
- **Requirements**:
  - `committed_to_team` flag (from B-1-040A/B)
  - `viktor_recruited` flag (from B-1-020C)
- **Access**: Via B-1-041 routing choice

### Key Scenes & Features

#### B-2-020 - 022: Plan Formation
- Viktor presents riot plan
- Moral choice: Accept violence / Modify for less casualties / Refuse
- Denis can leave if violence is embraced
- Three distinct branches based on player's commitment level

#### B-2-023 - 024: Final Preparations & Riot Triggers
- Kitchen fires initiated
- Cell blocks released
- Riot erupts at 22:00 hours
- Chaos spreads across prison

#### B-2-025 - 026: Moral Choice - The Young Guard
Three options when witnessing guard in danger:
1. **Help directly** - Intervene, save guard, lose time
2. **Keep moving** - Pragmatic, maintain schedule, ignore suffering
3. **Distraction** - Clever solution, minimal delay, guard saved

#### B-2-027 - 028: Wall Escape & Team Unity
- Climbing scaffolding under fire
- Marcel can be wounded
- Choice at the wall: Jump immediately vs. wait for team

#### B-2-029: Viktor's Fate - Three Variations
1. **B-2-029A - Immediate Jump**
   - Team jumps, one member left behind
   - Faster but someone captured
   - Sets flags: `team_member_captured`, `guilt_carried`

2. **B-2-029B - Wait for Everyone**
   - Unified escape, everyone makes it
   - Harder but morally superior
   - Sets flags: `full_team_escaped`, `unity_maintained`

3. **B-2-029C - Viktor's Sacrifice**
   - Viktor draws fire, team escapes
   - Heroic ending, Viktor's fate unknown
   - Sets flags: `viktor_sacrificed`, `viktor_fate_unknown`

#### B-2-030 - 032: Mainland Crossing
Four options for crossing to mainland:
- Swim immediately (exhausting, fast)
- Build makeshift raft (clever, moderate)
- Use monk's boat if available (safest, fastest)
- Wait for Cordelia's fishing boat (safest, slowest)

#### B-2-035 - 037: Final Choices & Endings
Three life paths after escape:
1. **Disappearance** (B-2-037A → B-5-E01)
   - New identity, quiet life
   - Survivor's guilt

2. **Justice** (B-2-037B → B-5-E02)
   - Legal battle, prove innocence
   - Expose corruption

3. **Liberation** (B-2-037C → B-5-E05)
   - Return to help others escape
   - Freedom fighter path

#### B-2-038 - 039: Epilogues
- Viktor's legacy honored
- Riot aftermath explored
- Moral complexity acknowledged
- Consequences of violence examined

## Key Mechanics

### Flags Set Throughout Route
- `chaos_route_started`
- `riot_plan_revealed`
- `violence_embraced` / `violence_minimized`
- `guards_encountered`
- `helped_guard` / `ignored_guard` / `distracted_attackers`
- `viktor_sacrificed` / `full_team_escaped`
- `mainland_reached`
- Various ending-specific flags

### Relationship Changes
- **Viktor**: Increases with violent choices, commitment to chaos
- **Denis**: Decreases with violence, can leave route entirely
- **Bastian**: Increases with team unity decisions
- **Guards**: Young guard can remember mercy shown

### Moral Choice System
The chaos route features multiple moral dilemmas:
1. Accept full violence vs. minimize casualties
2. Help endangered guard vs. prioritize escape
3. Leave weak behind vs. risk all for unity
4. Viktor's sacrifice vs. team coordination

### Consequences
- 5 guards died, 14 prisoners died in riot
- Military response triggered in some paths
- Denis remains inside, maintains chapel route
- Viktor can become gym owner or die as hero
- Player carries weight of violence used

## Testing & Verification

### Test Results
✅ All 29 chaos route scenes load correctly
✅ Routing scene (B-1-041) properly gates access
✅ Viktor recruitment path verified
✅ Moral choice scenes functional
✅ Viktor fate variations implemented
✅ Ending connections verified
✅ Total scene count: 318 (increased from 288)

### Playability Requirements
To access chaos route, player must:
1. Choose Path B at X-0-016
2. Recruit Viktor successfully (B-1-020C)
   - Requires showing courage, not seeking protection
3. Commit to team pact (B-1-040A or B-1-040B)
4. Choose "Chaos Route" at B-1-041

## Integration with Existing Routes

### Chapel Route (B-2-001)
- Requires `denis_recruited` flag
- Nonviolent alternative
- Can be chosen if Denis recruited instead of Viktor

### Loading Dock Route (B-2-060)
- Requires `marcel_recruited` flag
- Technical approach (TO BE CREATED)
- Third option in routing scene

### Routing Logic (B-1-041)
```
B-1-040A/B → B-1-041 (Method Choice)
  ├─ denis_recruited → B-2-001 (Chapel Route)
  ├─ viktor_recruited → B-2-020 (Chaos Route) ✅
  └─ marcel_recruited → B-2-060 (Loading Dock)
```

## Character Development: Viktor Kozlov

### Background
- Former boxer, killed in illegal fight
- 41 years old, physically imposing
- Sees prison as war, violence as tool

### Recruitment Path
- B-1-016: Initial approach in yard
- B-1-017: Viktor's challenge
- B-1-018A/B/C: Three approach methods
- B-1-019: Test of courage vs. Émile's crew
- B-1-020C: **SUCCESS** - Shows courage, earns respect

### Character Arc in Chaos Route
1. **Tactical Leader**: Orchestrates riot with precision
2. **Moral Conflict**: Challenges player's comfort with violence
3. **Sacrifice Potential**: Can die saving team
4. **Redemption**: Post-escape, either disappears or helps youth

### Viktor's Philosophy
- "Freedom has a price. Sometimes that price is blood."
- "Strength without direction is just destruction."
- "When steel meets flesh, all clever planning means nothing."

## Thematic Elements

### Violence vs. Nonviolence
The chaos route directly contrasts with Denis's chapel route:
- Denis: "Violence begets violence. Freedom through violence is no freedom."
- Viktor: "Every day in prison is slow death. Blood spilled for freedom is justified."

### Player Agency
Multiple opportunities to:
- Minimize casualties while accepting chaos
- Show mercy during violence
- Maintain team unity vs. expedience
- Choose life path after escape

### Consequences
The route doesn't glorify violence:
- Deaths occur (guards and prisoners)
- Moral weight carried
- Viktor's fate uncertain in heroic ending
- Denis's path proven partially right

## Future Enhancements (Optional)

### Potential Additions
1. More Denis reactions if he's recruited but chaos route chosen
2. Additional Marcel scenes during riot if he's present
3. Émile's role during chaos if he was recruited
4. Claude's potential betrayal during riot
5. Warden's direct confrontation scene

### Ending Expansions
Could create specific chaos route endings:
- B-5-E09: Viktor's Redemption (expanded)
- B-5-D03: Caught in Crossfire (expanded)
- B-5-C04: Viktor's Rampage (military called)

## Conclusion

The Chaos Route B-2 is now fully implemented and playable. It provides:
- 29 interconnected scenes
- Multiple moral choice points
- Character-driven narrative
- Consequence-rich gameplay
- Three distinct ending paths
- Full integration with Path B structure

The route requires Viktor recruitment and offers a violent but character-focused alternative to the peaceful chapel route, while maintaining the moral complexity and consequence system that defines CYOA-Prison.

**Status**: ✅ Complete and verified
**Playable**: Yes, when Viktor recruited via B-1-020C
**Scene Count**: 29 (B-2-020 to B-2-039)
**Total Scenes**: 318 (increased from 288)
