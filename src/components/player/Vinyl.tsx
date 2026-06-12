import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayer } from "@/store/playerStore";
import { songs, fmt } from "@/lib/songs";

export const VINYL_COLORS: Record<
  string,
  { base: string; groove: string; rim: string; label: string }
> = {
  black: { base: "#0d0d0d", groove: "#1c1c1c", rim: "#000", label: "#f4ead5" },
  burgundy: { base: "#3a0a14", groove: "#5a1424", rim: "#1a0008", label: "#f0d8c0" },
  navy: { base: "#0a1838", groove: "#1a2858", rim: "#000a1a", label: "#dfe6f0" },
  forest: { base: "#0c2818", groove: "#1c4028", rim: "#001008", label: "#e8dfb8" },
  pink: { base: "#d97aa8", groove: "#e890b8", rim: "#a04880", label: "#fff0e0" },
  purple: { base: "#3a1a5a", groove: "#5a2a7a", rim: "#1a0840", label: "#ecd6ff" },
  coralOrange: { base: "#FF7F50", groove: "#FF9E7A", rim: "#CC4A22", label: "#FFF0E6" },
  pearl: { base: "#e8e4d8", groove: "#f4f0e4", rim: "#a8a498", label: "#9b6a3a" },
  lavenderVeil: { base: "#f7d9fc", groove: "#e6c2ee", rim: "#b985c2", label: "#5b1c5e" },
  sunflowerGold: { base: "#fab940", groove: "#d99820", rim: "#7a5408", label: "#3a2400" },
  hotRose: { base: "#c32868", groove: "#e04a8a", rim: "#6e1238", label: "#fff0e6" },
  nightBordeaux: { base: "#5b1c2e", groove: "#7a2840", rim: "#2a0a14", label: "#f0d8b8" },
  darkAmethyst: { base: "#25104d", groove: "#3a1a6e", rim: "#0e0420", label: "#f7d9fc" },
  honeydew: { base: "#f6ffe9", groove: "#e2efcc", rim: "#a8c084", label: "#5b6b3a" },
  vanillaCustard: { base: "#f2e0a4", groove: "#dfc878", rim: "#8a7028", label: "#5b3a08" },
  periwinkle: { base: "#cac5e5", groove: "#a8a3c8", rim: "#6a6298", label: "#1a0a5a" },
  amethyst: { base: "#a230a4", groove: "#c050c2", rim: "#52114f", label: "#fbeef9" },
  darkUltramarine: { base: "#290087", groove: "#3e1aa0", rim: "#0c002e", label: "#cac5e5" },
  ocean: { base: "#25C5E9", groove: "#CAFFDE", rim: "#021225", label: "#F2FFF6" },
  amethystTeal: { base: "#3E828E", groove: "#F6B6B7", rim: "#27153D", label: "#FFEBED" },
  berrySilk: { base: "#D44D5C", groove: "#E3B5A4", rim: "#160029", label: "#F5E9E2" },
  dustyRhino: { base: "#DD8C96", groove: "#F4DAD4", rim: "#2E4060", label: "#F4DAD4" },
  mochaRose: { base: "#BF9292", groove: "#F4DAD4", rim: "#7C5A5A", label: "#F4DAD4" },
  icyViolet: { base: "#5320C0", groove: "#C5F9FC", rim: "#1D0C13", label: "#EDEDE8" },
  sapphireBlush: { base: "#3059A4", groove: "#F2A4A5", rim: "#006E87", label: "#FFF0E9" },
  peachAmethyst: { base: "#D18A75", groove: "#FFF1D2", rim: "#260C45", label: "#FFE9E9" },
  roseSteel: { base: "#9DA3A4", groove: "#DB7F8E", rim: "#604D53", label: "#FFDBDA" },
};

// Flat illustrated icon palette for vinyls
const ICON_COLORS: Record<
  string,
  { tile: string; ring: string; accent: string; label: string; ink: string }
