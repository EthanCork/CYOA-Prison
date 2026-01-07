/**
 * Tests for SceneHistory component
 */

import { render, screen } from '@testing-library/react';
import SceneHistory from '../SceneHistory';
import { useGameStore } from '@/lib/store';

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

describe('SceneHistory', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetGame();
  });

  describe('Panel Variant', () => {
    it('should show empty state when no history', () => {
      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('No scene history yet')).toBeInTheDocument();
    });

    it('should render panel with title when history exists', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('Scene History')).toBeInTheDocument();
    });

    it('should display current scene when history exists', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('Current Scene')).toBeInTheDocument();
      expect(screen.getByText('scene-1')).toBeInTheDocument();
    });

    it('should display scene count', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');
      store.goToScene('scene-2');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('2 scenes visited')).toBeInTheDocument();
    });

    it('should display singular scene text', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('1 scene visited')).toBeInTheDocument();
    });

    it('should show previous scenes in reverse order', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');
      store.goToScene('scene-2');
      store.goToScene('scene-3');

      render(<SceneHistory variant="panel" />);

      // Check that scene-2 appears (most recent in history)
      expect(screen.getByText('scene-2')).toBeInTheDocument();
      expect(screen.getByText('scene-1')).toBeInTheDocument();
      expect(screen.getByText('X-0-001')).toBeInTheDocument();
    });

    it('should mark previous scene', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');
      store.goToScene('scene-2');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should show step count for older scenes', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');
      store.goToScene('scene-2');
      store.goToScene('scene-3');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText('2 steps back')).toBeInTheDocument();
    });

    it('should limit displayed items to maxItems', () => {
      const store = useGameStore.getState();

      // Add 25 scenes
      for (let i = 1; i <= 25; i++) {
        store.goToScene(`scene-${i}`);
      }

      render(<SceneHistory variant="panel" maxItems={10} />);
      expect(screen.getByText('Showing last 10 of 20 scenes')).toBeInTheDocument();
    });

    it('should show note about reference only', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');

      render(<SceneHistory variant="panel" />);
      expect(screen.getByText(/History is for reference only/)).toBeInTheDocument();
    });
  });

  describe('Inline Variant', () => {
    it('should render inline text', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');
      store.goToScene('scene-2');

      render(<SceneHistory variant="inline" />);
      expect(screen.getByText(/Recent:/)).toBeInTheDocument();
    });

    it('should show empty state when no history', () => {
      render(<SceneHistory variant="inline" />);
      expect(screen.getByText('No scene history yet')).toBeInTheDocument();
    });

    it('should show recent scenes with arrows', () => {
      const store = useGameStore.getState();
      store.goToScene('scene-1');
      store.goToScene('scene-2');

      const { container } = render(<SceneHistory variant="inline" />);
      const text = container.textContent;

      expect(text).toContain('→');
      expect(text).toContain('scene-1');
    });

    it('should limit to 5 scenes in inline mode', () => {
      const store = useGameStore.getState();

      // Add 10 scenes
      for (let i = 1; i <= 10; i++) {
        store.goToScene(`scene-${i}`);
      }

      const { container } = render(<SceneHistory variant="inline" />);
      const text = container.textContent || '';

      // Should show ellipsis
      expect(text).toContain('...');
    });
  });

  describe('History Limit', () => {
    it('should respect 20 scene history limit in store', () => {
      const store = useGameStore.getState();

      // Add 25 scenes
      for (let i = 1; i <= 25; i++) {
        store.goToScene(`scene-${i}`);
      }

      // History should be limited to 20
      expect(useGameStore.getState().sceneHistory.length).toBe(20);
    });

    it('should show oldest scenes were removed', () => {
      const store = useGameStore.getState();

      // Add 25 scenes (will keep only last 20)
      for (let i = 1; i <= 25; i++) {
        store.goToScene(`scene-${i}`);
      }

      render(<SceneHistory variant="panel" />);

      // X-0-001 through scene-4 should be removed (5 items + current = 21 total, limit is 20)
      // History has: [scene-5, scene-6, ..., scene-24], current is scene-25
      expect(screen.queryByText('scene-1')).not.toBeInTheDocument();
      expect(screen.queryByText('scene-2')).not.toBeInTheDocument();
      expect(screen.queryByText('scene-3')).not.toBeInTheDocument();
      expect(screen.queryByText('scene-4')).not.toBeInTheDocument();

      // Should find recent scenes
      expect(screen.getByText('scene-24')).toBeInTheDocument();
      expect(screen.getByText('scene-5')).toBeInTheDocument(); // Oldest in history
    });

    it('should display overflow message', () => {
      const store = useGameStore.getState();

      // Add 25 scenes
      for (let i = 1; i <= 25; i++) {
        store.goToScene(`scene-${i}`);
      }

      render(<SceneHistory variant="panel" maxItems={10} />);

      // Should show that we're showing only 10 of 20
      expect(screen.getByText(/Showing last 10 of 20 scenes/)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SceneHistory variant="panel" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have scrollable area for long lists', () => {
      const store = useGameStore.getState();

      for (let i = 1; i <= 15; i++) {
        store.goToScene(`scene-${i}`);
      }

      const { container } = render(<SceneHistory variant="panel" />);
      const scrollArea = container.querySelector('.overflow-y-auto');
      expect(scrollArea).toBeInTheDocument();
    });
  });
});
