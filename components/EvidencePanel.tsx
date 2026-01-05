'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import {
  loadAllEvidence,
  getEvidenceById,
  getEvidenceProgress,
  hasEnoughEvidenceForJustice,
  getEvidenceCategories,
} from '@/lib/evidenceLoader';

interface EvidencePanelProps {
  className?: string;
  defaultCollapsed?: boolean;
  /** Hide panel entirely if no evidence collected (default: false) */
  hideWhenEmpty?: boolean;
}

/**
 * Panel displaying collected evidence for justice endings
 * Shows evidence pieces collected during investigation
 * Can be hidden until first evidence is found
 */
export default function EvidencePanel({
  className = '',
  defaultCollapsed = false,
  hideWhenEmpty = false,
}: EvidencePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  const collectedEvidenceIds = useGameStore((state) => state.evidence);

  // Load all evidence and filter by collected status
  const allEvidence = loadAllEvidence();
  const collectedEvidence = collectedEvidenceIds
    .map((id) => getEvidenceById(id))
    .filter(Boolean);

  const progress = getEvidenceProgress(collectedEvidenceIds);
  const hasEnoughForJustice = hasEnoughEvidenceForJustice(collectedEvidenceIds);
  const categories = getEvidenceCategories(collectedEvidenceIds);

  const toggleExpanded = (evidenceId: string) => {
    setExpandedEvidenceId(expandedEvidenceId === evidenceId ? null : evidenceId);
  };

  // Get emoji for evidence type based on keywords
  const getEvidenceEmoji = (evidenceId: string): string => {
    if (evidenceId.includes('photo')) return '📷';
    if (evidenceId.includes('ledger') || evidenceId.includes('payment')) return '💰';
    if (evidenceId.includes('letter') || evidenceId.includes('manifest')) return '📄';
    if (evidenceId.includes('dna') || evidenceId.includes('innocence')) return '🧬';
    if (evidenceId.includes('list')) return '📋';
    if (evidenceId.includes('log')) return '📝';
    if (evidenceId.includes('certificate')) return '📜';
    return '📁';
  };

  // Hide panel if requested and no evidence collected
  if (hideWhenEmpty && collectedEvidenceIds.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border-l-2 border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Evidence</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden text-gray-600 hover:text-gray-800"
            aria-label={isCollapsed ? 'Expand evidence' : 'Collapse evidence'}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>
              {progress.collected} / {progress.total} collected
            </span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                hasEnoughForJustice ? 'bg-green-600' : 'bg-amber-600'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Justice Path Indicator */}
        {hasEnoughForJustice && (
          <div className="mt-2 px-2 py-1 bg-green-100 border border-green-300 rounded text-xs text-green-800">
            ✓ Enough evidence for justice path
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto max-h-screen">
          {collectedEvidence.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No evidence collected yet.</p>
              <p className="text-xs mt-2">Investigate to find proof of corruption.</p>
            </div>
          ) : (
            <>
              {/* Evidence Categories Summary */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs font-semibold text-blue-900 mb-2">Categories Found:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.hasCorruption && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      💰 Corruption
                    </span>
                  )}
                  {categories.hasBrutality && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      ⚠️ Brutality
                    </span>
                  )}
                  {categories.hasInnocence && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      🧬 Innocence
                    </span>
                  )}
                  {categories.hasSystemic && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      📋 Systemic
                    </span>
                  )}
                </div>
              </div>

              {/* Evidence List */}
              <div className="space-y-2">
                {collectedEvidence.map((evidence) => {
                  if (!evidence) return null;
                  const isExpanded = expandedEvidenceId === evidence.id;

                  return (
                    <div
                      key={evidence.id}
                      className="border-l-4 border-amber-600 bg-amber-50 p-3 rounded-r-lg cursor-pointer hover:shadow-md transition-all"
                      onClick={() => toggleExpanded(evidence.id)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xl">{getEvidenceEmoji(evidence.id)}</span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {evidence.name}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-amber-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {evidence.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hint for Missing Evidence */}
              {progress.collected < progress.total && (
                <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700">
                  💡 <strong>Hint:</strong> {progress.total - progress.collected} more pieces of
                  evidence remain undiscovered. Keep investigating suspicious locations and
                  talking to informants.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
