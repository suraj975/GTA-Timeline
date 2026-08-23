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
];
