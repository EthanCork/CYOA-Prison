# Leverage Route B-2: Quick Reference Guide

## How to Play the Leverage Route

### Step 1: Choose Path B
At scene **X-0-016**, select Path B: The Conspiracy

### Step 2: Recruit Émile
Navigate through scenes **B-1-026** to **B-1-030A**:
- Approach Émile in cafeteria (public or private)
- Present proposition: "Work with me. Full partnership. We escape together or not at all."
- **SUCCESS**: Émile is recruited with flag `emile_recruited`
- Émile provides 3 years of corruption documentation

### Step 3: Form the Team
Complete Act 1 team formation at scene **B-1-040A** or **B-1-040B**

### Step 4: Choose Leverage Route
At routing scene **B-1-041**, select:
> "Leverage Route - Émile's blackmail plan, walk out with inside help"

### Step 5: Navigate Key Choices

#### Choice 1: Evidence Target (B-2-041)
Select which corruption to document:
- **Captain Moreau**: Drug bribe photo (moderate risk, strong leverage)
- **Sergeant Laurent**: Falsified reports (low risk, systematic proof)
- **Warden Dubois**: Financial records (high risk, maximum impact)

#### Choice 2: Confrontation Style (B-2-044)
How to blackmail Captain Moreau:
- **Aggressive**: Dominate, force compliance (hostile ally)
- **Diplomatic**: Mutual benefit, genuine cooperation (Denis approves)
- **Cautious**: Measured reveal, stable arrangement (balanced)

#### Choice 3: Escape Network (B-2-049)
How to disappear on mainland:
- **Émile's criminals**: Fast, 20k debt, criminal obligations
- **Cordelia's family**: Slow, safe, legitimate (recommended)
- **Marcel's forgers**: Thorough, 30k cost, complete reinvention

#### Choice 4: Moral Reflection (B-2-056)
How do you view the blackmail:
- **No regrets**: Pragmatic, system deserved it
- **Mixed feelings**: Necessary but gray (growth path)
- **Deep regrets**: Became what we fought, seek redemption

## Key NPCs in Leverage Route

### Émile Beaumont
- **Role**: Information broker, corruption expert
- **Relationship**: Purely transactional, no loyalty
- **Philosophy**: Information is power, morality is weakness
- **Fate**: Uses criminal network for new life

### Captain Moreau
- **Role**: Target, then reluctant ally
- **Corruption**: Takes drug smuggler bribes
- **Outcome**: Arrested 3 weeks post-escape (despite promises)
- **Fate**: Imprisoned, becomes what he guarded

### Bastian
- **Role**: Moral compass, team coordinator
- **Sister**: Cordelia (safe house option)
- **Fate**: New identity, stays in contact

### Denis (if recruited)
- **Role**: Moral opposition to blackmail
- **Reaction**: Troubled by manipulation tactics
- **Approval**: Increases with diplomatic approach

## Scenes by Section

### Evidence Gathering (B-2-040 to B-2-042)
- Émile reveals corruption list
- Choose investigation target
- Gather photographic/documentary evidence
- Risk of discovery (especially Warden route)

### Confrontation (B-2-043 to B-2-045)
- Plan blackmail strategy
- Approach Captain Moreau
- Force cooperation through leverage
- Establish inside help

### Official Escape (B-2-046 to B-2-048)
- Transfer papers forged
- Walk out as "psychiatric transfers"
- Medical transport boat
- Checkpoint inspection (tense)

### Mainland Disappearance (B-2-049 to B-2-050)
- Choose escape network
- New identity creation
- Payment arrangements
- Set up new life

### Aftermath (B-2-055 to B-2-059)
- Moreau arrested (broken promise)
- Moral reflection
- Choose life path
- Epilogue: systemic change triggered

## Flags Required/Set

### Required to Enter
- `committed_to_team` (from B-1-040A/B)
- `emile_recruited` (from B-1-030A)

