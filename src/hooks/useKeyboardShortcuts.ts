import { useEffect } from 'react';
import { usePlayer } from '@/store/playerStore';

export function useKeyboardShortcuts() {
  const { toggle, next, prev, view, setView, showShortcuts, setShowShortcuts, showToolkit, setShowToolkit, showVolume, setShowVolumePanel, ipod, setIpod, vinyl, setVinyl, toggleAppTheme, volume, setVolume } = usePlayer();

  const VOLUME_STEP = 0.05;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggle();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + VOLUME_STEP));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - VOLUME_STEP));
          break;
        case 't':
        case 'T':
          setView(view === 'ipod' ? 'vinyl' : 'ipod');
          break;
        case 'm':
        case 'M':
          if (view === 'ipod') {
            setIpod({ mode: ipod.mode === 'standard' ? 'pixel' : 'standard' });
          } else {
            const vinylModes = ['standard', 'flat', 'pixel', '8bit', 'retro'];
            const currentIndex = vinylModes.indexOf(vinyl.style);
            const nextIndex = (currentIndex + 1) % vinylModes.length;
            setVinyl({ style: vinylModes[nextIndex] });
          }
          break;
        case 'c':
        case 'C':
          setShowToolkit(!showToolkit);
          break;
        case 'v':
        case 'V':
          setShowVolumePanel(!showVolume);
          break;
        case 'd':
        case 'D':
          toggleAppTheme();
          break;
        case '?':
          setShowShortcuts(!showShortcuts);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, next, prev, view, setView, showShortcuts, setShowShortcuts, showToolkit, setShowToolkit, showVolume, setShowVolumePanel, ipod, setIpod, vinyl, setVinyl, toggleAppTheme, volume, setVolume]);
}
