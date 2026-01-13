export interface ChampionStat {
  championNameKr: string;
  championNameEn: string;
  totalGames: number;
  wins: number;
  winRate: number;
}

export interface TopBanStat {
  championNameKr: string;
  championNameEn: string;
  banCount: number;
  totalGames: number;
  wins: number;
  winRate: number;
}

export interface ChampionTop5Data {
  patchVersion: string;
  seasonInfo: string;
  champions: ChampionStat[];
  topBans: TopBanStat[];
}

export interface CommunityData {
  id: number;
  communityType: string;
  title: string;
  author: string;
  postUrl: string;
  createdAt: string;
  viewCount: number;
  voteCount: number;
  commentCount: number;
  lastUpdated: string;
}

export interface NewsData {
  id: number;
  title: string;
  subContent: string;
  thumbnail: string;
  postUrl: string;
  officeName: string;
  createdAt: string;
  lastUpdated: string;
}

// Player Top5 API
export interface PlayerStat {
  teamName: string;
  playerName: string;
  playerImgUrl: string;
  totalGames: number;
  statValue: number;
}

export interface PlayerTop5Data {
  patchVersion: string;
  seasonInfo: string;
  kdaTop5: PlayerStat[];
  gpmTop5: PlayerStat[];
  dpmTop5: PlayerStat[];
}

// Schedule API
export interface ScheduleTeam {
  code: string;
  name: string;
  imageUrl: string;
  wins: number;
}

export interface ScheduleSet {
  setNumber: number;
  vodUrl: string;
}

export interface ScheduleData {
  matchId: string;
  leagueName: string;
  matchTitle: string;
  matchDate: string;
  state: string;
  score: string;
  blueTeam: ScheduleTeam;
  redTeam: ScheduleTeam;
  sets: ScheduleSet[];
}