### Set During Route
- `leverage_route_started`
- `corruption_evidence_revealed`
- `targeting_captain` OR `targeting_sergeant` OR `targeting_warden`
- `captain_evidence_obtained` (or sergeant/warden variants)
- `moreau_dominated` OR `moreau_cooperating` OR `moreau_cautiously_allied`
- `inside_help_secured`
- `checkpoint_passed`
- Network flags: `used_emile_contacts` / `used_cordelia_network` / `used_marcel_forgers`
- Moral flags: `no_regrets` / `mixed_feelings` / `deep_regrets`

## Items Obtained

- `emile_corruption_list` - Initial documentation
- `moreau_bribe_photo` OR `laurent_original_reports` OR `warden_financial_records`
- `transfer_papers_forged` - Official escape documents

## Endings Available

### B-5-E07: Political Escape
- Walked out with forged papers
- Systemic corruption exposed
- All targets imprisoned
- Morally complex victory

## Statistics

### Violence Level
- **Zero physical deaths** (unique among routes)
- **Zero physical violence** (psychological only)
- Career destroyed: 1 (Moreau)
- Imprisoned: Multiple guards

### Scene Count
- 23 total scenes (B-2-040 to B-2-059)
- 3 evidence branches
- 3 confrontation styles
- 3 escape networks
- 3 moral outcomes

### Success Requirements
- Émile recruited (B-1-030A)
- Team commitment (B-1-040A/B)
- Evidence gathering (one target minimum)
- Moreau cooperation (any style)

## Moral Complexity

### Ethical Dilemmas
1. **Blackmail**: Is coercion justified against corrupt system?
2. **Broken Promises**: Moreau arrested despite deal
3. **Systemic Change**: Good ends through bad means?
4. **Character Cost**: Did we become what we fought?

### Character Growth Paths
- **Pragmatist**: Embrace information warfare, no regrets
- **Conflicted**: Acknowledge gray area, manage guilt
- **Redeemer**: Carry burden, seek to balance scales

## Comparison with Other Routes

### vs. Chapel Route (Denis)
- **Method**: Blackmail vs. monk passages
- **Violence**: Psychological vs. none
- **Morality**: Gray vs. clean
- **Speed**: Weeks vs. days

### vs. Chaos Route (Viktor)
- **Deaths**: 0 vs. 19
- **Escape**: Official papers vs. wall breach
- **Evidence**: Information vs. force
- **Aftermath**: Arrests vs. chaos

### vs. Loading Dock (Marcel - TBC)
- **Approach**: Social engineering vs. technical
- **Risk**: Reputational vs. physical
- **Tools**: Evidence vs. keys
- **Style**: Manipulation vs. precision

## Tips for Players

1. **Choose Diplomatic**: Most stable outcome, Denis approves

2. **Target Warden**: Highest impact for ending but riskiest gathering

3. **Use Cordelia Network**: No criminal debt, legitimate escape

4. **Accept Moral Complexity**: Route designed for gray area exploration

5. **Émile Stays Transactional**: He never becomes true friend

6. **Promises Mean Nothing**: Moreau's arrest shows information spreads

7. **Unintended Consequences**: Your blackmail triggers reform

## Verification

To verify the route is properly installed:
```bash
npx tsx scripts/test-leverage-route.ts
```

Expected output: All tests pass, 23 scenes verified

## Developer Notes

### Scene Files
- Main route: `/data/scenes/path-b-leverage-route.json`
- Team formation: `/data/scenes/path-b-social.json`
- Routing: Scene B-1-041 in path-b-social.json

### Integration
- Scene loader updated in `/lib/sceneLoader.ts`
- Test suite in `/scripts/test-leverage-route.ts`
- Full documentation in `LEVERAGE-ROUTE-SUMMARY.md`

### Unique Features
- Only route with zero violence
- Official escape mechanism (forged papers)
- Psychological warfare focus
- Systemic change triggered as side effect

---

**Created**: Step 65 Implementation
**Status**: Complete and verified ✅
**Playable**: Yes
**Total Scenes**: 23 (B-2-040 to B-2-059)
**Total Game Scenes**: 341
