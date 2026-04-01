export const TEAM_NAME_MAP: Record<string, string> = {
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

export const getTeamShortName = (fullName: string): string =>
  TEAM_NAME_MAP[fullName] ?? fullName;
