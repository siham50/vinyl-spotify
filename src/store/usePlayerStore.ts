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
  showShortcuts: boolean;
  showToolkit: boolean;
  showVolume: boolean;

  play: (songId: string) => void;
  pause: () => void;
  resume: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setProgress: (value: number) => void;
  setVolume: (value: number) => void;
  setViewMode: (mode: 'ipod' | 'vinyl') => void;
  setAppTheme: (theme: 'dark' | 'light') => void;
  setShowShortcuts: (show: boolean) => void;
  setShowToolkit: (show: boolean) => void;
  setShowVolume: (show: boolean) => void;
  setIpodColorTheme: (theme: string) => void;
  setIpodStyle: (style: PlayerState['ipodStyle']) => void;
  setIpodPixelColor: (color: string) => void;
  setIpodScreen: (screen: 'menu' | 'nowPlaying') => void;
  setVinylShape: (shape: PlayerState['vinylShape']) => void;
  setVinylStyle: (style: PlayerState['vinylStyle']) => void;
  setVinylColor: (color: string) => void;

  seekAudio: ((seconds: number) => void) | null;
  setSeekAudio: (fn: (seconds: number) => void) => void;
  spotifySeek: ((seconds: number) => void) | null;
  setSpotifySeek: (fn: (seconds: number) => void) => void;

  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;

  spotifyDeviceId: string | null;
  setSpotifyDeviceId: (id: string) => void;

  spotifyPlaylists: Array<{ id: string; name: string; images: Array<{ url: string }>; tracks: { total: number } }>;
  setSpotifyPlaylists: (playlists: PlayerState['spotifyPlaylists']) => void;

  setSongs: (songs: Song[]) => void;
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
  showShortcuts: false,
  showToolkit: false,
  showVolume: false,

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
  setShowShortcuts: (show) => set({ showShortcuts: show }),
  setShowToolkit: (show) => set({ showToolkit: show }),
  setShowVolume: (show) => set({ showVolume: show }),
  setIpodColorTheme: (theme) => set({ ipodColorTheme: theme }),
  setIpodStyle: (style) => set({ ipodStyle: style }),
  setIpodPixelColor: (color) => set({ ipodPixelColor: color }),
  setIpodScreen: (screen) => set({ ipodScreen: screen }),
  setVinylShape: (shape) => set({ vinylShape: shape }),
  setVinylStyle: (style) => set({ vinylStyle: style }),
  setVinylColor: (color) => set({ vinylColor: color }),

  seekAudio: null,
  setSeekAudio: (fn) => set({ seekAudio: fn }),
  spotifySeek: null,
  setSpotifySeek: (fn) => set({ spotifySeek: fn }),

  isAuthenticated: !!localStorage.getItem('spotify_access_token'),
  accessToken: localStorage.getItem('spotify_access_token'),
  setAccessToken: (token) => {
    localStorage.setItem('spotify_access_token', token);
    set({ isAuthenticated: true, accessToken: token });
  },
  logout: () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    set({ isAuthenticated: false, accessToken: null });
  },

  spotifyDeviceId: null,
  setSpotifyDeviceId: (id) => set({ spotifyDeviceId: id }),

  spotifyPlaylists: [],
  setSpotifyPlaylists: (playlists) => set({ spotifyPlaylists: playlists }),

  setSongs: (songs) => set({ songs }),
}));
