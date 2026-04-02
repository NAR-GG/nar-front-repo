export interface TeamSocialLinksViewModel {
  homepage?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
}

export interface RecentMatchViewModel {
  matchId: string;
  scheduledAt: string;
  blueTeamCode: string;
  redTeamCode: string;
  daysAgoLabel: string;
  isToday: boolean;
}

export interface TeamProfileHeaderViewModel {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamImageUrl: string;
  socialLinks: TeamSocialLinksViewModel;
  recentMatches: RecentMatchViewModel[];
}

export type TeamGameSummaryViewModel = {
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
  avgGameTime: string;
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
};

export interface PlayerRecordViewModel {
  playerId: number;
  playerName: string;
  playerImageUrl: string;
  position: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRateLabel: string;
  kdaLabel: string;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgKillParticipationPct: string;
  firstKillCount: number;
  firstDeathCount: number;
  pentaKillCount: number;
  avgDamageSharePct: string;
  avgGoldSharePct: string;
  avgVisionScore: string;
  avgVisionScorePerMinute: string;
}

export interface BannedChampionViewModel {
  championId: number;
  championName: string;
  championImageUrl: string;
  positionImageUrl?: string;
  banCount: number;
  banRatePct: string;
}

export interface TeamSideBanDataViewModel {
  all: BannedChampionViewModel[];
  blue: BannedChampionViewModel[];
  red: BannedChampionViewModel[];
}

export interface PlayedChampionViewModel {
  championId: number;
  championName: string;
  championImageUrl: string;
  gamesPlayed: number;
  winRateLabel: string;
  kdaLabel: string;
  lastUsedLabel: string;
}

export interface PlayedChampionPlayerViewModel {
  playerId: number;
  playerName: string;
  position: string;
  champions: PlayedChampionViewModel[];
}

export interface PlayedChampionsViewModel {
  all: PlayedChampionPlayerViewModel[];
  blue: PlayedChampionPlayerViewModel[];
  red: PlayedChampionPlayerViewModel[];
}

export interface TeamDashboardViewModel {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamImageUrl: string;
  gameSummary: TeamGameSummaryViewModel;
  playerRecords: PlayerRecordViewModel[];
  bannedByTeam: TeamSideBanDataViewModel;
  bannedAgainst: TeamSideBanDataViewModel;
  playedChampions: PlayedChampionsViewModel;
}
