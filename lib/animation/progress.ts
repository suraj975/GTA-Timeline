export function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function progressLabel(value: number) {
  const progress = clampProgress(value);
  if (progress < 0.25) return "Top-down view";
  if (progress < 0.6) return "Buildings gaining depth";
  if (progress < 0.88) return "Camera rotating to street level";
  return "Third-person city view";
}
