export type AssetRecord = {
  id: string;
  chapter: string;
  type: "image" | "video" | "texture" | "audio";
  source: string;
  owner: string;
  loading: "critical" | "nearby" | "deferred";
};

export const assets: AssetRecord[] = [
  {
    id: "timeline-panorama",
    chapter: "global",
    type: "image",
    source: "Original AI-assisted artwork generated for this project",
    owner: "Project artwork",
    loading: "critical",
  },
  {
    id: "era-2d-memory",
    chapter: "2d",
    type: "image",
    source: "Original AI-assisted artwork generated for this project",
    owner: "Project artwork",
    loading: "nearby",
  },
  {
    id: "era-3d-memory",
    chapter: "3d",
    type: "image",
    source: "Original AI-assisted artwork generated for this project",
    owner: "Project artwork",
    loading: "nearby",
  },
  {
    id: "era-radio-score",
    chapter: "global",
    type: "audio",
    source: "Five credited CC0 recordings from OpenGameArt; full provenance in public/audio/README.md",
    owner: "Zane Little Music · MintoDog · omfgdude · yd · Fupi",
    loading: "deferred",
  },
];
