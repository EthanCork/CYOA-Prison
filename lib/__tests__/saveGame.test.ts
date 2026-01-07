/**
 * Tests for save/load game functionality
 */

import type { GameState } from '@/types';
import {
  saveGame,
  loadGame,
  deleteSave,
  getSaveSlotMetadata,
  getAllSaveSlots,
  isSaveSlotEmpty,
  getMostRecentSaveSlot,
  hasSavedGames,
  exportSave,
  importSave,
  MAX_SAVE_SLOTS,
} from '../saveGame';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('saveGame', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: null,
    dayTime: null,
    workAssignment: null,
    inventory: ['item1', 'item2'],
    relationships: { char1: 50, char2: -30 },
    discoveredCharacters: ['char1', 'char2'],
    flags: ['flag1', 'flag2'],
    evidence: ['evidence1'],
    stats: {
      scenesVisited: 10,
      choicesMade: 5,
      itemsFound: 2,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: null,
      playTimeSeconds: 120,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should save game state to localStorage', () => {
    const result = saveGame(1, mockGameState);

    expect(result.gameState).toEqual(mockGameState);
    expect(result.metadata.slotNumber).toBe(1);
    expect(result.metadata.currentScene).toBe('X-0-001');
    expect(result.metadata.currentPath).toBeNull();
    expect(result.version).toBe('1.0.0');
  });

  it('should include timestamp in saved game', () => {
    const before = Date.now();
    const result = saveGame(1, mockGameState);
    const after = Date.now();

    expect(result.metadata.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.metadata.timestamp).toBeLessThanOrEqual(after);
    expect(result.metadata.dateString).toBeTruthy();
  });

  it('should support multiple save slots', () => {
    const state1 = { ...mockGameState, currentScene: 'scene1' };
    const state2 = { ...mockGameState, currentScene: 'scene2' };
    const state3 = { ...mockGameState, currentScene: 'scene3' };

    saveGame(1, state1);
    saveGame(2, state2);
    saveGame(3, state3);

    const loaded1 = loadGame(1);
    const loaded2 = loadGame(2);
    const loaded3 = loadGame(3);

    expect(loaded1?.gameState.currentScene).toBe('scene1');
    expect(loaded2?.gameState.currentScene).toBe('scene2');
    expect(loaded3?.gameState.currentScene).toBe('scene3');
  });

  it('should throw error for invalid slot number', () => {
    expect(() => saveGame(0, mockGameState)).toThrow('Invalid save slot number');
    expect(() => saveGame(4, mockGameState)).toThrow('Invalid save slot number');
    expect(() => saveGame(-1, mockGameState)).toThrow('Invalid save slot number');
  });

  it('should overwrite existing save in same slot', () => {
    const state1 = { ...mockGameState, currentScene: 'old-scene' };
    const state2 = { ...mockGameState, currentScene: 'new-scene' };

    saveGame(1, state1);
    saveGame(1, state2);

    const loaded = loadGame(1);
    expect(loaded?.gameState.currentScene).toBe('new-scene');
  });
});

describe('loadGame', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: 'A',
    dayTime: null,
    workAssignment: null,
    inventory: ['item1'],
    relationships: { char1: 50 },
    discoveredCharacters: ['char1'],
    flags: ['flag1'],
    evidence: [],
    stats: {
      scenesVisited: 10,
      choicesMade: 5,
      itemsFound: 1,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: 'A',
      playTimeSeconds: 120,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should load saved game state', () => {
    saveGame(1, mockGameState);
    const loaded = loadGame(1);

    expect(loaded).not.toBeNull();
    expect(loaded?.gameState).toEqual(mockGameState);
  });

  it('should return null for empty slot', () => {
    const loaded = loadGame(1);
    expect(loaded).toBeNull();
  });

  it('should load correct slot', () => {
    const state1 = { ...mockGameState, currentScene: 'scene1' };
    const state2 = { ...mockGameState, currentScene: 'scene2' };

    saveGame(1, state1);
    saveGame(2, state2);

    const loaded1 = loadGame(1);
    const loaded2 = loadGame(2);

    expect(loaded1?.gameState.currentScene).toBe('scene1');
    expect(loaded2?.gameState.currentScene).toBe('scene2');
  });

  it('should handle corrupted save data', () => {
    localStorage.setItem('el-palo-de-queso-save-1', 'invalid json');
    expect(() => loadGame(1)).toThrow();
  });
});

describe('deleteSave', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: null,
    dayTime: null,
    workAssignment: null,
    inventory: [],
    relationships: {},
    discoveredCharacters: [],
    flags: [],
    evidence: [],
    stats: {
      scenesVisited: 0,
      choicesMade: 0,
      itemsFound: 0,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: null,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should delete saved game', () => {
    saveGame(1, mockGameState);
    expect(loadGame(1)).not.toBeNull();

    deleteSave(1);
    expect(loadGame(1)).toBeNull();
  });

  it('should not affect other slots', () => {
    saveGame(1, mockGameState);
    saveGame(2, mockGameState);
    saveGame(3, mockGameState);

    deleteSave(2);

    expect(loadGame(1)).not.toBeNull();
    expect(loadGame(2)).toBeNull();
    expect(loadGame(3)).not.toBeNull();
  });

  it('should not throw error for empty slot', () => {
    expect(() => deleteSave(1)).not.toThrow();
  });
});

