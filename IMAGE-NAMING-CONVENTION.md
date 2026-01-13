# Image Naming Convention

## Scene Image Naming Rules

**CRITICAL: All scene images MUST be named after their scene ID.**

### Naming Format

- **Single image scenes:** `{SCENE_ID}.png`
  - Example: Scene `A-1-001` → Image: `A-1-001.png`
  - Example: Scene `X-0-006A` → Image: `X-0-006A.png`

- **Multi-page scenes:** `{SCENE_ID}-{PAGE_NUMBER}.png`
  - Example: Scene `X-0-004` page 1 → Image: `X-0-004-1.png`
  - Example: Scene `X-0-004` page 2 → Image: `X-0-004-2.png`
  - Example: Scene `X-0-005` page 1 → Image: `X-0-005-1.png`

### File Location

All scene images are stored in:
```
/public/images/backgrounds/
```

### File Format

- **Preferred format:** PNG (`.png`)
- Avoid using JPG unless specifically needed
- Avoid descriptive names like `cell-block.jpg` or `cell-interior.jpg`

### Scene JSON Structure

In scene JSON files, the visual path should be:
```json
{
  "id": "A-1-001",
  "content": {
    "visual": "/images/backgrounds/A-1-001.png"
  }
}
```

For multi-page scenes:
```json
{
  "id": "X-0-004",
  "content": {
    "visual": "/images/backgrounds/X-0-004.png",
    "pageVisuals": [
      "/images/backgrounds/X-0-004-1.png",
      "/images/backgrounds/X-0-004-2.png",
      "/images/backgrounds/X-0-004-3.png"
    ]
  }
}
```

## Why This Convention?

1. **Consistency:** Easy to find images that match scenes
2. **Organization:** Clear relationship between scene IDs and images
3. **Scalability:** Works for hundreds of scenes without confusion
4. **Debugging:** Quickly identify missing or misnamed images

## Current Scene IDs

### Act 0 (Opening/Prologue)
- X-0-001 (Title card)
- X-0-002 (Train crash - 3 pages)
- X-0-003 (Trial - 3 pages)
- X-0-004 (Prison transport - 3 pages with per-page visuals)
- X-0-005 (Legrand intro - 2 pages with per-page visuals)
- X-0-006A, X-0-006B, X-0-006C (Legrand response branches)
- X-0-006D (Arrival at prison - 3 pages with per-page visuals)
- X-0-007 (Warden meeting - 2 pages with per-page visuals)
- X-0-008A, X-0-008B, X-0-008C (Warden response branches)
- X-0-009 (Meeting Bastian - 3 pages with per-page visuals)
- X-0-010 (First night exploration hub)
- X-0-010A, X-0-010B, X-0-010C (Investigation scenes)
- X-0-011 (Morning after first night)
- X-0-012 (Bastian asks about crime - 2 pages)
- X-0-012A (Honest response - 3 pages with per-page visuals)
- X-0-012B (Evasive response)
- X-0-012C (Deflection response - 3 pages with per-page visuals)
- X-0-013 (First morning wake-up call)
- X-0-014 (Two weeks montage - 3 pages with per-page visuals)
- X-0-015 (Night 15 realization - 3 pages with per-page visuals)
- X-0-016 (THE CHOICE - Main path selection)
- X-0-016A (Path A confirmation - 3 pages with per-page visuals)
- X-0-016B (Path B confirmation - 3 pages with per-page visuals)
- X-0-016C (Path C confirmation - 3 pages with per-page visuals)

### Path A - The Tunnels (Night Escape Route)

