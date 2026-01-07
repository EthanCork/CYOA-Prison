/**
 * Main Menu Page
 * Entry point for El Palo de Queso game
 */

'use client';

import MainMenu from '@/components/MainMenu';

export default function MenuPage() {
  const handleStartGame = () => {
    console.log('Game starting...');
  };

  return <MainMenu onStartGame={handleStartGame} />;
}
