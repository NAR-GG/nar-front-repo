export const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const formatDiff = (value: number): string => {
  if (value === 0) return "0";
  const sign = value > 0 ? "+" : "";
  const absValue = Math.abs(value);
  if (absValue >= 1000) return `${sign}${(value / 1000).toFixed(1)}k`;
  return `${sign}${value}`;
};

export const calculateKP = (
  kills: number,
  assists: number,
  teamKills: number,
): string => {
  if (teamKills === 0) return "0%";
  return `${Math.round(((kills + assists) / teamKills) * 100)}%`;
};
