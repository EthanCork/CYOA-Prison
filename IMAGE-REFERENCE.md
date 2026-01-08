# Image Reference Guide - Act 0 Opening Scenes

## Directory Structure
```
/public/
  └── images/
      ├── backgrounds/    (Full screen background images)
      └── characters/     (Character portraits for dialogue)
```

## Required Images for Act 0

### Background Images (Locations)
Place these in: `/public/images/backgrounds/`

| Filename | Scene ID | Description | Setting |
|----------|----------|-------------|---------|
| `X-0-001.png` | X-0-001 | Title card / Prison island silhouette | Dramatic opening shot of Île de Pierre from sea |
| `X-0-002.png` | X-0-002 | Train crash aftermath | Derailed train, bodies, chaos - 1923 France |
| `X-0-003.png` | X-0-003 | French courtroom | 1920s courtroom, judge's bench, gallery |
| `X-0-004.png` | X-0-004 | Prison boat on Brittany coast | Transport boat, grey waters, prison fortress ahead |
| `X-0-007.png` | X-0-007 | Prison dock arrival | Stone dock, guard towers, iron gates |

### Character Portraits (Dialogue Scenes)
Place these in: `/public/images/characters/`

| Filename | Scene ID | Character | Expression/Mood |
|----------|----------|-----------|-----------------|
| `X-0-005.png` | X-0-005 | Guard Captain Legrand | Neutral, sizing you up |
| `X-0-006A.png` | X-0-006A | Guard Captain Legrand | Approving, giving advice (cooperative path) |
| `X-0-006B.png` | X-0-006B | Guard Captain Legrand | Angry, dismissive (defiant path) |
| `X-0-006C.png` | X-0-006C | Guard Captain Legrand | Respectful, neutral (silent path) |

## Naming Convention Benefits

✅ **Scene ID = Filename**: Instantly know which file belongs to which scene
✅ **Easy to track**: Missing image? The 404 error shows exactly which scene
✅ **Organized**: Files sort naturally in your folder
✅ **Scalable**: Works for all 58 endings (A-1-001.jpg, B-2-015.jpg, etc.)

## Image Specifications

### Backgrounds
- **Resolution**: 1920x1080 minimum (can be higher)
- **Aspect Ratio**: 16:9 (will be cropped/scaled with `bg-cover`)
- **Format**: PNG (or JPG for smaller file size)
- **Style**: Dark, moody, 1920s French prison aesthetic
- **Lighting**: Leave room for text overlay at bottom (gradient darkens bottom 1/3)

### Character Portraits
- **Resolution**: 800x1200 or similar portrait aspect
- **Format**: PNG (allows transparency for character cutouts)
- **Style**: Should match background art style
- **Framing**: Chest-up or waist-up portrait
- **Background**: Can be solid color or semi-transparent

## Visual Style Guide

### Act 0 Theme: Despair & Imprisonment
- **Color Palette**: Greys, dark blues, amber/sepia tones
- **Mood**: Oppressive, hopeless, unjust
- **Era**: 1923 France - post-WWI aesthetic

### Specific Scene Moods:

**X-0-001 (Title)**: Imposing, mysterious, isolated
- Prison fortress silhouetted against stormy sky
- Atlantic waves crashing on rocks
- Sense of no escape

**X-0-002 (Train Crash)**: Chaos, tragedy, guilt
- Mangled train carriages
- 1920s French railway
- Sense of disaster and death

**X-0-003 (Courtroom)**: Injustice, powerlessness
- French courtroom with wood paneling
- Judge's bench elevated and imposing
- Gallery with watching faces

**X-0-004 (Prison Boat)**: Dread, finality
- Small transport boat on grey ocean
- Prison fortress growing larger ahead
- Chains, other prisoners

**X-0-005-007 (Legrand Dialogue)**: First impressions, survival
- Stern French guard captain, 40s-50s
- Prison uniform, keys, baton
- Three expressions: neutral, approving, angry

**X-0-007 (Dock Arrival)**: Point of no return
- Wet stone dock
- Iron gates opening
- Guard towers watching
- First steps into prison

## Current Status

✅ All scenes updated to use scene ID naming
✅ Directory structure created
⏳ Awaiting images from artist/generation

Once you have the images, simply drop them into the appropriate folders with the exact filenames listed above!

## Testing

To test an image is loading:
1. Place image in `/public/images/backgrounds/` or `/public/images/characters/`
2. Visit `http://localhost:3000/images/backgrounds/X-0-001.png` directly
3. If it loads, the game will display it

## Fallback Behavior

If an image is missing:
- Backgrounds: Shows gradient placeholder based on scene type
- Characters: Shows gradient with scene name
- No errors, game continues to work
