'use client';

/**
 * Demo page for InventoryPanel component
 * Phase 2 - Step 18: Inventory Panel Component
 */

import { useGameStore } from '@/lib/store';
import InventoryPanel from '@/components/InventoryPanel';

export default function InventoryDemoPage() {
  const { addItem, removeItem, inventory, resetGame } = useGameStore();

  // Sample items for quick testing
  const sampleItems = [
    'rusty_spoon',
    'loose_brick',
    'shiv',
    'guard_uniform',
    'bandages',
    'lockpick_set',
    'tobacco_pouch',
    'playing_cards',
    'prison_map',
    'contraband_phone',
  ];

  const addRandomItem = () => {
    const availableItems = sampleItems.filter(id => !inventory.includes(id));
    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      addItem(randomItem);
    }
  };

  const removeRandomItem = () => {
    if (inventory.length > 0) {
      const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
      removeItem(randomItem);
    }
  };

  const addAllSampleItems = () => {
    sampleItems.forEach(item => addItem(item));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">
            Inventory Panel Demo
          </h1>
          <p className="text-gray-400">
            Test the inventory panel component with various items
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-400 mb-4">Controls</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={addRandomItem}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Add Random Item
                </button>

                <button
                  onClick={removeRandomItem}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  disabled={inventory.length === 0}
                >
                  Remove Random Item
                </button>

                <button
                  onClick={addAllSampleItems}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Add All Sample Items
                </button>

                <button
                  onClick={resetGame}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Clear Inventory
                </button>
              </div>

              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">
                  Current Inventory: <span className="text-amber-400 font-bold">{inventory.length}</span> items
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Item IDs: {inventory.length > 0 ? inventory.join(', ') : 'none'}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-400 mb-4">Features to Test</h2>

              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Add items and see them appear with icons and names</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Click on items to view detailed descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Click the same item again to hide details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Click different items to switch between details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Items are color-coded by category (tool, weapon, disguise, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>On mobile, collapse/expand the inventory panel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Empty state shows helpful message when no items</span>
                </li>
              </ul>
            </div>

            {/* Category Legend */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-400 mb-4">Category Colors</h2>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">●</span>
                  <span>Tool - Blue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">●</span>
                  <span>Weapon - Red</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">●</span>
                  <span>Disguise - Purple</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">●</span>
                  <span>Medical - Green</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">●</span>
                  <span>Evidence - Amber</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">●</span>
                  <span>Misc - Gray</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Panel */}
          <div className="lg:col-span-1">
            <InventoryPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
