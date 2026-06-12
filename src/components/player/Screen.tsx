import { useState } from "react";
import { motion } from "framer-motion";
import { songs, fmt } from "@/lib/songs";
import { usePlayer } from "@/store/playerStore";

export function Equalizer({ color = "#fff", playing = true }: { color?: string; playing?: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="eq-bar w-[3px] h-full rounded-[1px]"
          style={{
            background: color,
            animationDelay: `${i * 0.15}s`,
            animationPlayState: playing ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}

// 5-bar Framer Motion visualizer for the standard iPod screen
const HEIGHTS = [
  [4, 15, 8, 20, 6, 18, 5, 12, 4],
  [4, 12, 18, 5, 14, 7, 20, 8, 4],
  [4, 8, 20, 12, 16, 5, 10, 15, 4],
  [4, 18, 6, 14, 20, 8, 15, 5, 4],
  [4, 10, 15, 8, 20, 12, 6, 18, 4]
];

export function FramerEqualizer({ playing }: { playing: boolean }) {
  return (
    <div className="absolute bottom-[28px] right-2.5 flex items-end gap-[3px] h-[20px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-green-500 rounded-t-[2px]"
          initial={{ height: 4 }}
          animate={playing ? { height: HEIGHTS[i] } : { height: 4 }}
          transition={playing ? {
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
            delay: i * 0.15,
          } : { duration: 0.4 }}
        />
      ))}
    </div>
  );
}

// Pixel equalizer: 4 columns of 4x4px squares that animate up/down
function PixelEqualizer({ color, glow, playing }: { color: string; glow: string; playing: boolean }) {
  const heights = [3, 5, 4, 6]; // max pixel heights per column
  return (
    <div className="flex items-end gap-[3px]">
      {heights.map((maxH, col) => (
        <motion.div
          key={col}
          className="flex flex-col-reverse gap-[2px]"
          animate={playing ? { scaleY: [0.4, 1, 0.6, 1, 0.3, 0.9, 1] } : { scaleY: 0.2 }}
          transition={playing ? {
            repeat: Infinity, duration: 0.6 + col * 0.15, ease: "easeInOut",
            repeatType: "reverse", delay: col * 0.1,
          } : { duration: 0.4 }}
          style={{ originY: 1 }}
        >
          {Array.from({ length: maxH }).map((_, r) => (
            <div key={r} style={{
              width: 4, height: 4,
              background: color,
              boxShadow: `0 0 3px ${glow}`,
              imageRendering: "pixelated",
            }} />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

type PixelTheme = { text: string; screen: string; glow: string };

export function NowPlayingScreen({ pixelTheme }: { pixelTheme?: PixelTheme }) {
  const { index, progress, playing, setProgress } = usePlayer();
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const song = songs[index];
  const pct = (progress / song.duration) * 100;

  if (pixelTheme) {
    const { text, screen, glow } = pixelTheme;
    return (
      <div className="w-full h-full flex flex-col p-2 gap-1" style={{ background: screen, color: text, fontFamily: "'Press Start 2P', monospace" }}>
        {/* Header row */}
        <div className="flex justify-between items-center" style={{ fontSize: 6 }}>
          <span style={{ textShadow: `0 0 4px ${glow}` }}>&#9658; NOW PLAYING</span>
          <span style={{ textShadow: `0 0 4px ${glow}` }}>{fmt(progress)}</span>
        </div>

        {/* Album art + song info */}
        <div className="flex gap-2 flex-1 min-h-0">
          {/* Pixelated album art — scaled down to 32x32 then up */}
          <div style={{
            width: 52, height: 52, flexShrink: 0,
            imageRendering: "pixelated",
            boxShadow: `0 0 0 2px ${text}, 0 0 8px ${glow}`,
            overflow: "hidden",
          }}>
            <img
              src={song.art}
              alt=""
              style={{ width: "100%", height: "100%", imageRendering: "pixelated", objectFit: "cover" }}
            />
          </div>

          {/* Text info */}
          <div className="flex flex-col justify-between flex-1 min-w-0" style={{ fontSize: 5 }}>
            <div style={{ textShadow: `0 0 4px ${glow}`, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontSize: 6 }}>
              {song.title.toUpperCase().slice(0, 14)}
            </div>
            <div style={{ opacity: 0.7, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {song.artist.toUpperCase().slice(0, 16)}
            </div>
            <div style={{ opacity: 0.5 }}>
              {song.album.toUpperCase().slice(0, 16)}
            </div>
            <PixelEqualizer color={text} glow={glow} playing={playing} />
          </div>
        </div>

        {/* Progress bar made of pixel squares */}
        <div style={{ fontSize: 5, opacity: 0.6 }}>{fmt(song.duration - progress)} LEFT</div>
        <div 
          style={{
            height: 8, width: "100%",
            background: `${text}22`,
            boxShadow: `inset 0 0 0 1px ${text}44`,
            position: "relative",
            imageRendering: "pixelated",
            cursor: "pointer"
          }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - r.left) / r.width) * song.duration);
          }}
        >
          {/* Chunky pixel progress blocks */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0,
            width: `${pct}%`,
            background: text,
            boxShadow: `0 0 6px ${glow}`,
          }} />
          {/* Tick marks every ~10% */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", top: 0, bottom: 0,
              left: `${(i + 1) * 10}%`, width: 1,
              background: `${text}30`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-neutral-900 to-black text-white flex flex-col">
      <div className="relative w-full overflow-hidden shrink-0" style={{ height: 96 }}>
        <img src={song.art} alt={song.album} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      <div className="flex-1 px-2.5 py-1.5 flex flex-col justify-between min-h-0 gap-1 relative">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-display font-bold text-[12px] truncate flex-1 leading-tight">{song.title}</div>
          </div>
          <div className="text-[10px] text-white/70 truncate leading-tight">{song.artist}</div>
          <div className="text-[9px] text-white/40 truncate leading-tight">{song.album}</div>
        </div>
        <div className="space-y-1 relative group">
          {/* Tooltip */}
          {hoverPct !== null && (
            <div
              className="absolute -top-5 text-[8px] px-1 py-0.5 rounded shadow-lg pointer-events-none transform -translate-x-1/2 z-10"
              style={{
                left: `${hoverPct * 100}%`,
                background: 'rgba(255, 255, 255, 0.9)',
                color: 'black'
              }}
            >
              {fmt(hoverPct * song.duration)}
            </div>
          )}
          <div 
            className="h-[4px] w-full rounded-full bg-white/15 cursor-pointer relative overflow-visible"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setHoverPct(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
            }}
            onMouseLeave={() => setHoverPct(null)}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - r.left) / r.width) * song.duration);
            }}
          >
            {/* Fill */}
            <motion.div
              className="h-full rounded-full absolute top-0 left-0"
              style={{ background: song.accent }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
            {/* Thumb */}
            <motion.div
              className="w-[6px] h-[6px] rounded-full absolute top-1/2 -translate-y-1/2 -ml-[3px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              style={{ background: song.accent }}
              animate={{ left: `${pct}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/50 font-medium tabular-nums">
            <span>{fmt(progress)}</span><span>-{fmt(song.duration - progress)}</span>
          </div>
        </div>
        <FramerEqualizer playing={playing} />
      </div>
    </div>
  );
}
