/**
 * Tests for scene loader functionality
 */

import {
  loadScene,
  sceneExists,
  getAllSceneIds,
  getSceneCount,
  SceneNotFoundError,
} from '../sceneLoader';

describe('Scene Loader', () => {
  describe('loadScene', () => {
    it('should load a valid scene by ID', () => {
      const scene = loadScene('X-0-001');
      expect(scene).toBeDefined();
      expect(scene.id).toBe('X-0-001');
      expect(scene.type).toBe('narrative');
      expect(scene.content.text).toBeDefined();
    });

    it('should load a dialogue scene with speaker', () => {
      const scene = loadScene('X-0-002');
      expect(scene).toBeDefined();
      expect(scene.id).toBe('X-0-002');
      expect(scene.type).toBe('dialogue');
      expect(scene.content.speaker).toBe('Officer Ramirez');
    });

    it('should load a choice scene with multiple choices', () => {
      const scene = loadScene('A-1-001');
      expect(scene).toBeDefined();
      expect(scene.id).toBe('A-1-001');
      expect(scene.type).toBe('choice');
      expect(scene.choices.length).toBeGreaterThan(0);
    });

    it('should load an investigation scene with evidence', () => {
      const scene = loadScene('A-1-015');
      expect(scene).toBeDefined();
      expect(scene.id).toBe('A-1-015');
      expect(scene.type).toBe('investigation');
      expect(scene.itemChanges?.add).toContain('loose_brick');
    });

    it('should load an ending scene', () => {
      const scene = loadScene('END-1-ESCAPE');
      expect(scene).toBeDefined();
      expect(scene.id).toBe('END-1-ESCAPE');
      expect(scene.type).toBe('ending');
      expect(scene.flagChanges?.set).toContain('escaped_prison');
    });

    it('should throw SceneNotFoundError for invalid scene ID', () => {
      expect(() => loadScene('INVALID-ID')).toThrow(SceneNotFoundError);
      expect(() => loadScene('INVALID-ID')).toThrow('Scene not found: INVALID-ID');
    });

    it('should throw SceneNotFoundError for non-existent scene', () => {
      expect(() => loadScene('Z-9-999')).toThrow(SceneNotFoundError);
    });
  });

  describe('sceneExists', () => {
    it('should return true for existing scenes', () => {
      expect(sceneExists('X-0-001')).toBe(true);
      expect(sceneExists('X-0-002')).toBe(true);
      expect(sceneExists('A-1-001')).toBe(true);
      expect(sceneExists('A-1-015')).toBe(true);
      expect(sceneExists('END-1-ESCAPE')).toBe(true);
    });

    it('should return false for non-existent scenes', () => {
      expect(sceneExists('INVALID-ID')).toBe(false);
      expect(sceneExists('Z-9-999')).toBe(false);
      expect(sceneExists('')).toBe(false);
    });
  });

  describe('getAllSceneIds', () => {
    it('should return an array of all scene IDs', () => {
      const sceneIds = getAllSceneIds();
      expect(Array.isArray(sceneIds)).toBe(true);
      expect(sceneIds.length).toBeGreaterThan(0);
    });

    it('should include all sample scenes', () => {
      const sceneIds = getAllSceneIds();
      expect(sceneIds).toContain('X-0-001');
      expect(sceneIds).toContain('X-0-002');
      expect(sceneIds).toContain('A-1-001');
      expect(sceneIds).toContain('A-1-015');
      expect(sceneIds).toContain('END-1-ESCAPE');
    });
  });

  describe('getSceneCount', () => {
    it('should return the correct number of loaded scenes', () => {
      const count = getSceneCount();
      expect(count).toBe(5); // Based on sample-scenes.json
    });

    it('should match the length of getAllSceneIds', () => {
      const count = getSceneCount();
      const sceneIds = getAllSceneIds();
      expect(count).toBe(sceneIds.length);
    });
  });

  describe('Scene data integrity', () => {
    it('should load scenes with required fields', () => {
      const scene = loadScene('X-0-001');
      expect(scene.id).toBeDefined();
      expect(scene.type).toBeDefined();
      expect(scene.content).toBeDefined();
      expect(scene.content.text).toBeDefined();
      expect(scene.choices).toBeDefined();
      expect(Array.isArray(scene.choices)).toBe(true);
    });

    it('should preserve scene content structure', () => {
      const scene = loadScene('X-0-002');
      expect(scene.content.visual).toBeDefined();
      expect(scene.content.text).toBeDefined();
      expect(scene.content.speaker).toBeDefined();
    });

    it('should preserve choice data with changes', () => {
      const scene = loadScene('X-0-002');
      const choice = scene.choices[0];
      expect(choice.text).toBeDefined();
      expect(choice.nextScene).toBeDefined();
      expect(choice.relationshipChanges).toBeDefined();
      expect(choice.relationshipChanges?.ramirez).toBe(5);
    });

    it('should preserve flag changes in scenes', () => {
      const scene = loadScene('A-1-015');
      const choice = scene.choices[0];
      expect(choice.flagChanges?.set).toContain('found_cell_clue');
    });

    it('should preserve evidence changes', () => {
      const scene = loadScene('A-1-015');
      const choice = scene.choices[0];
      expect(choice.evidenceChanges?.add).toContain('mysterious_numbers');
    });
  });
});
