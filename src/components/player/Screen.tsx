import { motion } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";

// Helper to format seconds into m:ss
const fmt = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

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
  const { songs, currentSongId, progress, isPlaying, duration } = usePlayerStore();
  const currentSong = songs.find(s => s.id === currentSongId) || songs[0];
  const currentTime = progress * duration;
  const pct = progress * 100;

  if (pixel) {
    return (
      <div className="w-full h-full bg-[#9bbc0f] text-[#0f380f] font-pixel p-3 flex flex-col justify-between text-[8px] leading-relaxed">
        <div className="flex justify-between">
          <span>▶ NOW</span>
          <span>{fmt(progress)}</span>
        </div>
        <div className="text-center space-y-2">
          <div className="text-[10px]">{currentSong.title.toUpperCase()}</div>
          <div>{currentSong.artist.toUpperCase()}</div>
          <div className="flex justify-center gap-1 mt-2">
            {[0,1,2,3,4].map(i => (
              <span key={i} className="eq-bar w-1.5 h-3 bg-[#0f380f]"
                style={{ animationDelay: `${i*0.1}s`, animationPlayState: isPlaying ? "running" : "paused" }}/>
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
        <img src={currentSong.cover} alt={currentSong.album} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
      </div>
      <div className="flex-1 px-2.5 py-1.5 flex flex-col justify-between min-h-0 gap-1">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-display font-bold text-[12px] truncate flex-1 leading-tight">{currentSong.title}</div>
            <Equalizer color={currentSong.accentColor} playing={isPlaying}/>
          </div>
          <div className="text-[10px] text-white/70 truncate leading-tight">{currentSong.artist}</div>
          <div className="text-[9px] text-white/40 truncate leading-tight">{currentSong.album}</div>
        </div>
        <div className="space-y-1">
          <div className="h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: currentSong.accentColor }}
              animate={{ width: `${pct}%` }}
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/50 font-medium tabular-nums">
            <span>{fmt(currentTime)}</span><span>-{fmt(duration - currentTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SongListScreen({ pixel = false }: { pixel?: boolean }) {
  const { songs, currentSongId, play } = usePlayerStore();

  if (pixel) {
    return (
      <div className="w-full h-full bg-[#9bbc0f] text-[#0f380f] font-pixel p-2 flex flex-col text-[8px] leading-relaxed overflow-hidden">
        <div className="font-bold mb-2 tracking-widest border-b border-[#0f380f]/30 pb-1">SONGS</div>
        <div className="flex-1 overflow-y-auto space-y-1 pb-2">
          {songs.map((song) => {
            const isPlaying = song.id === currentSongId;
            return (
              <div 
                key={song.id}
                onClick={() => play(song.id)}
                className={`flex items-center gap-1 p-1 cursor-pointer ${isPlaying ? 'bg-[#0f380f] text-[#9bbc0f]' : ''}`}
              >
                <span className="w-3 shrink-0">{isPlaying ? '▶' : ''}</span>
                <span className="truncate">{song.title.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-neutral-900 to-black text-white flex flex-col p-2">
      <div className="font-display font-bold text-xs mb-2 text-white/80 border-b border-white/10 pb-1 shrink-0">
        Songs
      </div>
      <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar pb-2">
        {songs.map((song) => {
          const isPlaying = song.id === currentSongId;
          return (
            <div
              key={song.id}
              onClick={() => play(song.id)}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${isPlaying ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="w-8 h-8 rounded-sm overflow-hidden shrink-0">
                <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[10px] truncate font-medium ${isPlaying ? 'text-white' : 'text-white/80'}`} style={isPlaying ? { color: song.accentColor } : {}}>
                  {song.title}
                </div>
                <div className="text-[9px] text-white/50 truncate">{song.artist}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