describe('getSaveSlotMetadata', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: 'C',
    dayTime: { day: 3, timeOfDay: 'morning' },
    workAssignment: 'kitchen',
    inventory: [],
    relationships: {},
    discoveredCharacters: [],
    flags: [],
    evidence: [],
    stats: {
      scenesVisited: 50,
      choicesMade: 20,
      itemsFound: 5,
      relationshipsMaxed: 1,
      relationshipsMinned: 0,
      stageReached: 3,
      pathTaken: 'C',
      playTimeSeconds: 3600,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return metadata without loading full state', () => {
    saveGame(1, mockGameState);
    const metadata = getSaveSlotMetadata(1);

    expect(metadata).not.toBeNull();
    expect(metadata?.slotNumber).toBe(1);
    expect(metadata?.currentScene).toBe('X-0-001');
    expect(metadata?.currentPath).toBe('C');
    expect(metadata?.dayTime).toEqual({ day: 3, timeOfDay: 'morning' });
    expect(metadata?.playTimeSeconds).toBe(3600);
  });

  it('should return null for empty slot', () => {
    const metadata = getSaveSlotMetadata(1);
    expect(metadata).toBeNull();
  });
});

describe('getAllSaveSlots', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: null,
    dayTime: null,
    workAssignment: null,
    inventory: [],
    relationships: {},
    discoveredCharacters: [],
    flags: [],
    evidence: [],
    stats: {
      scenesVisited: 0,
      choicesMade: 0,
      itemsFound: 0,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: null,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return array of all save slots', () => {
    const slots = getAllSaveSlots();
    expect(slots).toHaveLength(MAX_SAVE_SLOTS);
  });

  it('should return null for empty slots', () => {
    const slots = getAllSaveSlots();
    expect(slots.every((slot) => slot === null)).toBe(true);
  });

  it('should return metadata for filled slots', () => {
    saveGame(1, mockGameState);
    saveGame(3, mockGameState);

    const slots = getAllSaveSlots();

    expect(slots[0]).not.toBeNull();
    expect(slots[1]).toBeNull();
    expect(slots[2]).not.toBeNull();
  });
});

describe('isSaveSlotEmpty', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: null,
    dayTime: null,
    workAssignment: null,
    inventory: [],
    relationships: {},
    discoveredCharacters: [],
    flags: [],
    evidence: [],
    stats: {
      scenesVisited: 0,
      choicesMade: 0,
      itemsFound: 0,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: null,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return true for empty slot', () => {
    expect(isSaveSlotEmpty(1)).toBe(true);
  });

  it('should return false for filled slot', () => {
    saveGame(1, mockGameState);
    expect(isSaveSlotEmpty(1)).toBe(false);
  });
});

describe('getMostRecentSaveSlot', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: null,
    dayTime: null,
    workAssignment: null,
    inventory: [],
    relationships: {},
    discoveredCharacters: [],
    flags: [],
    evidence: [],
    stats: {
      scenesVisited: 0,
      choicesMade: 0,
      itemsFound: 0,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: null,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return null when no saves exist', () => {
    expect(getMostRecentSaveSlot()).toBeNull();
  });

  it('should return most recent save slot', async () => {
    saveGame(1, mockGameState);
    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    saveGame(2, mockGameState);
    await new Promise(resolve => setTimeout(resolve, 10));
    saveGame(3, mockGameState);

    const mostRecent = getMostRecentSaveSlot();
    expect(mostRecent).toBe(3);
  });
});

describe('hasSavedGames', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: [],
    currentPath: null,
    dayTime: null,
    workAssignment: null,
    inventory: [],
    relationships: {},
    discoveredCharacters: [],
    flags: [],
    evidence: [],
    stats: {
      scenesVisited: 0,
      choicesMade: 0,
      itemsFound: 0,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 0,
      pathTaken: null,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return false when no saves exist', () => {
    expect(hasSavedGames()).toBe(false);
  });

  it('should return true when at least one save exists', () => {
    saveGame(1, mockGameState);
    expect(hasSavedGames()).toBe(true);
  });
});

describe('exportSave and importSave', () => {
  const mockGameState: GameState = {
    currentScene: 'X-0-001',
    sceneHistory: ['scene1', 'scene2'],
    currentPath: 'B',
    dayTime: null,
    workAssignment: null,
    inventory: ['item1', 'item2'],
    relationships: { char1: 75 },
    discoveredCharacters: ['char1'],
    flags: ['flag1'],
    evidence: ['evidence1'],
    stats: {
      scenesVisited: 25,
      choicesMade: 15,
      itemsFound: 2,
      relationshipsMaxed: 0,
      relationshipsMinned: 0,
      stageReached: 2,
      pathTaken: 'B',
      playTimeSeconds: 1800,
    },
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should export save as JSON string', () => {
    saveGame(1, mockGameState);
    const exported = exportSave(1);

    expect(exported).not.toBeNull();
    expect(typeof exported).toBe('string');

    const parsed = JSON.parse(exported!);
    expect(parsed.gameState).toEqual(mockGameState);
  });

  it('should return null for empty slot', () => {
    const exported = exportSave(1);
    expect(exported).toBeNull();
  });

  it('should import save from JSON string', () => {
    saveGame(1, mockGameState);
    const exported = exportSave(1);

    localStorageMock.clear();

    importSave(2, exported!);
    const loaded = loadGame(2);

    expect(loaded?.gameState).toEqual(mockGameState);
    expect(loaded?.metadata.slotNumber).toBe(2);
  });

  it('should throw error for invalid JSON', () => {
    expect(() => importSave(1, 'invalid json')).toThrow();
  });
});
