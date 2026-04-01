export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function adjust(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  if (fromMax === fromMin) return toMin;
  const progress = (value - fromMin) / (fromMax - fromMin);
  return round(toMin + (toMax - toMin) * progress);
}

export function toAbsoluteImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://api.nar.kr${url}`;
}