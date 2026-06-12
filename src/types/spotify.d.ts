// Spotify Web Playback SDK global types
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }

  namespace Spotify {
    interface Player {
      connect(): Promise<boolean>;
      disconnect(): void;
      addListener(event: 'ready', cb: (state: { device_id: string }) => void): boolean;
      addListener(event: 'not_ready', cb: (state: { device_id: string }) => void): boolean;
      addListener(event: 'player_state_changed', cb: (state: PlaybackState | null) => void): boolean;
      addListener(event: 'initialization_error', cb: (e: { message: string }) => void): boolean;
      addListener(event: 'authentication_error', cb: (e: { message: string }) => void): boolean;
      addListener(event: 'account_error', cb: (e: { message: string }) => void): boolean;
      removeListener(event: string): void;
      getCurrentState(): Promise<PlaybackState | null>;
      setName(name: string): Promise<void>;
      getVolume(): Promise<number>;
      setVolume(volume: number): Promise<void>;
      pause(): Promise<void>;
      resume(): Promise<void>;
      togglePlay(): Promise<void>;
      seek(position_ms: number): Promise<void>;
      previousTrack(): Promise<void>;
      nextTrack(): Promise<void>;
    }

    interface PlayerInit {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }

    interface PlaybackState {
      context: { uri: string; metadata: unknown };
      disallows: { resuming: boolean };
      paused: boolean;
      position: number;
      repeat_mode: number;
      shuffle: boolean;
      track_window: {
        current_track: Track;
        previous_tracks: Track[];
        next_tracks: Track[];
      };
      duration: number;
    }

    interface Track {
      id: string;
      uri: string;
      name: string;
      type: string;
      artists: Array<{ name: string; uri: string }>;
      album: {
        name: string;
        images: Array<{ url: string; width: number; height: number }>;
        uri: string;
      };
      duration_ms: number;
    }

    // eslint-disable-next-line no-var
    var Player: new (options: PlayerInit) => Player;
  }
}

export {};
