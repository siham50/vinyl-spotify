import React, { useEffect } from 'react';
import IPod from './components/player/IPod';
import Vinyl from './components/player/Vinyl';
import FloatingNav from './components/player/FloatingNav';
import { usePlayer } from './store/playerStore';
import { useAudio } from './hooks/useAudio';

export default function App() {
  useAudio();

  const { view: viewMode, appTheme } = usePlayer();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg)', transition: 'background 0.4s ease' }}>
      {viewMode === 'ipod' ? <IPod /> : <Vinyl />}
      <FloatingNav />
    </div>
  );
}
