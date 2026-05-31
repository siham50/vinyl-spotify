export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  accent: string;
  art: string;
  src: string;
};

export const songs: Song[] = [
  { id: "1", title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: 244, accent: "#ff5e8a", art: "https://picsum.photos/seed/midnight/600", src: "" },
  { id: "2", title: "Strawberry Swing", artist: "Coldplay", album: "Viva la Vida", duration: 253, accent: "#ffb347", art: "https://picsum.photos/seed/strawberry/600", src: "" },
  { id: "3", title: "Eternal Sunshine", artist: "Jhené Aiko", album: "Souled Out", duration: 198, accent: "#f9d77e", art: "https://picsum.photos/seed/eternal/600", src: "" },
  { id: "4", title: "Cherry Wine", artist: "Hozier", album: "Hozier", duration: 240, accent: "#c2185b", art: "https://picsum.photos/seed/cherry/600", src: "" },
  { id: "5", title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", duration: 229, accent: "#7c4dff", art: "https://picsum.photos/seed/electric/600", src: "" },
  { id: "6", title: "Lovers Rock", artist: "TV Girl", album: "French Exit", duration: 233, accent: "#ff7eb3", art: "https://picsum.photos/seed/lovers/600", src: "" },
  { id: "7", title: "Vienna", artist: "Billy Joel", album: "The Stranger", duration: 215, accent: "#d4a04c", art: "https://picsum.photos/seed/vienna/600", src: "" },
  { id: "8", title: "Heart of Glass", artist: "Blondie", album: "Parallel Lines", duration: 234, accent: "#ec4899", art: "https://picsum.photos/seed/heart/600", src: "" },
];

export const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};
