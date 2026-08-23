export type GameChapter = {
  id: string;
  navLabel: string;
  title: string;
  year: string;
  accent: string;
};

export const prototypeChapters: GameChapter[] = [
  { id: "intro", navLabel: "Intro", title: "From Above", year: "1997", accent: "#dbff3f" },
  { id: "gta-1997", navLabel: "2D era", title: "Grand Theft Auto", year: "1997", accent: "#dbff3f" },
  { id: "evolution", navLabel: "The jump", title: "Dimension Shift", year: "2001", accent: "#62b8df" },
  { id: "liberty", navLabel: "Liberty", title: "Grand Theft Auto III", year: "2001", accent: "#7dc9e8" },
  { id: "vice", navLabel: "Vice", title: "Vice City", year: "2002", accent: "#ff6cc9" },
];