> = {
  black: { tile: "#18181b", ring: "#3f3f46", accent: "#fbbf24", label: "#fde68a", ink: "#0a0a0a" },
  burgundy: { tile: "#7f1d1d", ring: "#b91c1c", accent: "#fecaca", label: "#fee2e2", ink: "#450a0a" },
  navy: { tile: "#1e3a8a", ring: "#3b82f6", accent: "#bfdbfe", label: "#dbeafe", ink: "#0c1f4a" },
  forest: { tile: "#14532d", ring: "#16a34a", accent: "#bbf7d0", label: "#dcfce7", ink: "#052e16" },
  pink: { tile: "#db2777", ring: "#ec4899", accent: "#fce7f3", label: "#fbcfe8", ink: "#500724" },
  purple: { tile: "#6d28d9", ring: "#8b5cf6", accent: "#ddd6fe", label: "#ede9fe", ink: "#2e1065" },
  coralOrange: { tile: "#FF7F50", ring: "#CC4A22", accent: "#FF9E7A", label: "#FFF0E6", ink: "#CC4A22" },
  pearl: { tile: "#fafaf9", ring: "#d6d3d1", accent: "#a8a29e", label: "#f5f5f4", ink: "#44403c" },
  lavenderVeil: { tile: "#f7d9fc", ring: "#d4a8db", accent: "#b985c2", label: "#fbeafe", ink: "#5b1c5e" },
  sunflowerGold: { tile: "#fab940", ring: "#d99820", accent: "#fff0c8", label: "#ffe9a8", ink: "#5b3a08" },
  hotRose: { tile: "#c32868", ring: "#e04a8a", accent: "#ffd4e2", label: "#fff0e6", ink: "#3a0820" },
  nightBordeaux: { tile: "#5b1c2e", ring: "#8a3046", accent: "#f0d8b8", label: "#f5e4cc", ink: "#1a0408" },
  darkAmethyst: { tile: "#25104d", ring: "#5a3a9e", accent: "#f7d9fc", label: "#cac5e5", ink: "#0a0220" },
  honeydew: { tile: "#f6ffe9", ring: "#cfe0a8", accent: "#a8c084", label: "#e8f4cc", ink: "#3a5018" },
  vanillaCustard: { tile: "#f2e0a4", ring: "#bfa75e", accent: "#fff0c0", label: "#fbeec0", ink: "#3a2808" },
  periwinkle: { tile: "#cac5e5", ring: "#8e87b8", accent: "#eae6ff", label: "#ddd8f0", ink: "#1a0a5a" },
  amethyst: { tile: "#a230a4", ring: "#c050c2", accent: "#f7d9fc", label: "#fbeef9", ink: "#3a0840" },
  darkUltramarine: { tile: "#290087", ring: "#5a3ad0", accent: "#cac5e5", label: "#eae6ff", ink: "#08001a" },
  ocean: { tile: "#25C5E9", ring: "#021225", accent: "#CAFFDE", label: "#F2FFF6", ink: "#021225" },
  amethystTeal: { tile: "#3E828E", ring: "#27153D", accent: "#F6B6B7", label: "#FFEBED", ink: "#27153D" },
  berrySilk: { tile: "#D44D5C", ring: "#160029", accent: "#E3B5A4", label: "#F5E9E2", ink: "#160029" },
  dustyRhino: { tile: "#DD8C96", ring: "#2E4060", accent: "#F4DAD4", label: "#F4DAD4", ink: "#2E4060" },
  mochaRose: { tile: "#BF9292", ring: "#7C5A5A", accent: "#F4DAD4", label: "#F4DAD4", ink: "#7C5A5A" },
  icyViolet: { tile: "#5320C0", ring: "#1D0C13", accent: "#C5F9FC", label: "#EDEDE8", ink: "#1D0C13" },
  sapphireBlush: { tile: "#3059A4", ring: "#006E87", accent: "#F2A4A5", label: "#FFF0E9", ink: "#006E87" },
  peachAmethyst: { tile: "#D18A75", ring: "#260C45", accent: "#FFF1D2", label: "#FFE9E9", ink: "#260C45" },
  roseSteel: { tile: "#9DA3A4", ring: "#604D53", accent: "#DB7F8E", label: "#FFDBDA", ink: "#604D53" },
};

