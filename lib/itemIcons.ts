/**
 * Item icon/symbol mapping for El Palo de Queso
 * Maps item categories to emoji/symbol representations
 */

import type { ItemCategory } from '@/types';

/**
 * Get the icon/symbol for an item category
 * @param category - The item category
 * @returns Unicode emoji/symbol for the category
 */
export function getCategoryIcon(category: ItemCategory): string {
  const iconMap: Record<ItemCategory, string> = {
    tool: '🔧',
    weapon: '⚔️',
    disguise: '👔',
    medical: '💊',
    evidence: '📄',
    misc: '📦',
  };

  return iconMap[category];
}

/**
 * Get a specific icon for common items (fallback to category icon)
 * @param itemId - The item ID
 * @param category - The item category
 * @returns Unicode emoji/symbol for the item
 */
export function getItemIcon(itemId: string, category: ItemCategory): string {
  // Specific item icons (optional, can override category defaults)
  const specificIcons: Record<string, string> = {
    // Tools
    lockpick_set: '🔑',
    wire_cutters: '✂️',
    flashlight: '🔦',
    rope: '🪢',
    hammer: '🔨',
    screwdriver: '🪛',
    crowbar: '🪛',
    cell_key: '🔑',
    master_key: '🗝️',
    mirror_shard: '🪞',

    // Weapons
    shiv: '🔪',
    glass_shard: '🔪',
    metal_pipe: '🔧',
    razor_blade: '🪒',
    brass_knuckles: '👊',

    // Disguises
    guard_uniform: '👮',
    janitor_outfit: '🧹',
    kitchen_apron: '👨‍🍳',
    medical_scrubs: '👨‍⚕️',

    // Medical
    bandages: '🩹',
    painkillers: '💊',
    antibiotics: '💉',
    first_aid_kit: '⚕️',

    // Evidence
    prison_map: '🗺️',
    security_manual: '📖',
    shift_schedule: '📅',
    warden_memo: '📝',
    inmate_ledger: '📋',
    tunnel_plans: '📐',

    // Misc
    tobacco_pouch: '🚬',
    cigarettes: '🚬',
    chocolate_bar: '🍫',
    playing_cards: '🃏',
    photo_family: '📷',
    contraband_phone: '📱',
    money_cash: '💵',
    watch: '⌚',
    bible: '📖',
    journal: '📓',
    pen: '✒️',
    soap_bar: '🧼',
    blanket: '🛏️',
    pillow: '🛏️',

    // Tools (continued)
    radio_scanner: '📻',
    binoculars: '🔭',
    camera: '📷',
    duct_tape: '📼',
    loose_brick: '🧱',
    rusty_spoon: '🥄',
    guard_keycard: '💳',
  };

  return specificIcons[itemId] || getCategoryIcon(category);
}

/**
 * Get color class for item category (for styling)
 * @param category - The item category
 * @returns Tailwind color class
 */
export function getCategoryColor(category: ItemCategory): string {
  const colorMap: Record<ItemCategory, string> = {
    tool: 'text-blue-400',
    weapon: 'text-red-400',
    disguise: 'text-purple-400',
    medical: 'text-green-400',
    evidence: 'text-amber-400',
    misc: 'text-gray-400',
  };

  return colorMap[category];
}

/**
 * Get background color class for item category
 * @param category - The item category
 * @returns Tailwind background color class
 */
export function getCategoryBgColor(category: ItemCategory): string {
  const bgColorMap: Record<ItemCategory, string> = {
    tool: 'bg-blue-900/20 border-blue-700',
    weapon: 'bg-red-900/20 border-red-700',
    disguise: 'bg-purple-900/20 border-purple-700',
    medical: 'bg-green-900/20 border-green-700',
    evidence: 'bg-amber-900/20 border-amber-700',
    misc: 'bg-gray-900/20 border-gray-700',
  };

  return bgColorMap[category];
}
