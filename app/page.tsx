/**
 * Homepage - Main Menu
 * Entry point for Île de Pierre game
 */

'use client';

import MainMenu from '@/components/MainMenu';

export default function Home() {
  const handleStartGame = () => {
    console.log('Game starting...');
  };

  return <MainMenu onStartGame={handleStartGame} />;
}
