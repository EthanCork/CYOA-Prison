# EL PALO DE QUESO
## Complete Game Bible & Implementation Guide
### A 433-Scene, 58-Ending Prison Escape Interactive Fiction

---

# TABLE OF CONTENTS

**PART 1: FOUNDATION (This Section)**
- 1.1 Game Overview
- 1.2 Core Characters (12 total)
- 1.3 Locations (15 areas)
- 1.4 Items & Evidence (40+ items)
- 1.5 Relationship System
- 1.6 The Three Paths

**PART 2: COMPLETE SCENE MAP**
- 2.1 Scene Numbering System
- 2.2 Act 0: The Opening (15 shared scenes)
- 2.3 Path A: Night Escape (100 scenes)
- 2.4 Path B: Social Route (120 scenes)
- 2.5 Path C: Day Escape (213 scenes)

**PART 3: ALL 58 ENDINGS**
- 3.1 Death Endings (12)
- 3.2 Capture Endings (12)
- 3.3 Escape Endings (22)
- 3.4 Justice Endings (12)

**PART 4: TECHNICAL IMPLEMENTATION**
- 4.1 Data Structures
- 4.2 State Management
- 4.3 Scene Transition Logic
- 4.4 Placeholder System

**PART 5: STEP-BY-STEP BUILD GUIDE**
- 5.1 Week 1: Core Engine
- 5.2 Week 2: Act 0 + Path A
- 5.3 Week 3: Path B + Path C
- 5.4 Week 4: Polish & Testing

---

# PART 1: FOUNDATION

## 1.1 Game Overview

### Premise
You are **Alexandre Dubois**, a 34-year-old railway engineer wrongfully convicted of sabotaging a train that killed 47 people, including the love of your life, **Sophie Renault**. The real culprit is **Francois Marchand**, a corrupt industrialist who framed you to cover his cost-cutting on railway infrastructure.

You've been sentenced to life imprisonment at **ÃŽle de Pierre** (Stone Island), a notorious French prison fortress off the Brittany coast. It's 1923, and you have one goal: escape and prove your innocence.

### The Three Paths
On your 15th night, you discover three potential routes to freedom:

1. **PATH A: The Night Escape** - Physical escape through darkness, tunnels, and timing
2. **PATH B: The Social Route** - Build alliances, recruit help, escape as a team
3. **PATH C: The Day Escape** - Methodical planning over 6 days, multiple work assignments

### Core Mechanics
- **Scene-based navigation**: Click/tap choices to move between scenes
- **Relationship tracking**: 6 NPCs with -100 to +100 relationship scores
- **Inventory system**: Collect and use items at key moments
- **Evidence collection**: Gather proof for justice endings
- **Time tracking**: Path C tracks 6 days with morning/day/evening/night cycles

### Win Conditions
- **Escape**: Physically leave the island alive and free
- **Justice**: Prove your innocence and expose the true culprit
- **Death**: Fail in a way that ends your life
- **Capture**: Get caught and returned to imprisonment (or worse)

---

## 1.2 Core Characters

### THE PROTAGONIST

**ALEXANDRE DUBOIS (You)**
- Age: 34
- Profession: Railway Engineer
- Background: Orphaned at 12, raised by uncle who taught him mechanics. Rose through railway company to become lead engineer. Met Sophie at a company function. Was working late the night of the sabotage - his alibi was dismissed because he was alone.
- Skills: Mechanical aptitude, logical thinking, observant
- Flaw: Trusts too easily, which is how Francois framed him

---

### THE ALLIES (6 NPCs with relationship tracking)

