export type TeamSideFilter = "ALL" | "BLUE" | "RED";

export type TeamScatterMetric = "ALL" | "KILLS" | "GOLD" | "OBJECTIVES";

export interface TeamDashboardAppliedFilter {
  year: number;
  split: string;
  patch: string;
  side: TeamSideFilter;
}

export interface TeamGameSummaryData {
  matchesPlayed: number;
  matchWins: number;
  matchLosses: number;
  setsPlayed: number;
  setWins: number;
  setLosses: number;
  winRatePct: number;
  avgKills: number;
  avgGold: number;
  avgBarons: number;
  avgDragons: number;
  avgTowers: number;
  avgGameLengthSeconds: number;
  firstBloodCount: number;
  firstTowerCount: number;
  firstDragonCount: number;
  firstHeraldCount: number;
  firstBaronCount: number;
  firstBloodRatePct: number;
  firstTowerRatePct: number;
  firstDragonRatePct: number;
  firstHeraldRatePct: number;
  firstBaronRatePct: number;
}

export interface TeamPlayerRecordData {
  playerId: number;
  playerName: string;
  playerImageUrl: string;
  position: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRatePct: number;
  avgKda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  firstKillCount: number;
  firstDeathCount: number;
  pentaKillCount: number;
  avgKillParticipationPct: number;
  avgDamageSharePct: number;
  avgGoldSharePct: number;
  avgVisionScore: number;
  avgVisionScorePerMinute: number;
}

export interface TeamChampionBanData {
  championId: number;
  championNameKr: string;
  championNameEn: string;
  championImageUrl: string;
  banCount: number;
  banRatePct: number;
}

export interface TeamPlayedChampionData {
  championId: number;
  championNameKr: string;
  championNameEn: string;
  championImageUrl: string;
  gamesPlayed: number;
  winRatePct: number;
  avgKda: number;
  lastUsedAt: string;
}

export interface TeamPlayedChampionPlayerData {
  playerId: number;
  playerName: string;
  playerImageUrl: string;
  position: string;
  champions: TeamPlayedChampionData[];
}

export interface TeamSideBanData {
  all: TeamChampionBanData[];
  blue: TeamChampionBanData[];
  red: TeamChampionBanData[];
}

export interface TeamSidePlayedChampionData {
  all: TeamPlayedChampionPlayerData[];
  blue: TeamPlayedChampionPlayerData[];
  red: TeamPlayedChampionPlayerData[];
}

export interface TeamDashboardData {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamImageUrl: string;
  leagueName: string;
  appliedFilter: TeamDashboardAppliedFilter;
  gameSummary: TeamGameSummaryData;
  playerRecords: TeamPlayerRecordData[];
  bannedAgainst: TeamSideBanData;
  bannedByTeam: TeamSideBanData;
  playedChampions: TeamSidePlayedChampionData;
}

export interface TeamRecentMatchData {
  matchId: string;
  leagueName: string;
  state: string;
  scheduledAt: string;
  relativeLabel: string;
  blueTeamCode: string;
  blueTeamName: string;
  redTeamCode: string;
  redTeamName: string;
  blueScore: number;
  redScore: number;
}

export interface TeamSocialLinksData {
  homepage?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface TeamProfileHeaderData {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamImageUrl: string;
  socialLinks?: TeamSocialLinksData;
  recentMatches: TeamRecentMatchData[];
}

export interface TeamRadarStatData {
  teamId: number;
  teamName: string;
  gamesPlayed: number;
  year: number;
  winRate: number;
  goldDiffAt10: number;
  goldDiffAt15: number;
  goldDiffAt20: number;
  goldDiffAt25: number;
  gspd: number;
  ckpm: number;
  firstBloodRate: number;
  firstTowerRate: number;
  firstThreeTowerRate: number;
  firstHeraldRate: number;
  firstDragonRate: number;
  firstBaronRate: number;
  dragonsPerGame: number;
  voidGrubsRate: number;
  towersKilledAvg: number;
  towersLostAvg: number;
  earlyGameRating: number;
  midLateRating: number;
  pointsPerGame: number;
}

export interface TeamRadarData {
  stats: TeamRadarStatData;
  leagueAverage: TeamRadarStatData;
}

export interface TeamDetailStatsItemData extends TeamGameSummaryData {
  rank: number;
  teamId: number;
  teamName: string;
  teamCode: string;
  teamImageUrl: string;
}

export interface TeamDetailStatsData {
  leagueName: string;
  year: number;
  totalTeams: number;
  items: TeamDetailStatsItemData[];
}

export interface TeamScatterPointData {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamImageUrl: string;
  gamesPlayed: number;
  winRatePct: number;
  avgOverall: number;
  avgKills: number;
  avgGold: number;
  avgObjectives: number;
  xvalue: number;
}

export interface TeamScatterData {
  leagueName: string;
  year: number;
  metric: TeamScatterMetric;
  points: TeamScatterPointData[];
  xaxisLabel: string;
  yaxisLabel: string;
  xleagueAverage: number;
  yleagueAverage: number;
}

export interface TeamsDashboardParams {
  teamId: number;
  league?: string;
  year?: number;
  split?: string;
  patch?: string;
  side?: TeamSideFilter;
}

export interface TeamsProfileHeaderParams {
  teamId: number;
  league?: string;
}

export interface TeamsRadarParams {
  teamId: number;
  year?: number;
  league?: string;
  split?: string;
  patch?: string;
  side?: TeamSideFilter;
}

export interface TeamsDetailStatsParams {
  year?: number;
  league?: string;
  split?: string;
  patch?: string;
  side?: TeamSideFilter;
}

export interface TeamsScatterParams {
  year?: number;
  league?: string;
  split?: string;
  patch?: string;
  side?: TeamSideFilter;
  metric?: TeamScatterMetric;
}

export interface TeamsRankingsParams {
  year?: number;
  splits?: string[];
  leagueNames?: string[];
  patch?: string;
  side?: string;
}

export interface OpponentChampionData {
  championName?: string;
  championImageUrl?: string;
  matchCount?: number;
  winRate?: number;
}

export interface ChampionPickData {
  championName?: string;
  championImageUrl?: string;
  playCount?: number;
  winRate?: number;
  banRate?: number;
  topOpponents?: OpponentChampionData[];
}

export interface MostPickByPositionData {
  top?: ChampionPickData[];
  jungle?: ChampionPickData[];
  mid?: ChampionPickData[];
  bot?: ChampionPickData[];
  support?: ChampionPickData[];
}

export interface TeamRankingItemData {
  rank?: number;
  teamId?: number;
  teamName?: string;
  teamCode?: string;
  imageUrl?: string;
  winRate?: number;
  wins?: number;
  losses?: number;
  totalGames?: number;
  mostPicks?: MostPickByPositionData;
}

export interface TeamRankingFilterData {
  year?: number;
  splits?: string[];
  leagueNames?: string[];
  patch?: string;
  side?: string;
  effectiveSide?: string;
}

export interface TeamRankingData {
  rankings?: TeamRankingItemData[];
  totalTeams?: number;
  appliedFilter?: TeamRankingFilterData;
}
