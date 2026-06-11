import { motion } from "framer-motion";
import { Disc3, Music4, Sun, Moon } from "lucide-react";
import { usePlayer, type View } from "@/store/playerStore";
import { IPOD_COLORS, PIXEL_COLORS } from "./IPod";
import { VINYL_COLORS } from "./Vinyl";

const views: { id: View; icon: any; label: string }[] = [
  { id: "ipod", icon: Music4, label: "iPod" },
  { id: "vinyl", icon: Disc3, label: "Vinyl" },
];

function Swatch({ active, color, onClick, ring = "#fff" }: { active: boolean; color: string; onClick: () => void; ring?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className="w-3 h-3 rounded-full transition"
      style={{
        background: color,
        boxShadow: active ? `0 0 0 2px ${ring}, 0 0 0 3px rgba(0,0,0,0.4)` : "inset 0 0 0 1px rgba(255,255,255,0.2)",
      }}
    />
  );
}

export default function FloatingNav() {
  const { view, setView, ipod, setIpod, vinyl, setVinyl, appTheme, toggleAppTheme } = usePlayer();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 frosted rounded-full px-3 py-2 flex items-center gap-3 shadow-2xl max-w-[95vw] overflow-x-auto"
    >
      <div className="flex items-center gap-1">
        {views.map(v => {
          const Icon = v.icon;
          const active = view === v.id;
          return (
            <motion.button key={v.id} whileTap={{ scale: 0.9 }} onClick={() => setView(v.id)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition"
              style={{ color: active ? "var(--active-icon)" : "var(--nav-muted)" }}>
              {active && <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-full" style={{ background: "var(--active-pill)" }}/>}
              <Icon className="w-4 h-4 relative z-10"/>
            </motion.button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-white/10"/>

      <div className="flex items-center gap-2">
        {view === "ipod" && (
          <>
            <div className="flex items-center gap-1">
              {(["standard","pixel"] as const).map(m => (
                <button key={m} onClick={() => setIpod({ mode: m })}
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded transition"
                  style={{ color: ipod.mode === m ? "var(--nav-fg)" : "var(--nav-muted)" }}>
                  {m === "pixel" ? "PIX" : "STD"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {Object.entries(ipod.mode === "pixel" ? PIXEL_COLORS : IPOD_COLORS).map(([k, v]) => (
                <Swatch key={k} active={ipod.color === k} color={"body" in v ? v.body : v.body} onClick={() => setIpod({ color: k })}/>
              ))}
            </div>
          </>
        )}

        {view === "vinyl" && (
          <>
            <div className="flex items-center gap-1">
              {(["round","heart"] as const).map(s => (
                <button key={s} onClick={() => setVinyl({ shape: s })}
                  className="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded transition"
                  style={{ color: vinyl.shape === s ? "var(--nav-fg)" : "var(--nav-muted)" }}>{s === "round" ? "○" : "♥"}</button>
              ))}
            </div>
            <div className="w-px h-5 bg-white/10"/>
            <div className="flex items-center gap-1">
              {(["standard","flat","pixel","8bit","retro"] as const).map(s => (
                <button key={s} onClick={() => setVinyl({ style: s })}
                  className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded transition"
                  style={{ color: vinyl.style === s ? "var(--nav-fg)" : "var(--nav-muted)" }}>
                  {s === "standard" ? "STD" : s === "flat" ? "FLAT" : s === "pixel" ? "PIX" : s === "8bit" ? "8BT" : "COOL"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {Object.entries(VINYL_COLORS).map(([k, v]) => (
                <Swatch key={k} active={vinyl.color === k} color={v.base} onClick={() => setVinyl({ color: k })}/>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="w-px h-6 bg-white/10"/>

      {/* Dark / Light mode toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleAppTheme}
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition"
        style={{ color: "var(--nav-fg)" }}
        title={appTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <motion.div
          key={appTheme}
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {appTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
