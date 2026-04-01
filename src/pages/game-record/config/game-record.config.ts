export const TEAM_ABBREVIATIONS: Record<string, string> = {
  "Bnk Fearx": "BFX",
  "Dplus Kia": "DK",
  "Kt Rolster": "KT",
  "Nongshim Redforce": "NS",
  "Hanwha Life Esports": "HLE",
  "Gen.g": "GEN",
  T1: "T1",
  "Oksavingsbank Brion": "BRO",
  Drx: "DRX",
  "Dn Freecs": "DNF",
};

export const TIMELINE_CONFIG = {
  positions: ["top", "jng", "mid", "bot", "sup"] as const,
  timePoints: [10, 15, 20, 25] as const,
  metrics: ["gold", "xp", "cs", "kills", "deaths", "assists"] as const,
} as const;

export const TIMELINE_FILTER_OPTIONS = {
  metric: [
    { value: "gold", label: "골드" },
    { value: "xp", label: "경험치" },
    { value: "cs", label: "CS" },
    { value: "kills", label: "킬" },
  ],
  time: [
    { label: "10m", value: "10" },
    { label: "15m", value: "15" },
    { label: "20m", value: "20" },
    { label: "25m", value: "25" },
  ],
  chartMetric: [
    { value: "gold", label: "골드" },
    { value: "xp", label: "경험치" },
    { value: "cs", label: "CS" },
    { value: "kills", label: "킬" },
    { value: "deaths", label: "데스" },
    { value: "assists", label: "어시스트" },
  ],
  teamDetailMetric: [
    { value: "gold", label: "골드" },
    { value: "xp", label: "경험치" },
    { value: "cs", label: "CS" },
    { value: "kda", label: "KDA" },
  ],
} as const;
