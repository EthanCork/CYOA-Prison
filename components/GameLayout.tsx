/**
 * Main game layout component for El Palo de Queso
 * Full-screen dark prison theme with responsive design
 */

'use client';

import { ReactNode } from 'react';
import SceneText from './SceneText';

interface GameLayoutProps {
  children?: ReactNode;
  sceneText?: string;
  location?: string;
  mood?: string;
  typewriter?: boolean;
  choices?: ReactNode;
  inventory?: ReactNode;
  showInventory?: boolean;
}

export default function GameLayout({
  children,
  sceneText = 'Scene text will appear here...',
  location,
  mood,
  typewriter = false,
  choices,
  inventory,
  showInventory = true,
}: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 lg:p-8">
          {/* Game Title Header */}
          <header className="mb-6 border-b border-gray-700 pb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-amber-500 tracking-wide">
              El Palo de Queso
            </h1>
            <p className="text-sm text-gray-400 mt-1">Una historia interactiva</p>
          </header>

          {/* Scene Content Container */}
          <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
            {/* Scene Text Area */}
            <section className="flex-1 bg-gray-800/50 rounded-lg border border-gray-700 p-6 lg:p-8 mb-6 shadow-2xl backdrop-blur-sm">
              {children || (
                <SceneText
                  text={sceneText}
                  location={location}
                  mood={mood}
                  typewriter={typewriter}
                />
              )}
            </section>

            {/* Choices Section */}
            <section className="bg-gray-800/30 rounded-lg border border-gray-700 p-4 lg:p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-amber-400 mb-4">
                ¿Qué haces?
              </h2>
              <div className="space-y-3">
                {choices || (
                  <>
                    <button className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
                      <span className="text-gray-200">Choice 1 - Example action</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
                      <span className="text-gray-200">Choice 2 - Another action</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
                      <span className="text-gray-200">Choice 3 - Different approach</span>
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Inventory Sidebar */}
        {showInventory && (
          <aside className="lg:w-80 bg-gray-900/50 border-t lg:border-t-0 lg:border-l border-gray-700 p-4 lg:p-6 backdrop-blur-sm">
            <div className="sticky top-6">
              {/* Inventory Header */}
              <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-gray-700 pb-3">
                Inventario
              </h2>

              {inventory || (
                <div className="space-y-4">
                  {/* Items Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Objetos
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-amber-500/30 transition-colors cursor-pointer">
                        <p className="text-gray-300 text-sm">Cuchara de metal</p>
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-amber-500/30 transition-colors cursor-pointer">
                        <p className="text-gray-300 text-sm">Fotografía vieja</p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Evidencia
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-amber-500/30 transition-colors cursor-pointer">
                        <p className="text-gray-300 text-sm">Huella dactilar</p>
                      </div>
                    </div>
                  </div>

                  {/* Relationships Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Relaciones
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-gray-300 text-sm">Guardia</p>
                          <span className="text-xs text-green-400">+25</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: '62.5%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-gray-300 text-sm">Recluso</p>
                          <span className="text-xs text-red-400">-10</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-red-500 h-1.5 rounded-full"
                            style={{ width: '45%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
