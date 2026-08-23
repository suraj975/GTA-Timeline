export type AssetRecord = {
  id: string;
  chapter: string;
  type: "image" | "video" | "texture" | "audio";
  source: string;
  owner: string;
  loading: "critical" | "nearby" | "deferred";
};

// Production media will be registered here after source and usage review.
// The vertical slice intentionally uses original CSS and procedural geometry.
export const assets: AssetRecord[] = [];
