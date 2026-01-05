'use client';

/**
 * Inventory Panel Component
 * Displays the player's inventory with items, icons, and descriptions
 * Collapsible on mobile devices
 */

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { getItemById } from '@/lib/itemLoader';
import { getItemIcon, getCategoryColor, getCategoryBgColor } from '@/lib/itemIcons';
import type { Item } from '@/types';

interface InventoryPanelProps {
  /** Optional CSS class name */
  className?: string;
  /** Whether the panel starts collapsed (mobile) */
  defaultCollapsed?: boolean;
}

/**
 * Component for displaying a single inventory item
 */
interface InventoryItemProps {
  item: Item;
  isSelected: boolean;
  onClick: () => void;
}

function InventoryItem({ item, isSelected, onClick }: InventoryItemProps) {
  const icon = getItemIcon(item.id, item.category);
  const colorClass = getCategoryColor(item.category);
  const bgColorClass = getCategoryBgColor(item.category);

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 rounded-lg border-2 transition-all
        hover:scale-105 active:scale-95
        ${bgColorClass}
        ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-900' : ''}
      `}
      aria-label={`View details for ${item.name}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <div className="flex-1 text-left">
          <div className={`font-medium ${colorClass}`}>{item.name}</div>
          <div className="text-xs text-gray-400 capitalize">{item.category}</div>
        </div>
      </div>
    </button>
  );
}

/**
 * Component for displaying item details
 */
interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
}

function ItemDetails({ item, onClose }: ItemDetailsProps) {
  const icon = getItemIcon(item.id, item.category);
  const colorClass = getCategoryColor(item.category);

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {icon}
          </span>
          <div>
            <h3 className={`font-bold text-lg ${colorClass}`}>{item.name}</h3>
            <span className="text-xs text-gray-400 capitalize">{item.category}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
          <p className="text-sm text-gray-300">{item.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-1">Location Hint</h4>
          <p className="text-sm text-gray-300 italic">{item.locationHint}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Inventory Panel Component
 */
export default function InventoryPanel({
  className = '',
  defaultCollapsed = false,
}: InventoryPanelProps) {
  const inventory = useGameStore((state) => state.inventory);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Get full item data for inventory items
  const inventoryItems = inventory
    .map((itemId) => getItemById(itemId))
    .filter((item): item is Item => item !== undefined);

  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      // Clear selection when expanding
      setSelectedItemId(null);
    }
  };

  const handleItemClick = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null); // Deselect if clicking same item
    } else {
      setSelectedItemId(itemId);
    }
  };

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer md:cursor-default"
        onClick={() => {
          // Only allow collapse on mobile (screens smaller than md)
          if (window.innerWidth < 768) {
            toggleCollapse();
          }
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🎒
          </span>
          <h2 className="text-lg font-bold text-amber-400">Inventory</h2>
          <span className="text-sm text-gray-400">({inventoryItems.length})</span>
        </div>

        {/* Collapse toggle (mobile only) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? 'Expand inventory' : 'Collapse inventory'}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          {inventoryItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Your inventory is empty</p>
              <p className="text-xs mt-2">Items you collect will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Item List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {inventoryItems.map((item) => (
                  <InventoryItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItemId === item.id}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </div>

              {/* Selected Item Details */}
              {selectedItem && (
                <div className="pt-4 border-t border-gray-700">
                  <ItemDetails item={selectedItem} onClose={() => setSelectedItemId(null)} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
