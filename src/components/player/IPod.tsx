import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import { NowPlayingScreen } from "./Screen";

export const IPOD_COLORS: Record<string, { body: string; wheel: string; accent: string; shadow: string; logo: string }> = {
  silver: { body: "#C8C8C8", wheel: "#B0B0B0", accent: "#E8E8E8", shadow: "rgba(0,0,0,0.25)", logo: "#1a1a1a" },
  black:  { body: "#1a1a1a", wheel: "#111111", accent: "#2a2a2a", shadow: "rgba(0,0,0,0.8)", logo: "#ffffff" },
  pink:   { body: "#F4A7C3", wheel: "#E8849F", accent: "#FCC8D8", shadow: "rgba(0,0,0,0.2)", logo: "#1a1a1a" },
  blue:   { body: "#4A90D9", wheel: "#2E6DB4", accent: "#6AAEE8", shadow: "rgba(0,0,0,0.3)", logo: "#ffffff" },
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

export const PIXEL_COLORS: Record<string, { body: string; dark: string; mid: string; text: string; screen: string; glow: string }> = Object.fromEntries(
  Object.entries(IPOD_COLORS).map(([k, v]) => {
    const isDarkLogo = v.logo === "#1a1a1a" || v.logo === "#000";
    return [k, {
      body: v.body,
      dark: v.wheel.startsWith("linear") ? "#222" : v.wheel,
      mid: v.accent.startsWith("linear") ? "#888" : v.accent,
      text: isDarkLogo ? "#000000" : "#ffffff",
      screen: isDarkLogo ? v.accent : "#0f0f0f",
      glow: isDarkLogo ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)"
    }];
  })
);

export default function IPod() {
  const { ipod, playing, toggle, next, prev } = usePlayer();
  const isPixel = ipod.mode === "pixel";
  const pix = isPixel ? PIXEL_COLORS[ipod.color] ?? PIXEL_COLORS.silver : null;
  const std = !isPixel ? IPOD_COLORS[ipod.color] ?? IPOD_COLORS.silver : null;

  if (isPixel) {
    const p = PIXEL_COLORS[ipod.color] ?? PIXEL_COLORS.silver;
    // Pixel grid body texture — 4px squares dithered
    const gridPattern = `repeating-linear-gradient(0deg, ${p.dark} 0px, ${p.dark} 2px, transparent 2px, transparent 4px), repeating-linear-gradient(90deg, ${p.dark} 0px, ${p.dark} 2px, transparent 2px, transparent 4px)`;
    // Scanline overlay for the screen
    const scanlines = `repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)`;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.3 }}
        className="relative select-none"
        style={{
          width: 280, height: 470, borderRadius: 0,
          background: p.body,
          backgroundImage: gridPattern,
          backgroundSize: "4px 4px",
          boxShadow: `0 0 0 3px ${p.mid}, 0 0 0 4px ${p.dark}, 0 0 40px ${p.glow}, 0 20px 60px rgba(0,0,0,0.9)`,
          imageRendering: "pixelated",
        }}
      >
        {/* Dither edge strips — top */}
        <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${p.mid} 0px, ${p.mid} 4px, ${p.dark} 4px, ${p.dark} 8px)`,
          opacity: 0.8,
        }} />
        {/* Dither edge strips — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${p.dark} 0px, ${p.dark} 4px, ${p.mid} 4px, ${p.mid} 8px)`,
          opacity: 0.8,
        }} />
        {/* Dither edge strips — left */}
        <div className="absolute top-0 bottom-0 left-0 w-2 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${p.mid} 0px, ${p.mid} 4px, ${p.dark} 4px, ${p.dark} 8px)`,
          opacity: 0.8,
        }} />
        {/* Dither edge strips — right */}
        <div className="absolute top-0 bottom-0 right-0 w-2 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${p.dark} 0px, ${p.dark} 4px, ${p.mid} 4px, ${p.mid} 8px)`,
          opacity: 0.8,
        }} />

        {/* PIXEL SCREEN */}
        <div
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
          style={{
            top: 22, width: 232, height: 200, borderRadius: 0,
            background: p.screen,
            boxShadow: `0 0 0 3px ${p.mid}, 0 0 0 4px ${p.dark}, inset 0 0 20px rgba(0,0,0,0.8), 0 0 12px ${p.glow}`,
          }}
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            backgroundImage: scanlines,
            backgroundSize: "100% 2px",
          }} />

          <NowPlayingScreen pixelTheme={{ text: p.text, screen: p.screen, glow: p.glow }} />
        </div>

        {/* iPod text label */}
        <div
          className="absolute left-1/2 -translate-x-1/2 font-pixel text-[7px] tracking-[0.3em]"
          style={{ top: 228, color: p.text, textShadow: `0 0 6px ${p.glow}` }}
        >
          iPOD
        </div>

        {/* D-PAD SQUARE WHEEL */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: 32, width: 200, height: 200, borderRadius: 0,
            background: p.dark,
            boxShadow: `0 0 0 3px ${p.mid}, 0 0 0 4px ${p.dark}, 0 0 16px ${p.glow}`,
          }}
        >
          {/* D-PAD cross arms */}
          {/* Vertical bar */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0" style={{ width: 56, background: p.mid }} />
          {/* Horizontal bar */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0" style={{ height: 56, background: p.mid }} />

          {/* Corner fills (dark) to create cross shape */}
          {[[0,0],[1,0],[0,1],[1,1]].map(([x,y]) => (
            <div key={`${x}-${y}`} className="absolute" style={{
              width: 72, height: 72,
              left: x ? "auto" : 0, right: x ? 0 : "auto",
              top: y ? "auto" : 0, bottom: y ? 0 : "auto",
              background: p.body,
              backgroundImage: gridPattern,
              backgroundSize: "4px 4px",
            }} />
          ))}

          {/* Navigation labels */}
          <button onClick={() => {}} className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 flex flex-col items-center justify-center gap-0.5" style={{ color: p.text }}>
            <span className="font-pixel text-[8px]" style={{ textShadow: `0 0 4px ${p.glow}` }}>↑</span>
            <span className="font-pixel text-[5px] tracking-widest" style={{ textShadow: `0 0 4px ${p.glow}` }}>MENU</span>
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center" style={{ color: p.text }}>
            <span className="font-pixel text-[10px]" style={{ textShadow: `0 0 4px ${p.glow}` }}>→</span>
          </button>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center" style={{ color: p.text }}>
            <span className="font-pixel text-[10px]" style={{ textShadow: `0 0 4px ${p.glow}` }}>←</span>
          </button>
          <button onClick={toggle} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 flex items-center justify-center" style={{ color: p.text }}>
            <span className="font-pixel text-[10px]" style={{ textShadow: `0 0 4px ${p.glow}` }}>↓</span>
          </button>

          {/* Center select button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-pixel text-[6px]"
            style={{
              width: 52, height: 52, borderRadius: 0,
              background: p.mid,
              color: p.text,
              boxShadow: `0 0 0 2px ${p.text}, 0 0 8px ${p.glow}`,
              textShadow: `0 0 4px ${p.glow}`,
            }}
          >
            {playing ? "❚❚" : "▶"}
          </motion.button>
        </div>

        {/* VinyPod Logo — pixel font */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 font-pixel text-[6px] tracking-[0.2em]"
          style={{ color: p.text, textShadow: `0 0 6px ${p.glow}` }}
        >
          VINYPOD
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
