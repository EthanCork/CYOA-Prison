/**
 * Scene History Component
 * Displays list of previously visited scenes
 */

'use client';

import { useGameStore } from '@/lib/store';

interface SceneHistoryProps {
  /** Maximum number of items to display */
  maxItems?: number;
  /** Show as panel or inline list */
  variant?: 'panel' | 'inline';
  /** Allow clicking to navigate to scene */
  interactive?: boolean;
  /** Custom className */
  className?: string;
}

export default function SceneHistory({
  maxItems = 20,
  variant = 'panel',
  interactive = false,
  className = '',
}: SceneHistoryProps) {
  const { sceneHistory, currentScene, goToScene } = useGameStore();

  // Get the most recent scenes (limited by maxItems)
  const displayHistory = sceneHistory.slice(-maxItems).reverse();

  const handleSceneClick = (sceneId: string, index: number) => {
    if (!interactive) return;

    // Calculate how many steps back this is
    const stepsBack = index + 1;

    // Navigate back by removing the appropriate number of items from history
    const newHistory = sceneHistory.slice(0, -(stepsBack));

    // Go to the scene without adding to history
    goToScene(sceneId, false);

    // Manually set the history
    useGameStore.setState({ sceneHistory: newHistory });
  };

  if (sceneHistory.length === 0) {
    return (
      <div className={className || 'text-gray-500 italic text-center p-4'}>
        No scene history yet
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={className || 'text-sm text-gray-400'}>
        <span className="font-semibold">Recent: </span>
        {displayHistory.slice(0, 5).map((sceneId, index) => (
          <span key={index}>
            {sceneId}
            {index < Math.min(4, displayHistory.length - 1) && ' → '}
          </span>
        ))}
        {displayHistory.length > 5 && ' ...'}
      </div>
    );
  }

  return (
    <div className={className || 'bg-gray-800 rounded-lg p-6 border border-gray-700'}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Scene History</h3>
        <span className="text-sm text-gray-400">
          {sceneHistory.length} scene{sceneHistory.length !== 1 ? 's' : ''} visited
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {/* Current Scene */}
        <div className="flex items-center gap-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <div className="text-sm text-blue-200 font-semibold">Current Scene</div>
            <div className="text-white font-mono">{currentScene}</div>
          </div>
        </div>

        {/* History List */}
        {displayHistory.map((sceneId, index) => (
          <div
            key={index}
            onClick={() => handleSceneClick(sceneId, index)}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              interactive
                ? 'cursor-pointer hover:bg-gray-700/50 transition-colors'
                : ''
            } ${index === 0 ? 'bg-gray-700/30' : 'bg-gray-800/50'} border border-gray-700`}
          >
            <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-xs text-gray-400">
                {index === 0 ? 'Previous' : `${index + 1} step${index > 0 ? 's' : ''} back`}
              </div>
              <div className="text-gray-300 font-mono text-sm">{sceneId}</div>
            </div>
            {interactive && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {sceneHistory.length > maxItems && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing last {maxItems} of {sceneHistory.length} scenes
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded">
        <p className="text-xs text-yellow-200">
          <strong>Note:</strong> History is for reference only. Use the Back button to
          navigate to previous scenes.
        </p>
      </div>
    </div>
  );
}
