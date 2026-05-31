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

export function NowPlayingScreen({ pixel = false }: { pixel?: boolean }) {
  const { index, progress, playing } = usePlayer();
  const song = songs[index];
  const pct = (progress / song.duration) * 100;

  if (pixel) {
    return (
      <div className="w-full h-full bg-[#9bbc0f] text-[#0f380f] font-pixel p-3 flex flex-col justify-between text-[8px] leading-relaxed">
        <div className="flex justify-between">
          <span>▶ NOW</span>
          <span>{fmt(progress)}</span>
        </div>
        <div className="text-center space-y-2">
          <div className="text-[10px]">{song.title.toUpperCase()}</div>
          <div>{song.artist.toUpperCase()}</div>
          <div className="flex justify-center gap-1 mt-2">
            {[0,1,2,3,4].map(i => (
              <span key={i} className="eq-bar w-1.5 h-3 bg-[#0f380f]"
                style={{ animationDelay: `${i*0.1}s`, animationPlayState: playing ? "running" : "paused" }}/>
            ))}
          </div>
        </div>
        <div className="h-1.5 w-full bg-[#0f380f]/30">
          <div className="h-full bg-[#0f380f]" style={{ width: `${pct}%` }}/>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-neutral-900 to-black text-white flex flex-col">
      <div className="relative w-full overflow-hidden shrink-0" style={{ height: 96 }}>
        <img src={song.art} alt={song.album} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
      </div>
      <div className="flex-1 px-2.5 py-1.5 flex flex-col justify-between min-h-0 gap-1">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-display font-bold text-[12px] truncate flex-1 leading-tight">{song.title}</div>
            <Equalizer color={song.accent} playing={playing}/>
          </div>
          <div className="text-[10px] text-white/70 truncate leading-tight">{song.artist}</div>
          <div className="text-[9px] text-white/40 truncate leading-tight">{song.album}</div>
        </div>
        <div className="space-y-1">
          <div className="h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: song.accent }}
              animate={{ width: `${pct}%` }}
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/50 font-medium tabular-nums">
            <span>{fmt(progress)}</span><span>-{fmt(song.duration - progress)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
