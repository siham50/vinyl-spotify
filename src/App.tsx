import React from 'react';
import IPod from './components/player/IPod';
import Vinyl from './components/player/Vinyl';
import FloatingNav from './components/player/FloatingNav';
import { usePlayer } from './store/playerStore';
import { useAudio } from './hooks/useAudio';

export default function App() {
  // Mount the audio engine once at the root — drives Howler in sync with the store
  useAudio();

  const { view: viewMode } = usePlayer();

  return (
    <div className="min-h-screen bg-[#0a0a0a] w-full relative">
      {viewMode === 'ipod' ? <IPod /> : <Vinyl />}
      <FloatingNav />
    </div>
  );
}
