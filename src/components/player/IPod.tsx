import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { NowPlayingScreen, SongListScreen } from "./Screen";

// Standard skeuomorphic palette with diagonal depth
export const IPOD_COLORS: Record<string, { body: string; wheel: string; edge: string; tlHi: string; brSh: string }> = {
  silver:         { body: "linear-gradient(135deg,#fafaf6 0%,#e2e2dc 55%,#bcbcb6 100%)", wheel: "#f4f4ef", edge: "#9a9a96", tlHi: "rgba(255,255,255,0.85)", brSh: "rgba(0,0,0,0.45)" },
  black:          { body: "linear-gradient(135deg,#3a3a3a 0%,#1a1a1a 55%,#000 100%)",     wheel: "#1a1a1a", edge: "#000",    tlHi: "rgba(255,255,255,0.25)", brSh: "rgba(0,0,0,0.7)" },
  rose:           { body: "linear-gradient(135deg,#ffe4ec 0%,#f4a5bb 55%,#c97a92 100%)", wheel: "#ffe2ec", edge: "#c97a92", tlHi: "rgba(255,255,255,0.8)",  brSh: "rgba(120,30,55,0.45)" },
  red:            { body: "linear-gradient(135deg,#ffb0b0 0%,#df3a3a 55%,#8a1414 100%)", wheel: "#ffd6d6", edge: "#8a1414", tlHi: "rgba(255,255,255,0.7)",  brSh: "rgba(70,0,0,0.55)" },
  purple:         { body: "linear-gradient(135deg,#e6d9ff 0%,#9a6dff 55%,#5a36b8 100%)", wheel: "#e6d9ff", edge: "#5a36b8", tlHi: "rgba(255,255,255,0.8)",  brSh: "rgba(35,0,90,0.5)" },
  burgundy:       { body: "linear-gradient(135deg,#a04050 0%,#6b1e2e 55%,#3a0d18 100%)", wheel: "#7e2638", edge: "#3a0d18", tlHi: "rgba(255,255,255,0.35)", brSh: "rgba(0,0,0,0.6)" },
  lavenderVeil:   { body: "linear-gradient(135deg,#ffffff 0%,#f7d9fc 55%,#d4a8db 100%)", wheel: "#fbeafe", edge: "#b985c2", tlHi: "rgba(255,255,255,0.9)",  brSh: "rgba(120,60,130,0.35)" },
  sunflowerGold:  { body: "linear-gradient(135deg,#ffe9a8 0%,#fab940 55%,#a87014 100%)", wheel: "#ffe2a0", edge: "#a87014", tlHi: "rgba(255,255,255,0.85)", brSh: "rgba(80,40,0,0.5)" },
  hotRose:        { body: "linear-gradient(135deg,#ff7aa3 0%,#c32868 55%,#6e1238 100%)", wheel: "#e54a82", edge: "#6e1238", tlHi: "rgba(255,255,255,0.55)", brSh: "rgba(60,0,30,0.6)" },
  nightBordeaux:  { body: "linear-gradient(135deg,#8a3046 0%,#5b1c2e 55%,#2a0a14 100%)", wheel: "#6e2438", edge: "#2a0a14", tlHi: "rgba(255,255,255,0.3)",  brSh: "rgba(0,0,0,0.65)" },
  darkAmethyst:   { body: "linear-gradient(135deg,#5a3a9e 0%,#25104d 55%,#0e0420 100%)", wheel: "#321a64", edge: "#0e0420", tlHi: "rgba(255,255,255,0.3)",  brSh: "rgba(0,0,0,0.7)" },
  honeydew:       { body: "linear-gradient(135deg,#ffffff 0%,#f6ffe9 55%,#cfdfb6 100%)", wheel: "#f8ffec", edge: "#a8c084", tlHi: "rgba(255,255,255,0.95)", brSh: "rgba(60,80,30,0.3)" },
  vanillaCustard: { body: "linear-gradient(135deg,#fff5d0 0%,#f2e0a4 55%,#bfa75e 100%)", wheel: "#fbeec0", edge: "#bfa75e", tlHi: "rgba(255,255,255,0.85)", brSh: "rgba(90,70,20,0.4)" },
  periwinkle:     { body: "linear-gradient(135deg,#eae6ff 0%,#cac5e5 55%,#8e87b8 100%)", wheel: "#ddd8f0", edge: "#8e87b8", tlHi: "rgba(255,255,255,0.85)", brSh: "rgba(40,30,90,0.4)" },
  amethyst:       { body: "linear-gradient(135deg,#d870da 0%,#a230a4 55%,#52114f 100%)", wheel: "#c050c2", edge: "#52114f", tlHi: "rgba(255,255,255,0.5)",  brSh: "rgba(40,0,40,0.6)" },
  darkUltramarine:{ body: "linear-gradient(135deg,#5a3ad0 0%,#290087 55%,#0c002e 100%)", wheel: "#3a1aa0", edge: "#0c002e", tlHi: "rgba(255,255,255,0.3)",  brSh: "rgba(0,0,20,0.7)" },
};

