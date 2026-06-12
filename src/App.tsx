import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import IPod from './components/player/IPod';
import Vinyl from './components/player/Vinyl';
import FloatingNav from './components/player/FloatingNav';
import ShortcutsOverlay from './components/player/ShortcutsOverlay';
import { usePlayer } from './store/playerStore';
import { useAudio } from './hooks/useAudio';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import { songs } from './data/songs';
import { Disc3, Music2 } from 'lucide-react';
import { redirectToSpotifyAuth } from './lib/spotifyAuth';
import Callback from './routes/callback';

function PlayerUI() {
  const { view: viewMode, currentSongId, isAuthenticated } = usePlayer();

  return (
    <AnimatePresence mode="wait">
      {/* Feature #7: Empty state */}
      {!currentSongId ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          className="flex flex-col items-center gap-6 text-center px-8 select-none"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ color: 'var(--fg-muted)' }}
          >
            <Disc3 className="w-24 h-24 opacity-30" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--fg)' }}>
              VinyPod
            </h1>
            <p className="text-base" style={{ color: 'var(--fg-muted)' }}>
              Select a song to begin
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <motion.div
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
              style={{ background: 'var(--surface)', color: 'var(--fg-subtle)', border: '1px solid var(--border)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Music2 className="w-4 h-4" />
              <span>Browse the playlist on the left to get started</span>
            </motion.div>
            
            {/* Spotify Connect Button */}
            {!isAuthenticated && (
              <button
                onClick={redirectToSpotifyAuth}
                className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-full font-medium transition-transform hover:scale-105 active:scale-95"
                style={{ background: '#1DB954', color: '#fff', border: 'none' }}
              >
                Connect with Spotify
              </button>
            )}
          </div>
        </motion.div>
      ) : viewMode === 'ipod' ? (
        <IPod key="ipod" />
      ) : (
        <Vinyl key="vinyl" />
      )}
    </AnimatePresence>
  );
}

export default function App() {
  useAudio();
  useKeyboardShortcuts();

  const { appTheme, index, playing, currentSongId, isAuthenticated } = usePlayer();
  const song = currentSongId ? songs[index] : null;
  const location = useLocation();

  // Only mount Spotify SDK when authenticated
  const spotifyPlayer = isAuthenticated ? <SpotifyPlayerMount /> : null;

  // Feature #6: sync page title
  useEffect(() => {
    if (song) {
      document.title = `${playing ? '▶' : '⏸'} ${song.title} — ${song.artist} | VinyPod`;
    } else {
      document.title = 'VinyPod — Select a song to begin';
    }
  }, [song, playing]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg)', transition: 'background 0.4s ease' }}>
      {spotifyPlayer}
      <Routes>
        <Route path="/" element={<PlayerUI />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
      
      {/* Hide FloatingNav and ShortcutsOverlay on callback route */}
      {location.pathname !== '/callback' && (
        <>
          <FloatingNav />
          <ShortcutsOverlay />
        </>
      )}
    </div>
  );
}

// Mounted as a child only when authenticated; initialises the Spotify SDK
function SpotifyPlayerMount() {
  useSpotifyPlayer();
  return null;
}
