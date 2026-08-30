export type EraId = "intro" | "2d" | "3d" | "hd" | "future";

export type GameEntry = {
  id: string;
  title: string;
  displayTitle: string;
  year: string;
  era: Exclude<EraId, "intro">;
  city: string;
  platform: string;
  change: string;
  summary: string;
  accent: string;
  index: string;
  featured?: boolean;
};

export type EraChapter = { id: EraId; navLabel: string; year: string; accent: string };

export const eraChapters: EraChapter[] = [
  { id: "intro", navLabel: "Start", year: "1997", accent: "#eaff3d" },
  { id: "2d", navLabel: "2D", year: "97—99", accent: "#eaff3d" },
  { id: "3d", navLabel: "3D", year: "01—06", accent: "#ff5db1" },
  { id: "hd", navLabel: "HD", year: "08—NOW", accent: "#68cfff" },
  { id: "future", navLabel: "VI", year: "2026", accent: "#ff896c" },
];

export const games: GameEntry[] = [
  { id: "grand-theft-auto", title: "Grand Theft Auto", displayTitle: "Grand Theft Auto", year: "1997", era: "2d", city: "Liberty · Vice · San Andreas", platform: "PC · PlayStation", change: "The open city", summary: "A top-down city becomes a toy box: steal a car, ignore the route and make your own trouble.", accent: "#eaff3d", index: "01", featured: true },
  { id: "gta-london-1969", title: "Grand Theft Auto: London 1969", displayTitle: "London 1969", year: "1999", era: "2d", city: "London", platform: "PC · PlayStation", change: "A real place", summary: "The formula crosses the Atlantic, swaps the mood and proves the city itself can be the star.", accent: "#ff654f", index: "02" },
  { id: "gta-london-1961", title: "Grand Theft Auto: London 1961", displayTitle: "London 1961", year: "1999", era: "2d", city: "London", platform: "PC", change: "The expansion expands", summary: "A free mission pack turns one detour through London into a miniature era of its own.", accent: "#f1c45b", index: "03" },
  { id: "gta-2", title: "Grand Theft Auto 2", displayTitle: "GTA 2", year: "1999", era: "2d", city: "Anywhere City", platform: "PC · PlayStation · Dreamcast", change: "Respect the gangs", summary: "A darker near-future city adds rival factions, reputation and a sharper arcade rhythm.", accent: "#6de0b0", index: "04", featured: true },
  { id: "gta-3", title: "Grand Theft Auto III", displayTitle: "GTA III", year: "2001", era: "3d", city: "Liberty City", platform: "PlayStation 2 · Xbox · PC", change: "The third dimension", summary: "The camera drops behind the car and the modern open world finds its visual language.", accent: "#79c8ec", index: "05", featured: true },
  { id: "vice-city", title: "Grand Theft Auto: Vice City", displayTitle: "Vice City", year: "2002", era: "3d", city: "Vice City", platform: "PlayStation 2 · Xbox · PC", change: "A city with a soundtrack", summary: "Neon, ocean haze and an unmistakable decade turn location into personality.", accent: "#ff5db1", index: "06", featured: true },
  { id: "san-andreas", title: "Grand Theft Auto: San Andreas", displayTitle: "San Andreas", year: "2004", era: "3d", city: "Los Santos · San Fierro · Las Venturas", platform: "PlayStation 2 · Xbox · PC", change: "A whole state", summary: "Three cities, countryside and character progression make the world feel impossibly broad.", accent: "#85c65c", index: "07", featured: true },
  { id: "gta-advance", title: "Grand Theft Auto Advance", displayTitle: "GTA Advance", year: "2004", era: "3d", city: "Liberty City", platform: "Game Boy Advance", change: "Back above", summary: "A pocket-sized return to the overhead viewpoint keeps the original perspective alive.", accent: "#dcff58", index: "08" },
  { id: "liberty-city-stories", title: "Grand Theft Auto: Liberty City Stories", displayTitle: "Liberty City Stories", year: "2005", era: "3d", city: "Liberty City", platform: "PSP · PlayStation 2", change: "The city goes portable", summary: "A full 3D Liberty City arrives in your hands without shrinking its attitude.", accent: "#9fb4c7", index: "09" },
  { id: "vice-city-stories", title: "Grand Theft Auto: Vice City Stories", displayTitle: "Vice City Stories", year: "2006", era: "3d", city: "Vice City", platform: "PSP · PlayStation 2", change: "Build an empire", summary: "The portable chapter gives businesses and territory a bigger role in the neon city.", accent: "#ff82ca", index: "10" },
  { id: "gta-4", title: "Grand Theft Auto IV", displayTitle: "GTA IV", year: "2008", era: "hd", city: "Liberty City", platform: "PlayStation 3 · Xbox 360 · PC", change: "The HD universe", summary: "Weight, physics and a denser city replace caricature with a colder, more grounded world.", accent: "#a8c1cf", index: "11", featured: true },
  { id: "lost-and-damned", title: "The Lost and Damned", displayTitle: "The Lost and Damned", year: "2009", era: "hd", city: "Liberty City", platform: "Xbox 360 · PC · PlayStation 3", change: "Another point of view", summary: "The same streets tell a rougher parallel story from the seat of a motorcycle.", accent: "#cf6c52", index: "12" },
  { id: "chinatown-wars", title: "Grand Theft Auto: Chinatown Wars", displayTitle: "Chinatown Wars", year: "2009", era: "hd", city: "Liberty City", platform: "Nintendo DS · PSP · Mobile", change: "Touch the city", summary: "A graphic-novel look and tactile systems reinvent the overhead view for handheld screens.", accent: "#ffdf54", index: "13" },
  { id: "ballad-of-gay-tony", title: "The Ballad of Gay Tony", displayTitle: "The Ballad of Gay Tony", year: "2009", era: "hd", city: "Liberty City", platform: "Xbox 360 · PC · PlayStation 3", change: "Spectacle returns", summary: "Nightlife, color and airborne excess reveal a brighter side of the same concrete city.", accent: "#d868ff", index: "14" },
  { id: "gta-5", title: "Grand Theft Auto V", displayTitle: "GTA V", year: "2013", era: "hd", city: "Los Santos · Blaine County", platform: "PlayStation · Xbox · PC", change: "Three lives, one world", summary: "Character switching turns a huge state into three overlapping stories and viewpoints.", accent: "#91c959", index: "15", featured: true },
  { id: "gta-online", title: "Grand Theft Auto Online", displayTitle: "GTA Online", year: "2013—", era: "hd", city: "Southern San Andreas", platform: "PlayStation · Xbox · PC", change: "The living city", summary: "Heists, businesses and constant expansion transform one release into a decade-long platform.", accent: "#5bd7ff", index: "16", featured: true },
  { id: "trilogy-definitive", title: "The Trilogy — The Definitive Edition", displayTitle: "The Trilogy — Definitive", year: "2021", era: "hd", city: "Liberty · Vice · San Andreas", platform: "PlayStation · Xbox · Switch · PC · Mobile", change: "The past remastered", summary: "The three landmark 3D-era cities return together for a new generation of hardware.", accent: "#f19d4c", index: "17" },
  { id: "gta-6", title: "Grand Theft Auto VI", displayTitle: "GTA VI", year: "2026", era: "future", city: "Vice City · Leonida", platform: "PlayStation 5 · Xbox Series X|S", change: "Back to Vice", summary: "The journey circles back to Vice City—now part of a wider Leonida and viewed through a modern lens.", accent: "#ff896c", index: "18", featured: true },
];

export const gamesByEra = (era: GameEntry["era"]) => games.filter((game) => game.era === era);
