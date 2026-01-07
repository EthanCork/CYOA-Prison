/**
 * Settings Page
 * Standalone settings page with return to menu option
 */

'use client';

import SettingsMenu from '@/components/SettingsMenu';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-8">
      <SettingsMenu showReturnToMenu={true} showCloseButton={false} />
    </div>
  );
}
