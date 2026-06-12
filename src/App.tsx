import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IPod from './components/player/IPod';
import Vinyl from './components/player/Vinyl';
import FloatingNav from './components/player/FloatingNav';
import ShortcutsOverlay from './components/player/ShortcutsOverlay';
import { usePlayer } from './store/playerStore';
import { useAudio } from './hooks/useAudio';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  useAudio();
  useKeyboardShortcuts();

  const { view: viewMode, appTheme } = usePlayer();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg)', transition: 'background 0.4s ease' }}>
      <AnimatePresence mode="wait">
        {viewMode === 'ipod' ? <IPod key="ipod" /> : <Vinyl key="vinyl" />}
      </AnimatePresence>
      <FloatingNav />
      <ShortcutsOverlay />
    </div>
  );
}
