# Game Page

This directory contains the main game page and related components for "El Palo de Queso".

## Purpose
- Main game interface
- Game state management
- Player interaction handling

## Current Implementation

### page.tsx
Main game page using the GameLayout component.

**Features:**
- Dark prison-themed full-screen layout
- Placeholder scene text (intro scene in Spanish)
- Three example choices (placeholder)
- Inventory sidebar with:
  - Sample items (metal spoon, old photo)
  - Sample evidence (fingerprint)
  - Sample relationships (Guard +25, Inmate -10)

**Route:** `/game`

The page currently displays static placeholder content. Future updates will connect to the Zustand store and load dynamic scene data from JSON files.
