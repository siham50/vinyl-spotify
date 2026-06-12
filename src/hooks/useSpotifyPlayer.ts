import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import type { Song } from '../types/song';

const SPOTIFY_API = 'https://api.spotify.com/v1';

// ─── Spotify API helpers ────────────────────────────────────────────────────

async function spotifyFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${SPOTIFY_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    if (res.status === 401 && window.location.pathname !== '/callback') {
      usePlayerStore.getState().logout();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `Spotify API error: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function mapSpotifyTrack(item: any): Song {
  const track = item.track ?? item;
  const images: Array<{ url: string; width?: number; height?: number }> =
    track.album?.images ?? [];
  const cover = images.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? '';
  return {
    id: track.id,
    title: track.name,
    artist: track.artists?.map((a: any) => a.name).join(', ') ?? '',
    album: track.album?.name ?? '',
    src: '',      // streaming handled by SDK, no direct src
    cover,
    duration: Math.floor(track.duration_ms / 1000),
    accentColor: '#1DB954',
  };
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSpotifyPlayer() {
  const store = usePlayerStore;
  const playerRef = useRef<Spotify.Player | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const token = store.getState().accessToken;
    if (!token) return;

    // ── Load SDK script ─────────────────────────────────────────────────────
    if (!document.getElementById('spotify-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'spotify-sdk-script';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // ── Smooth progress interval ─────────────────────────────────────────────
    function startProgressInterval() {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        const state = store.getState();
        if (!state.isPlaying) return;
        const duration = state.duration || 1;
        const newProgress = Math.min(1, state.progress + 0.5 / duration);
        store.setState({ progress: newProgress });
      }, 500);
    }

    function stopProgressInterval() {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    // ── SDK Ready callback ───────────────────────────────────────────────────
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'VinyPod',
        getOAuthToken: (cb) => {
          cb(store.getState().accessToken ?? '');
        },
        volume: store.getState().volume,
      });

      playerRef.current = player;

      // ── Event: Ready ──────────────────────────────────────────────────────
      player.addListener('ready', ({ device_id }) => {
        console.log('[VinyPod] Spotify SDK ready. Device ID:', device_id);
        deviceIdRef.current = device_id;
        store.getState().setSpotifyDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.warn('[VinyPod] Spotify SDK went offline. Device:', device_id);
      });

      // ── Event: State Changed ──────────────────────────────────────────────
      player.addListener('player_state_changed', (state) => {
        if (!state) return;

        const track = state.track_window.current_track;
        const duration_ms = state.duration;
        const position_ms = state.position;
        const paused = state.paused;

        if (!track) return;

        const images: Array<{ url: string; width?: number; height?: number }> =
          track.album.images ?? [];
        const cover = images.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? '';

        const mappedSong: Song = {
          id: track.id,
          title: track.name,
          artist: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          src: '',
          cover,
          duration: Math.floor(duration_ms / 1000),
          accentColor: '#1DB954',
        };

        const currentSongs = store.getState().songs;
        const existsInList = currentSongs.find((s) => s.id === track.id);
        if (!existsInList) {
          store.setState({ songs: [mappedSong, ...currentSongs] });
        }

        store.setState({
          currentSongId: track.id,
          isPlaying: !paused,
          progress: duration_ms > 0 ? position_ms / duration_ms : 0,
          duration: Math.floor(duration_ms / 1000),
        });

        if (!paused) {
          startProgressInterval();
        } else {
          stopProgressInterval();
        }
      });

      // ── Error Listeners ───────────────────────────────────────────────────
      player.addListener('initialization_error', ({ message }) => {
        console.error('[VinyPod] SDK init error:', message);
      });
      player.addListener('authentication_error', ({ message }) => {
        console.error('[VinyPod] SDK auth error:', message);
        if (window.location.pathname !== '/callback') {
          store.getState().logout();
        }
      });
      player.addListener('account_error', ({ message }) => {
        console.error('[VinyPod] SDK account error (Spotify Premium required):', message);
      });

      player.connect();
    };

    // ── Override store actions to call real Spotify API ───────────────────────
    const origPause = store.getState().pause;
    const origResume = store.getState().resume;
    const origNext = store.getState().nextSong;
    const origPrev = store.getState().prevSong;
    const origSetVolume = store.getState().setVolume;
    const origSeekAudio = store.getState().seekAudio;

    function isSpotify() {
      const id = store.getState().currentSongId;
      return id && id.length > 5;
    }

    store.setState({
      pause: () => {
        if (isSpotify()) {
          playerRef.current?.pause();
          stopProgressInterval();
          store.setState({ isPlaying: false });
        } else {
          origPause();
        }
      },
      resume: () => {
        if (isSpotify()) {
          playerRef.current?.resume();
          startProgressInterval();
          store.setState({ isPlaying: true });
        } else {
          origResume();
        }
      },
      nextSong: () => {
        if (isSpotify()) {
          playerRef.current?.nextTrack();
        } else {
          origNext();
        }
      },
      prevSong: () => {
        if (isSpotify()) {
          playerRef.current?.previousTrack();
        } else {
          origPrev();
        }
      },
      setVolume: (value: number) => {
        if (isSpotify()) {
          playerRef.current?.setVolume(value);
        }
        origSetVolume(value);
      },
      seekAudio: (seconds: number) => {
        if (isSpotify()) {
          const dur = store.getState().duration || 1;
          // Immediately update store to seeked position so UI reflects it right away
          store.setState({ progress: Math.min(1, seconds / dur) });
          // Tell the Spotify SDK to actually seek
          playerRef.current?.seek(seconds * 1000);
          // Restart progress interval from new position
          stopProgressInterval();
          if (store.getState().isPlaying) startProgressInterval();
        } else if (origSeekAudio) {
          origSeekAudio(seconds);
        }
      },
    });

    // ── Fetch playlists ──────────────────────────────────────────────────────
    async function fetchPlaylists() {
      const t = store.getState().accessToken;
      if (!t) return;
      try {
        const data = await spotifyFetch('/me/playlists?limit=50', t);
        store.getState().setSpotifyPlaylists(data.items ?? []);
      } catch (err) {
        console.error('[VinyPod] Failed to fetch playlists:', err);
      }
    }

    fetchPlaylists();

    return () => {
      stopProgressInterval();
      // Restore original store actions
      store.setState({
        pause: origPause,
        resume: origResume,
        nextSong: origNext,
        prevSong: origPrev,
        setVolume: origSetVolume,
        seekAudio: origSeekAudio,
      });
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only runs once on mount

  // ── Fetch playlist tracks ────────────────────────────────────────────────
  async function loadPlaylistTracks(playlistId: string) {
    const token = store.getState().accessToken;
    if (!token) return;
    try {
      const data = await spotifyFetch(
        `/playlists/${playlistId}/tracks?limit=50&fields=items(track(id,name,artists,album,duration_ms))`,
        token
      );
      const mapped: Song[] = (data.items ?? [])
        .filter((item: any) => item.track && item.track.id)
        .map(mapSpotifyTrack);
      store.getState().setSongs(mapped);
      if (mapped.length > 0) {
        store.setState({ currentSongId: mapped[0].id });
        // Tell the SDK to play this playlist
        const deviceId = deviceIdRef.current;
        if (deviceId && token) {
          await spotifyFetch(`/me/player/play?device_id=${deviceId}`, token, {
            method: 'PUT',
            body: JSON.stringify({
              context_uri: `spotify:playlist:${playlistId}`,
              offset: { position: 0 },
              position_ms: 0,
            }),
          });
        }
      }
    } catch (err) {
      console.error('[VinyPod] Failed to load playlist tracks:', err);
    }
  }

  return { loadPlaylistTracks };
}
