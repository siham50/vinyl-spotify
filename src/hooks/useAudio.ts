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
  } = usePlayerStore();

  const howlRef = useRef<Howl | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      if (!howl.playing()) return;
      const seek = howl.seek() as number;
      const dur = howl.duration() as number;
      if (dur > 0) {
        setCurrentTime(seek);
        setProgress(seek / dur);
      }
    }, 500);
  }

  // ── Auto-play first song on first mount if nothing is selected ───────────
  useEffect(() => {
    if (!currentSongId && songs.length > 0) {
      play(songs[0].id);
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Rebuild Howl when the current song changes ────────────────────────────
  useEffect(() => {
    destroyHowl();

    if (!currentSongId) return;

    const song = songs.find((s) => s.id === currentSongId);
    if (!song) return;

    // Gracefully skip tracks with no audio source
    if (!song.src) {
      setDuration(song.duration ?? 0);
      setCurrentTime(0);
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

  // ── seek helper (0–1 fraction) ────────────────────────────────────────────
  function seek(value: number) {
    const howl = howlRef.current;
    if (!howl) return;
    const dur = howl.duration() as number;
    if (dur > 0) {
      const targetSeconds = value * dur;
      howl.seek(targetSeconds);
      setCurrentTime(targetSeconds);
      setProgress(value);
    }
  }

  return { currentTime, duration, seek };
}
