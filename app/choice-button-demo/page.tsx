'use client';

import { useState } from 'react';
import ChoiceButton from '@/components/ChoiceButton';
import type { Choice } from '@/types';

export default function ChoiceButtonDemo() {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Sample choices
  const basicChoice: Choice = {
    text: 'Thank you for the advice, officer.',
    nextScene: 'A-1-001',
  };

  const choiceWithRelationship: Choice = {
    text: 'I can take care of myself.',
    nextScene: 'A-1-002',
    relationshipChanges: {
      ramirez: -3,
    },
  };

  const choiceWithFlags: Choice = {
    text: 'Examine the cell carefully',
    nextScene: 'A-1-015',
    flagChanges: {
      set: ['examined_cell', 'observant'],
    },
  };

  const choiceWithItems: Choice = {
    text: 'Take the loose brick',
    nextScene: 'A-1-020',
    itemChanges: {
      add: ['loose_brick'],
    },
  };

  const choiceWithEvidence: Choice = {
    text: 'Note down the mysterious numbers',
    nextScene: 'A-2-001',
    evidenceChanges: {
      add: ['mysterious_numbers'],
    },
    flagChanges: {
      set: ['found_cell_clue'],
    },
  };

  const complexChoice: Choice = {
    text: 'Use the keycard to access the restricted area',
    nextScene: 'B-1-001',
    requirements: {
      items: ['keycard'],
      flags: ['met_officer_ramirez'],
      relationships: {
        ramirez: 10,
      },
    },
    relationshipChanges: {
      ramirez: 5,
      guard_captain: -10,
    },
    flagChanges: {
      set: ['accessed_restricted_area'],
      unset: ['maintain_low_profile'],
    },
    itemChanges: {
      remove: ['keycard'],
    },
  };

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoice(choice);
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-amber-400">Choice Button Demo</h1>
        <p className="text-gray-400 mb-8">
          Interactive demonstration of the ChoiceButton component
        </p>

        {/* Basic Choices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Basic Choices</h2>
          <div className="space-y-3">
            <ChoiceButton
              choice={basicChoice}
              onClick={handleChoiceClick}
              index={1}
            />
            <ChoiceButton
              choice={choiceWithRelationship}
              onClick={handleChoiceClick}
              index={2}
            />
            <ChoiceButton
              choice={{
                text: 'Say nothing and just nod.',
                nextScene: 'A-1-003',
              }}
              onClick={handleChoiceClick}
              index={3}
            />
          </div>
        </section>

        {/* Choices with State Changes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            Choices with State Changes
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Hover over these in development mode to see metadata
          </p>
          <div className="space-y-3">
            <ChoiceButton
              choice={choiceWithFlags}
              onClick={handleChoiceClick}
              index={1}
            />
            <ChoiceButton
              choice={choiceWithItems}
              onClick={handleChoiceClick}
              index={2}
            />
            <ChoiceButton
              choice={choiceWithEvidence}
              onClick={handleChoiceClick}
              index={3}
            />
          </div>
        </section>

        {/* Complex Choice */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Complex Choice</h2>
          <p className="text-sm text-gray-400 mb-4">
            Multiple state changes and requirements (hover in dev mode)
          </p>
          <div className="space-y-3">
            <ChoiceButton
              choice={complexChoice}
              onClick={handleChoiceClick}
            />
          </div>
        </section>

        {/* Disabled/Locked Choices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            Disabled/Locked Choices
          </h2>
          <div className="space-y-3">
            <ChoiceButton
              choice={{
                text: 'Convince the guard to let you pass',
                nextScene: 'B-2-001',
                requirements: {
                  relationships: {
                    guard: 50,
                  },
                },
              }}
              disabled={true}
              lockReason="Requires: Guard relationship ≥ 50"
              index={1}
            />
            <ChoiceButton
              choice={{
                text: 'Use the master key to unlock the door',
                nextScene: 'B-2-010',
                requirements: {
                  items: ['master_key'],
                },
              }}
              disabled={true}
              lockReason="Requires: Master Key"
              index={2}
            />
            <ChoiceButton
              choice={{
                text: 'Access the security terminal',
                nextScene: 'B-3-001',
                requirements: {
                  flags: ['hacked_mainframe'],
                  items: ['security_badge'],
                },
              }}
              disabled={true}
              lockReason="Requires: Hacked Mainframe, Security Badge"
              index={3}
            />
          </div>
        </section>

        {/* Without Index Numbers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            Without Index Numbers
          </h2>
          <div className="space-y-3">
            <ChoiceButton
              choice={{
                text: 'Continue forward cautiously',
                nextScene: 'A-5-001',
              }}
              onClick={handleChoiceClick}
            />
            <ChoiceButton
              choice={{
                text: 'Turn back and find another route',
                nextScene: 'A-4-020',
              }}
              onClick={handleChoiceClick}
            />
          </div>
        </section>

        {/* Stats Panel */}
        <section className="mb-12">
          <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-amber-400">Click Stats</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-gray-100">{clickCount}</div>
                <div className="text-sm text-gray-400">Total Clicks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-100">
                  {selectedChoice ? '✓' : '-'}
                </div>
                <div className="text-sm text-gray-400">Choice Selected</div>
              </div>
            </div>

            {selectedChoice && (
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-400 mb-2">
                  Last Selected Choice:
                </h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>
                    <strong>Text:</strong> {selectedChoice.text}
                  </div>
                  <div>
                    <strong>Next Scene:</strong> {selectedChoice.nextScene}
                  </div>
                  {selectedChoice.relationshipChanges && (
                    <div className="text-purple-400">
                      <strong>Relationships:</strong>{' '}
                      {JSON.stringify(selectedChoice.relationshipChanges)}
                    </div>
                  )}
                  {selectedChoice.flagChanges && (
                    <div className="text-green-400">
                      <strong>Flags:</strong> {JSON.stringify(selectedChoice.flagChanges)}
                    </div>
                  )}
                  {selectedChoice.itemChanges && (
                    <div className="text-blue-400">
                      <strong>Items:</strong> {JSON.stringify(selectedChoice.itemChanges)}
                    </div>
                  )}
                  {selectedChoice.evidenceChanges && (
                    <div className="text-yellow-400">
                      <strong>Evidence:</strong>{' '}
                      {JSON.stringify(selectedChoice.evidenceChanges)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              Implementation Notes
            </h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Dark theme styling with amber accents</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Hover effects with animated arrow</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Disabled state with lock icon and reason</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Optional index numbers with badge styling</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Click callbacks for scene transitions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Development metadata tooltips on hover</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>Accessible with ARIA labels</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
