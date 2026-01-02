/**
 * SceneText component for displaying narrative text in El Palo de Queso
 * Includes optional typewriter effect and visual indicators
 */

'use client';

import { useEffect, useState } from 'react';

interface SceneTextProps {
  /** The main narrative text to display */
  text: string;
  /** Optional location indicator */
  location?: string;
  /** Optional mood/atmosphere indicator */
  mood?: string;
  /** Enable typewriter effect (default: false) */
  typewriter?: boolean;
  /** Typewriter speed in milliseconds per character (default: 30) */
  typewriterSpeed?: number;
  /** Callback when typewriter effect completes */
  onComplete?: () => void;
}

export default function SceneText({
  text,
  location,
  mood,
  typewriter = false,
  typewriterSpeed = 30,
  onComplete,
}: SceneTextProps) {
  const [displayedText, setDisplayedText] = useState(typewriter ? '' : text);
  const [isTyping, setIsTyping] = useState(typewriter);

  useEffect(() => {
    if (!typewriter) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        onComplete?.();
      }
    }, typewriterSpeed);

    return () => clearInterval(interval);
  }, [text, typewriter, typewriterSpeed, onComplete]);

  return (
    <div className="space-y-4">
      {/* Location & Mood Indicators */}
      {(location || mood) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {location && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-full">
              <svg
                className="w-4 h-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm text-gray-300 font-medium">{location}</span>
            </div>
          )}
          {mood && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-full">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="text-sm text-gray-300 font-medium">{mood}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Text Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg font-serif">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 ml-1 bg-amber-400 animate-pulse" />
          )}
        </p>
      </div>

      {/* Skip button for typewriter effect */}
      {typewriter && isTyping && (
        <button
          onClick={() => {
            setDisplayedText(text);
            setIsTyping(false);
            onComplete?.();
          }}
          className="mt-4 text-sm text-gray-400 hover:text-amber-400 transition-colors underline"
        >
          Saltar animación →
        </button>
      )}
    </div>
  );
}