const HEART_PATH =
  "M256 460 C 80 360, -40 220, 60 110 C 130 30, 230 60, 256 140 C 282 60, 382 30, 452 110 C 552 220, 432 360, 256 460 Z";

export default function Vinyl() {
  const { vinyl, index, progress, playing, next, prev, toggle, setProgress, volume, setVolume } =
    usePlayer();
  const song = songs[index];
  const palette = VINYL_COLORS[vinyl.color] ?? VINYL_COLORS.black;
  const icon = ICON_COLORS[vinyl.color] ?? ICON_COLORS.black;
  const pct = (progress / song.duration) * 100;

  const isHeart = vinyl.shape === "heart";
  const isPixel = vinyl.style === "pixel"; // new pixel art style
  const isFlat = vinyl.style === "flat"; // old flat icon style
  const is8bit = vinyl.style === "8bit"; // old chunky-groove style (renamed)
  const isRetro = vinyl.style === "retro";

  const grooves = Array.from({ length: is8bit ? 8 : 28 }, (_, i) => 60 + i * 6.5);

  // We will use CSS animations for a perfectly fluid, interruptible infinite spin.

  const PIXEL_HEART_MAP = [
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000011111100000000111111000000',
    '00000111111110000001111111100000',
    '00001111111111000011111111110000',
    '00011111111111100111111111111000',
    '00111111111111111111111111111100',
    '01111111111111111111111111111110',
    '01111111111111111111111111111110',
    '11111111111111111111111111111111',
    '11111111111111111111111111111111',
    '11111111111111111111111111111111',
    '11111111111111111111111111111111',
    '01111111111111111111111111111110',
    '01111111111111111111111111111110',
    '00111111111111111111111111111100',
    '00011111111111111111111111111000',
    '00011111111111111111111111111000',
    '00001111111111111111111111110000',
    '00000111111111111111111111100000',
    '00000011111111111111111111000000',
    '00000001111111111111111110000000',
    '00000000111111111111111100000000',
    '00000000011111111111111000000000',
    '00000000001111111111110000000000',
    '00000000000111111111100000000000',
    '00000000000011111111000000000000',
    '00000000000001111110000000000000',
    '00000000000000111100000000000000',
    '00000000000000011000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000'
  ];

  const pixelPaths = useMemo(() => {
    if (!isPixel) return null;
    let base = "", hole = "", label = "", labelShadow = "", groove = "", rim = "";
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const dx = x - 15.5;
        const dy = y - 15.5;
        const d = Math.sqrt(dx * dx + dy * dy);

        let isInside = false;
        if (isHeart) {
          isInside = PIXEL_HEART_MAP[y][x] === '1';
        } else {
          isInside = d <= 15.5;
        }
        if (!isInside) continue;

        const rect = `M${x},${y}h1v1h-1z `;
        if (d <= 1.5) {
          hole += rect;
        } else if (d <= 5.5) {
          if (dx + dy > 2) { label += rect; labelShadow += rect; }
          else { label += rect; }
        } else {
          const isGroove = [7, 9, 11, 13, 15].some((r) => Math.abs(d - r) < 0.8);
          const isHighlightAngle =
            (dx + dy < -4 && dx - dy < 8 && dx - dy > -8) ||
            (dx + dy > 6 && dx - dy < 8 && dx - dy > -8);
          if (isGroove && isHighlightAngle) {
            groove += rect;
          } else if (d > 14.5 && dx + dy > 8 && !isHeart) {
            rim += rect;
          } else {
            base += rect;
          }
        }
      }
    }
    return { base, hole, label, labelShadow, groove, rim };
  }, [isPixel, isHeart]);

  // Tonearm position adjusts to vinyl shape so the stylus sits on the playable surface
  const armPos = isHeart
    ? { top: 38, right: -30, pivot: "160px 20px", playAngle: -24, pauseAngle: -8 }
    : { top: 52, right: -38, pivot: "160px 20px", playAngle: -29, pauseAngle: -13 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="flex flex-col items-center gap-6 w-full max-w-sm px-4"
    >
      {/* Vinyl + tonearm */}
      <div className="relative w-[320px] h-[320px]">
        {/* Tonearm */}
        <motion.div
          className="absolute z-20 text-slate-700"
          style={{ transformOrigin: armPos.pivot }}
          animate={{
            top: armPos.top,
            right: armPos.right,
            rotate: playing ? armPos.playAngle : armPos.pauseAngle,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="arm" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5f5f5" />
                <stop offset="50%" stopColor="#999" />
                <stop offset="100%" stopColor="#3a3a3a" />
              </linearGradient>
              <radialGradient id="pivot" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="60%" stopColor="#888" />
                <stop offset="100%" stopColor="#222" />
              </radialGradient>
            </defs>
            <circle cx="160" cy="20" r="16" fill="url(#pivot)" stroke="#111" strokeWidth="1" />
            <circle cx="160" cy="20" r="6" fill="#1a1a1a" />
            <rect
              x="40"
              y="16"
              width="120"
              height="6"
              rx="3"
              fill="url(#arm)"
              transform="rotate(-15 160 20)"
            />
            <rect
              x="36"
              y="22"
              width="22"
              height="14"
              rx="3"
              fill="currentColor"
              transform="rotate(-15 160 20)"
            />
          </svg>
        </motion.div>

        {/* FLAT ILLUSTRATED ICON style */}
        {isFlat ? (
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s", animationPlayState: playing ? "running" : "paused" }}
          >
            <svg
              viewBox="0 0 512 512"
              className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            >
              {isHeart ? (
                <>
                  <path d={HEART_PATH} fill={icon.tile} />
                  <path d={HEART_PATH} fill="none" stroke={icon.ring} strokeWidth="14" />
                  <circle cx="256" cy="256" r="110" fill={icon.accent} />
                  <circle cx="256" cy="256" r="55" fill={icon.label} />
                  <circle cx="256" cy="256" r="10" fill={icon.ink} />
                </>
              ) : (
                <>
                  <circle cx="256" cy="256" r="240" fill={icon.tile} />
                  <circle cx="256" cy="256" r="240" fill="none" stroke={icon.ring} strokeWidth="16" />
                  <circle cx="256" cy="256" r="180" fill="none" stroke={icon.ring} strokeWidth="6" opacity="0.4" />
                  <circle cx="256" cy="256" r="140" fill="none" stroke={icon.ring} strokeWidth="6" opacity="0.3" />
                  <circle cx="256" cy="256" r="100" fill={icon.accent} />
                  <circle cx="256" cy="256" r="55" fill={icon.label} />
                  <circle cx="256" cy="256" r="10" fill={icon.ink} />
                </>
              )}
            </svg>
          </div>
        ) : isPixel ? (
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s", animationPlayState: playing ? "running" : "paused" }}
          >
            <svg
              viewBox="0 0 32 32"
              className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              style={{ imageRendering: "pixelated" }}
            >
              <path d={pixelPaths!.base} fill={palette.base} />
              <path d={pixelPaths!.rim} fill={palette.rim} />
              <path d={pixelPaths!.groove} fill={palette.groove} />
              <path d={pixelPaths!.label} fill={palette.label} />
              <path d={pixelPaths!.labelShadow} fill="rgba(0,0,0,0.3)" />
              <path d={pixelPaths!.hole} fill="#ffffff" />
            </svg>
          </div>
        ) : (
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s", animationPlayState: playing ? "running" : "paused" }}
          >
            <svg
              viewBox="0 0 512 512"
              className="w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.75)]"
            >
              <defs>
                <clipPath id="shape-clip">
                  {isHeart ? <path d={HEART_PATH} /> : <circle cx="256" cy="256" r="250" />}
                </clipPath>
                <radialGradient id="vinyl-grad" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor={palette.groove} />
                  <stop offset="60%" stopColor={palette.base} />
                  <stop offset="100%" stopColor={palette.rim} />
                </radialGradient>
                {/* Retro "Cool" glassy liquid-metal base */}
                <radialGradient id="retro-grad" cx="38%" cy="30%" r="75%">
                  <stop offset="0%" stopColor={palette.groove} stopOpacity="1" />
                  <stop offset="40%" stopColor={palette.base} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={palette.rim} stopOpacity="1" />
                </radialGradient>
                {/* Glassy edge sheen — bright left chrome sweep */}
                <linearGradient id="glass-edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
                  <stop offset="6%" stopColor="rgba(255,255,255,0.35)" />
                  <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="55%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="88%" stopColor="rgba(200,210,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(180,190,255,0.55)" />
                </linearGradient>
                {/* Glassy central warm bloom */}
                <radialGradient id="glass-bloom" cx="40%" cy="32%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                  <stop offset="30%" stopColor="rgba(255,240,220,0.25)" />
                  <stop offset="70%" stopColor="rgba(255,255,255,0.04)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                {/* Glassy lower shadow */}
                <radialGradient id="glass-shadow" cx="50%" cy="88%" r="55%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                  <stop offset="60%" stopColor="rgba(0,0,0,0.15)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                {/* Secondary diagonal gloss streak */}
                <linearGradient id="glass-streak" x1="0.1" y1="0" x2="0.6" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="20%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                  <stop offset="35%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="65%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
                </linearGradient>
              </defs>

              <g clipPath="url(#shape-clip)">
                {isHeart ? (
                  <path d={HEART_PATH} fill={isRetro ? "url(#retro-grad)" : "url(#vinyl-grad)"} />
                ) : (
                  <circle
                    cx="256"
                    cy="256"
                    r="250"
                    fill={isRetro ? "url(#retro-grad)" : "url(#vinyl-grad)"}
                  />
                )}

                {/* Grooves */}
                {!isRetro &&
                  grooves.map((r, i) => (
                    <circle
                      key={i}
                      cx="256"
                      cy="256"
                      r={r}
                      fill="none"
                      stroke={is8bit ? palette.groove : "rgba(0,0,0,0.35)"}
                      strokeWidth={is8bit ? 3 : 0.6}
                      opacity={is8bit ? 1 : 0.55}
                    />
                  ))}

                {/* Cool (retro): glassy liquid-metal layers */}
                {isRetro && (
                  <>
                    {/* Subtle fine grooves beneath glass */}
                    {Array.from({ length: 20 }, (_, i) => (
                      <circle
                        key={i}
                        cx="256"
                        cy="256"
                        r={110 + i * 6}
                        fill="none"
                        stroke="rgba(0,0,0,0.10)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {/* Primary left chrome edge sweep */}
                    {isHeart
                      ? <path d={HEART_PATH} fill="url(#glass-edge)" opacity="1" style={{ mixBlendMode: "screen" }} />
                      : <circle cx="256" cy="256" r="250" fill="url(#glass-edge)" opacity="1" style={{ mixBlendMode: "screen" }} />}
                    {/* Diagonal gloss streak — top-left slash */}
                    {isHeart
                      ? <path d={HEART_PATH} fill="url(#glass-streak)" opacity="0.9" style={{ mixBlendMode: "screen" }} />
                      : <circle cx="256" cy="256" r="250" fill="url(#glass-streak)" opacity="0.9" style={{ mixBlendMode: "screen" }} />}
                    {/* Central warm bloom */}
                    {isHeart
                      ? <path d={HEART_PATH} fill="url(#glass-bloom)" opacity="1" style={{ mixBlendMode: "screen" }} />
                      : <circle cx="256" cy="256" r="250" fill="url(#glass-bloom)" opacity="1" style={{ mixBlendMode: "screen" }} />}
                    {/* Bottom rim shadow */}
                    {isHeart
                      ? <path d={HEART_PATH} fill="url(#glass-shadow)" opacity="1" />
                      : <circle cx="256" cy="256" r="250" fill="url(#glass-shadow)" opacity="1" />}
                    {/* Outer chrome ring highlight */}
                    {isHeart
                      ? <path d={HEART_PATH} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" />
                      : <circle cx="256" cy="256" r="249" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" />}
                    {/* Inner chrome ring */}
                    {isHeart
                      ? <path d={HEART_PATH} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                      : <circle cx="256" cy="256" r="240" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />}
                  </>
                )}

                {/* Highlight sheen across vinyl for realism */}
                {!is8bit &&
                  !isRetro &&
                  (isHeart ? (
                    <path d={HEART_PATH} fill="url(#sheen)" opacity="0.55" />
                  ) : (
                    <circle cx="256" cy="256" r="250" fill="url(#sheen)" opacity="0.55" />
                  ))}
              </g>

              {/* Label */}
              <circle
                cx="256"
                cy="256"
                r="82"
                fill={palette.label}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="1.5"
              />
              
              {/* Album Art (60px diameter) */}
              <image
                href={song.art}
                x="226"
                y="186"
                width="60"
                height="60"
                style={{ clipPath: "circle(50% at 50% 50%)" }}
                preserveAspectRatio="xMidYMid slice"
                opacity={0.95}
              />
              
              {/* Center hole */}
              <circle cx="256" cy="256" r="4" fill="#0a0a0a" />

              {/* Song Info */}
              <text x="256" y="278" textAnchor="middle" fill={palette.base} fontSize="11" fontWeight="bold" fontFamily="var(--font-sans)">
                {song.title}
              </text>
              <text x="256" y="292" textAnchor="middle" fill={palette.base} fontSize="8" fontFamily="var(--font-sans)" opacity="0.8">
                {song.artist}
              </text>

              {/* VinyPod Logo */}
              <text x="256" y="320" textAnchor="middle" fill={palette.base} fontSize="6" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="1.5" opacity="0.6">
                VINYPOD
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Song info */}
      <div className="text-center space-y-1">
        <h2 className="font-display font-bold text-2xl leading-tight" style={{ color: 'var(--fg)' }}>{song.title}</h2>
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
          {song.artist} · <span className="italic">{song.album}</span>
        </p>
      </div>

      {/* Progress */}
      <div className="w-full space-y-1.5">
        <div
          className="h-1 w-full rounded-full overflow-hidden cursor-pointer"
          style={{ background: 'var(--progress-track)' }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - r.left) / r.width) * song.duration);
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: song.accent }}
            animate={{ width: `${pct}%` }}
            transition={{ ease: "linear", duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs tabular-nums" style={{ color: 'var(--fg-subtle)' }}>
          <span>{fmt(progress)}</span>
          <span>{fmt(song.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="transition"
          style={{ color: 'var(--controls-fg)' }}
        >
          <SkipBack className="w-6 h-6" fill="currentColor" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="w-14 h-14 rounded-full flex items-center justify-center text-black"
          style={{ background: song.accent, boxShadow: `0 8px 30px ${song.accent}66` }}
        >
          {playing ? (
            <Pause className="w-6 h-6" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
          )}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="transition"
          style={{ color: 'var(--controls-fg)' }}
        >
          <SkipForward className="w-6 h-6" fill="currentColor" />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 w-full">
        <Volume2 className="w-4 h-4" style={{ color: 'var(--fg-subtle)' }} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1"
          style={{ accentColor: song.accent }}
        />
      </div>
    </motion.div>
  );
}
