export const TEAM_PLAYERS_TABS = {
  items: [
    { id: "total", label: "통계", value: "total" },
    { id: "play-list", label: "경기 리스트", value: "play-list" },
  ],
  values: ["total", "play-list"] as const,
} as const;

export const DEFAULT_TEAM_DASHBOARD_FILTERS = {
  year: 2026,
  leagueName: "LCK",
  side: "ALL",
  defaultTeamName: "Gen.g",
} as const;

export const BAN_SIDE_MENU = [
  { label: "전체", value: "all" },
  { label: "블루 사이드", value: "blue" },
  { label: "레드 사이드", value: "red" },
] as const;
