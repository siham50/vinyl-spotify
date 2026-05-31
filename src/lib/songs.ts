/**
 * lib/songs.ts — re-exports song data from src/data/songs.ts and provides
 * legacy field aliases (`art`, `accent`) that the UI components reference.
 */

import { songs as rawSongs } from '../data/songs';

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  /** Legacy alias for accentColor */
  accent: string;
  /** Legacy alias for cover */
  art: string;
  src: string;
};

export const songs: Song[] = rawSongs.map((s) => ({
  id: s.id,
  title: s.title,
  artist: s.artist,
  album: s.album,
  duration: s.duration,
  accent: s.accentColor,
  art: s.cover,
  src: s.src,
}));

export const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
};
