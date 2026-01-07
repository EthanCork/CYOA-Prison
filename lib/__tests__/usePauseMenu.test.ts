/**
 * Tests for usePauseMenu hook
 */

import { renderHook, act } from '@testing-library/react';
import { usePauseMenu } from '../hooks/usePauseMenu';

describe('usePauseMenu', () => {
  beforeEach(() => {
    // Clear any event listeners
    jest.clearAllMocks();
  });

  it('should initialize with isPaused as false', () => {
    const { result } = renderHook(() => usePauseMenu());
    expect(result.current.isPaused).toBe(false);
  });

  it('should provide pause function', () => {
    const { result } = renderHook(() => usePauseMenu());
    expect(typeof result.current.pause).toBe('function');
  });

  it('should provide resume function', () => {
    const { result } = renderHook(() => usePauseMenu());
    expect(typeof result.current.resume).toBe('function');
  });

  it('should provide toggle function', () => {
    const { result } = renderHook(() => usePauseMenu());
    expect(typeof result.current.toggle).toBe('function');
  });

  describe('pause function', () => {
    it('should set isPaused to true', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);
    });

    it('should keep isPaused true if called multiple times', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.pause();
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);
    });
  });

  describe('resume function', () => {
    it('should set isPaused to false', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.resume();
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('should keep isPaused false if called when already resumed', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.resume();
      });

      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('toggle function', () => {
    it('should toggle isPaused from false to true', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isPaused).toBe(true);
    });

    it('should toggle isPaused from true to false', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        result.current.toggle(); // true
        result.current.toggle(); // false
        result.current.toggle(); // true
      });

      expect(result.current.isPaused).toBe(true);
    });
  });

  describe('Escape key handling', () => {
    it('should toggle pause on Escape key press', () => {
      const { result } = renderHook(() => usePauseMenu());

      expect(result.current.isPaused).toBe(false);

      // Simulate Escape key press
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      expect(result.current.isPaused).toBe(true);
    });

    it('should toggle pause off on second Escape press', () => {
      const { result } = renderHook(() => usePauseMenu());

      // First Escape - pause
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      expect(result.current.isPaused).toBe(true);

      // Second Escape - resume
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('should not respond to other keys', () => {
      const { result } = renderHook(() => usePauseMenu());

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        window.dispatchEvent(event);
      });

      expect(result.current.isPaused).toBe(false);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Space' });
        window.dispatchEvent(event);
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('should prevent default on Escape key', () => {
      renderHook(() => usePauseMenu());

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should work with manual pause and Escape key', () => {
      const { result } = renderHook(() => usePauseMenu());

      // Manual pause
      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);

      // Escape to resume
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
      });

      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => usePauseMenu());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
