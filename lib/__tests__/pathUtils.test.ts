/**
 * Tests for path utility functions
 */

import {
  getPathInfo,
  getAllPaths,
  getPathDisplayName,
  getPathColors,
  isSceneOnPath,
  isSharedScene,
  getPathFromSceneId,
  canAccessScene,
  getRecommendedPath,
  getPathSelectionSceneId,
} from '../pathUtils';

describe('Path Utils', () => {
  describe('getPathInfo', () => {
    it('should return info for Path A', () => {
      const info = getPathInfo('A');
      expect(info.id).toBe('A');
      expect(info.name).toBe('Path A: Night');
      expect(info.description).toContain('darkness');
      expect(info.approach).toContain('Stealth');
      expect(info.icon).toBe('🌙');
      expect(info.color).toBe('blue');
    });

    it('should return info for Path B', () => {
      const info = getPathInfo('B');
      expect(info.id).toBe('B');
      expect(info.name).toBe('Path B: Social');
      expect(info.description).toContain('alliances');
      expect(info.approach).toContain('Social');
      expect(info.icon).toBe('🤝');
      expect(info.color).toBe('green');
    });

    it('should return info for Path C', () => {
      const info = getPathInfo('C');
      expect(info.id).toBe('C');
      expect(info.name).toBe('Path C: Day (Justice)');
      expect(info.description).toContain('evidence');
      expect(info.approach).toContain('Investigation');
      expect(info.icon).toBe('⚖️');
      expect(info.color).toBe('amber');
    });

    it('should have all required fields', () => {
      const info = getPathInfo('A');
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('description');
      expect(info).toHaveProperty('approach');
      expect(info).toHaveProperty('icon');
      expect(info).toHaveProperty('color');
    });
  });

  describe('getAllPaths', () => {
    it('should return exactly 3 paths', () => {
      const paths = getAllPaths();
      expect(paths).toHaveLength(3);
    });

    it('should include all three path IDs', () => {
      const paths = getAllPaths();
      const ids = paths.map((p) => p.id);
      expect(ids).toContain('A');
      expect(ids).toContain('B');
      expect(ids).toContain('C');
    });

    it('should return paths in A, B, C order', () => {
      const paths = getAllPaths();
      expect(paths[0].id).toBe('A');
      expect(paths[1].id).toBe('B');
      expect(paths[2].id).toBe('C');
    });

    it('should return complete path info objects', () => {
      const paths = getAllPaths();
      paths.forEach((path) => {
        expect(path).toHaveProperty('id');
        expect(path).toHaveProperty('name');
        expect(path).toHaveProperty('description');
        expect(path).toHaveProperty('approach');
        expect(path).toHaveProperty('icon');
        expect(path).toHaveProperty('color');
      });
    });
  });

  describe('getPathDisplayName', () => {
    it('should return formatted name for Path A', () => {
      const name = getPathDisplayName('A');
      expect(name).toBe('🌙 Path A: Night');
    });

    it('should return formatted name for Path B', () => {
      const name = getPathDisplayName('B');
      expect(name).toBe('🤝 Path B: Social');
    });

    it('should return formatted name for Path C', () => {
      const name = getPathDisplayName('C');
      expect(name).toBe('⚖️ Path C: Day (Justice)');
    });

    it('should return placeholder for null path', () => {
      const name = getPathDisplayName(null);
      expect(name).toBe('No path selected');
    });
  });

  describe('getPathColors', () => {
    it('should return blue colors for Path A', () => {
      const colors = getPathColors('A');
      expect(colors.bg).toBe('bg-blue-100');
      expect(colors.text).toBe('text-blue-800');
      expect(colors.border).toBe('border-blue-600');
      expect(colors.hover).toBe('hover:bg-blue-200');
    });

    it('should return green colors for Path B', () => {
      const colors = getPathColors('B');
      expect(colors.bg).toBe('bg-green-100');
      expect(colors.text).toBe('text-green-800');
      expect(colors.border).toBe('border-green-600');
      expect(colors.hover).toBe('hover:bg-green-200');
    });

    it('should return amber colors for Path C', () => {
      const colors = getPathColors('C');
      expect(colors.bg).toBe('bg-amber-100');
      expect(colors.text).toBe('text-amber-800');
      expect(colors.border).toBe('border-amber-600');
      expect(colors.hover).toBe('hover:bg-amber-200');
    });

    it('should have all required color properties', () => {
      const colors = getPathColors('A');
      expect(colors).toHaveProperty('bg');
      expect(colors).toHaveProperty('text');
      expect(colors).toHaveProperty('border');
      expect(colors).toHaveProperty('hover');
    });
  });

  describe('isSceneOnPath', () => {
    it('should return true for Path A scenes', () => {
      expect(isSceneOnPath('A-1-001', 'A')).toBe(true);
      expect(isSceneOnPath('A-2-015', 'A')).toBe(true);
      expect(isSceneOnPath('A-0-005', 'A')).toBe(true);
    });

    it('should return true for Path B scenes', () => {
      expect(isSceneOnPath('B-1-001', 'B')).toBe(true);
      expect(isSceneOnPath('B-2-015', 'B')).toBe(true);
    });

    it('should return true for Path C scenes', () => {
      expect(isSceneOnPath('C-1-001', 'C')).toBe(true);
      expect(isSceneOnPath('C-2-015', 'C')).toBe(true);
    });

    it('should return false for scenes on different paths', () => {
      expect(isSceneOnPath('A-1-001', 'B')).toBe(false);
      expect(isSceneOnPath('B-1-001', 'C')).toBe(false);
      expect(isSceneOnPath('C-1-001', 'A')).toBe(false);
    });

    it('should return false for shared scenes', () => {
      expect(isSceneOnPath('X-0-001', 'A')).toBe(false);
      expect(isSceneOnPath('X-0-014', 'B')).toBe(false);
      expect(isSceneOnPath('X-1-020', 'C')).toBe(false);
    });
  });

  describe('isSharedScene', () => {
    it('should return true for X- scenes', () => {
      expect(isSharedScene('X-0-001')).toBe(true);
      expect(isSharedScene('X-0-014')).toBe(true);
      expect(isSharedScene('X-1-020')).toBe(true);
    });

    it('should return false for path-specific scenes', () => {
      expect(isSharedScene('A-1-001')).toBe(false);
      expect(isSharedScene('B-1-001')).toBe(false);
      expect(isSharedScene('C-1-001')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isSharedScene('X')).toBe(false); // Just 'X' doesn't have scene structure
      expect(isSharedScene('X-')).toBe(true); // Has X- prefix
      expect(isSharedScene('x-0-001')).toBe(false); // lowercase
    });
  });

  describe('getPathFromSceneId', () => {
    it('should return A for Path A scenes', () => {
      expect(getPathFromSceneId('A-1-001')).toBe('A');
      expect(getPathFromSceneId('A-2-015')).toBe('A');
    });

    it('should return B for Path B scenes', () => {
      expect(getPathFromSceneId('B-1-001')).toBe('B');
      expect(getPathFromSceneId('B-2-015')).toBe('B');
    });

    it('should return C for Path C scenes', () => {
      expect(getPathFromSceneId('C-1-001')).toBe('C');
      expect(getPathFromSceneId('C-2-015')).toBe('C');
    });

    it('should return null for shared scenes', () => {
      expect(getPathFromSceneId('X-0-001')).toBeNull();
      expect(getPathFromSceneId('X-0-014')).toBeNull();
    });

    it('should return null for invalid scene IDs', () => {
      expect(getPathFromSceneId('invalid')).toBeNull();
      expect(getPathFromSceneId('Z-1-001')).toBeNull();
      expect(getPathFromSceneId('')).toBeNull();
    });
  });

  describe('canAccessScene', () => {
    it('should allow access to shared scenes from any path', () => {
      expect(canAccessScene('X-0-001', 'A')).toBe(true);
      expect(canAccessScene('X-0-014', 'B')).toBe(true);
      expect(canAccessScene('X-1-020', 'C')).toBe(true);
    });

    it('should allow access to shared scenes with no path selected', () => {
      expect(canAccessScene('X-0-001', null)).toBe(true);
      expect(canAccessScene('X-0-014', null)).toBe(true);
    });

    it('should allow access to matching path scenes', () => {
      expect(canAccessScene('A-1-001', 'A')).toBe(true);
      expect(canAccessScene('B-1-001', 'B')).toBe(true);
      expect(canAccessScene('C-1-001', 'C')).toBe(true);
    });

    it('should deny access to non-matching path scenes', () => {
      expect(canAccessScene('A-1-001', 'B')).toBe(false);
      expect(canAccessScene('B-1-001', 'C')).toBe(false);
      expect(canAccessScene('C-1-001', 'A')).toBe(false);
    });

    it('should deny access to path-specific scenes with no path selected', () => {
      expect(canAccessScene('A-1-001', null)).toBe(false);
      expect(canAccessScene('B-1-001', null)).toBe(false);
      expect(canAccessScene('C-1-001', null)).toBe(false);
    });
  });

  describe('getRecommendedPath', () => {
    it('should recommend Path C when player has evidence', () => {
      const path = getRecommendedPath(true, 0, false);
      expect(path).toBe('C');
    });

    it('should recommend Path B when player has high relationships', () => {
      const path = getRecommendedPath(false, 3, false);
      expect(path).toBe('B');
    });

    it('should recommend Path A when player has stealth items', () => {
      const path = getRecommendedPath(false, 0, true);
      expect(path).toBe('A');
    });

    it('should prioritize relationships when they score higher', () => {
      const path = getRecommendedPath(true, 3, false);
      expect(path).toBe('B'); // Evidence score: 3, Relationships: 4.5
    });

    it('should prioritize evidence over stealth', () => {
      const path = getRecommendedPath(true, 0, true);
      expect(path).toBe('C'); // Evidence score: 3, Stealth: 2
    });

    it('should prioritize relationships over stealth', () => {
      const path = getRecommendedPath(false, 2, true);
      expect(path).toBe('B'); // Relationships: 3, Stealth: 2
    });

    it('should return null when no qualifying conditions', () => {
      const path = getRecommendedPath(false, 0, false);
      expect(path).toBeNull();
    });

    it('should handle tie-breaking consistently', () => {
      // When scores are equal, should prefer C > B > A based on order
      const path1 = getRecommendedPath(true, 2, false); // C: 3, B: 3
      expect(path1).toBe('C');
    });
  });

  describe('getPathSelectionSceneId', () => {
    it('should return the path selection scene ID', () => {
      expect(getPathSelectionSceneId()).toBe('X-0-014');
    });

    it('should always return the same ID', () => {
      const id1 = getPathSelectionSceneId();
      const id2 = getPathSelectionSceneId();
      expect(id1).toBe(id2);
    });
  });

  describe('Path System Integration', () => {
    it('should have consistent path IDs across functions', () => {
      const allPaths = getAllPaths();
      allPaths.forEach((pathInfo) => {
        const retrieved = getPathInfo(pathInfo.id as 'A' | 'B' | 'C');
        expect(retrieved.id).toBe(pathInfo.id);
        expect(retrieved.name).toBe(pathInfo.name);
      });
    });

    it('should have unique icons for each path', () => {
      const icons = getAllPaths().map((p) => p.icon);
      const uniqueIcons = [...new Set(icons)];
      expect(uniqueIcons.length).toBe(3);
    });

    it('should have unique colors for each path', () => {
      const colors = getAllPaths().map((p) => p.color);
      const uniqueColors = [...new Set(colors)];
      expect(uniqueColors.length).toBe(3);
    });

    it('should have unique names for each path', () => {
      const names = getAllPaths().map((p) => p.name);
      const uniqueNames = [...new Set(names)];
      expect(uniqueNames.length).toBe(3);
    });
  });
});
