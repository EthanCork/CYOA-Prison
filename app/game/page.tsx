/**
 * Main game page for El Palo de Queso
 */

import GameLayout from '@/components/GameLayout';

export default function GamePage() {
  return (
    <GameLayout
      sceneText={`Te despiertas en una celda fría y oscura. El olor a humedad y desesperación llena el aire.

A través de los barrotes, puedes ver un pasillo débilmente iluminado. El sonido de pasos distantes resuena en las paredes de concreto.

Tu mente corre mientras intentas recordar cómo llegaste aquí. Lo último que recuerdas es... nada. Un vacío total.

Necesitas encontrar respuestas. Necesitas escapar.`}
      location="Celda Principal"
      mood="Misterioso"
    />
  );
}