**Act 1: Cell Escape & Tunnel Discovery**
- A-1-001 (Night 16 begins - 3 pages with per-page visuals)
- A-1-001B (Choice: remove stone/search/wake Bastian)
- A-1-002 (Finding the cache - 3 pages with per-page visuals)
- A-1-002A (Searching for tools - 3 pages with per-page visuals)
- A-1-002B (Waking Bastian - 3 pages)
- A-1-002B1 (Bastian reveals cache)
- A-1-002B1A (Bastian gives tools - ally path)
- A-1-002B1B (Bastian explains choice)
- A-1-002B2 (Bastian warns of danger)
- A-1-002B2A (Taking the risk)
- A-1-002B2B (Cautious acceptance)
- A-1-002B3 (Bastian stays neutral)
- A-1-002C (Bastian explains catacombs)
- A-1-003 (Planning the escape - 3 pages with per-page visuals)
- A-1-004 (Night 20 - Reaching chapel - 3 pages with per-page visuals)
- A-1-005 (DARKNESS MECHANIC: Match choice at basement)
- A-1-006A (Used match on stairs - 2 pages with per-page visuals)
- A-1-006B (Descended in dark - 2 pages with per-page visuals)
- A-1-007 (Navigate by memory - 2 matches left)
- A-1-007B (Lost in darkness - second match choice)
- A-1-007B1 (Used second match)
- A-1-007B2 (Searched blindly - 3 pages with per-page visuals)
- A-1-008 (Entry into catacombs)
- A-1-009 (Choice to light match and read map OR navigate blind)
- A-1-009A (Used match, knows correct route)
- A-1-009B (Navigating blind, uncertain position)
- A-1-010A (Safe passage - 3 pages)
- A-1-010B (Risky passage with injury - 3 pages with per-page visuals)
- A-1-011 (The junction - choose left or right path)
- A-1-011A (Used last match at junction)
- A-1-012 (Took right passage, reached second junction)
- A-1-013 (Three-way junction - choice to scout routes)
- A-1-014A (Scouted left passage - too narrow, found crack)
- A-1-014B (Scouted center passage - drainage system, flood risk)
- A-1-014C (Scouted right passage - found chamber with creatures)
- A-1-014C1 (Encounter with creatures - choice to retreat/scare/investigate)
- A-1-014C2 (Scared creatures away, found storage chamber)
- A-1-014C3 (Cautious approach, creatures fled, found glass bottle)
- A-1-014C4 (Explored storage chamber, found lantern)
- A-1-015 (Returned to three-way junction, scouting complete)
- A-1-016 (Decision point - choose route)
- A-1-017A (Drainage route - water rising)
- A-1-017B (Cavern route - following fresh air)
- A-1-017C (Narrow passage route - forced through crack)
- A-1-018A (Deep in drainage - approaching outlet)
- A-1-018B (Ascending through cavern - tree roots, voices ahead)
- A-1-018C (Ancient tunnels - found skeleton)
- A-1-019A (Reached drainage outlet - found grate to ocean)
- A-1-019B (Reached vertical shaft - under guard area)
- A-1-019C (Found ancient key, unlocked old door)
- A-1-020 (Scouting mission complete - must return to cell)
- A-1-021 (Returned safely to cell, Bastian suspicious)
- A-1-022 (Night 25 - Planning phase, need tools/supplies)
- A-1-023 (Route commitment choice - drainage/ancient/shaft)
- A-1-024A (Drainage route - planning kitchen theft)
- A-1-024B (Ancient route - planning supply gathering)
- A-1-024C (Shaft route - planning intelligence gathering)
- A-1-025A (Drainage chosen - must deal with Émile for kitchen duty)
- A-1-025B (Ancient chosen - found lamp oil in smuggler cache)
- A-1-025C (Shaft chosen - must deal with Émile for intelligence)
- A-1-026 to A-1-030 (Reserved for future tunnel exploration route)
- A-1-031 to A-1-035 (Reserved for future lighthouse/guard area route)

**Act 2: Kitchen Route (Drainage Path)**
- A-2-001 (Night 27 - Kitchen duty begins - 3 pages with per-page visuals)
- A-2-002 (Kitchen environment introduction)
- A-2-003 (Choice: methodical/bold/social approach)
- A-2-004A (Methodical: studying guard patterns - 3 pages with per-page visuals)
- A-2-004B (Bold: creating distraction - 3 pages with per-page visuals)
- A-2-004C (Social: befriending Carlos and Tomás)
- A-2-005A (Methodical: theft window approaching)
- A-2-005B (Bold: did you grab anything during chaos?)
- A-2-005C (Social: alliance formed, inmates will help - 2 pages with per-page visuals)
- A-2-006A (Methodical: grabbed kitchen knife successfully)
- A-2-006B (Methodical: grabbed waterproof cloth successfully)
- A-2-006C (Methodical: grabbed rope successfully)
- A-2-006D (Methodical: greedy grab, Chef Pierre notices - 2 pages with per-page visuals)
- A-2-007A (Bold: grabbed paring knife during distraction)
- A-2-007B (Bold: grabbed kitchen cloth during distraction)
- A-2-007C (Bold: played it safe, grabbed nothing)
- A-2-008 (Social: inmates create distraction, choose item)
- A-2-009 (Successful theft, exit kitchen)
- A-2-010 (Chef Pierre confronts you)
- A-2-011 (Failed theft, return to cell empty-handed)
- A-2-012 (Hide stolen item in cache - 2 pages with per-page visuals)
- A-2-013A (Played innocent, Chef Pierre backs off)
- A-2-013B (Created second distraction, escape)
- A-2-013C (Abandoned theft to avoid trouble)
- A-2-014 (Night 28 - Kitchen route complete, drainage escape next)

