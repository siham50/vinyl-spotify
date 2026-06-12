import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * useAudio
 *
 * Wraps Howler.js and keeps it in sync with the Zustand player store.
 * Mount once at the App root — it has no visible output.
 *
 * Returns:
 *   currentTime – current playback position in seconds (live)
 *   duration    – total track duration in seconds
 *   seek        – seek(0–1) jumps to that fraction of the track
 */
export function useAudio() {
  const {
    songs,
    currentSongId,
    isPlaying,
    volume,
    setProgress,
    nextSong,
    play,
    setSeekAudio,
  } = usePlayerStore();

  const howlRef = useRef<Howl | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSeekingRef = useRef(false);
  const expectedSeekRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function stopInterval() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function destroyHowl() {
    stopInterval();
    if (howlRef.current) {
      howlRef.current.off(); // remove all event listeners
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
  }

  function startProgressTick(howl: Howl) {
    stopInterval();
    intervalRef.current = setInterval(() => {
      if (isSeekingRef.current) return;
      if (!howl.playing()) return;
      
      // howler.seek() returns Howl if called without args, but we know it's a number here
      // when no arguments are passed.
      const currentSeek = howl.seek() as number;
      
      // If we are waiting for a seek to complete and the time is still wildly off, it's a stale read (buffering)
      if (expectedSeekRef.current !== null) {
        if (Math.abs(currentSeek - expectedSeekRef.current) > 2) {
          return; // Ignore stale time
        } else {
          expectedSeekRef.current = null; // Reached expected time!
        }
      }

      const dur = howl.duration() as number;
      if (dur > 0) {
        setCurrentTime(currentSeek);
        setProgress(currentSeek / dur);
      }
    }, 500);
  }

  // Removed auto-play so the Empty State is shown initially.

  // ── Rebuild Howl when the current song changes ────────────────────────────
  useEffect(() => {
    destroyHowl();

    if (!currentSongId) return;

    const song = songs.find((s) => s.id === currentSongId);
    if (!song) return;

    // Gracefully handle tracks with no audio source by doing nothing with Howler
    // A separate useEffect will handle mock playback for these
    if (!song.src) {
      const isSpotifyTrack = currentSongId && currentSongId.length > 5;
      if (!isSpotifyTrack) {
        setDuration(song.duration ?? 0);
        setCurrentTime(0);
      }
      return;
    }

    const howl = new Howl({
      src: [song.src],
      html5: true,  // enables streaming / large files
      volume,
      onload() {
        const dur = howl.duration() as number;
        setDuration(dur);
        usePlayerStore.getState().setProgress(0); // reset progress bar
      },
      onend() {
        stopInterval();
        nextSong();
      },
      onseek() {
        // Clear the seeking lock once HTML5 audio has successfully seeked
        isSeekingRef.current = false;
      },
      onloaderror(_id, err) {
        console.warn('[useAudio] load error:', err);
      },
      onplayerror(_id, err) {
        console.warn('[useAudio] play error:', err);
      },
    });

    howlRef.current = howl;

    if (isPlaying) {
      howl.play();
      startProgressTick(howl);
    }

    return () => {
      destroyHowl();
    };
    // Re-create howl only when the song changes — not on every isPlaying toggle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongId]);

  // ── React to play / pause toggles ─────────────────────────────────────────
  useEffect(() => {
    const howl = howlRef.current;
    if (!howl) return;

    if (isPlaying) {
      if (!howl.playing()) howl.play();
      startProgressTick(howl);
    } else {
      howl.pause();
      stopInterval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // ── React to volume changes ───────────────────────────────────────────────
  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  // ── Global cleanup on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      destroyHowl();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── seek helper (seconds) ────────────────────────────────────────────
  function seek(targetSeconds: number) {
    const howl = howlRef.current;
    
    // If no howl is loaded (e.g., missing src), just update the store state directly
    if (!howl) {
      const state = usePlayerStore.getState();
      const song = state.songs.find((s) => s.id === state.currentSongId);
      const dur = song?.duration || 1;
      setCurrentTime(targetSeconds);
      setProgress(targetSeconds / dur);
      return;
    }

    const dur = howl.duration() as number;
    if (dur > 0) {
      isSeekingRef.current = true;
      expectedSeekRef.current = targetSeconds;
      howl.seek(targetSeconds);
      setCurrentTime(targetSeconds);
      setProgress(targetSeconds / dur);
      
      // Fallback in case onseek doesn't fire (e.g. if already at that position)
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 1500);
    }
  }

  // ── Mock playback for songs without audio ────────────────────────────
  useEffect(() => {
    const song = songs.find((s) => s.id === currentSongId);
    const isSpotifyTrack = currentSongId && currentSongId.length > 5;
    if (!song || song.src || !isPlaying || isSpotifyTrack) return;

    const dur = song.duration || 1;
    const interval = setInterval(() => {
      usePlayerStore.setState((state) => {
        let newProgress = state.progress + 0.5 / dur;
        if (newProgress >= 1) {
          newProgress = 0;
          setTimeout(() => nextSong(), 0);
        }
        setCurrentTime(newProgress * dur);
        return { progress: newProgress };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, currentSongId, songs, nextSong]);

  // ── Register seek to store ─────────────────────────────────────────────
  useEffect(() => {
    setSeekAudio(seek);
  }, [setSeekAudio]);

  return { currentTime, duration, seek };
}
