/**
 * Work assignment utility functions for Path C (Day/Justice)
 * Manages the 6 work assignments available to players
 */

import type { WorkAssignment } from '@/types';

/**
 * All available work assignments
 */
export const WORK_ASSIGNMENTS: WorkAssignment[] = [
  'kitchen',
  'laundry',
  'yard',
  'infirmary',
  'chapel',
  'library',
];

/**
 * Work assignment information
 */
export interface WorkAssignmentInfo {
  id: WorkAssignment;
  name: string;
  description: string;
  location: string;
  opportunities: string[];
  icon: string;
  color: string;
}

/**
 * Get information about a specific work assignment
 */
export function getWorkAssignmentInfo(assignment: WorkAssignment): WorkAssignmentInfo {
  const assignments: Record<WorkAssignment, WorkAssignmentInfo> = {
    kitchen: {
      id: 'kitchen',
      name: 'Kitchen Duty',
      description: 'Prepare meals for prisoners and staff',
      location: 'Prison Kitchen',
      opportunities: [
        'Access to kitchen knives and tools',
        'Overhear guard conversations during meals',
        'Build rapport with kitchen staff',
        'Access to food storage areas',
      ],
      icon: '🍳',
      color: 'red',
    },
    laundry: {
      id: 'laundry',
      name: 'Laundry Service',
      description: 'Wash and distribute prison uniforms',
      location: 'Laundry Room',
      opportunities: [
        'Access to guard uniforms for disguise',
        'Chemical supplies for cleaning',
        'Meet prisoners from all blocks',
        'Access to laundry carts for transport',
      ],
      icon: '👕',
      color: 'blue',
    },
    yard: {
      id: 'yard',
      name: 'Yard Maintenance',
      description: 'Maintain outdoor areas and gardens',
      location: 'Prison Yard',
      opportunities: [
        'Study perimeter walls and fences',
        'Access to gardening tools',
        'Outdoor time and fresh air',
        'Observe guard patrol patterns',
      ],
      icon: '🌿',
      color: 'green',
    },
    infirmary: {
      id: 'infirmary',
      name: 'Infirmary Assistant',
      description: 'Help medical staff with basic tasks',
      location: 'Medical Wing',
      opportunities: [
        'Access to medical supplies and drugs',
        'Build relationship with doctor/nurses',
        'Access to medical records',
        'Learn about guard and staff health',
      ],
      icon: '⚕️',
      color: 'teal',
    },
    chapel: {
      id: 'chapel',
      name: 'Chapel Services',
      description: 'Assist with religious services and maintenance',
      location: 'Prison Chapel',
      opportunities: [
        'Private conversations with chaplain',
        'Access to chapel during off-hours',
        'Meet prisoners seeking guidance',
        'Access to chapel records and archives',
      ],
      icon: '⛪',
      color: 'purple',
    },
    library: {
      id: 'library',
      name: 'Library Assistant',
      description: 'Organize books and help with prison records',
      location: 'Prison Library',
      opportunities: [
        'Access to legal resources',
        'Research prison history and layout',
        'Access to administrative records',
        'Build relationship with librarian',
      ],
      icon: '📚',
      color: 'amber',
    },
  };

  return assignments[assignment];
}

/**
 * Get Tailwind color classes for a work assignment
 */
export function getWorkAssignmentColors(assignment: WorkAssignment): {
  bg: string;
  text: string;
  border: string;
  hover: string;
} {
  const colors: Record<WorkAssignment, ReturnType<typeof getWorkAssignmentColors>> = {
    kitchen: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-600',
      hover: 'hover:bg-red-200',
    },
    laundry: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-600',
      hover: 'hover:bg-blue-200',
    },
    yard: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-600',
      hover: 'hover:bg-green-200',
    },
    infirmary: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      border: 'border-teal-600',
      hover: 'hover:bg-teal-200',
    },
    chapel: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-600',
      hover: 'hover:bg-purple-200',
    },
    library: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-600',
      hover: 'hover:bg-amber-200',
    },
  };

  return colors[assignment];
}

/**
 * Get display name with icon
 */
export function getWorkAssignmentDisplayName(assignment: WorkAssignment | null): string {
  if (!assignment) return 'No assignment selected';
  const info = getWorkAssignmentInfo(assignment);
  return `${info.icon} ${info.name}`;
}

/**
 * Get all work assignments with their info
 */
export function getAllWorkAssignments(): WorkAssignmentInfo[] {
  return WORK_ASSIGNMENTS.map((assignment) => getWorkAssignmentInfo(assignment));
}

/**
 * Check if a work assignment is valid
 */
export function isValidWorkAssignment(assignment: string): assignment is WorkAssignment {
  return WORK_ASSIGNMENTS.includes(assignment as WorkAssignment);
}

/**
 * Get items that can be obtained from a specific work assignment
 */
export function getWorkAssignmentItems(assignment: WorkAssignment): string[] {
  const items: Record<WorkAssignment, string[]> = {
    kitchen: ['kitchen_knife', 'master_key_copy', 'food_rations'],
    laundry: ['guard_uniform', 'cleaning_chemicals', 'laundry_cart_access'],
    yard: ['gardening_tools', 'rope', 'perimeter_map'],
    infirmary: ['sedatives', 'medical_supplies', 'patient_records'],
    chapel: ['chaplain_trust', 'chapel_key', 'archived_documents'],
    library: ['legal_books', 'prison_blueprints', 'administrative_access'],
  };

  return items[assignment];
}

/**
 * Get evidence that can be found through a specific work assignment
 */
export function getWorkAssignmentEvidence(assignment: WorkAssignment): string[] {
  const evidence: Record<WorkAssignment, string[]> = {
    kitchen: ['food_poisoning_records'],
    laundry: ['uniform_theft_evidence'],
    yard: ['escape_attempt_reports'],
    infirmary: ['medical_malpractice_records', 'prisoner_injury_logs'],
    chapel: ['chaplain_witness_statement'],
    library: ['warden_ledger', 'missing_prisoner_list'],
  };

  return evidence[assignment];
}

/**
 * Get characters the player can build relationships with in each assignment
 */
export function getWorkAssignmentCharacters(assignment: WorkAssignment): string[] {
  const characters: Record<WorkAssignment, string[]> = {
    kitchen: ['chef_gomez', 'guard_torres'],
    laundry: ['laundry_supervisor', 'maria'],
    yard: ['gardener_carlos', 'yard_guard'],
    infirmary: ['doctor_reyes', 'nurse_santos'],
    chapel: ['chaplain_ortiz'],
    library: ['librarian_julia', 'records_clerk'],
  };

  return characters[assignment];
}

/**
 * Get recommended work assignment based on player's path approach
 */
export function getRecommendedWorkAssignment(
  hasEvidenceGoal: boolean,
  hasSocialGoal: boolean,
  hasStealthGoal: boolean
): WorkAssignment | null {
  // Library is best for evidence gathering
  if (hasEvidenceGoal) return 'library';

  // Kitchen/Laundry good for social connections
  if (hasSocialGoal) return 'kitchen';

  // Yard/Infirmary good for stealth items
  if (hasStealthGoal) return 'yard';

  return null;
}

/**
 * Format work assignment for display
 */
export function formatWorkAssignment(assignment: WorkAssignment | null): string {
  if (!assignment) return 'No assignment';
  const info = getWorkAssignmentInfo(assignment);
  return `${info.icon} ${info.name} - ${info.location}`;
}
