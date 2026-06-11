import { create } from 'zustand';
import { songs } from '../data/songs';
import type { Song } from '../types/song';
export type { Song } from '../types/song';

interface PlayerState {
  songs: Song[];
  currentSongId: string | null;

  isPlaying: boolean;
  progress: number;
  volume: number;
  duration: number;

  viewMode: 'ipod' | 'vinyl';

  ipodColorTheme: string;
  ipodStyle: 'standard' | 'pixel';
  ipodPixelColor: string;
  ipodScreen: 'menu' | 'nowPlaying';

  vinylShape: 'round' | 'heart';
  vinylStyle: 'standard' | 'pixel' | 'retro' | 'holographic' | '8bit' | 'flat';
  vinylColor: string;

  appTheme: 'dark' | 'light';

  play: (songId: string) => void;
  pause: () => void;
  resume: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setProgress: (value: number) => void;
  setVolume: (value: number) => void;
  setViewMode: (mode: 'ipod' | 'vinyl') => void;
  setAppTheme: (theme: 'dark' | 'light') => void;
  setIpodColorTheme: (theme: string) => void;
  setIpodStyle: (style: PlayerState['ipodStyle']) => void;
  setIpodPixelColor: (color: string) => void;
  setIpodScreen: (screen: 'menu' | 'nowPlaying') => void;
  setVinylShape: (shape: PlayerState['vinylShape']) => void;
  setVinylStyle: (style: PlayerState['vinylStyle']) => void;
  setVinylColor: (color: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  songs: songs,
  currentSongId: null,

  isPlaying: false,
  progress: 0,
  volume: 0.8,
  duration: 0,

  viewMode: 'ipod',
  appTheme: 'dark',

  ipodColorTheme: 'silver',
  ipodStyle: 'standard',
  ipodPixelColor: 'green',
  ipodScreen: 'nowPlaying',

  vinylShape: 'round',
  vinylStyle: 'standard',
  vinylColor: 'black',

  play: (songId) => set({ currentSongId: songId, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  nextSong: () => {
    const { songs, currentSongId } = get();
    if (!currentSongId) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSongId);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % songs.length;
      set({ currentSongId: songs[nextIndex].id, isPlaying: true, progress: 0 });
    }
  },
  prevSong: () => {
    const { songs, currentSongId } = get();
    if (!currentSongId) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSongId);
    if (currentIndex !== -1) {
      const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
      set({ currentSongId: songs[prevIndex].id, isPlaying: true, progress: 0 });
    }
  },
  setProgress: (value) => set({ progress: value }),
  setVolume: (value) => set({ volume: value }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setAppTheme: (theme) => set({ appTheme: theme }),
  setIpodColorTheme: (theme) => set({ ipodColorTheme: theme }),
  setIpodStyle: (style) => set({ ipodStyle: style }),
  setIpodPixelColor: (color) => set({ ipodPixelColor: color }),
  setIpodScreen: (screen) => set({ ipodScreen: screen }),
  setVinylShape: (shape) => set({ vinylShape: shape }),
  setVinylStyle: (style) => set({ vinylStyle: style }),
  setVinylColor: (color) => set({ vinylColor: color }),
}));
