import { useEffect } from 'react';
import { usePlayer } from '@/store/playerStore';

export function useKeyboardShortcuts() {
  const { toggle, next, prev, view, setView, showShortcuts, setShowShortcuts } = usePlayer();

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
        case 't':
        case 'T':
          setView(view === 'ipod' ? 'vinyl' : 'ipod');
          break;
        case '?':
          setShowShortcuts(!showShortcuts);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, next, prev, view, setView, showShortcuts, setShowShortcuts]);
}
