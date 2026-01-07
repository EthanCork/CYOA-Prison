/**
 * Back Button Component
 * Returns to previous scene in history
 */

'use client';

import { useGameStore } from '@/lib/store';

interface BackButtonProps {
  /** Custom className for styling */
  className?: string;
  /** Show full button text or icon only */
  variant?: 'full' | 'icon';
  /** Callback after going back */
  onBack?: () => void;
}

export default function BackButton({
  className = '',
  variant = 'full',
  onBack,
}: BackButtonProps) {
  const { sceneHistory, goBack } = useGameStore();
  const canGoBack = sceneHistory.length > 0;

  const handleBack = () => {
    if (canGoBack) {
      goBack();
      onBack?.();
    }
  };

  const defaultClassName =
    'px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2';

  return (
    <button
      onClick={handleBack}
      disabled={!canGoBack}
      className={className || defaultClassName}
      title={canGoBack ? 'Go back to previous scene' : 'No previous scenes'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      {variant === 'full' && <span>Back</span>}
    </button>
  );
}
