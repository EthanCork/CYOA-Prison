/**
 * Visual Novel Scene Component
 * Fullscreen background with text overlay and interactive hotspots
 */

'use client';

import { useState, useEffect } from 'react';
import type { Scene, Choice, Hotspot, HotspotAction } from '@/types';

interface VisualNovelSceneProps {
  scene: Scene;
  onChoiceSelected: (choice: Choice) => void;
  onContinue: (nextSceneId: string) => void;
  isChoiceAvailable?: (choice: Choice) => boolean;
  onHotspotInteraction?: (hotspot: Hotspot, action: HotspotAction) => void;
  isHotspotAvailable?: (hotspot: Hotspot) => boolean;
  interactedHotspots?: Set<string>;
}

export default function VisualNovelScene({
  scene,
  onChoiceSelected,
  onContinue,
  isChoiceAvailable = () => true,
  onHotspotInteraction,
  isHotspotAvailable = () => true,
  interactedHotspots = new Set(),
}: VisualNovelSceneProps) {
  const [showText, setShowText] = useState(true);
  const [hoveredChoice, setHoveredChoice] = useState<number | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [examinedText, setExaminedText] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Check if content uses pagination
  const hasPages = scene.content.pages && scene.content.pages.length > 0;
  const totalPages = hasPages ? scene.content.pages!.length : 1;
  const currentText = hasPages ? scene.content.pages![currentPage] : scene.content.text;
  const currentVisual = scene.content.pageVisuals && scene.content.pageVisuals[currentPage]
    ? scene.content.pageVisuals[currentPage]
    : scene.content.visual;
  const isLastPage = currentPage === totalPages - 1;

  const hasChoices = scene.choices && scene.choices.length > 0;
  const canContinue = !hasChoices && scene.nextScene && isLastPage;
  const canAdvancePage = hasPages && !isLastPage;
  const hasHotspots = scene.hotspots && scene.hotspots.length > 0;

  // Reset page when scene changes
  useEffect(() => {
    setCurrentPage(0);
  }, [scene.id]);

  const handleBackgroundClick = () => {
    if (canAdvancePage) {
      setCurrentPage(currentPage + 1);
    } else if (canContinue && scene.nextScene) {
      onContinue(scene.nextScene);
    }
  };

  const handleChoiceClick = (choice: Choice) => {
    if (isChoiceAvailable(choice)) {
      onChoiceSelected(choice);
    }
  };

  const handleHotspotClick = (hotspot: Hotspot, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent background click

    if (!isHotspotAvailable(hotspot)) return;
    if (hotspot.action.oneTime && interactedHotspots.has(hotspot.id)) return;

    const { action } = hotspot;

    // Handle examine action with text popup
    if (action.type === 'examine' && action.text) {
      setExaminedText(action.text);
    }

    // Notify parent component of interaction
    if (onHotspotInteraction) {
      onHotspotInteraction(hotspot, action);
    }
  };

  // Generate placeholder background based on scene visual description
  const getBackgroundStyle = () => {
    const visualDesc = scene.content.visual || '';

    // Map common locations to color schemes
    const colorMap: Record<string, string> = {
      'prison': 'from-gray-800 via-gray-900 to-black',
      'cell': 'from-gray-700 via-gray-800 to-gray-900',
      'yard': 'from-blue-900 via-gray-800 to-gray-700',
      'cafeteria': 'from-amber-950 via-gray-800 to-gray-900',
      'chapel': 'from-purple-950 via-gray-900 to-black',
      'lighthouse': 'from-blue-950 via-slate-800 to-gray-900',
      'dock': 'from-blue-950 via-slate-900 to-gray-800',
      'boat': 'from-blue-900 via-slate-800 to-gray-900',
      'courtroom': 'from-amber-950 via-gray-800 to-black',
      'train': 'from-red-950 via-gray-800 to-black',
    };

    for (const [key, gradient] of Object.entries(colorMap)) {
      if (visualDesc.toLowerCase().includes(key)) {
        return `bg-gradient-to-b ${gradient}`;
      }
    }

    return 'bg-gradient-to-b from-gray-900 via-gray-800 to-black';
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden cursor-pointer`}
      onClick={handleBackgroundClick}
    >
      {/* Background image */}
      {currentVisual ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentVisual})` }}
        />
      ) : (
        // Fallback gradient if no image specified
        <div className={`absolute inset-0 ${getBackgroundStyle()}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-9xl text-white/20">Scene</div>
          </div>
        </div>
      )}

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Interactive hotspots */}
      {hasHotspots && scene.hotspots!.map((hotspot) => {
        const isAvailable = isHotspotAvailable(hotspot);
        const isInteracted = interactedHotspots.has(hotspot.id);
        const shouldHide = hotspot.action.oneTime && isInteracted;

        if (shouldHide || !isAvailable) return null;

        const isHovered = hoveredHotspot === hotspot.id;

        return (
          <div
            key={hotspot.id}
            className="absolute cursor-pointer transition-all duration-200 z-30"
            style={{
              left: `${hotspot.position.x}%`,
              top: `${hotspot.position.y}%`,
              width: `${hotspot.position.width}%`,
              height: `${hotspot.position.height}%`,
            }}
            onClick={(e) => handleHotspotClick(hotspot, e)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            {/* Hotspot highlight */}
            <div className={`absolute inset-0 rounded-lg border-2 transition-all duration-200 ${
              isHovered
                ? 'bg-amber-400/20 border-amber-400 shadow-lg shadow-amber-400/50'
                : 'bg-transparent border-amber-400/0 hover:border-amber-400/50'
            }`} />

            {/* Hotspot label */}
            {isHovered && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-amber-400 px-3 py-1 rounded text-sm whitespace-nowrap border border-amber-600/50">
                {hotspot.label}
              </div>
            )}
          </div>
        );
      })}

      {/* Examined text popup */}
      {examinedText && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-40 p-8"
          onClick={(e) => {
            e.stopPropagation();
            setExaminedText(null);
          }}
        >
          <div className="max-w-2xl bg-gray-900 border-2 border-amber-600 rounded-lg p-8 shadow-2xl">
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap mb-4">
              {examinedText}
            </p>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-gray-900 font-semibold rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setExaminedText(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text overlay area - bottom portion */}
      {showText && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="bg-gradient-to-t from-black/95 via-black/90 to-transparent pt-32 pb-8 px-8">
            <div className="max-w-4xl mx-auto pointer-events-auto">
              {/* Speaker name if dialogue */}
              {scene.content.speaker && (
                <div className="mb-3">
                  <span className="inline-block px-4 py-2 bg-amber-600/90 text-white font-semibold rounded-t-lg">
                    {scene.content.speaker}
                  </span>
                </div>
              )}

              {/* Main text */}
              <div
                className="bg-black/80 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-amber-600/30 cursor-pointer"
                onClick={(canContinue || canAdvancePage) ? handleBackgroundClick : undefined}
              >
                <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                  {currentText}
                </p>

                {/* Page indicator for multi-page content */}
                {hasPages && (
                  <div className="mt-3 flex justify-center">
                    <div className="flex gap-1.5">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentPage
                              ? 'bg-amber-400 w-6'
                              : index < currentPage
                              ? 'bg-amber-600/60'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Continue/Next page indicator */}
                {(canContinue || canAdvancePage) && (
                  <div className="mt-4 flex justify-end">
                    <div className="text-amber-400 text-sm animate-pulse flex items-center gap-2">
                      <span>{canAdvancePage ? 'Click to continue' : 'Click to continue'}</span>
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Choices - only show on last page */}
              {hasChoices && isLastPage && (
                <div className="mt-6 space-y-3" onClick={(e) => e.stopPropagation()}>
                  {scene.choices.map((choice, index) => {
                    const available = isChoiceAvailable(choice);
                    return (
                      <button
                        key={index}
                        onClick={() => handleChoiceClick(choice)}
                        onMouseEnter={() => setHoveredChoice(index)}
                        onMouseLeave={() => setHoveredChoice(null)}
                        disabled={!available}
                        className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-200 ${
                          available
                            ? hoveredChoice === index
                              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/50 transform scale-105'
                              : 'bg-gray-900/90 hover:bg-gray-800/90 text-gray-100 border border-amber-600/50'
                            : 'bg-gray-900/50 text-gray-500 border border-gray-700/30 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 font-bold">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="flex-1">{choice.text}</span>
                          {!available && (
                            <span className="text-xs text-gray-600">(Locked)</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toggle text visibility button (top right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowText(!showText);
        }}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-200 border border-amber-600/30"
      >
        {showText ? 'Hide Text' : 'Show Text'}
      </button>

      {/* Scene info (top left) */}
      <div className="absolute top-4 left-4 z-40 px-3 py-2 bg-black/70 rounded text-xs text-gray-400 font-mono">
        {scene.id}
      </div>
    </div>
  );
}