**Act 2: Tunnel Route (Deep Tunnels - Drainage Escape)**
- A-2-015 (Night 32 - Final escape begins - 3 pages with per-page visuals)
- A-2-016 (Chapel basement descent - 3 pages with per-page visuals)
- A-2-017 (Smuggler signs discovered in catacombs)
- A-2-018 (Three-way junction - choice to follow/ignore/study signs)
- A-2-019A (Followed smuggler signs, reached flooded section)
- A-2-019B (Ignored signs, caught in current)
- A-2-019C (Studied signs, understood tidal warning - 3 pages with per-page visuals)
- A-2-020 (Chest-deep water, choice to push forward or retreat)
- A-2-021 (Understood tidal timing, 30-minute window)
- A-2-022A (Pushed through flood with waterproof cloth - 3 pages with per-page visuals)
- A-2-022B (Pushed through without protection, lost tools - 3 pages with per-page visuals)
- A-2-022C (Turned back from flood, retreated safely)
- A-2-023A (Racing against the tide - 3 pages with per-page visuals)
- A-2-023B (Waited for low tide in side chamber - 3 pages with per-page visuals)
- A-2-023C (Reconsidering alternative routes)
- A-2-024 (Examining ocean grate, preparing to breach - 3 pages with per-page visuals)
- A-2-025 (Failed at grate without tools - critical failure)
- A-2-026 (Back at junction, choosing alternative route)
- A-2-027 (Reached grate at low tide, optimal timing)
- A-2-028 (Alternative route chosen, branches to future acts)
- A-2-029 (Breaking through ocean grate - 3 pages with per-page visuals)

**Act 2: Lighthouse Route (Vertical Shaft - Signal Escape)**
- A-2-030 (Night 29 - Lighthouse route planning - 3 pages with per-page visuals)
- A-2-031 (Choice: Bastian/Émile/Solo intelligence gathering)
- A-2-032A (Bastian shares Cordelia info - 3 pages with per-page visuals)
- A-2-032B (Émile demands payment for intel - 3 pages with per-page visuals)
- A-2-032C (Solo observation of Marcel's routine)
- A-2-033 (Cordelia payment negotiation)
- A-2-034 (Émile's harsh terms - three jobs owed)
- A-2-035 (Solo route confirmed, relying on hope)
- A-2-036A (Promised Cordelia money - lied about funds)
- A-2-036B (Offered Cordelia information trade)
- A-2-036C (Invited Bastian to escape together - 3 pages with per-page visuals)
- A-2-037A (Accepted Émile's deal, received intel)
- A-2-037B (Refused Émile, made enemy)
- A-2-038 (Night 35 - Final decision to climb)
- A-2-039 (Cordelia waiting offshore, signal pattern ready)
- A-2-040 (Two-person climb with Bastian - 3 pages with per-page visuals)
- A-2-041 (Solo climb with Émile's debt pending)
- A-2-042A (Climbing lighthouse tower - 3 pages with per-page visuals)
- A-2-042B (Aborted lighthouse plan, too risky)
- A-2-043 (Signal sent, boat responding - 3 pages with per-page visuals)
- A-2-044 (Lighthouse route postponed, needs preparation)

### Path B - The Conspiracy (Investigation Route)
- To be created

### Path C - The Violence (Power Route)
- A-3-001 (to be created)

### Endings
- END-1-ESCAPE (and 57 more to be created)
