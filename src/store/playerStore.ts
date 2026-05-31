import { create } from "zustand";
import { songs } from "@/lib/songs";

export type View = "ipod" | "vinyl";
export type IpodTheme = { mode: "standard" | "pixel"; color: string };
export type VinylShape = "round" | "heart";
export type VinylStyle = "standard" | "pixel" | "8bit" | "retro";

type State = {
  view: View;
  index: number;
  playing: boolean;
  progress: number;
  volume: number;
  ipod: IpodTheme;
  vinyl: { shape: VinylShape; style: VinylStyle; color: string };
  setView: (v: View) => void;
  next: () => void;
  prev: () => void;
  toggle: () => void;
  setProgress: (n: number) => void;
  tick: () => void;
  setIndex: (i: number) => void;
  setIpod: (p: Partial<IpodTheme>) => void;
  setVinyl: (p: Partial<{ shape: VinylShape; style: VinylStyle; color: string }>) => void;
  setVolume: (n: number) => void;
};

export const usePlayer = create<State>((set, get) => ({
  view: "ipod",
  index: 0,
  playing: true,
  progress: 42,
  volume: 0.7,
  ipod: { mode: "standard", color: "silver" },
  vinyl: { shape: "round", style: "standard", color: "black" },
  setView: (view) => set({ view }),
  next: () => set((s) => ({ index: (s.index + 1) % songs.length, progress: 0 })),
  prev: () => set((s) => ({ index: (s.index - 1 + songs.length) % songs.length, progress: 0 })),
  toggle: () => set((s) => ({ playing: !s.playing })),
  setProgress: (n) => set({ progress: n }),
  tick: () => {
    const { playing, progress, index } = get();
    if (!playing) return;
    const d = songs[index].duration;
    if (progress + 1 >= d) set({ index: (index + 1) % songs.length, progress: 0 });
    else set({ progress: progress + 1 });
  },
  setIndex: (index) => set({ index, progress: 0 }),
  setIpod: (p) => set((s) => ({ ipod: { ...s.ipod, ...p } })),
  setVinyl: (p) => set((s) => ({ vinyl: { ...s.vinyl, ...p } })),
  setVolume: (volume) => set({ volume }),
}));
