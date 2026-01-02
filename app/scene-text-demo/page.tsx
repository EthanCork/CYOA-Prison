/**
 * Demo page for SceneText component
 */

'use client';

import { useState } from 'react';
import SceneText from '@/components/SceneText';

export default function SceneTextDemoPage() {
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);

  const sampleText = `Te despiertas en una celda fría y oscura. El olor a humedad y desesperación llena el aire.

A través de los barrotes, puedes ver un pasillo débilmente iluminado. El sonido de pasos distantes resuena en las paredes de concreto.

Tu mente corre mientras intentas recordar cómo llegaste aquí. Lo último que recuerdas es... nada. Un vacío total.

Necesitas encontrar respuestas. Necesitas escapar.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-amber-500">SceneText Component Demo</h1>
          <p className="text-gray-400 mt-2">Testing narrative text display with various options</p>
        </header>

        {/* Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Controls</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={typewriterEnabled}
              onChange={(e) => setTypewriterEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-gray-300">Enable Typewriter Effect</span>
          </label>
        </div>

        {/* Example 1: Basic Text */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Basic Scene Text</h2>
          <SceneText
            text={sampleText}
            typewriter={typewriterEnabled}
          />
        </div>

        {/* Example 2: With Location */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">With Location Indicator</h2>
          <SceneText
            text="El guardia te mira con desconfianza. Sus ojos recorren tu celda, buscando algo fuera de lugar. Tienes que actuar con cuidado."
            location="Celda Principal"
            typewriter={typewriterEnabled}
          />
        </div>

        {/* Example 3: With Location and Mood */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">With Location and Mood</h2>
          <SceneText
            text="El patio de la prisión está lleno de actividad. Grupos de reclusos se reúnen en las esquinas, hablando en voz baja. El ambiente está tenso, como si todos estuvieran esperando que algo suceda."
            location="Patio de Ejercicio"
            mood="Tenso"
            typewriter={typewriterEnabled}
          />
        </div>

        {/* Example 4: Long Text */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Long Narrative Text</h2>
          <SceneText
            text={`La biblioteca de la prisión es un lugar tranquilo, casi olvidado. Estantes llenos de libros viejos y polvorientos se alinean contra las paredes. La luz entra a través de una pequeña ventana, creando patrones en el suelo de concreto.

Te acercas a uno de los estantes y pasas los dedos por los lomos de los libros. Muchos están en mal estado, pero algunos parecen haber sido leídos recientemente.

De repente, notas algo extraño: uno de los libros sobresale ligeramente del estante, como si alguien lo hubiera dejado así a propósito.

¿Debería investigar más?`}
            location="Biblioteca"
            mood="Misterioso"
            typewriter={typewriterEnabled}
            typewriterSpeed={20}
          />
        </div>

        {/* Example 5: Short, Dramatic Text */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Short, Dramatic Text</h2>
          <SceneText
            text="¡ALARMA! Las luces rojas parpadean. El sonido ensordecedor de la sirena llena cada rincón de la prisión. Es ahora o nunca."
            location="Corredor Principal"
            mood="Urgente"
            typewriter={typewriterEnabled}
            typewriterSpeed={40}
          />
        </div>
      </div>
    </div>
  );
}