**BASTIAN MOREAU** - The Cellmate
- Age: 28
- Crime: Murder (killed his sister's abusive husband)
- Cell: Shares cell with Alexandre
- Personality: Quiet, loyal, protective. Speaks little but observes everything.
- Secret: His sister Cordelia runs a fishing boat that passes the island
- Relationship Start: 30 (neutral-positive, shares cell)
- Key to: Night escape lighthouse route, Social route coordination
- Trust unlocks: At 60+, reveals sister's boat schedule. At 80+, will risk his life for you.

**MARCEL LAURENT** - The Locksmith
- Age: 52
- Crime: Burglary (master thief, caught on his last job)
- Location: Usually in workshop or library
- Personality: Grandfatherly, patient, loves teaching his craft
- Secret: Knows every lock in the prison, made copies of several keys
- Relationship Start: 0 (stranger)
- Key to: Any route requiring locked doors, key copies
- Trust unlocks: At 40+, teaches lock basics. At 60+, gives you a lockpick. At 80+, gives you master key copy.

**VIKTOR KOZLOV** - The Muscle
- Age: 41
- Crime: Assault (former boxer, killed a man in an illegal fight)
- Location: Yard, weight area
- Personality: Intimidating exterior, surprisingly philosophical. Respects strength of character.
- Secret: Guards fear him; he could start a riot anytime
- Relationship Start: -20 (sees you as weak newcomer)
- Key to: Social route chaos option, protection from Ã‰mile
- Trust unlocks: At 0+, stops actively threatening you. At 40+, offers protection. At 70+, will create distraction. At 90+, will fight guards for you.

**DENIS ARCHAMBAULT** - The Priest
- Age: 67
- Crime: Helped political prisoners escape (20 years ago)
- Location: Chapel, infirmary (volunteers)
- Personality: Serene, wise, speaks in parables. Genuinely kind.
- Secret: Knows hidden passages in the old monastery section
- Relationship Start: 20 (kind to all newcomers)
- Key to: Chapel route, spiritual endings, secret passages
- Trust unlocks: At 50+, shares monastery history. At 70+, shows hidden passage entrance. At 90+, guides you through passages himself.

**Ã‰MILE BEAUMONT** - The Bully
- Age: 38
- Crime: Multiple murders (genuinely dangerous sociopath)
- Location: Yard, cafeteria (wherever he can intimidate)
- Personality: Cruel, territorial, hates weakness. BUT responds to genuine strength.
- Secret: Terrified of the warden; has information about guard corruption
- Relationship Start: -50 (immediate enemy, sees you as target)
- Key to: Guard corruption evidence, unlikely ally route
- Trust unlocks: At -20+, stops targeting you actively. At 20+, grudging respect. At 50+, shares guard secrets. At 80+ (very hard), becomes genuine ally.

**DR. JEAN MOREAU** - The Prison Doctor
- Age: 45
- Crime: None (staff, not prisoner)
- Location: Infirmary
- Personality: Burned out, alcoholic, but still has conscience buried deep
- Secret: Knows warden is embezzling; addicted to morphine he steals from supplies
- Relationship Start: 0 (professional distance)
- Key to: Medical supplies, fake death scheme, warden evidence
- Trust unlocks: At 30+, gives basic medical help. At 50+, provides sedatives. At 70+, helps fake your death. At 90+, testifies against warden.

---

### THE ANTAGONISTS

**WARDEN HENRI BEAUREGARD**
- Age: 58
- Role: Prison Warden for 15 years
- Personality: Meticulously cruel, obsessed with control, corrupt
- Motivation: Money. Takes bribes, embezzles funds, sells prisoner privileges.
- Connection to plot: Received large payment from Francois to ensure Alexandre never escapes or speaks to outside world
- Weakness: Paper trail of corruption; fears exposure more than anything

**FRANCOIS MARCHAND** - The True Villain
- Age: 51
- Role: Wealthy industrialist, railway investor
- Background: Inherited father's company, expanded ruthlessly. Cut costs on railway maintenance to increase profits. When accident became inevitable, framed Alexandre to avoid responsibility.
- Never appears in person: His shadow looms over entire story. Only seen in flashbacks, photographs, documents.
- Evidence against him scattered throughout game

**GUARD CAPTAIN PIERRE LEGRAND**
- Age: 44
- Role: Head of guards, warden's enforcer
- Personality: Sadistic but lazy. Will hurt prisoners for fun but won't go out of his way.
- Weakness: Bribable, alcoholic, predictable patrol schedule

**CLAUDE FONTAINE** - The Informant
- Age: 35
- Crime: Fraud
- Location: Circulates everywhere
- Role: Prison snitch. Reports to guards for privileges.
- Danger: If you trust him or share plans near him, he reports to guards
- Tell: Always appears friendly, asks too many questions about plans

---

### OUTSIDE CHARACTERS (Referenced but not present)

**SOPHIE RENAULT** - The Lost Love
- Status: Died in train accident
- Role: Alexandre's motivation. Her death is what he grieves most.
- Secret: She survived the initial crash; died because rescue was delayed by cost-cutting. Proof exists.

**CORDELIA MOREAU** - Bastian's Sister
- Role: Runs fishing boat that passes island twice weekly
- Key to: Lighthouse escape route, boat pickup
- Never seen directly until escape moment

**LUCIEN MARCHAND** - Francois's Brother
- Role: Knows truth about Francois, wracked with guilt
- Location: Lives in Paris, referenced in documents
- Key to: Justice endings - can testify if contacted

**MARGOT DELACROIX** - Journalist
- Role: Investigating railway accidents, suspects cover-up
- Location: Mainland, can be contacted through certain routes
- Key to: Justice endings - can publish story if given evidence

---

## 1.3 Locations

### PRISON PROPER

**1. CELL BLOCK A** (Where you're housed)
- Your cell (shared with Bastian)
- 20 other cells in block
- Central guard station
- Notable: Loose stone in your cell wall (Path A entrance)
- Items findable: Spoon (digging tool), matches (in guard station)

**2. CELL BLOCK B** (Higher security)
- Where Ã‰mile and Viktor are housed
- More guards, less freedom
- Notable: Window overlooking yard
- Items findable: Wire (for lockpicking)

**3. CAFETERIA**
- Meals served 3x daily
- Social hub - best place for conversations
- Notable: Kitchen access door (requires work assignment or stealth)
- Items findable: Knife (hidden), food (bribery), salt (weapon)

**4. YARD**
- Exercise area, open air
- Weight equipment, benches
- Notable: View of walls, guard towers, lighthouse in distance
- Items findable: Rock (weapon), rope (hidden in equipment shed)

**5. CHAPEL**
- Old monastery section, beautiful but crumbling
- Denis's domain
- Notable: Hidden passages in walls, connects to old tunnels
- Items findable: Candles, matches, old map fragment

**6. LIBRARY**
- Small collection of approved books
- Marcel often here
- Notable: Contains old prison records, newspaper archives
- Items findable: Newspaper clippings (evidence), map of island, prison blueprints

**7. INFIRMARY**
- Dr. Moreau's domain
- 6 beds, medicine cabinet, office
- Notable: Sedatives, chemicals for fake death
- Items findable: Sedatives, bandages, scalpel, medical file (with evidence)

**8. WORKSHOP**
- Prisoners do labor here
- Marcel's unofficial territory
- Notable: Tools that could aid escape
- Items findable: Screwdriver, wire cutters, file

**9. LAUNDRY**
- Work assignment location
- Steam, noise, low supervision
- Notable: Access to guard uniforms
- Items findable: Guard uniform pieces, chemicals

**10. WARDEN'S OFFICE**
- Administrative section
- High security, rarely accessible
- Notable: Contains files on all prisoners, corruption evidence
- Items findable: Alexandre's case file, payment records, keys

---

### ESCAPE ZONES

**11. BASEMENT/TUNNELS**
- Accessed from Cell Block A (loose stone) or Chapel (hidden passage)
- Dark, partially flooded
- Notable: Splits into multiple routes (kitchen, old tunnel, lighthouse)
- Items findable: Old lantern, smuggler's cache

**12. KITCHEN**
- Behind cafeteria
- Work assignment or sneak-in only
- Notable: Loading dock access, delivery schedule
- Items findable: Larger knife, delivery manifest

**13. LOADING DOCK**
- Where supplies arrive
- Heavy guard presence during day, minimal at night
- Notable: Boats dock here, trucks leave here
- Exit point for multiple endings

**14. LIGHTHOUSE**
- Old, partially abandoned
- Accessible through tunnels or external climb
- Notable: Signal equipment, view of Cordelia's boat route
- Exit point for Bastian-related endings

**15. OUTER WALLS/PERIMETER**
- Guards, searchlights, dogs
- Various weak points depending on path
- Exit point for wall-climb endings

---

## 1.4 Items & Evidence System

### TOOLS (Aid Escape)

| Item | Location | Use |
|------|----------|-----|
| Spoon | Cell (hidden in mattress) | Dig through loose stone, improvised weapon |
| Screwdriver | Workshop | Open vents, disable locks |
| Wire Cutters | Workshop | Cut fence, disable equipment |
| Lockpick | Marcel (relationship 60+) | Open most locks |
| Master Key | Marcel (relationship 80+) | Open all standard locks |
| Rope | Yard (equipment shed) | Climbing, binding |
| Matches | Chapel or Guard Station | Light way in tunnels |
| Lantern | Basement | Extended light source |
| File | Workshop | Cut bars (slow), shape metal |

### DISGUISES

| Item | Location | Use |
|------|----------|-----|
| Guard Uniform (shirt) | Laundry | Part of disguise |
| Guard Uniform (pants) | Laundry | Part of disguise |
| Guard Cap | Guard Station (steal) | Completes disguise |
| Work Clothes | Standard issue | Blend in during day |

### MEDICAL

| Item | Location | Use |
|------|----------|-----|
| Sedatives | Infirmary | Knock out guards, fake death |
| Bandages | Infirmary | Treat injuries |
| Scalpel | Infirmary | Weapon, tool |
| Morphine | Dr. Moreau (relationship 70+) | Trade, fake death |

### WEAPONS

| Item | Location | Use |
|------|----------|-----|
| Kitchen Knife | Kitchen | Combat, intimidation |
| Spoon (sharpened) | Cell | Improvised shiv |
| Rock | Yard | Thrown weapon, blunt force |
| Salt | Cafeteria | Thrown in eyes (distraction) |

### EVIDENCE (For Justice Endings)

| Evidence | Location | What It Proves |
|----------|----------|----------------|
| Payment Records | Warden's Office | Francois paid warden to keep you silent |
| Original Case File | Warden's Office | Shows evidence was falsified |
| Newspaper Clippings | Library | Reports questioning accident cause |
| Dr. Moreau's Notes | Infirmary | Medical cover-up at accident site |
| Sophie's Letter | Your belongings (hidden) | She wrote about Francois's threats before accident |
| Maintenance Logs | Library (archives) | Proves corner-cutting on railway |
| Lucien's Address | Library (society pages) | Allows contacting Francois's guilt-ridden brother |
| Guard Ledger | Guard Station | Shows bribe patterns from Francois |
| Photograph | Warden's Office | Francois meeting with warden |

### MISCELLANEOUS

| Item | Location | Use |
|------|----------|-----|
| Cigarettes | Various (trade) | Currency, bribery |
| Food | Cafeteria | Bribery, survival |
| Book (hollowed) | Library | Hide small items |
| Candles | Chapel | Light source |
| Map Fragment | Chapel/Basement | Shows tunnel routes |
| Prison Blueprints | Library | Shows all passages |

---

## 1.5 Relationship System

### How It Works
- Each ally NPC has a score from -100 to +100
- Score changes based on dialogue choices and actions
- Certain options/endings only unlock at threshold scores
- Some actions have permanent consequences (can't undo)

### Starting Values
```
BASTIAN: 30 (cellmate familiarity)
MARCEL: 0 (stranger)
VIKTOR: -20 (sees you as weak)
DENIS: 20 (kind to all)
Ã‰MILE: -50 (immediate enemy)
DR. MOREAU: 0 (professional distance)
```

### Relationship Thresholds

**BASTIAN**
- 30: Will make small talk
- 50: Shares personal history
- 60: **UNLOCKS**: Tells you about sister's boat
- 70: Willing to take risks for you
- 80: **UNLOCKS**: Will signal sister, risk his life
- 90: **UNLOCKS**: Best escape ending (both escape together)

**MARCEL**
- 20: Teaches you about locks (lore)
- 40: **UNLOCKS**: Gives basic lockpicking tips (easier lock puzzles)
- 60: **UNLOCKS**: Gives you lockpick item
- 80: **UNLOCKS**: Gives master key copy
- 90: **UNLOCKS**: Joins escape attempt, unique ending

**VIKTOR**
- -20 to 0: Stops actively threatening you
- 0+: Neutral, won't help but won't hurt
- 40: **UNLOCKS**: Offers protection from Ã‰mile
- 70: **UNLOCKS**: Will create distraction/riot
- 90: **UNLOCKS**: Will fight guards, unique ending

**DENIS**
- 30: Shares monastery history
- 50: **UNLOCKS**: Tells you about hidden passages
- 70: **UNLOCKS**: Shows passage entrance
- 90: **UNLOCKS**: Guides you through passages, unique ending

**Ã‰MILE**
- -50 to -30: Active threat, may attack you
- -30 to 0: Ignores you (grudgingly)
- 0+: Stops being threat
- 20: Grudging respect
- 50: **UNLOCKS**: Shares guard corruption info
- 80: **UNLOCKS**: Becomes actual ally (very hard to achieve)

**DR. MOREAU**
- 20: More talkative, shares complaints
- 30: **UNLOCKS**: Provides basic medical help freely
- 50: **UNLOCKS**: Gives sedatives
- 70: **UNLOCKS**: Helps fake your death
- 90: **UNLOCKS**: Will testify against warden

### Relationship Modifiers

**Actions that INCREASE relationship:**
- Choosing kind/supportive dialogue options: +5 to +10
- Sharing cigarettes/food: +5
- Defending them from others: +10 to +20
- Keeping their secrets: +10
- Helping with their problems: +15 to +25
- Taking a risk for them: +20 to +30

**Actions that DECREASE relationship:**
- Choosing dismissive/rude dialogue: -5 to -10
- Stealing from them: -20
- Betraying their trust: -30 to -50
- Siding with their enemy: -20
- Getting them in trouble with guards: -30

**Permanent Consequences:**
- If relationship drops below -80: They become permanent enemy
- If you betray someone to guards: That relationship is locked at -100
- If you save someone's life: Permanent +30 bonus

---

## 1.6 The Three Paths Overview

### PATH A: THE NIGHT ESCAPE (100 scenes)
**Theme**: Physical skill, timing, darkness
**Playstyle**: Action-oriented, stealth, resource management
**Time**: One night (Night 15)
**Core mechanic**: Navigate darkness, manage limited items

**Structure**:
- ACT 1 (35 scenes): Cell escape, basement navigation
- ACT 2 (35 scenes): Choose route - Kitchen, Tunnel, or Lighthouse
- ACT 3 (30 scenes): Escape execution and consequences

**Unique elements**:
- Darkness mechanic (limited matches/lantern fuel)
- Timing puzzles (guard patrols)
- Three sub-routes with different requirements

**Endings available**: 15
- 4 Death endings
- 3 Capture endings
- 8 Escape endings

---

### PATH B: THE SOCIAL ROUTE (120 scenes)
**Theme**: Relationships, trust, teamwork
**Playstyle**: Dialogue-heavy, relationship management
**Time**: Days 15-21 (one week of planning)
**Core mechanic**: Build alliances, recruit team, coordinate escape

**Structure**:
- ACT 1 (40 scenes): Make contact, recruit allies
- ACT 2 (45 scenes): Plan and prepare with team
- ACT 3 (35 scenes): Execute group escape

**Unique elements**:
- Must recruit at least 2 allies
- Team composition affects available endings
- Betrayal/loyalty dynamics

**Endings available**: 18
- 3 Death endings
- 4 Capture endings
- 11 Escape endings (including "everyone lives" hardest ending)

---

### PATH C: THE DAY ESCAPE (213 scenes)
**Theme**: Patience, planning, information
**Playstyle**: Methodical, resource gathering, multiple playthroughs
**Time**: 6 full days (Days 15-20)
**Core mechanic**: Time management, work assignments, evidence gathering

**Structure**:
- Days 1-5 (30-35 scenes each): Daily routine, gather resources/allies/evidence
- Day 6 (28 scenes): Final execution of chosen plan

**Unique elements**:
- Day/night cycle with scheduled events
- Work assignment choices (6 options, each unlocks different content)
- Evidence system for justice endings
- Most complex path with most endings

**Endings available**: 25
- 5 Death endings
- 5 Capture endings
- 7 Escape endings
- 8 Justice endings (unique to this path)

---

# PART 2: COMPLETE SCENE MAP

## 2.1 Scene Numbering System

### Format: `[PATH]-[ACT]-[SCENE]`

**PATH CODES:**
- `X` = Shared/Opening (all paths)
- `A` = Night Escape
- `B` = Social Route
- `C` = Day Escape

**ACT CODES:**
- `0` = Opening/Prologue
- `1` = Early game (Act 1)
- `2` = Mid game (Act 2)
- `3` = Late game (Act 3)
- `4` = Escape execution
- `5` = Endings

**Examples:**
- `X-0-001` = Opening, first scene
- `A-1-015` = Night path, Act 1, scene 15
- `C-2-042` = Day path, Act 2, scene 42

### Scene Count Summary

| Section | Scene Count |
|---------|-------------|
| Shared Opening (X-0) | 15 |
| Path A: Night | 100 |
| Path B: Social | 120 |
| Path C: Day | 213 |
| **TOTAL** | **448** |

*Note: Opening scenes shared, so unique scenes = 433*

---

## 2.2 Act 0: The Opening (15 Shared Scenes)

### X-0-001: Title Screen
```
SCENE: X-0-001
TYPE: Title
CONTENT:
  [TITLE CARD]
  EL PALO DE QUESO
  "The Cheese Stick"
  
  A Prison Escape in 58 Endings
  
  [START] [LOAD] [SETTINGS]
NEXT: X-0-002
```

### X-0-002: The Explosion
```
SCENE: X-0-002
TYPE: Flashback/Cutscene
CONTENT:
  [VISUAL: Train tracks at night, rain]
  
  The night of March 15th, 1922.
  
  You remember the sound first. Metal screaming against metal.
  Then the fireball, orange against the black sky.
  
  The Bordeaux Express. 47 souls.
  
  Sophie was in car three.
  
  [Continue]
NEXT: X-0-003
```

### X-0-003: The Trial
```
SCENE: X-0-003
TYPE: Flashback/Cutscene
CONTENT:
  [VISUAL: Courtroom, hostile faces]
  
  The trial lasted three days.
  
  The evidence was overwhelming. Falsified, but overwhelming.
  Your tools at the sabotage site.
  Your fingerprints on the loosened bolts.
  Your "motive" - a fabricated gambling debt.
  
  Francois Marchand watched from the gallery.
  He never testified. He didn't have to.
  He'd paid for the verdict months in advance.
  
  "GUILTY of industrial sabotage resulting in 47 deaths."
  
  "Life imprisonment at ÃŽle de Pierre."
  
  [Continue]
NEXT: X-0-004
```

### X-0-004: Arrival at the Island
```
SCENE: X-0-004
TYPE: Narrative
CONTENT:
  [VISUAL: Boat approaching dark island, fortress silhouette]
  
  The boat cuts through grey water. Seagulls circle overhead,
  screaming what sounds like warnings.
  
  ÃŽle de Pierre rises from the Atlantic like a fist of granite.
  The prison sits at its crown - a converted monastery from
  the time of the Templars, they say.
  
  No one has ever escaped.
  
  The guards don't bother with chains for the crossing.
  Where would you go?
  
  [Continue]
NEXT: X-0-005
```

### X-0-005: Processing
```
SCENE: X-0-005
TYPE: Narrative + Choice
CONTENT:
  [VISUAL: Prison intake room, harsh lighting]
  
  They take everything.
  
  Your clothes. Your watch. Your wedding ring - 
  you weren't married, but Sophie's ring was in your pocket.
  You'd planned to propose the week after...
  
  "Name?" The guard doesn't look up.
  
  CHOICES:
  [A] "Alexandre Dubois." (Cooperate)
  [B] "You already know my name." (Defiant)
  [C] Stay silent. (Passive)

BRANCHES:
  A: Cooperative â†’ X-0-006A (Guard notes you as "compliant")
  B: Defiant â†’ X-0-006B (Guard notes you as "trouble")
  C: Silent â†’ X-0-006C (Guard notes you as "broken")
```

### X-0-006A/B/C: Processing Continues
```
SCENE: X-0-006A (Cooperative)
TYPE: Narrative
CONTENT:
  The guard grunts. "Cooperative. Good. Makes this easier."
  
  He stamps a form. "Cell Block A. Cell 14. You'll share
  with Moreau. He's quiet. Keep it that way."
  
  [FLAG: PROCESSING_COOPERATIVE = TRUE]
NEXT: X-0-007

SCENE: X-0-006B (Defiant)
TYPE: Narrative  
CONTENT:
  The guard finally looks up. His eyes are dead.
  
  "Funny man. The funny ones always cry first."
  
  He stamps a form with unnecessary force. "Cell Block A.
  Cell 14. You'll share with Moreau. Maybe he'll teach
  you some manners."
  
  [FLAG: PROCESSING_DEFIANT = TRUE]
NEXT: X-0-007

SCENE: X-0-006C (Silent)
TYPE: Narrative
CONTENT:
  The guard sighs. "Another broken one."
  
  He stamps the form. "Cell Block A. Cell 14. 
  You'll share with Moreau. Try not to hang yourself
  before breakfast. The paperwork is annoying."
  
  [FLAG: PROCESSING_SILENT = TRUE]
NEXT: X-0-007
```

### X-0-007: Meeting the Warden
```
SCENE: X-0-007
TYPE: Narrative + Choice
CONTENT:
  [VISUAL: Warden's office, mahogany desk, portrait of Napoleon]
  
  Before your cell, they bring you to HIM.
  
  Warden Henri Beauregard sits behind his desk like a spider
  in its web. Silver hair, immaculate uniform, eyes that
  measure you like meat.
  
  "Dubois. The train bomber." He savors the words.
  "I've been paid well to keep you... comfortable."
  
  Your blood runs cold. Paid?
  
  "Oh yes. A mutual friend wants to ensure you never
  speak to anyone about... certain matters. Ever."
  
  He smiles. It doesn't reach his eyes.
  
  "Welcome to Stone Island. You'll die here."
  
  CHOICES:
  [A] "Francois Marchand sent you." (Accusation)
  [B] "I'm innocent. This is a setup." (Protest)
  [C] Say nothing. But remember. (Silent)

BRANCHES:
  A â†’ X-0-008A (Warden confirms Francois connection)
  B â†’ X-0-008B (Warden mocks your innocence)
  C â†’ X-0-008C (Warden is unnerved by silence)
```

### X-0-008A/B/C: Warden's Response
```
SCENE: X-0-008A (Accusation)
TYPE: Narrative
CONTENT:
  For a moment - just a moment - the Warden's mask slips.
  
  "You're smarter than you look. Yes. Monsieur Marchand
  has been... generous. And he'll continue to be generous
  as long as you remain silent."
  
  He leans forward. "If you ever speak to a lawyer, a
  journalist, or anyone from the outside about that night...
  accidents happen in prison. Understand?"
  
  You understand perfectly.
  
  [FLAG: KNOWS_FRANCOIS_CONNECTION = TRUE]
  [EVIDENCE: WARDEN_ADMISSION memory added]
NEXT: X-0-009

SCENE: X-0-008B (Protest)
TYPE: Narrative
CONTENT:
  The Warden laughs. Genuinely laughs.
  
  "Innocent! They all say that. The murderers, the
  thieves, the rapists - all innocent. The only guilty
  man on this island is me, I suppose."
  
  He waves dismissively. "Save your protests for God.
  He doesn't listen either."
  
  [FLAG: PROTESTED_INNOCENCE = TRUE]
NEXT: X-0-009

SCENE: X-0-008C (Silent)
TYPE: Narrative
CONTENT:
  You say nothing. But your eyes say everything.
  
  The Warden's smile falters, just slightly.
  
  "Nothing to say? Perhaps you're smarter than the
  others. Or perhaps you've already given up."
  
  He gestures to the guards. "Take him to his cell."
  
  As you leave, you feel his eyes on your back.
  Uncertain. You've made him uncertain.
  
  [FLAG: WARDEN_UNCERTAIN = TRUE]
NEXT: X-0-009
```

### X-0-009: The Cell
```
SCENE: X-0-009
TYPE: Narrative
CONTENT:
  [VISUAL: Stone cell, two bunks, barred window, grey light]
  
  Cell 14. Home for the rest of your life.
  
  Or so they think.
  
  The cell is eight feet by ten. Two bunks, one occupied.
  A toilet. A sink. A small window showing nothing but sky.
  
  The man on the lower bunk looks up. Dark hair, early
  twenties, eyes that have seen too much.
  
  "New one." His voice is flat. "Take the top bunk.
  Don't snore. Don't talk in your sleep. Don't ask
  about my crime."
  
  He turns to face the wall.
  
  "Name's Bastian. Welcome to hell."
  
  [RELATIONSHIP: BASTIAN = 30]
  [Continue]
NEXT: X-0-010
```

### X-0-010: First Night - Cell Exploration
```
SCENE: X-0-010
TYPE: Exploration + Choices
CONTENT:
  Lights out was hours ago. Bastian's breathing is even.
  
  You can't sleep. Won't sleep. Your mind races.
  
  In the darkness, you examine your cage.
  
  CHOICES:
  [A] Examine the walls (Search for weaknesses)
  [B] Look out the window (Study the exterior)
  [C] Listen to the corridor (Learn guard patterns)
  [D] Try to sleep (End night)

BRANCHES:
  A â†’ X-0-010A (Find loose stone)
  B â†’ X-0-010B (See lighthouse in distance)
  C â†’ X-0-010C (Hear guard patrol timing)
  D â†’ X-0-011 (Next morning)
```

### X-0-010A/B/C: Cell Details
```
SCENE: X-0-010A (Walls)
TYPE: Discovery
CONTENT:
  Your fingers trace the ancient stones. Most are
  solid, mortared tight centuries ago.
  
  But in the corner, behind the toilet...
  
  One stone moves. Just slightly. The mortar has
  crumbled around it. With time and patience,
  it could be removed.
  
  You file this away. Say nothing to Bastian.
  
  [FLAG: DISCOVERED_LOOSE_STONE = TRUE]
  [Return to choices or continue to morning]
NEXT: X-0-010 (if more to explore) or X-0-011

SCENE: X-0-010B (Window)
TYPE: Discovery
CONTENT:
  The window is small, barred, but offers a view.
  
  Beyond the prison walls, past the guard towers,
  you can see the sea. And on a rocky outcrop...
  
  A lighthouse. Old, weathered, but its beam still
  sweeps the waters.
  
  Interesting. A lighthouse means passing ships.
  Passing ships mean... possibilities.
  
  [FLAG: DISCOVERED_LIGHTHOUSE = TRUE]
  [Return to choices or continue to morning]
NEXT: X-0-010 or X-0-011

SCENE: X-0-010C (Corridor)
TYPE: Discovery
CONTENT:
  You press your ear to the bars and listen.
  
  Footsteps. Regular. The night guard walks the
  block every... you count... every fifteen minutes.
  
  His footsteps are heavy at the start of his route,
  lighter at the end. He's tired. Bored. Predictable.
  
  [FLAG: LEARNED_PATROL_PATTERN = TRUE]
  [Return to choices or continue to morning]
NEXT: X-0-010 or X-0-011
```

### X-0-011: First Morning - Bastian
```
SCENE: X-0-011
TYPE: Dialogue + Choice
CONTENT:
  [VISUAL: Morning light through bars, Bastian awake]
  
  "You didn't sleep."
  
  It's not a question. Bastian watches you from his bunk.
  
  "First night is the hardest. Or so they say. I wouldn't
  know. I slept like the dead."
  
  He sits up. For the first time, you see his face clearly.
  Young, but old. Like looking in a mirror.
  
  "What are you in for?"
  
  CHOICES:
  [A] "They say I bombed a train." (Honest but vague)
  [B] "I'm innocent. I was framed." (Full truth)
  [C] "What did you say about not asking about crimes?" (Deflect)

BRANCHES:
  A â†’ X-0-011A (Bastian curious, +5 relationship)
  B â†’ X-0-011B (Bastian skeptical, no change)
  C â†’ X-0-011C (Bastian respects boundary, +10 relationship)
```

### X-0-011A/B/C: Bastian Response
```
SCENE: X-0-011A (Vague honest)
TYPE: Dialogue
CONTENT:
  "The Bordeaux Express." Bastian's eyes widen slightly.
  "That was you?"
  
  "They say it was me."
  
  He studies you for a long moment.
  
  "Forty-seven people. If you did it, you're a monster.
  If you didn't..." He shrugs. "Welcome to Stone Island.
  We've got all kinds."
  
  [RELATIONSHIP: BASTIAN +5 = 35]
NEXT: X-0-012

SCENE: X-0-011B (Full truth)
TYPE: Dialogue
CONTENT:
  "A man named Francois Marchand framed me. He owned
  part of the railway. Cut costs that caused the accident.
  Used me to cover it up."
  
  Bastian's expression doesn't change.
  
  "Every man in here is innocent. Ask them."
  
  "I'm not every man."
  
  "That's what they all say too."
  
  [RELATIONSHIP: BASTIAN = 30 (no change)]
NEXT: X-0-012

SCENE: X-0-011C (Deflect)
TYPE: Dialogue
CONTENT:
  Bastian almost smiles.
  
  "Fair enough. You remember what I said. Good."
  
  He stands, stretches. "I don't know what you did.
  Don't care. In here, what matters is what you do
  now. Not before."
  
  It's the closest thing to wisdom you've heard
  since the trial.
  
  [RELATIONSHIP: BASTIAN +10 = 40]
NEXT: X-0-012
```

### X-0-012: Two Weeks Pass
```
SCENE: X-0-012
TYPE: Montage/Narrative
CONTENT:
  [VISUAL: Series of quick scenes - meals, yard, cell, repeat]
  
  Two weeks.
  
  You learn the rhythms of Stone Island.
  
  Breakfast at 6. Work assignment at 7. Lunch at 12.
  Yard time at 2. Dinner at 6. Lights out at 9.
  Repeat. Repeat. Repeat.
  
  You learn the players.
  
  Marcel, the old locksmith, always reading in the library.
  Viktor, the giant Russian, lifting weights in silence.
  Denis, the priest-prisoner, tending the chapel garden.
  Ã‰mile, the predator, watching from the corners.
  
  And Bastian. Always Bastian. He speaks little, but
  his presence is solid. Reliable. Almost... safe.
  
  You learn one more thing.
  
  You learn that you cannot stay here forever.
  
  [Continue]
NEXT: X-0-013
```

### X-0-013: Night 15 - The Realization
```
SCENE: X-0-013
TYPE: Narrative
CONTENT:
  [VISUAL: Cell at night, moonlight through bars]
  
  Night 15.
  
  You lie awake, same as every night.
  
  But tonight is different. Tonight, something crystallizes.
  
  You are not going to die here.
  
  The warden said you'd never escape. That no one ever has.
  But the warden also said Francois Marchand paid for your
  silence. Which means Francois is afraid.
  
  If you escape, you can expose him.
  If you expose him, you can clear your name.
  If you clear your name, you can give Sophie justice.
  
  For the first time since the trial, you feel something
  other than despair.
  
  You feel determination.
  
  [Continue]
NEXT: X-0-014
```

### X-0-014: THE CHOICE - Path Selection
```
SCENE: X-0-014
TYPE: Major Branch Point
CONTENT:
  [VISUAL: Cell, same as before, but Alexandre now sitting up with purpose]
  
  You consider your options.
  
  You've spent two weeks watching, listening, learning.
  Three possibilities have emerged.
  
  The loose stone in the wall. It leads somewhere - 
  you're certain now. A tunnel? The basement?
  One desperate night could see you through.
  
  The other prisoners. Some could be allies. Bastian.
  Marcel. Even Viktor or Denis. With help, with a
  plan, escape becomes more than a gamble.
  
  The daily routine. There are cracks in the system.
  Work assignments that grant access. Guards with
  patterns. Information in the library. A careful,
  patient approach could yield results.
  
  Tonight, you decide.
  
  CHOICES:
  [A] "Tonight. I go tonight. Through the wall."
      â†’ PATH A: THE NIGHT ESCAPE
  
  [B] "I need allies. This can't be done alone."
      â†’ PATH B: THE SOCIAL ROUTE
  
  [C] "Patience. I need to plan. Watch. Wait."
      â†’ PATH C: THE DAY ESCAPE

BRANCHES:
  A â†’ X-0-015A (Commit to Night Path)
  B â†’ X-0-015B (Commit to Social Path)
  C â†’ X-0-015C (Commit to Day Path)
```

### X-0-015A/B/C: Path Confirmation
```
SCENE: X-0-015A (Night Path)
TYPE: Transition
CONTENT:
  Tonight.
  
  You wait until Bastian's breathing steadies.
  Until the guard makes his hourly pass.
  Until the moon rises high enough to give you
  light through the window.
  
  Then you move to the loose stone.
  
  This is it. No turning back.
  
  [BEGIN PATH A: THE NIGHT ESCAPE]
NEXT: A-1-001

SCENE: X-0-015B (Social Path)
TYPE: Transition
CONTENT:
  Allies.
  
  Tomorrow, you'll start building connections.
  Bastian first - he's closest, and you sense
  there's more to him than silence.
  
  Then Marcel. Denis. Maybe even Viktor.
  
  Alone, you're just one man against a fortress.
  Together, you might just have a chance.
  
  [BEGIN PATH B: THE SOCIAL ROUTE]
NEXT: B-1-001

SCENE: X-0-015C (Day Path)
TYPE: Transition
CONTENT:
  Patience.
  
  Tomorrow begins a new phase. You'll watch.
  You'll learn. You'll probe every crack in
  this prison's armor.
  
  Six days. You give yourself six days to find
  a way out. If you haven't found it by then...
  
  You'll find it. You have to.
  
  [BEGIN PATH C: THE DAY ESCAPE]
NEXT: C-1-001
```

---

## 2.3 Path A: Night Escape (100 Scenes)

### ACT 1: CELL ESCAPE & BASEMENT (Scenes A-1-001 to A-1-035)

**A-1-001: The Loose Stone**
```
SCENE: A-1-001
TYPE: Action
CONTENT:
  Your fingers find the loose stone in the darkness.
  
  Heart pounding, you work it free. The mortar crumbles
  silently - perhaps it was never meant to be permanent.
  Perhaps someone before you started this work.
  
  Behind the stone: blackness. A hole just wide enough
  for a man to squeeze through.
  
  Cold air flows from the opening. The smell of damp
  stone and old secrets.
  
  CHOICES:
  [A] Enter immediately (No preparation)
  [B] Check for items first (Search cell)
  [C] Wake Bastian (Trust him)
  
BRANCHES:
  A â†’ A-1-003 (Enter tunnel, no items)
  B â†’ A-1-002 (Search cell for items)
  C â†’ A-1-002B (Wake Bastian - relationship check)
```

**A-1-002: Cell Search**
```
SCENE: A-1-002
TYPE: Exploration
CONTENT:
  Moving silently, you search the cell.
  
  Under your mattress: a sharpened spoon, hidden weeks ago.
  Under Bastian's mattress: nothing - or you don't dare check.
  Behind the toilet: three matches, wrapped in paper.
  
  [ITEM GAINED: Sharpened Spoon]
  [ITEM GAINED: Matches (3)]
  
  CHOICES:
  [A] Enter the hole now (Continue escape)
  [B] Wake Bastian (Trust him)
  
BRANCHES:
  A â†’ A-1-003
  B â†’ A-1-002B
```

**A-1-002B: Waking Bastian**
```
SCENE: A-1-002B
TYPE: Dialogue + Relationship Check
CONTENT:
  You kneel beside Bastian's bunk.
  
  "Bastian. Wake up."
  
  His eyes open immediately. Alert. Unsurprised.
  
  "I know," he whispers. "I heard you find the stone.
  Weeks ago."
  
  [RELATIONSHIP CHECK: BASTIAN]
  
IF BASTIAN >= 50:
  "I wondered when you'd go for it. You want help?"
  
  CHOICES:
  [A] "Come with me."
  [B] "Just... don't raise the alarm."
  [C] "I need to do this alone."
  
  BRANCHES:
  A â†’ A-1-003B (Bastian joins, +20 relationship)
  B â†’ A-1-003 (Bastian stays, promise, +10 relationship)
  C â†’ A-1-003 (Bastian stays, understands, +5 relationship)

IF BASTIAN < 50:
  "Escaping?" His voice is flat. "Good luck with that."
  
  He turns back to the wall.
  
  "I won't say anything. But you're on your own."
  
  â†’ A-1-003 (Bastian stays, no bonus)
```

**A-1-003: Into the Darkness**
```
SCENE: A-1-003
TYPE: Navigation
CONTENT:
  [VISUAL: Complete darkness]
  
  You squeeze through the hole.
  
  Darkness swallows you whole. The air is cold, thick,
  ancient. Stone walls press close on either side.
  
  You can't see your hand in front of your face.
  
  [IF HAS_MATCHES]:
  You have 3 matches. Each will burn for about 30 seconds.
  
  CHOICES:
  [A] Light a match (Use 1 match, see surroundings)
  [B] Feel your way forward (Conserve matches, risk)
  [C] Wait for eyes to adjust (Slow but safe)
  
IF NO_MATCHES:
  You have no light source. This just got much harder.
  
  CHOICES:
  [A] Feel your way forward (Only option)
  [B] Go back (Abandon escape - bad ending check)
  
BRANCHES:
  A (with match) â†’ A-1-004A (See passage clearly)
  B (no match) â†’ A-1-004B (Stumble in darkness)
  C (wait) â†’ A-1-004C (Partial vision)
  "Go back" â†’ A-1-FAIL-001 (Cowardice ending)
```

**A-1-004A/B/C: The Passage**
```
SCENE: A-1-004A (With light)
TYPE: Exploration
CONTENT:
  [MATCH COUNTER: 2 remaining]
  
  The match flares to life.
  
  You're in a narrow passage, carved from living rock.
  The walls are wet with condensation. Ahead, the passage
  slopes downward.
  
  On the wall, scratched into stone: initials and dates.
  "J.L. 1887" "M.R. 1902" "A.B. 1919"
  
  Others have tried this way. You wonder how many succeeded.
  
  The match burns your fingers. Darkness returns.
  
  [Continue]
NEXT: A-1-005

SCENE: A-1-004B (No light)
TYPE: Hazard
CONTENT:
  You edge forward, hands outstretched.
  
  The floor is uneven. You stumble twice. The third time,
  your foot catches on something and you fall.
  
  Pain lances through your knee. You bite back a cry.
  
  In the darkness, you feel around. Your hands find...
  bones. Old, dry, scattered.
  
  Someone else didn't make it.
  
  [FLAG: INJURED_KNEE = TRUE]
  [This will affect later scenes]
NEXT: A-1-005

SCENE: A-1-004C (Eyes adjusted)
TYPE: Exploration
CONTENT:
  Minutes pass. Slowly, the absolute black becomes...
  less absolute. A faint grey emerges.
  
  You can make out shapes now. Walls. Floor. The passage
  ahead, descending into deeper darkness.
  
  It's not much. But it's enough to move carefully.
  
  [FLAG: NIGHT_VISION_ACTIVE = TRUE]
NEXT: A-1-005
```

**A-1-005 through A-1-020: Basement Navigation**
```
[SUMMARY OF SCENES A-1-005 to A-1-020]

These scenes handle navigation through the basement/tunnel system.
Key elements:

A-1-005: Descending stairs carved in stone
A-1-006: First junction - left or right? (Left = dead end trap)
A-1-007: Discovery of old supply room (possible lantern find)
A-1-008: Sound of water - underground stream ahead
A-1-009: Narrow squeeze through collapsed section
A-1-010: Guard room above (can hear them talking - lore)

A-1-011: Second junction - three paths visible
A-1-012: Path 1 scouting - leads to kitchen
A-1-013: Path 2 scouting - leads to old tunnel (out)
A-1-014: Path 3 scouting - leads to lighthouse basement
A-1-015: Decision point - which path to take

A-1-016: Environmental hazard - water rising
A-1-017: Quick decision needed - high or low route
A-1-018: Discovery of smuggler's cache (items)
A-1-019: Finding old map fragment
A-1-020: Reaching stable ground

Key items findable in basement:
- Old lantern (needs oil, but provides light)
- Map fragment (shows tunnel layout)
- Smuggler's cache (rope, knife, coins)
- Evidence note (prisoner's confession about Francois)
```

**A-1-021 to A-1-035: Route Selection**
```
[SCENES A-1-021 to A-1-035]

These scenes establish the three sub-routes of Path A:

KITCHEN ROUTE (if path 1 chosen):
A-1-021: Approaching kitchen basement access
A-1-022: Sound of work above - kitchen staff
A-1-023: Timing the entry
A-1-024: Kitchen infiltration
A-1-025: Loading dock visible through door

TUNNEL ROUTE (if path 2 chosen):
A-1-026: The old smuggler tunnel
A-1-027: Signs of recent use (concerning)
A-1-028: Tight passages, claustrophobia
A-1-029: Exit visible - moonlit cave
A-1-030: Sound of sea, taste of salt air

LIGHTHOUSE ROUTE (if path 3 chosen):
A-1-031: Lighthouse basement entry
A-1-032: Spiral stairs upward
A-1-033: Old equipment, possible signals
A-1-034: Top of lighthouse - view of everything
A-1-035: Bastian's sister's boat (if relationship high enough)

MAJOR CHOICE at A-1-035:
Player commits to one of three Act 2 routes
```

---

### ACT 2: ESCAPE ROUTES (Scenes A-2-001 to A-2-044)

**KITCHEN ROUTE (A-2-001 to A-2-014)**
```
A-2-001: Kitchen entry - stealth check
A-2-002: Hiding among supplies
A-2-003: Chef Pierre discovers you (relationship opportunity)
A-2-004: Choice - fight, talk, or hide better
A-2-005: Pierre's decision (help or call guards)
A-2-006: Loading dock approach
A-2-007: Guard patterns at dock
A-2-008: Supply truck spotted (possible stowaway)
A-2-009: Fishing boat at dock (possible theft)
A-2-010: Making your move
A-2-011: Success - into truck OR onto boat
A-2-012: Complication - guard returns
A-2-013: Final confrontation or escape
A-2-014: Kitchen route resolution â†’ Endings

KITCHEN ENDINGS:
- Stowaway Truck (escape)
- Stolen Boat (escape with complications)
- Caught at Dock (capture)
- Shot at Dock (death)
```

**TUNNEL ROUTE (A-2-015 to A-2-029)**
```
A-2-015: Deep into smuggler tunnels
A-2-016: Signs of other escapees (or smugglers)
A-2-017: Underground river crossing
A-2-018: Water rising - timing puzzle
A-2-019: Cave system navigation
A-2-020: Moonlight ahead - exit near
A-2-021: But voices - who's there?
A-2-022: Smugglers or guards?
A-2-023: Choice - hide, approach, or fight
A-2-024: Smuggler interaction (possible help)
A-2-025: Guard patrol passes
A-2-026: Final swim to freedom
A-2-027: Tide timing critical
A-2-028: Emerge on rocks or pulled out to sea
A-2-029: Tunnel route resolution â†’ Endings

TUNNEL ENDINGS:
- Smuggler Network (escape with criminal connections)
- Narrow Escape (escape, barely)
- Lost at Sea (death)
- Drowned Underground (death)
- Caught at Sea (capture)
```

**LIGHTHOUSE ROUTE (A-2-030 to A-2-044)**
```
A-2-030: Climbing lighthouse stairs
A-2-031: Each floor more dangerous
A-2-032: Old keeper's quarters - supplies
A-2-033: Signal equipment found
A-2-034: Learning to use signal lamp
A-2-035: Bastian's information (if shared)
A-2-036: Signaling passing boats
A-2-037: Cordelia's boat approaches (if Bastian >= 60)
A-2-038: Guard discovers lighthouse activity
A-2-039: Race to descend / escape
A-2-040: Rope descent or jump?
A-2-041: Water landing
A-2-042: Swimming to Cordelia's boat
A-2-043: Boat escape OR confrontation
A-2-044: Lighthouse route resolution â†’ Endings

LIGHTHOUSE ENDINGS:
- Cordelia's Rescue (best escape, requires Bastian 80+)
- Bastian's Sacrifice (escape, Bastian dies for you)
- Fall from Lighthouse (death)
- Caught at Lighthouse (capture)
- Signal Not Answered (stranded, capture)
```

---

### ACT 3: PATH A ENDINGS (Scenes A-5-001 to A-5-015)

```
DEATH ENDINGS (4):
A-5-D01: Shot at the Dock
  - Trigger: Confronted guards with weapon, lost fight
  - Scene: Guards open fire, you fall into cold water
  
A-5-D02: Drowned Underground
  - Trigger: Failed water timing in tunnel
  - Scene: Rising water, no air, darkness takes you
  
A-5-D03: Lost at Sea
  - Trigger: Boat sinks or wrong tide, no rescue
  - Scene: Hypothermia, exhaustion, the sea claims you
  
A-5-D04: Fall from Lighthouse
  - Trigger: Failed climbing/descending lighthouse
  - Scene: Rope breaks, rocks below

CAPTURE ENDINGS (3):
A-5-C01: Caught in Kitchen
  - Trigger: Pierre reports you OR stealth failed
  - Scene: Guards drag you back, solitary confinement
  
A-5-C02: Caught at Dock
  - Trigger: Guard patrol timing failed
  - Scene: Surrounded, beaten, thrown in hole
  
A-5-C03: Caught at Sea
  - Trigger: Boat intercepted by coast guard
  - Scene: Returned to island, warden waiting

ESCAPE ENDINGS (8):
A-5-E01: The Supply Truck
  - Trigger: Kitchen route, successful stowaway
  - Scene: Wake up on mainland, dawn breaking, free
  
A-5-E02: The Stolen Boat
  - Trigger: Kitchen route, successful boat theft
  - Scene: Alone at sea, but free. What now?
  
A-5-E03: The Narrow Escape
  - Trigger: Tunnel route, survived by luck
  - Scene: Crawling onto beach, coughing water, alive
  
A-5-E04: Blood on Your Hands
  - Trigger: Any route where you killed to escape
  - Scene: Free, but the price weighs on you
  
A-5-E05: The Fisherman's Mercy
  - Trigger: Found by innocent fisherman, not reported
  - Scene: Quiet ending, new identity, but no justice
  
A-5-E06: The Smuggler Network
  - Trigger: Joined smugglers, became one of them
  - Scene: Criminal life, but free. Sophie's face fades.
  
A-5-E07: Bastian's Sister
  - Trigger: Lighthouse route, Bastian >= 80, Cordelia rescue
  - Scene: Best Night Path ending - proper escape, allies kept
  
A-5-E08: The Front Door
  - Trigger: Perfect stealth, perfect timing, never seen
  - Scene: Walk off island like ghost. They don't know you're gone until morning.
```

---

## 2.4 Path B: Social Route (120 Scenes)

### ACT 1: ALLIANCE BUILDING (Scenes B-1-001 to B-1-040)

**B-1-001 to B-1-010: Initial Contact**
```
B-1-001: Morning after decision - yard time
B-1-002: Approaching Bastian with plan
B-1-003: Bastian's reaction (relationship dependent)
B-1-004: First alliance proposal
B-1-005: Bastian's conditions
B-1-006: Planning recruitment targets
B-1-007: Assessment of other prisoners
B-1-008: Risk evaluation
B-1-009: First recruitment decision
B-1-010: Commitment to alliance path
```

**B-1-011 to B-1-030: Recruitment Sequences**
```
MARCEL RECRUITMENT (B-1-011 to B-1-015):
B-1-011: Finding Marcel in library
B-1-012: Building rapport (books, conversation)
B-1-013: Subtle hints about escape
B-1-014: Marcel's test (prove trustworthiness)
B-1-015: Marcel agrees or refuses â†’ branch

VIKTOR RECRUITMENT (B-1-016 to B-1-020):
B-1-016: Approaching Viktor in yard
B-1-017: Viktor's challenge (test of courage)
B-1-018: Proving yourself (physical or moral test)
B-1-019: Viktor's respect earned or denied
B-1-020: Viktor agrees (conditionally) or refuses â†’ branch

DENIS RECRUITMENT (B-1-021 to B-1-025):
B-1-021: Chapel conversation
B-1-022: Denis's reluctance (pacifist concerns)
B-1-023: Moral argument (justice vs violence)
B-1-024: Denis's secret passages revealed
B-1-025: Denis agrees to help (his way) or refuses â†’ branch

Ã‰MILE "RECRUITMENT" (B-1-026 to B-1-030):
B-1-026: Risky approach to enemy
B-1-027: Ã‰mile's initial hostility
B-1-028: Finding common ground (hatred of system)
B-1-029: Uneasy alliance formation
B-1-030: Ã‰mile as wildcard ally (dangerous but powerful)
```

**B-1-031 to B-1-040: Team Formation**
```
B-1-031: Assessing recruited allies
B-1-032: Group meeting (covert)
B-1-033: Sharing information
B-1-034: Plan formation
B-1-035: Role assignment
B-1-036: Claude complication (informant risk)
B-1-037: Trust test within group
B-1-038: Timeline establishment
B-1-039: Final preparations
B-1-040: Commitment ceremony (all in or out)
```

---

### ACT 2: EXECUTION (Scenes B-2-001 to B-2-079)

**CHAPEL ROUTE (B-2-001 to B-2-019)** [Requires Denis]
```
B-2-001: Gathering in chapel
B-2-002: Denis reveals full passage system
B-2-003: Old monastery exploration
B-2-004: Hidden histories (lore, evidence)
B-2-005: Passage navigation
B-2-006: Unexpected obstacle
B-2-007: Team problem-solving
B-2-008: Deeper passages
B-2-009: Exit approaches
B-2-010: Denis's choice (stay or go)
B-2-011: Emergence point
B-2-012: Final obstacles
B-2-013: Coast reached
B-2-014: Boat arranged or improvised
B-2-015: Launch sequence
B-2-016: Pursuit begins
B-2-017: Team coordination
B-2-018: Final escape push
B-2-019: Chapel route resolution â†’ Endings
```

**CHAOS ROUTE (B-2-020 to B-2-039)** [Requires Viktor]
```
B-2-020: Viktor's riot plan
B-2-021: Positioning team members
B-2-022: Riot triggers
B-2-023: Chaos erupts
B-2-024: Moving through chaos
B-2-025: Guards overwhelmed
B-2-026: Casualties mounting
B-2-027: Moral choice (help others or self-preserve)
B-2-028: Breaking through
B-2-029: Viktor holds the line
B-2-030: Wall breach
B-2-031: Outer perimeter
B-2-032: Guard tower threat
B-2-033: Viktor's fate (hero or casualty)
B-2-034: Final push to freedom
B-2-035: Shore reached
B-2-036: Escape vessel
B-2-037: Pursuit situation
B-2-038: Team status
B-2-039: Chaos route resolution â†’ Endings
```

**LEVERAGE ROUTE (B-2-040 to B-2-059)** [Requires Ã‰mile's info]
```
B-2-040: Gathering corruption evidence
B-2-041: Ã‰mile's guard secrets
B-2-042: Warden's vulnerabilities
B-2-043: Blackmail preparation
B-2-044: Confronting guard captain
B-2-045: Guard cooperation forced
B-2-046: Inside help arranged
B-2-047: Walking out (disguised/permitted)
B-2-048: Checkpoint tension
B-2-049: Almost caught moment
B-2-050: Loading dock (legitimate exit)
B-2-051: Boat arranged by guards
B-2-052: Conditions of freedom
B-2-053: Deal with devil implications
B-2-054: Crossing water
B-2-055: Mainland reached
B-2-056: Guards' demands
B-2-057: Freedom vs obligation
B-2-058: Final leverage play
B-2-059: Leverage route resolution â†’ Endings
```

**LOADING DOCK ROUTE (B-2-060 to B-2-079)** [Requires Marcel + any other]
```
B-2-060: Marcel's key copies
B-2-061: Night approach planning
B-2-062: Synchronized movement
B-2-063: First lock
B-2-064: Guard patrol dodge
B-2-065: Second lock
B-2-066: Near discovery
B-2-067: Third lock (Marcel's masterwork)
B-2-068: Loading dock entry
B-2-069: Boat assessment
B-2-070: Engine check
B-2-071: Supplies gathered
B-2-072: Team embarkation
B-2-073: Engine start (loud)
B-2-074: Alarm raised
B-2-075: Pulling away
B-2-076: Gunfire
B-2-077: Navigation
B-2-078: Open water
B-2-079: Loading dock route resolution â†’ Endings
```

---

### ACT 3: PATH B ENDINGS (Scenes B-5-001 to B-5-018)

```
DEATH ENDINGS (3):
B-5-D01: Betrayed and Shot
  - Trigger: Claude informed, ambush at rendezvous
  - Scene: Shot in the back by guards you didn't see coming
  
B-5-D02: Left Behind
  - Trigger: Team had to choose, you weren't essential
  - Scene: Watching the boat leave without you
  
B-5-D03: Caught in Crossfire
  - Trigger: Viktor's riot went too far
  - Scene: Stray bullet, wrong place, wrong time

CAPTURE ENDINGS (4):
B-5-C01: Betrayed by Claude
  - Trigger: Claude knew everything, reported in time
  - Scene: Guards waiting at every exit
  
B-5-C02: Plan Failed
  - Trigger: Too many variables, something broke
  - Scene: Rounded up one by one, solitary for all
  
B-5-C03: Ã‰mile Broke
  - Trigger: Ã‰mile used you for his own escape
  - Scene: He's gone. You're caught. He sold you out.
  
B-5-C04: Viktor's Rampage
  - Trigger: Riot brought too much attention
  - Scene: Military called in, no escape possible

ESCAPE ENDINGS (11):
B-5-E01: Solo Survivor
  - Trigger: Everyone else captured/killed, you escaped
  - Scene: Freedom tastes like ash. They're still inside.
  
B-5-E02: Everyone Lives
  - Trigger: Perfect execution, all allies escaped
  - Scene: The hardest ending. A new family, bound by survival.
  
B-5-E03: Brothers in Arms
  - Trigger: You and Bastian escape, others didn't
  - Scene: Bastian becomes lifelong friend. Some bonds can't break.
  
B-5-E04: The Locksmith's Escape
  - Trigger: Marcel leads successful quiet escape
  - Scene: Marcel's masterpiece. Every lock opened, no one hurt.
  
B-5-E05: Viktor's Redemption
  - Trigger: Viktor sacrifices for team
  - Scene: He held the line. He's probably dead. You're free.
  
B-5-E06: Denis's Blessing
  - Trigger: Denis guides you out, returns to prison
  - Scene: He chose to stay. "My work is here." You carry his blessing.
  
B-5-E07: Political Escape
  - Trigger: Leverage route, clean exit
  - Scene: Walked out the front. They can't admit what happened.
  
B-5-E08: The Family
  - Trigger: 3+ allies escape together
  - Scene: A new family forged in desperation. Together forever.
  
B-5-E09: Cordelia's Crew
  - Trigger: Bastian route, sister's boat, multiple passengers
  - Scene: Cordelia smiles. "Brother said you were trouble."
  
B-5-E10: The Priest's Way
  - Trigger: Denis's passages, minimal violence
  - Scene: Like monks fleeing persecution centuries ago. Sacred escape.
  
B-5-E11: Bittersweet Freedom
  - Trigger: You escape, but someone you cared about didn't
  - Scene: Free but incomplete. Some part of you stays behind.
```

---

## 2.5 Path C: Day Escape (213 Scenes)

### DAY 1: ORIENTATION (Scenes C-1-001 to C-1-030)

**Morning (C-1-001 to C-1-008)**
```
C-1-001: Waking with purpose
C-1-002: Breakfast - observation mode
C-1-003: Social dynamics assessment
C-1-004: First conversation opportunity
C-1-005: Choosing who to approach
C-1-006: Morning interactions
C-1-007: Work assignment announcement
C-1-008: Assignment choice presented

WORK ASSIGNMENT CHOICE (Major Branch):
  [Kitchen] [Laundry] [Yard] [Infirmary] [Chapel] [Library]
  Each unlocks different scenes, items, relationships, endings
```

**Day - Work Assignment (C-1-009 to C-1-018)**
```
Each work assignment has unique day scenes:

KITCHEN DAY 1: C-1-009K to C-1-018K
  Meeting Pierre, learning routines, noting loading dock

LAUNDRY DAY 1: C-1-009L to C-1-018L  
  Hot, loud, but low supervision, uniform access

YARD DAY 1: C-1-009Y to C-1-018Y
  Viktor's territory, wall observation, tool access

INFIRMARY DAY 1: C-1-009I to C-1-018I
  Dr. Moreau, medical supplies, prisoner intake

CHAPEL DAY 1: C-1-009H to C-1-018H
  Denis's domain, peaceful, hidden passages

LIBRARY DAY 1: C-1-009B to C-1-018B
  Marcel's space, records, evidence potential
```

**Evening (C-1-019 to C-1-025)**
```
C-1-019: Dinner social opportunity
C-1-020: Evening yard time
C-1-021: Cell return
C-1-022: Bastian conversation
C-1-023: Processing day's information
C-1-024: Night planning
C-1-025: Lights out
```

**Night (C-1-026 to C-1-030)**
```
C-1-026: Night thoughts
C-1-027: Optional exploration (risk)
C-1-028: Guard pattern study
C-1-029: Day 1 summary
C-1-030: Dawn approaching â†’ Day 2
```

---

### DAYS 2-5: DETAILED BREAKDOWN

**DAY 2 (C-2-001 to C-2-030)**
```
Focus: Establishing routine, building first relationship
Key Events:
  - Work detail choice can change
  - First real conversation with chosen ally
  - Evidence discovery possible (library/infirmary)
  - Ã‰mile confrontation (can be avoided or faced)
```

**DAY 3 (C-3-001 to C-3-035)**
```
Focus: Complications arise
Key Events:
  - Claude appears (informant danger)
  - Someone gets hurt (infirmary visit)
  - Warden walks through (tension)
  - Possible evidence found (newspaper about Sophie)
```

**DAY 4 (C-4-001 to C-4-035)**
```
Focus: Alliances deepen or fracture
Key Events:
  - Major ally reveals personal stake
  - Guard corruption observed
  - Escape route possibility discovered
  - Trust tested (ally in danger)
```

**DAY 5 (C-5-001 to C-5-030)**
```
Focus: Crisis point
Key Events:
  - Warden summons player (suspicious)
  - Ally warns of danger
  - Evidence nearly complete (or not)
  - Tomorrow is the day (decision forced)
```

---

### DAY 6: FINAL DAY (Scenes C-6-001 to C-6-028)

**Morning (C-6-001 to C-6-007)**
```
C-6-001: The last morning
C-6-002: Final preparation
C-6-003: Gathering resources
C-6-004: Ally check-ins
C-6-005: Route finalization
C-6-006: Evidence compilation (if justice path)
C-6-007: Point of no return

FINAL PATH CHOICE:
  [ESCAPE] - Physical escape attempt
  [JUSTICE] - Use evidence to expose truth
  [TRANSFER] - Accept transfer (safe ending)
  [SURRENDER] - Give up (fail ending)
```

**Day - Execution (C-6-008 to C-6-020)**
```
Based on choice:

ESCAPE EXECUTION (C-6-008E to C-6-020E):
  Work assignment used for escape
  Route depends on which assignment chosen all week
  
JUSTICE EXECUTION (C-6-008J to C-6-020J):
  Contacting outside world
  Evidence delivery
  Waiting for response
  
TRANSFER (C-6-008T to C-6-020T):
  Accepting transfer
  Leaving island
  What happens after?
```

**Resolution (C-6-021 to C-6-028)**
```
C-6-021: Climax of chosen path
C-6-022: Complications
C-6-023: Final choice
C-6-024: Resolution begins
C-6-025: Consequences revealed
C-6-026: Future glimpse
C-6-027: Ending determination
C-6-028: Path C ending â†’ One of 25 endings
```

---

### PATH C WORK DETAIL BRANCHES

**KITCHEN PATH (K-scenes)**
```
40+ scenes specific to kitchen work
Key NPCs: Pierre (chef), Kitchen Staff, Delivery drivers
Key Items: Large knife, delivery manifest, loading dock access
Key Endings: Stowaway, Pierre's Help, Kitchen Fire (distraction), Poisoning attempt
```

**LAUNDRY PATH (L-scenes)**
```
40+ scenes specific to laundry work  
Key NPCs: Laundry manager, Other workers
Key Items: Guard uniform (complete), chemicals, steam access
Key Endings: Guard disguise, Chemical incident, Laundry cart escape
```

**YARD PATH (Y-scenes)**
```
40+ scenes specific to yard work
Key NPCs: Viktor, Outdoor guards, Groundskeepers
Key Items: Tools, Rope, Wall observation data
Key Endings: Wall climb, Viktor's help, Tool-based escape
```

**INFIRMARY PATH (I-scenes)**
```
40+ scenes specific to infirmary work
Key NPCs: Dr. Moreau, Nurse, Sick prisoners
Key Items: Sedatives, Medical supplies, Files
Key Endings: Fake death, Moreau's help, Ambulance escape
```

**CHAPEL PATH (H-scenes)**
```
40+ scenes specific to chapel work
Key NPCs: Denis, Visiting clergy, Praying prisoners
Key Items: Candles, Maps, Passage access
Key Endings: Secret passages, Denis's way, Holy escape
```

**LIBRARY PATH (B-scenes)**
```
40+ scenes specific to library work
Key NPCs: Marcel, Librarian guard
Key Items: Evidence, Blueprints, Contact information
Key Endings: Evidence gathered, Legal appeal, Journalist contact
```

---

### PATH C ENDINGS (25 Total)

```
DEATH ENDINGS (5):
C-5-D01: Assassination
  - Trigger: Warden ordered your death, no protection
  
C-5-D02: Riot Victim
  - Trigger: Started chaos you couldn't control
  
C-5-D03: Poison Backfire
  - Trigger: Poisoning attempt failed, consumed yourself
  
C-5-D04: Fall from Wall
  - Trigger: Wall climb failed at crucial moment
  
C-5-D05: Fake Death Gone Wrong
  - Trigger: Moreau's fake death too real, buried alive

CAPTURE ENDINGS (5):
C-5-C01: Transferred Away
  - Trigger: Accepted transfer, lose escape chance forever
  
C-5-C02: Caught at Wall
  - Trigger: Climbing attempt spotted
  
C-5-C03: Disguise Failed
  - Trigger: Guard uniform didn't fool anyone
  
C-5-C04: Woke Too Early
  - Trigger: Fake death sedative wore off
  
C-5-C05: Evidence Destroyed
  - Trigger: Justice path failed, no proof remains

ESCAPE ENDINGS (7):
C-5-E01: The Supply Truck
  - Trigger: Kitchen path successful stowaway
  
C-5-E02: The Ambulance
  - Trigger: Infirmary path, medical transport
  
C-5-E03: The Guard Walk
  - Trigger: Laundry path, perfect disguise
  
C-5-E04: The Wall
  - Trigger: Yard path, wall climb success
  
C-5-E05: The Passages
  - Trigger: Chapel path, Denis's tunnels
  
C-5-E06: The Boat
  - Trigger: Loading dock, any path with dock access
  
C-5-E07: The Fog
  - Trigger: Perfect timing, walked out in morning fog

JUSTICE ENDINGS (8) - UNIQUE TO PATH C:
C-5-J01: Partial Exoneration
  - Trigger: Some evidence reached outside, case reopened
  
C-5-J02: The Warden Falls
  - Trigger: Warden's corruption exposed, you stay prisoner but satisfied
  
C-5-J03: Margot's Expose
  - Trigger: Journalist publishes everything, public pressure
  
C-5-J04: Sophie's Truth
  - Trigger: Evidence proves Sophie could have been saved
  
C-5-J05: Lucien Confesses
  - Trigger: Francois's brother contacted, breaks down, confesses
  
C-5-J06: Francois Exposed
  - Trigger: Complete evidence trail to Francois, arrested
  
C-5-J07: Complete Vindication
  - Trigger: Perfect justice - freed, Francois imprisoned, name cleared
  - Best justice ending
  
C-5-J08: The Long Con
  - Trigger: Play along for years, gather everything, destroy Francois completely
  - Most unique ending - you stay in prison 5 more years by choice
  - When you finally emerge, Francois has lost everything
  - You spent 20 years destroying him from inside and out
```

---

# PART 3: ALL 58 ENDINGS

## Complete Endings Table

| # | ID | Name | Path | Type | Requirements |
|---|-----|------|------|------|--------------|
| 1 | A-D01 | Shot at Dock | A | Death | Fight guards at loading dock |
| 2 | A-D02 | Drowned Underground | A | Death | Fail water timing in tunnel |
| 3 | A-D03 | Lost at Sea | A | Death | Boat sinks, no rescue |
| 4 | A-D04 | Fall from Lighthouse | A | Death | Fail climbing lighthouse |
| 5 | A-C01 | Caught in Kitchen | A | Capture | Stealth fail in kitchen |
| 6 | A-C02 | Caught at Dock | A | Capture | Guard patrol timing fail |
| 7 | A-C03 | Caught at Sea | A | Capture | Coast guard intercepts |
| 8 | A-E01 | Supply Truck | A | Escape | Kitchen stowaway success |
| 9 | A-E02 | Stolen Boat | A | Escape | Dock boat theft success |
| 10 | A-E03 | Narrow Escape | A | Escape | Tunnel route, survive barely |
| 11 | A-E04 | Blood on Hands | A | Escape | Killed to escape |
| 12 | A-E05 | Fisherman's Mercy | A | Escape | Found by sympathetic civilian |
| 13 | A-E06 | Smuggler Network | A | Escape | Join criminals |
| 14 | A-E07 | Bastian's Sister | A | Escape | BASTIANâ‰¥80, lighthouse, Cordelia |
| 15 | A-E08 | Front Door | A | Escape | Perfect stealth (hardest A) |
| 16 | B-D01 | Betrayed and Shot | B | Death | Claude informed, ambush |
| 17 | B-D02 | Left Behind | B | Death | Team chose without you |
| 18 | B-D03 | Caught in Crossfire | B | Death | Viktor's riot casualty |
| 19 | B-C01 | Betrayed by Claude | B | Capture | Informant victory |
| 20 | B-C02 | Plan Failed | B | Capture | Execution broke down |
| 21 | B-C03 | Ã‰mile Broke | B | Capture | Ã‰mile betrayed group |
| 22 | B-C04 | Viktor's Rampage | B | Capture | Riot too big, military |
| 23 | B-E01 | Solo Survivor | B | Escape | Only you escaped |
| 24 | B-E02 | Everyone Lives | B | Escape | All allies escape (hardest B) |
| 25 | B-E03 | Brothers in Arms | B | Escape | You + Bastian only |
| 26 | B-E04 | Locksmith's Escape | B | Escape | Marcel leads perfect exit |
| 27 | B-E05 | Viktor's Redemption | B | Escape | Viktor sacrifices |
| 28 | B-E06 | Denis's Blessing | B | Escape | Denis guides, stays behind |
| 29 | B-E07 | Political Escape | B | Escape | Leverage route clean exit |
| 30 | B-E08 | The Family | B | Escape | 3+ allies escape |
| 31 | B-E09 | Cordelia's Crew | B | Escape | Group boat escape |
| 32 | B-E10 | Priest's Way | B | Escape | Chapel route, minimal violence |
| 33 | B-E11 | Bittersweet Freedom | B | Escape | Escape with loss |
| 34 | C-D01 | Assassination | C | Death | Warden ordered hit |
| 35 | C-D02 | Riot Victim | C | Death | Lost control of chaos |
| 36 | C-D03 | Poison Backfire | C | Death | Self-poisoned |
| 37 | C-D04 | Fall from Wall | C | Death | Climb failed |
| 38 | C-D05 | Buried Alive | C | Death | Fake death too real |
| 39 | C-C01 | Transferred | C | Capture | Accepted transfer |
| 40 | C-C02 | Caught at Wall | C | Capture | Spotted climbing |
| 41 | C-C03 | Disguise Failed | C | Capture | Uniform didn't work |
| 42 | C-C04 | Woke Too Early | C | Capture | Sedative wore off |
| 43 | C-C05 | Evidence Destroyed | C | Capture | Justice path failed |
| 44 | C-E01 | Supply Truck | C | Escape | Kitchen route |
| 45 | C-E02 | Ambulance | C | Escape | Infirmary route |
| 46 | C-E03 | Guard Walk | C | Escape | Laundry disguise |
| 47 | C-E04 | The Wall | C | Escape | Yard climb |
| 48 | C-E05 | The Passages | C | Escape | Chapel tunnels |
| 49 | C-E06 | The Boat | C | Escape | Loading dock |
| 50 | C-E07 | The Fog | C | Escape | Timing perfect |
| 51 | C-J01 | Partial Exoneration | C | Justice | Some evidence out |
| 52 | C-J02 | Warden Falls | C | Justice | Warden exposed |
| 53 | C-J03 | Margot's Expose | C | Justice | Journalist publishes |
| 54 | C-J04 | Sophie's Truth | C | Justice | Her death explained |
| 55 | C-J05 | Lucien Confesses | C | Justice | Brother breaks |
| 56 | C-J06 | Francois Exposed | C | Justice | Villain arrested |
| 57 | C-J07 | Complete Vindication | C | Justice | Full exoneration (best) |
| 58 | C-J08 | The Long Con | C | Justice | 20-year revenge (unique) |

---

# PART 4: TECHNICAL IMPLEMENTATION

## 4.1 Data Structures

### Scene Object
```typescript
interface Scene {
  id: string;           // "X-0-001", "A-1-015", etc.
  type: SceneType;      // 'narrative' | 'dialogue' | 'choice' | 'exploration' | 'ending'
  content: {
    visual?: string;    // Description of visual (for placeholder)
    text: string;       // Main narrative text
    speaker?: string;   // For dialogue scenes
  };
  choices?: Choice[];   // If type is 'choice'
  nextScene?: string;   // Default next scene (if no choices)
  flags?: FlagChange[]; // Flags to set/check
  items?: ItemChange[]; // Items to give/remove
  relationships?: RelChange[]; // Relationship changes
  requirements?: Requirement[]; // Must be met to enter scene
}

interface Choice {
  id: string;
  text: string;
  nextScene: string;
  requirements?: Requirement[];
  flags?: FlagChange[];
  items?: ItemChange[];
  relationships?: RelChange[];
}

interface Requirement {
  type: 'flag' | 'item' | 'relationship' | 'path';
  target: string;
  comparison: '=' | '>' | '<' | '>=' | '<=' | 'has' | '!has';
  value: string | number | boolean;
}
```

### Game State
```typescript
interface GameState {
  currentScene: string;
  path: 'X' | 'A' | 'B' | 'C' | null;
  day: number;          // For Path C
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  
  // Flags (booleans and strings)
  flags: Record<string, boolean | string>;
  
  // Inventory
  inventory: string[];
  
  // Relationships
  relationships: {
    BASTIAN: number;
    MARCEL: number;
    VIKTOR: number;
    DENIS: number;
    EMILE: number;
    MOREAU: number;
  };
  
  // Evidence collected
  evidence: string[];
  
  // Work assignment (Path C)
  workAssignment?: 'kitchen' | 'laundry' | 'yard' | 'infirmary' | 'chapel' | 'library';
  
  // Ending reached
  ending?: string;
  
  // Meta
  sceneHistory: string[];
  choices: Record<string, string>; // sceneid: choiceid
}
```

## 4.2 State Management

### Initial State
```typescript
const initialState: GameState = {
  currentScene: 'X-0-001',
  path: 'X',
  day: 0,
  timeOfDay: 'night',
  flags: {
    PROCESSING_COOPERATIVE: false,
    PROCESSING_DEFIANT: false,
    PROCESSING_SILENT: false,
    KNOWS_FRANCOIS_CONNECTION: false,
    DISCOVERED_LOOSE_STONE: false,
    DISCOVERED_LIGHTHOUSE: false,
    LEARNED_PATROL_PATTERN: false,
  },
  inventory: [],
  relationships: {
    BASTIAN: 30,
    MARCEL: 0,
    VIKTOR: -20,
    DENIS: 20,
    EMILE: -50,
    MOREAU: 0,
  },
  evidence: [],
  workAssignment: undefined,
  ending: undefined,
  sceneHistory: [],
  choices: {},
};
```

### State Update Functions
```typescript
function goToScene(sceneId: string): void;
function makeChoice(choiceId: string): void;
function addFlag(flagName: string, value: boolean | string): void;
function addItem(itemId: string): void;
function removeItem(itemId: string): void;
function changeRelationship(npc: string, delta: number): void;
function addEvidence(evidenceId: string): void;
function setWorkAssignment(assignment: string): void;
function setEnding(endingId: string): void;
function saveGame(): void;
function loadGame(): void;
```

## 4.3 Scene Transition Logic

### Transition Handler
```typescript
function handleSceneTransition(nextSceneId: string, state: GameState): GameState {
  // 1. Get scene data
  const scene = getScene(nextSceneId);
  
  // 2. Check requirements
  if (scene.requirements && !checkRequirements(scene.requirements, state)) {
    // Handle blocked scene (shouldn't happen if choices are filtered)
    return state;
  }
  
  // 3. Apply automatic changes
  let newState = { ...state, currentScene: nextSceneId };
  
  if (scene.flags) {
    newState = applyFlagChanges(newState, scene.flags);
  }
  
  if (scene.items) {
    newState = applyItemChanges(newState, scene.items);
  }
  
  if (scene.relationships) {
    newState = applyRelationshipChanges(newState, scene.relationships);
  }
  
  // 4. Update history
  newState.sceneHistory = [...newState.sceneHistory, nextSceneId];
  
  // 5. Check for ending
  if (scene.type === 'ending') {
    newState.ending = nextSceneId;
  }
  
  return newState;
}
```

## 4.4 Placeholder System

### Visual Placeholder Component
```typescript
interface PlaceholderProps {
  description: string;
  mood: 'dark' | 'tense' | 'hopeful' | 'neutral' | 'action';
  location?: string;
  characters?: string[];
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
}

function VisualPlaceholder({ description, mood, location, characters, timeOfDay }: PlaceholderProps) {
  // Returns a styled placeholder box with:
  // - Background color based on mood
  // - Icon based on location type
  // - Character silhouettes
  // - Time of day indicator
  // - Description text for artist reference
}
```

### Placeholder Categories
```
LOCATIONS:
- cell (8x10 stone room, bunks, bars)
- corridor (long hallway, cells on sides, guard station)
- cafeteria (tables, serving line, kitchen door)
- yard (open air, weights, benches, walls visible)
- chapel (old stone, altar, pews, religious imagery)
- library (shelves, tables, dim lighting)
- infirmary (beds, medicine cabinet, clinical)
- workshop (tools, workbenches, industrial)
- laundry (steam, machines, uniforms)
- basement (dark, wet, stone)
- tunnel (narrow, pitch black, claustrophobic)
- lighthouse (spiral stairs, old equipment, ocean view)
- loading_dock (boats, trucks, guards)
- warden_office (mahogany, portrait, intimidating)
- exterior (walls, towers, sea, island)

MOODS:
- dark (black/grey tones, minimal light)
- tense (red accents, sharp shadows)
- hopeful (warmer tones, light sources)
- neutral (muted colors, standard lighting)
- action (dynamic shapes, motion implied)

CHARACTERS (silhouettes):
- protagonist (medium build, prisoner clothes)
- bastian (young, slim)
- marcel (older, slight stoop)
- viktor (large, imposing)
- denis (robed, peaceful posture)
- emile (aggressive stance)
- moreau (white coat, tired posture)
- guard (uniform, weapon)
- warden (tall, formal)
```

---

# PART 5: STEP-BY-STEP BUILD GUIDE

## Week 1: Core Engine

### Day 1-2: Project Setup
```
1. Create Next.js project with TypeScript
2. Set up file structure:
   /app
     /game
       page.tsx (main game component)
   /components
     /scenes (scene renderer)
     /ui (buttons, inventory, relationships)
     /placeholders (visual placeholders)
   /data
     /scenes (JSON scene files)
     /items (item definitions)
     /characters (NPC data)
   /lib
     state.ts (state management)
     transitions.ts (scene logic)
     requirements.ts (condition checking)
   /types
     index.ts (TypeScript interfaces)
```

### Day 3-4: Core Systems
```
1. Implement GameState interface
2. Create state management (useReducer or Zustand)
3. Build scene loading system
4. Create requirement checker
5. Build transition handler
```

### Day 5-6: UI Foundation
```
1. Create SceneRenderer component
2. Create ChoiceButton component
3. Create InventoryPanel component
4. Create RelationshipDisplay component
5. Create visual placeholder system
```

### Day 7: Testing Framework
```
1. Create test scenes (5-10 scenes)
2. Test all transition types
3. Test requirement checking
4. Test state persistence
```

## Week 2: Act 0 + Path A

### Day 8-10: Act 0 (Opening)
```
1. Create all 15 X-0 scenes as JSON
2. Implement opening sequence
3. Test all opening branches
4. Verify path selection works
```

### Day 11-14: Path A Complete
```
1. Create A-1 scenes (35 scenes) - Cell/Basement
2. Create A-2 scenes (44 scenes) - Three routes
3. Create A-5 scenes (15 endings)
4. Test all Path A routes
5. Verify all 15 endings are reachable
```

## Week 3: Path B + Path C Foundation

### Day 15-17: Path B
```
1. Create B-1 scenes (40 scenes) - Alliance building
2. Create B-2 scenes (45 scenes) - Four escape routes
3. Create B-5 scenes (18 endings)
4. Test Path B routes and endings
```

### Day 18-21: Path C Days 1-3
```
1. Create C-1 scenes (30 scenes) - Day 1
2. Create C-2 scenes (30 scenes) - Day 2
3. Create C-3 scenes (35 scenes) - Day 3
4. Create work assignment branch structures
5. Test first 3 days functionality
```

## Week 4: Path C Completion + Polish

### Day 22-24: Path C Days 4-6
```
1. Create C-4 scenes (35 scenes) - Day 4
2. Create C-5 scenes (30 scenes) - Day 5
3. Create C-6 scenes (28 scenes) - Day 6
4. Create all 25 Path C endings
5. Test complete Path C
```

### Day 25-27: Work Detail Branches
```
1. Create Kitchen branch scenes (40)
2. Create Laundry branch scenes (40)
3. Create Yard branch scenes (40)
4. Create Infirmary branch scenes (40)
5. Create Chapel branch scenes (40)
6. Create Library branch scenes (40)
```

### Day 28-30: Polish & Testing
```
1. Full playthrough all paths
2. Verify all 58 endings
3. Fix broken transitions
4. Balance relationship thresholds
5. Polish text and pacing
6. Prepare for art replacement
```

---

# APPENDIX: QUICK REFERENCE

## Relationship Thresholds
```
BASTIAN: 60 (boat info), 80 (best endings)
MARCEL: 40 (tips), 60 (lockpick), 80 (master key)
VIKTOR: 0 (neutral), 40 (protection), 70 (riot)
DENIS: 50 (history), 70 (passages), 90 (guide)
Ã‰MILE: 0 (safe), 50 (secrets), 80 (ally)
MOREAU: 30 (help), 50 (sedatives), 70 (fake death)
```

## Item Locations
```
TOOLS: Workshop (screwdriver, wire cutters, file)
KEYS: Marcel (lockpick, master), Guard Station (stolen)
MEDICAL: Infirmary (sedatives, bandages, scalpel)
DISGUISE: Laundry (uniform), Guard Station (cap)
EVIDENCE: Library (clippings), Warden Office (files), Infirmary (notes)
MISC: Cell (spoon, matches), Chapel (candles, map), Yard (rope, rock)
```

## Path Entry Points
```
X-0-014 â†’ A-1-001 (Night: "Through the wall")
X-0-014 â†’ B-1-001 (Social: "I need allies")
X-0-014 â†’ C-1-001 (Day: "Patience. Plan.")
```

## Ending Counts by Type
```
DEATH: 12 (A:4, B:3, C:5)
CAPTURE: 12 (A:3, B:4, C:5)
ESCAPE: 22 (A:8, B:11, C:7)
JUSTICE: 8 (C only)
TOTAL: 58
```

---

*Document Version: 1.0*
*Total Word Count: ~15,000*
*Scene Count: 433*
*Ending Count: 58*

**This document serves as the complete blueprint for El Palo de Queso. Follow the Step-by-Step Build Guide in Part 5 to implement the full game within one month.**