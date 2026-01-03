'use client';

import { useState } from 'react';
import ChoiceButton from '@/components/ChoiceButton';
import { checkChoiceRequirements } from '@/lib/sceneTransitions';
import type { Choice } from '@/types';

export default function RequirementsDemo() {
  // Mock game state that can be toggled
  const [inventory, setInventory] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [relationships, setRelationships] = useState<{ [key: string]: number }>({});
  const [evidence, setEvidence] = useState<string[]>([]);

  // Sample choices with different requirement types
  const choices: Choice[] = [
    {
      text: 'Use the master key to unlock the door',
      nextScene: 'A-2-001',
      requirements: {
        items: ['master_key'],
      },
    },
    {
      text: 'Convince the guard with your high relationship',
      nextScene: 'A-2-002',
      requirements: {
        relationships: {
          guard: 50,
        },
      },
    },
    {
      text: 'Use evidence to prove your innocence',
      nextScene: 'A-2-003',
      requirements: {
        evidence: ['fingerprint', 'alibi'],
      },
    },
    {
      text: 'Access restricted area (requires hacked flag)',
      nextScene: 'B-1-001',
      requirements: {
        flags: ['hacked_mainframe'],
      },
    },
    {
      text: 'Sneak past guard (requires low relationship)',
      nextScene: 'B-1-002',
      requirements: {
        maxRelationships: {
          guard: 10,
        },
      },
    },
    {
      text: 'Blend in with inmates (must NOT have guard uniform)',
      nextScene: 'B-1-003',
      requirements: {
        notItems: ['guard_uniform'],
      },
    },
    {
      text: 'Act innocent (must NOT have raised suspicion flag)',
      nextScene: 'B-2-001',
      requirements: {
        notFlags: ['raised_suspicion'],
      },
    },
    {
      text: 'Cover up crime (must NOT have forensic evidence)',
      nextScene: 'B-2-002',
      requirements: {
        notEvidence: ['forensic_report'],
      },
    },
    {
      text: 'Complex choice (multiple requirements)',
      nextScene: 'C-1-001',
      requirements: {
        items: ['keycard'],
        flags: ['met_informant'],
        relationships: {
          informant: 25,
        },
        notFlags: ['caught_by_guards'],
      },
    },
  ];

  const toggleItem = (item: string) => {
    setInventory((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const toggleEvidence = (item: string) => {
    setEvidence((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const setRelationship = (character: string, score: number) => {
    setRelationships((prev) => ({
      ...prev,
      [character]: score,
    }));
  };

  const checkChoice = (choice: Choice) => {
    return checkChoiceRequirements(choice, {
      inventory,
      flags,
      relationships,
      evidence,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-amber-400 mb-1">
            Requirement Checker Demo
          </h1>
          <p className="text-sm text-gray-400">
            Toggle mock requirements to see choices hide/show or become locked/unlocked
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mock State Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Inventory */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">Inventory</h3>
              <div className="space-y-2">
                {['master_key', 'keycard', 'guard_uniform'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inventory.includes(item)}
                      onChange={() => toggleItem(item)}
                      className="rounded"
                    />
                    <span className="text-sm">{item.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Flags</h3>
              <div className="space-y-2">
                {['hacked_mainframe', 'met_informant', 'raised_suspicion', 'caught_by_guards'].map((flag) => (
                  <label key={flag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flags.includes(flag)}
                      onChange={() => toggleFlag(flag)}
                      className="rounded"
                    />
                    <span className="text-sm">{flag.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Evidence */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Evidence</h3>
              <div className="space-y-2">
                {['fingerprint', 'alibi', 'forensic_report'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={evidence.includes(item)}
                      onChange={() => toggleEvidence(item)}
                      className="rounded"
                    />
                    <span className="text-sm">{item.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Relationships */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Relationships</h3>
              <div className="space-y-3">
                {['guard', 'informant'].map((character) => (
                  <div key={character}>
                    <label className="text-sm text-gray-300 block mb-1">
                      {character}: {relationships[character] || 0}
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={relationships[character] || 0}
                      onChange={(e) => setRelationship(character, parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Choices Display */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">
                Available Choices
              </h2>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-amber-400">
                  Requirement Types Demonstrated:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Has items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Has flags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Has evidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Min relationships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Must NOT have items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Must NOT have flags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Must NOT have evidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Max relationships</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {choices.map((choice, index) => {
                  const { canSelect, reason } = checkChoice(choice);
                  return (
                    <ChoiceButton
                      key={index}
                      choice={choice}
                      onClick={(c) => console.log('Selected:', c.text)}
                      index={index + 1}
                      disabled={!canSelect}
                      lockReason={reason}
                    />
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Try these combinations:
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Add master_key to unlock Choice #1</li>
                  <li>• Set Guard relationship to 50+ to unlock Choice #2</li>
                  <li>• Add both fingerprint and alibi evidence to unlock Choice #3</li>
                  <li>• Enable hacked_mainframe flag to unlock Choice #4</li>
                  <li>• Set Guard relationship to 10 or less to unlock Choice #5</li>
                  <li>• Remove guard_uniform (or do not add it) to unlock Choice #6</li>
                  <li>• Ensure raised_suspicion flag is OFF to unlock Choice #7</li>
                  <li>• Ensure forensic_report evidence is NOT collected to unlock Choice #8</li>
                  <li>• Meet ALL requirements for Choice #9 (complex multi-requirement)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
