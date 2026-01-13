# Chaos Route B-2: Quick Reference Guide

## How to Play the Chaos Route

### Step 1: Choose Path B
At scene **X-0-016**, select Path B: The Conspiracy

### Step 2: Recruit Viktor
Navigate through scenes **B-1-016** to **B-1-020C**:
- Approach Viktor in the yard
- Choose bold dialogue: "You're wasting your strength in here. I know a way out."
- When confronted by Émile's crew, choose: "I don't need your protection, Viktor. This conversation is over."
- **SUCCESS**: Viktor is recruited with flag `viktor_recruited`

### Step 3: Form the Team
Complete Act 1 team formation at scene **B-1-040A** or **B-1-040B**

### Step 4: Choose Chaos Route
At routing scene **B-1-041**, select:
> "Chaos Route - Viktor's riot plan, violence and overwhelming force"

### Step 5: Navigate Key Choices

#### Choice 1: Accept or Modify Violence (B-2-021)
- **Full commitment**: Maximum Viktor relationship, Denis leaves
- **Modified plan**: Balanced approach, Denis stays
- **Refuse**: Viktor leaves, route ends

#### Choice 2: The Young Guard (B-2-025)
- **Help directly**: Moral high ground, lose time
- **Keep moving**: Pragmatic, maintain schedule
- **Distraction**: Clever solution, best of both

#### Choice 3: Wall Jump (B-2-028)
- **Jump immediately**: Fast but leave weak behind
- **Wait for team**: Unified escape, riskier
- **Viktor sacrifices**: Heroic ending, Viktor's fate uncertain

#### Choice 4: Mainland Crossing (B-2-031)
- **Swim**: Exhausting but immediate
- **Raft**: Clever, moderate speed
- **Monk's boat**: If available, best option
- **Cordelia**: Safest, must wait for dawn

#### Choice 5: Life After Escape (B-2-036)
- **Disappearance**: New identity → B-5-E01
- **Justice**: Prove innocence → B-5-E02
- **Liberation**: Help others escape → B-5-E05

## Key NPCs in Chaos Route

### Viktor Kozlov
- **Role**: Riot leader, tactical mind
- **Relationship**: Increases with violent choices
- **Fate**: Can survive or sacrifice himself

### Denis Archambault
- **Role**: Moral counterbalance
- **Relationship**: Decreases with violence
- **Fate**: May leave if full violence chosen

### Bastian
- **Role**: Loyal ally, team coordinator
- **Relationship**: Increases with unity choices
- **Fate**: Can sacrifice self for team

## Scenes by Section

### Planning (B-2-020 to B-2-022)
- Viktor's plan revealed
- Team positioning
- Moral commitment choice

### Execution (B-2-023 to B-2-027)
- Final preparations
- Riot erupts at 22:00
- Kitchen fires, cell releases
- Guard moral choice
- Wall climb under fire

### Escape (B-2-028 to B-2-032)
- Wall jump decision
- Viktor fate variations
- Mainland crossing options
- Team status assessment

### Resolution (B-2-035 to B-2-039)
- Mainland freedom
- Final life choices
- Viktor's legacy
- Riot aftermath
- Moral complexity explored

## Flags Required/Set

### Required to Enter
- `committed_to_team` (from B-1-040A/B)
- `viktor_recruited` (from B-1-020C)

### Set During Route
- `chaos_route_started`
- `riot_plan_revealed`
- `violence_embraced` OR `violence_minimized`
- `helped_guard` OR `ignored_guard` OR `distracted_attackers`
- `viktor_sacrificed` OR `full_team_escaped` OR `team_member_captured`
- `mainland_reached`

## Endings Available

### B-5-E01: Solo Survivor / Disappearance
Freedom with survivor's guilt, new identity

### B-5-E02: Everyone Lives / Justice Achieved
Legal vindication, corruption exposed

### B-5-E05: Viktor's Redemption / Liberation
Continued resistance, helping others escape

## Statistics

### Riot Casualties
- 5 guards killed
- 14 prisoners killed
- 17 injured

### Scene Count
- 29 total scenes (B-2-020 to B-2-039)
- 8 major choice points
- 3 distinct ending paths

### Playthrough Length
Approximately 45-60 minutes depending on reading speed

## Tips for Players

1. **Moral Complexity**: The route doesn't glorify violence. Choices have weight.

2. **Viktor's Character**: He's not evil, just pragmatic about violence.

3. **Denis's Warning**: "Violence begets violence" proves partially true.

4. **Team Unity**: Choices that keep team together are harder but more rewarding.

5. **Consequences**: Unlike some routes, deaths actually occur here.

6. **Multiple Playthroughs**: Try different moral choices to see variations.

## Comparison with Other Routes

### Chapel Route (B-2-001)
- Requires Denis instead of Viktor
- Nonviolent escape through monk passages
- No casualties
- Slower but morally clean

### Chaos Route (B-2-020)
- Requires Viktor
- Violent riot-based escape
- Significant casualties
- Faster but morally complex

### Loading Dock Route (B-2-060)
- Requires Marcel (TO BE CREATED)
- Technical, precision-based escape
- Minimal violence
- Moderate speed

## Verification

To verify the route is properly installed:
```bash
npx tsx scripts/test-chaos-route.ts
```

Expected output: All tests pass, 29 scenes verified

## Developer Notes

### Scene Files
- Main route: `/data/scenes/path-b-chaos-route.json`
- Team formation: `/data/scenes/path-b-social.json`
- Routing: Scene B-1-041 in path-b-social.json

### Integration
- Scene loader updated in `/lib/sceneLoader.ts`
- Test suite in `/scripts/test-chaos-route.ts`
- Full documentation in `CHAOS-ROUTE-SUMMARY.md`

---

**Created**: Step 64 Implementation
**Status**: Complete and verified ✅
**Playable**: Yes
**Total Scenes**: 29 (B-2-020 to B-2-039)
