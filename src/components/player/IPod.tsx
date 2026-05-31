import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import { NowPlayingScreen } from "./Screen";

export const IPOD_COLORS: Record<string, { body: string; wheel: string; accent: string; shadow: string; logo: string }> = {
  silver: { body: "#C8C8C8", wheel: "#B0B0B0", accent: "#E8E8E8", shadow: "rgba(0,0,0,0.25)", logo: "#1a1a1a" },
  black:  { body: "#1a1a1a", wheel: "#111111", accent: "#2a2a2a", shadow: "rgba(0,0,0,0.8)", logo: "#ffffff" },
  pink:   { body: "#F4A7C3", wheel: "#E8849F", accent: "#FCC8D8", shadow: "rgba(0,0,0,0.2)", logo: "#1a1a1a" },
  blue:   { body: "#4A90D9", wheel: "#2E6DB4", accent: "#6AAEE8", shadow: "rgba(0,0,0,0.3)", logo: "#ffffff" },
  red:    { body: "#C0392B", wheel: "#96281B", accent: "#E74C3C", shadow: "rgba(0,0,0,0.4)", logo: "#ffffff" },
  purple: { body: "#7D3C98", wheel: "#6C3483", accent: "#9B59B6", shadow: "rgba(0,0,0,0.4)", logo: "#ffffff" },
  burgundy: { body: "#6A1B31", wheel: "#4B1323", accent: "#8B2340", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  ocean: { body: "linear-gradient(135deg, #F2FFF6 0%, #CAFFDE 25%, #25C5E9 50%, #238689 75%, #021225 100%)", wheel: "#238689", accent: "#CAFFDE", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  amethystTeal: { body: "linear-gradient(135deg, #FFEBED 0%, #F6B6B7 25%, #A6C9B6 50%, #3E828E 75%, #27153D 100%)", wheel: "#3E828E", accent: "#F6B6B7", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  berrySilk: { body: "linear-gradient(135deg, #F5E9E2 0%, #E3B5A4 25%, #D44D5C 50%, #773344 75%, #160029 100%)", wheel: "#773344", accent: "#E3B5A4", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  dustyRhino: { body: "linear-gradient(135deg, #F4DAD4 0%, #DD8C96 50%, #2E4060 100%)", wheel: "#2E4060", accent: "#DD8C96", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  mochaRose: { body: "linear-gradient(135deg, #F4DAD4 0%, #BF9292 50%, #7C5A5A 100%)", wheel: "#7C5A5A", accent: "#F4DAD4", shadow: "rgba(0,0,0,0.4)", logo: "#ffffff" },
  icyViolet: { body: "linear-gradient(135deg, #EDEDE8 0%, #C5F9FC 25%, #5320C0 50%, #4F032E 75%, #1D0C13 100%)", wheel: "#5320C0", accent: "#C5F9FC", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  sapphireBlush: { body: "linear-gradient(135deg, #FFF0E9 0%, #F2A4A5 25%, #E5C5C6 50%, #3059A4 75%, #006E87 100%)", wheel: "#3059A4", accent: "#F2A4A5", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  peachAmethyst: { body: "linear-gradient(135deg, #FFE9E9 0%, #FFF1D2 25%, #D18A75 50%, #A33E7E 75%, #260C45 100%)", wheel: "#A33E7E", accent: "#FFF1D2", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
  roseSteel: { body: "linear-gradient(135deg, #FFDBDA 0%, #DB7F8E 25%, #D5C5C8 50%, #9DA3A4 75%, #604D53 100%)", wheel: "#9DA3A4", accent: "#DB7F8E", shadow: "rgba(0,0,0,0.5)", logo: "#ffffff" },
};

// Flat illustrated "icon" style — like a small flat app/sticker tile
export const PIXEL_COLORS: Record<string, { tile: string; accent: string; screen: string; ink: string }> = {
  cobalt: { tile: "#1f2937", accent: "#3b82f6", screen: "#0f172a", ink: "#e2e8f0" },
  blossom: { tile: "#fbcfe8", accent: "#db2777", screen: "#fdf2f8", ink: "#831843" },
  mint: { tile: "#bbf7d0", accent: "#059669", screen: "#ecfdf5", ink: "#064e3b" },
  amber: { tile: "#fde68a", accent: "#d97706", screen: "#fffbeb", ink: "#78350f" },
  graphite: { tile: "#27272a", accent: "#f59e0b", screen: "#0a0a0a", ink: "#fbbf24" },
  lilac: { tile: "#ddd6fe", accent: "#7c3aed", screen: "#f5f3ff", ink: "#3b0764" },
};

export default function IPod() {
  const { ipod, playing, toggle, next, prev } = usePlayer();
  const isPixel = ipod.mode === "pixel";
  const pix = isPixel ? PIXEL_COLORS[ipod.color] ?? PIXEL_COLORS.cobalt : null;
  const std = !isPixel ? IPOD_COLORS[ipod.color] ?? IPOD_COLORS.silver : null;

  if (isPixel) {
    // Flat illustrated icon mode
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{
          width: 280, height: 470, borderRadius: 36,
          background: pix!.tile,
          boxShadow: `inset 3px 3px 0 rgba(255,255,255,0.18), inset -4px -4px 0 rgba(0,0,0,0.25), 0 30px 60px -20px rgba(0,0,0,0.75)`,
        }}
      >
        {/* Flat screen */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col justify-between p-3" style={{
          top: 26, width: 232, height: 200, borderRadius: 14,
          background: pix!.screen, color: pix!.ink,
          boxShadow: `inset 0 0 0 3px ${pix!.accent}, 0 6px 0 rgba(0,0,0,0.2)`,
        }}>
          <div className="flex items-center justify-between text-[9px] font-bold tracking-widest opacity-80">
            <span>iPOD</span>
            <span style={{ color: pix!.accent }}>● PLAY</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: pix!.accent }}>
              {playing
                ? <Pause className="w-8 h-8" style={{ color: pix!.screen }} fill="currentColor" />
                : <Play className="w-8 h-8 ml-1" style={{ color: pix!.screen }} fill="currentColor" />}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-1 rounded-full" style={{ background: `${pix!.accent}33` }}>
              <div className="h-full rounded-full" style={{ background: pix!.accent, width: "42%" }} />
            </div>
            <div className="text-[9px] font-semibold opacity-70 text-center">Now Playing</div>
          </div>
        </div>

        {/* Flat wheel */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{
          bottom: 36, width: 200, height: 200, borderRadius: "50%",
          background: pix!.accent,
          boxShadow: `inset 4px 4px 0 rgba(255,255,255,0.2), inset -4px -4px 0 rgba(0,0,0,0.3)`,
        }}>
          <button onClick={() => { }} className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold" style={{ color: pix!.screen }}>MENU</button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2"><SkipForward className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor" /></button>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2"><SkipBack className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor" /></button>
          <button onClick={toggle} className="absolute bottom-3 left-1/2 -translate-x-1/2">
            {playing
              ? <Pause className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor" />
              : <Play className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor" />}
          </button>
          <motion.button whileTap={{ scale: 0.94 }} onClick={toggle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 78, height: 78, borderRadius: "50%",
              background: pix!.tile,
              boxShadow: `inset 3px 3px 0 rgba(255,255,255,0.15), inset -3px -3px 0 rgba(0,0,0,0.3)`,
            }} />
        </div>
      </motion.div>
    );
  }

  // Standard skeuomorphic mode — 3D depth, lighter TL, darker BR
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{
        width: 280, height: 470, borderRadius: 32,
        background: std!.body,
        boxShadow: [
          `inset 2px 2px 0 ${std!.accent}`,
          `inset -3px -3px 0 ${std!.shadow}`,
          `inset 0 1px 1px rgba(255,255,255,0.4)`,
          `0 30px 60px -20px rgba(0,0,0,0.75)`,
          `0 0 0 1px rgba(0,0,0,0.25)`,
        ].join(", "),
        transition: "all 400ms ease",
      }}
    >
      {/* Subtle diagonal sheen */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)" }} />
      {/* Screen */}
      <div
        className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
        style={{
          top: 22, width: 232, height: 200, borderRadius: 6,
          backgroundColor: "#1a1a1a",
          boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.9), inset -2px -2px 4px rgba(0,0,0,0.9), 0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.35)",
        }}
      >
        <NowPlayingScreen />
      </div>

      {/* Click wheel with depth */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 32, width: 200, height: 200, borderRadius: "50%",
          background: std!.wheel,
          boxShadow: `inset 3px 3px 5px ${std!.accent}, inset -3px -3px 6px ${std!.shadow}, 0 0 0 1px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.25)`,
          transition: "all 400ms ease",
        }}
      >
        <button onClick={() => { }} className="wheel-glow absolute top-0 left-1/2 -translate-x-1/2 w-16 h-10 flex items-start justify-center pt-2 text-[10px] font-semibold text-black/70 rounded-[20px]">MENU</button>
        <button onClick={next} className="wheel-glow absolute right-0 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-end pr-2 rounded-[20px]"><SkipForward className="w-4 h-4 text-black/70" fill="currentColor" /></button>
        <button onClick={prev} className="wheel-glow absolute left-0 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-start pl-2 rounded-[20px]"><SkipBack className="w-4 h-4 text-black/70" fill="currentColor" /></button>
        <button onClick={toggle} className="wheel-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 flex items-end justify-center pb-2 rounded-[20px]">
          {playing ? <Pause className="w-4 h-4 text-black/70" fill="currentColor" /> : <Play className="w-4 h-4 text-black/70" fill="currentColor" />}
        </button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggle}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 78, height: 78, borderRadius: "50%",
            background: std!.body,
            boxShadow: `inset 2px 2px 3px ${std!.accent}, inset -2px -2px 4px ${std!.shadow}, 0 3px 6px rgba(0,0,0,0.25)`,
            transition: "all 400ms ease",
          }}
        />
      </div>

      {/* VinyPod Logo */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display font-bold text-[10px] tracking-widest opacity-80"
        style={{ color: std!.logo, transition: "all 400ms ease" }}
      >
        VinyPod
      </div>
    </motion.div>
  );
}
