'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import EvidencePanel from '@/components/EvidencePanel';
import {
  loadAllEvidence,
  getEvidenceProgress,
  hasEnoughEvidenceForJustice,
  getEvidenceCategories,
} from '@/lib/evidenceLoader';

/**
 * Demo page for evidence tracking system
 * Shows how evidence collection works for justice endings
 */
export default function EvidenceDemoPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'collected' | 'remaining'>('all');

  const collectedEvidenceIds = useGameStore((state) => state.evidence);
  const addEvidence = useGameStore((state) => state.addEvidence);
  const removeEvidence = useGameStore((state) => state.removeEvidence);

  const allEvidence = loadAllEvidence();
  const progress = getEvidenceProgress(collectedEvidenceIds);
  const hasEnoughForJustice = hasEnoughEvidenceForJustice(collectedEvidenceIds);
  const categories = getEvidenceCategories(collectedEvidenceIds);

  const collectedEvidence = allEvidence.filter((ev) => collectedEvidenceIds.includes(ev.id));
  const remainingEvidence = allEvidence.filter((ev) => !collectedEvidenceIds.includes(ev.id));

  const handleCollectEvidence = (evidenceId: string) => {
    addEvidence(evidenceId);
  };

  const handleRemoveEvidence = (evidenceId: string) => {
    removeEvidence(evidenceId);
  };

  const handleCollectAll = () => {
    allEvidence.forEach((ev) => addEvidence(ev.id));
  };

  const handleClearAll = () => {
    collectedEvidenceIds.forEach((id) => removeEvidence(id));
  };

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

  const displayedEvidence =
    selectedTab === 'collected'
      ? collectedEvidence
      : selectedTab === 'remaining'
      ? remainingEvidence
      : allEvidence;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Evidence System Demo</h1>
        <p className="text-gray-400 mb-8">
          Collect evidence to build a case for justice. Gather at least 5 pieces to unlock the
          justice ending path.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Evidence Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Collection Progress</h2>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Evidence Collected</span>
                  <span>
                    {progress.collected} / {progress.total} ({progress.percentage}%)
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      hasEnoughForJustice ? 'bg-green-600' : 'bg-amber-600'
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Justice Path Status */}
              <div
                className={`p-4 rounded-lg ${
                  hasEnoughForJustice
                    ? 'bg-green-900/30 border border-green-600'
                    : 'bg-amber-900/30 border border-amber-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{hasEnoughForJustice ? '✅' : '⏳'}</span>
                  <div>
                    <p className="font-semibold">
                      {hasEnoughForJustice
                        ? 'Justice Path Unlocked!'
                        : 'Need More Evidence'}
                    </p>
                    <p className="text-sm text-gray-300">
                      {hasEnoughForJustice
                        ? 'You have enough evidence to expose the corruption.'
                        : `Collect ${5 - progress.collected} more piece${
                            5 - progress.collected === 1 ? '' : 's'
                          } to unlock the justice ending.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Categories Found */}
              {progress.collected > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-400 mb-2">Evidence Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.hasCorruption && (
                      <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">
                        💰 Corruption
                      </span>
                    )}
                    {categories.hasBrutality && (
                      <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm">
                        ⚠️ Brutality
                      </span>
                    )}
                    {categories.hasInnocence && (
                      <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">
                        🧬 Innocence
                      </span>
                    )}
                    {categories.hasSystemic && (
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                        📋 Systemic Abuse
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleCollectAll}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                >
                  Collect All Evidence
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                >
                  Clear All Evidence
                </button>
              </div>
            </div>

            {/* Evidence List */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Evidence Pieces</h2>

                {/* Tab Selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`px-3 py-1 rounded text-sm transition ${
                      selectedTab === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All ({allEvidence.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('collected')}
                    className={`px-3 py-1 rounded text-sm transition ${
                      selectedTab === 'collected'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Collected ({collectedEvidence.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('remaining')}
                    className={`px-3 py-1 rounded text-sm transition ${
                      selectedTab === 'remaining'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Remaining ({remainingEvidence.length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {displayedEvidence.map((evidence) => {
                  const isCollected = collectedEvidenceIds.includes(evidence.id);

                  return (
                    <div
                      key={evidence.id}
                      className={`border rounded-lg p-4 transition ${
                        isCollected
                          ? 'bg-green-900/20 border-green-600'
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{getEvidenceEmoji(evidence.id)}</span>
                            <h3 className="font-semibold">{evidence.name}</h3>
                            {isCollected && (
                              <span className="px-2 py-0.5 bg-green-700 text-green-100 rounded text-xs">
                                ✓ Collected
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {evidence.description}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            isCollected
                              ? handleRemoveEvidence(evidence.id)
                              : handleCollectEvidence(evidence.id)
                          }
                          className={`px-4 py-2 rounded text-sm transition ${
                            isCollected
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isCollected ? 'Remove' : 'Collect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Evidence Panel */}
          <div className="lg:sticky lg:top-0 lg:h-screen">
            <EvidencePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
