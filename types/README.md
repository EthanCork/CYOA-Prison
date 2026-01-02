# Types

This directory contains TypeScript type definitions and interfaces for "El Palo de Queso".

## Purpose
- Game state types
- Scene and choice types
- Item and character interfaces
- API and utility types

## Core Types

### Scene
Represents a scene in the game with content, choices, and effects.
- `id`: Unique identifier
- `content`: Narrative text
- `choices`: Available player choices
- `flags`: Flags set when scene is visited
- `items`: Items available in scene
- `relationships`: Character relationship changes
- `evidence`: Evidence that can be collected

### GameState
Tracks the current state of the game.
- `currentScene`: Current scene ID
- `inventory`: Player's items
- `relationships`: Character relationship scores
- `flags`: Set flags
- `evidence`: Collected evidence

### Choice
Represents a player choice with optional requirements.
- `text`: Choice text shown to player
- `nextScene`: Target scene ID
- `requirements`: Optional requirements (items, flags, relationships, evidence)

### Character
Represents a character in the game.
- `id`: Unique identifier
- `name`: Display name
- `relationshipScore`: Score from -100 to 100
- `description`: Character description

### Item & Evidence
Simple entities that can be collected.
- `id`: Unique identifier
- `name`: Display name
- `description`: Description text
