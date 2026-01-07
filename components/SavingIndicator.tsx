/**
 * Saving Indicator Component
 * Brief visual indicator shown during auto-save
 */

'use client';

import { useEffect, useState } from 'react';

interface SavingIndicatorProps {
  /** Whether saving is in progress */
  isSaving: boolean;
  /** Duration to show the indicator after saving completes (ms) */
  showDuration?: number;
}

export default function SavingIndicator({
  isSaving,
  showDuration = 1500,
}: SavingIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSaving) {
      setIsVisible(true);
      setShowSuccess(false);
    } else if (isVisible) {
      // Show success briefly before hiding
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowSuccess(false);
      }, showDuration);

      return () => clearTimeout(timer);
    }
  }, [isSaving, isVisible, showDuration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors ${
          showSuccess
            ? 'bg-green-900 text-green-200'
            : 'bg-gray-800 text-gray-200'
        }`}
      >
        {showSuccess ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Saved</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="font-medium">Saving...</span>
          </>
        )}
      </div>
    </div>
  );
}