// Flat illustrated "icon" style — like a small flat app/sticker tile
export const PIXEL_COLORS: Record<string, { tile: string; accent: string; screen: string; ink: string }> = {
  cobalt:    { tile: "#1f2937", accent: "#3b82f6", screen: "#0f172a", ink: "#e2e8f0" },
  blossom:   { tile: "#fbcfe8", accent: "#db2777", screen: "#fdf2f8", ink: "#831843" },
  mint:      { tile: "#bbf7d0", accent: "#059669", screen: "#ecfdf5", ink: "#064e3b" },
  amber:     { tile: "#fde68a", accent: "#d97706", screen: "#fffbeb", ink: "#78350f" },
  graphite:  { tile: "#27272a", accent: "#f59e0b", screen: "#0a0a0a", ink: "#fbbf24" },
  lilac:     { tile: "#ddd6fe", accent: "#7c3aed", screen: "#f5f3ff", ink: "#3b0764" },
};

export default function IPod() {
  const { ipodStyle, ipodColorTheme, ipodPixelColor, isPlaying, resume, pause, nextSong, prevSong, ipodScreen, setIpodScreen } = usePlayerStore();
  const toggle = () => isPlaying ? pause() : resume();
  const isPixel = ipodStyle === "pixel";
  const pixColor = isPixel ? ipodPixelColor : ipodColorTheme;
  const pix = isPixel ? PIXEL_COLORS[pixColor] ?? PIXEL_COLORS.cobalt : null;
  const std = !isPixel ? IPOD_COLORS[ipodColorTheme] ?? IPOD_COLORS.silver : null;

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
            <span style={{ color: pix!.accent }}>{isPlaying ? '● PLAY' : '⏸ PAUSE'}</span>
          </div>
          <div className="flex-1 overflow-hidden rounded-md mt-1 mb-1 relative">
            {ipodScreen === 'nowPlaying' ? <NowPlayingScreen pixel /> : <SongListScreen pixel />}
          </div>
        </div>

        {/* Flat wheel */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{
          bottom: 36, width: 200, height: 200, borderRadius: "50%",
          background: pix!.accent,
          boxShadow: `inset 4px 4px 0 rgba(255,255,255,0.2), inset -4px -4px 0 rgba(0,0,0,0.3)`,
        }}>
          <button onClick={() => setIpodScreen(ipodScreen === 'nowPlaying' ? 'menu' : 'nowPlaying')} className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold" style={{ color: pix!.screen }}>MENU</button>
          <button onClick={nextSong} className="absolute right-3 top-1/2 -translate-y-1/2"><SkipForward className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor"/></button>
          <button onClick={prevSong} className="absolute left-3 top-1/2 -translate-y-1/2"><SkipBack className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor"/></button>
          <button onClick={toggle} className="absolute bottom-3 left-1/2 -translate-x-1/2">
            {isPlaying
              ? <Pause className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor"/>
              : <Play className="w-5 h-5" style={{ color: pix!.screen }} fill="currentColor"/>}
          </button>
          <motion.button whileTap={{ scale: 0.94 }} onClick={toggle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 78, height: 78, borderRadius: "50%",
              background: pix!.tile,
              boxShadow: `inset 3px 3px 0 rgba(255,255,255,0.15), inset -3px -3px 0 rgba(0,0,0,0.3)`,
            }}/>
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
          `inset 2px 2px 0 ${std!.tlHi}`,
          `inset -3px -3px 0 ${std!.brSh}`,
          `inset 0 1px 1px rgba(255,255,255,0.4)`,
          `0 30px 60px -20px rgba(0,0,0,0.75)`,
          `0 0 0 1px rgba(0,0,0,0.25)`,
        ].join(", "),
      }}
    >
      {/* Subtle diagonal sheen */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)" }}/>
      {/* Screen */}
      <div
        className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
        style={{
          top: 22, width: 232, height: 200, borderRadius: 6,
          background: "#000",
          boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.9), inset -2px -2px 4px rgba(0,0,0,0.9), 0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.35)",
        }}
      >
        {ipodScreen === 'nowPlaying' ? <NowPlayingScreen /> : <SongListScreen />}
      </div>

      {/* Click wheel with depth */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 32, width: 200, height: 200, borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${std!.wheel} 45%, ${std!.edge} 130%)`,
          boxShadow: "inset 3px 3px 5px rgba(255,255,255,0.75), inset -3px -3px 6px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.25)",
        }}
      >
        <button onClick={() => setIpodScreen(ipodScreen === 'nowPlaying' ? 'menu' : 'nowPlaying')} className="wheel-glow absolute top-0 left-1/2 -translate-x-1/2 w-16 h-10 flex items-start justify-center pt-2 text-[10px] font-semibold text-black/70 rounded-[20px]">MENU</button>
        <button onClick={nextSong} className="wheel-glow absolute right-0 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-end pr-2 rounded-[20px]"><SkipForward className="w-4 h-4 text-black/70" fill="currentColor"/></button>
        <button onClick={prevSong} className="wheel-glow absolute left-0 top-1/2 -translate-y-1/2 w-10 h-16 flex items-center justify-start pl-2 rounded-[20px]"><SkipBack className="w-4 h-4 text-black/70" fill="currentColor"/></button>
        <button onClick={toggle} className="wheel-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 flex items-end justify-center pb-2 rounded-[20px]">
          {isPlaying ? <Pause className="w-4 h-4 text-black/70" fill="currentColor"/> : <Play className="w-4 h-4 text-black/70" fill="currentColor"/>}
        </button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggle}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 78, height: 78, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #ededed 55%, #b8b8b8 100%)",
            boxShadow: "inset 2px 2px 3px rgba(255,255,255,0.95), inset -2px -2px 4px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </motion.div>
  );
}
