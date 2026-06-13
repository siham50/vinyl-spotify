/**
 * Compatibility shim — exposes the legacy `usePlayer` API that the UI
 * components (IPod, Vinyl, FloatingNav, Screen) depend on, backed by
 * the canonical `usePlayerStore`.
 */

import { usePlayerStore } from './usePlayerStore';

export type View = 'ipod' | 'vinyl';

export function usePlayer() {
  const store = usePlayerStore();

  const songs = store.songs;
  const currentId = store.currentSongId;
  const index = currentId ? songs.findIndex((s) => s.id === currentId) : 0;
  const safeIndex = index < 0 ? 0 : index;

  return {
    // ── View ────────────────────────────────────────────────────────────────
    view: store.viewMode as View,
    setView: (v: View) => store.setViewMode(v),
    appTheme: store.appTheme,
    toggleAppTheme: () => store.setAppTheme(store.appTheme === 'dark' ? 'light' : 'dark'),
    showShortcuts: store.showShortcuts,
    setShowShortcuts: store.setShowShortcuts,
    showToolkit: store.showToolkit,
    setShowToolkit: store.setShowToolkit,
    showVolume: store.showVolume,
    setShowVolumePanel: store.setShowVolume,
    currentSongId: store.currentSongId,

    // ── iPod config ─────────────────────────────────────────────────────────
    ipod: {
      mode: store.ipodStyle as 'standard' | 'pixel',
      color: store.ipodStyle === 'pixel' ? store.ipodPixelColor : store.ipodColorTheme,
    },
    setIpod: (patch: { mode?: 'standard' | 'pixel'; color?: string }) => {
      if (patch.mode !== undefined) store.setIpodStyle(patch.mode);
      if (patch.color !== undefined) {
        if ((patch.mode ?? store.ipodStyle) === 'pixel') {
          store.setIpodPixelColor(patch.color);
        } else {
          store.setIpodColorTheme(patch.color);
        }
      }
    },

    // ── Vinyl config ────────────────────────────────────────────────────────
    vinyl: {
      shape: store.vinylShape,
      style: store.vinylStyle,
      color: store.vinylColor,
    },
    setVinyl: (patch: { shape?: 'round' | 'heart'; style?: string; color?: string }) => {
      if (patch.shape !== undefined) store.setVinylShape(patch.shape);
      if (patch.style !== undefined) store.setVinylStyle(patch.style as any);
      if (patch.color !== undefined) store.setVinylColor(patch.color);
    },

    // ── Playback ─────────────────────────────────────────────────────────────
    index: safeIndex,
    playing: store.isPlaying,
    progress: store.progress * (songs[safeIndex]?.duration ?? 0),
    volume: store.volume,

    toggle: () => (store.isPlaying ? store.pause() : store.resume()),
    next: () => {
      if (!store.currentSongId) store.play(songs[0]?.id ?? '');
      else store.nextSong();
    },
    prev: () => {
      if (!store.currentSongId) store.play(songs[0]?.id ?? '');
      else store.prevSong();
    },
    play: (songId: string) => store.play(songId),
    pause: () => store.pause(),

    /** setProgress accepts an absolute seconds value (legacy API) */
    setProgress: (seconds: number) => {
      const dur = songs[safeIndex]?.duration ?? 1;
      usePlayerStore.getState().setProgress(Math.min(1, Math.max(0, seconds / dur)));
      const seekFn = usePlayerStore.getState().seekAudio;
      if (seekFn) {
        seekFn(seconds);
      }
    },
    setVolume: store.setVolume,

    // ── Auth ────────────────────────────────────────────────────────────────
    isAuthenticated: store.isAuthenticated,
    accessToken: store.accessToken,
    setAccessToken: store.setAccessToken,
    logout: store.logout,
  };
}
