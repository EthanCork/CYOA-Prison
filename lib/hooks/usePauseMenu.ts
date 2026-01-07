/**
 * Pause Menu Hook
 * Manages pause menu state and keyboard shortcuts
 */

'use client';

import { useEffect, useState } from 'react';

export function usePauseMenu() {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle pause on Escape key
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const toggle = () => setIsPaused(prev => !prev);

  return {
    isPaused,
    pause,
    resume,
    toggle,
  };
}
