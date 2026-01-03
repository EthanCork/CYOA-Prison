/**
 * StateChangeNotification component
 * Displays visual feedback when game state changes (items gained, flags set, relationships changed)
 */

'use client';

import { useEffect, useState } from 'react';

export type StateChange = {
  type: 'item' | 'flag' | 'relationship' | 'evidence';
  action: 'add' | 'remove' | 'increase' | 'decrease' | 'set' | 'unset';
  name: string;
  value?: number;
  icon?: string;
};

interface StateChangeNotificationProps {
  changes: StateChange[];
  duration?: number;
  onComplete?: () => void;
}

export default function StateChangeNotification({
  changes,
  duration = 3000,
  onComplete,
}: StateChangeNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (changes.length === 0) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300); // Wait for fade animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [changes, duration, onComplete]);

  if (!visible || changes.length === 0) {
    return null;
  }

  const getChangeIcon = (change: StateChange): string => {
    if (change.icon) return change.icon;

    switch (change.type) {
      case 'item':
        return change.action === 'add' ? '📦' : '🗑️';
      case 'flag':
        return change.action === 'set' ? '🚩' : '⚐';
      case 'relationship':
        return change.action === 'increase' ? '💚' : '💔';
      case 'evidence':
        return change.action === 'add' ? '📋' : '🗑️';
      default:
        return '•';
    }
  };

  const getChangeColor = (change: StateChange): string => {
    switch (change.type) {
      case 'item':
        return change.action === 'add' ? 'text-amber-300' : 'text-gray-400';
      case 'flag':
        return change.action === 'set' ? 'text-green-300' : 'text-gray-400';
      case 'relationship':
        return change.action === 'increase' ? 'text-green-300' : 'text-red-300';
      case 'evidence':
        return change.action === 'add' ? 'text-yellow-300' : 'text-gray-400';
      default:
        return 'text-gray-300';
    }
  };

  const getChangeBorderColor = (change: StateChange): string => {
    switch (change.type) {
      case 'item':
        return change.action === 'add' ? 'border-amber-600' : 'border-gray-600';
      case 'flag':
        return change.action === 'set' ? 'border-green-600' : 'border-gray-600';
      case 'relationship':
        return change.action === 'increase' ? 'border-green-600' : 'border-red-600';
      case 'evidence':
        return change.action === 'add' ? 'border-yellow-600' : 'border-gray-600';
      default:
        return 'border-gray-600';
    }
  };

  const formatChangeText = (change: StateChange): string => {
    const name = change.name.replace(/_/g, ' ');

    switch (change.type) {
      case 'item':
        return change.action === 'add' ? `Gained: ${name}` : `Lost: ${name}`;
      case 'flag':
        return change.action === 'set' ? `Flag set: ${name}` : `Flag unset: ${name}`;
      case 'relationship':
        if (change.value !== undefined) {
          const sign = change.value > 0 ? '+' : '';
          return `${name}: ${sign}${change.value}`;
        }
        return `${name} relationship changed`;
      case 'evidence':
        return change.action === 'add' ? `Evidence found: ${name}` : `Evidence removed: ${name}`;
      default:
        return name;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 animate-fade-in">
      {changes.map((change, index) => (
        <div
          key={`${change.type}-${change.name}-${index}`}
          className={`flex items-center gap-3 px-4 py-3 bg-gray-900/95 backdrop-blur-sm border-2 ${getChangeBorderColor(change)} rounded-lg shadow-xl animate-slide-in-right`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-2xl">{getChangeIcon(change)}</div>
          <div className="flex-1">
            <div className={`font-semibold ${getChangeColor(change)}`}>
              {formatChangeText(change)}
            </div>
            {change.type === 'relationship' && change.value !== undefined && (
              <div className="text-xs text-gray-400 mt-1">
                Relationship {change.value > 0 ? 'improved' : 'worsened'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook for managing state change notifications
export function useStateChangeNotifications() {
  const [notifications, setNotifications] = useState<StateChange[]>([]);

  const addNotifications = (changes: StateChange[]) => {
    setNotifications((prev) => [...prev, ...changes]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotifications,
    clearNotifications,
  };
}
