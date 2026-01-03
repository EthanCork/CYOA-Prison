/**
 * ChoiceButton component for displaying interactive choices in El Palo de Queso
 * Supports disabled state for locked choices and dark theme styling
 */

'use client';

import { useState } from 'react';
import type { Choice } from '@/types';

interface ChoiceButtonProps {
  /** The choice data to display */
  choice: Choice;
  /** Whether the choice is disabled/locked */
  disabled?: boolean;
  /** Callback when the choice is clicked */
  onClick?: (choice: Choice) => void;
  /** Optional custom styling class */
  className?: string;
  /** Show lock reason when disabled */
  lockReason?: string;
  /** Index number for the choice (optional, for display) */
  index?: number;
}

export default function ChoiceButton({
  choice,
  disabled = false,
  onClick,
  className = '',
  lockReason,
  index,
}: ChoiceButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(choice);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-full text-left px-6 py-4 rounded-lg
          transition-all duration-200 ease-in-out
          font-medium text-base
          ${
            disabled
              ? 'bg-gray-800/50 border-2 border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
              : 'bg-gray-800 border-2 border-amber-600/50 text-gray-200 hover:border-amber-500 hover:bg-gray-700 hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer active:scale-[0.98]'
          }
          ${className}
        `}
        aria-label={choice.text}
        aria-disabled={disabled}
      >
        <div className="flex items-start gap-3">
          {/* Choice Number Badge (if provided) */}
          {index !== undefined && (
            <span
              className={`
                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  disabled
                    ? 'bg-gray-700 text-gray-500'
                    : 'bg-amber-600 text-gray-900'
                }
              `}
            >
              {index}
            </span>
          )}

          {/* Lock Icon (if disabled) */}
          {disabled && (
            <svg
              className="flex-shrink-0 w-5 h-5 text-gray-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          )}

          {/* Choice Text */}
          <span className="flex-1 leading-relaxed">
            {choice.text}
          </span>

          {/* Arrow Icon (if not disabled) */}
          {!disabled && (
            <svg
              className={`
                flex-shrink-0 w-5 h-5 text-amber-500 transition-transform duration-200
                ${isHovered ? 'translate-x-1' : ''}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          )}
        </div>

        {/* Lock Reason Tooltip */}
        {disabled && lockReason && (
          <div className="mt-2 text-xs text-gray-600 italic">
            {lockReason}
          </div>
        )}

        {/* Hover Effect Indicator */}
        {!disabled && isHovered && (
          <div className="absolute inset-0 bg-amber-500/5 rounded-lg pointer-events-none" />
        )}
      </button>

      {/* Metadata Display (for development/debugging) */}
      {process.env.NODE_ENV === 'development' && !disabled && isHovered && (
        <div className="absolute left-0 right-0 top-full mt-2 p-2 bg-gray-900 border border-gray-700 rounded text-xs text-gray-400 z-10">
          <div>Next Scene: {choice.nextScene}</div>
          {choice.relationshipChanges && (
            <div className="text-purple-400">
              Relationships: {JSON.stringify(choice.relationshipChanges)}
            </div>
          )}
          {choice.flagChanges && (
            <div className="text-green-400">
              Flags: {JSON.stringify(choice.flagChanges)}
            </div>
          )}
          {choice.itemChanges && (
            <div className="text-blue-400">
              Items: {JSON.stringify(choice.itemChanges)}
            </div>
          )}
          {choice.evidenceChanges && (
            <div className="text-yellow-400">
              Evidence: {JSON.stringify(choice.evidenceChanges)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
