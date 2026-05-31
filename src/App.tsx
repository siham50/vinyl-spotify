import React from 'react';
import IPod from './components/player/IPod';
import Vinyl from './components/player/Vinyl';
import FloatingNav from './components/player/FloatingNav';
import { usePlayer } from './store/playerStore';

export default function App() {
  const { view: viewMode } = usePlayer();

  return (
    <div className="min-h-screen bg-[#0a0a0a] w-full relative">
      {viewMode === 'ipod' ? <IPod /> : <Vinyl />}
      <FloatingNav />
    </div>
  );
}
