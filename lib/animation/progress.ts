export function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function progressLabel(value: number) {
  const progress = clampProgress(value);
  if (progress < 0.14) return "The map comes alive";
  if (progress < 0.45) return "The city rises";
  if (progress < 0.66) return "The camera descends";
  if (progress < 0.86) return "Entering the tunnel";
  return "Welcome to Liberty City";
}
