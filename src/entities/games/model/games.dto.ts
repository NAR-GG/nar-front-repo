import type { ApiResponse } from "@/shared/types/api";
import type { Pageable } from "@/shared/types/common";

export interface GamePlayer {
  playerName: string;
  championName: string;
  position: string;
}

export interface GameTeam {
  teamName: string;
  isWin: boolean;
  side: string;
  players: GamePlayer[];
}

export interface GameData {
  gameId: number;
  league: string;
  patch: string;
  gameDate: string;
  gameLengthSeconds: number;
  blueTeam: GameTeam;
  redTeam: GameTeam;
}

export interface GameListData {
  totalElements: number;
  totalPages: number;

  pageable: Pageable;

  size: number;
  content: GameData[];

  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GameBans {
  blue: string[];
  red: string[];
}

export interface GameDetailPlayer {
  participantid: number;
  side: string;
  position: string;
  playername: string;
  teamname: string;
  champion: string;
  result: number;

  teamkills: number;
  teamdeaths: number;

  firstblood: boolean;
  firstdragon: boolean;
  dragons: number;
  oppDragons: number;

  elementaldrakes: number;
  oppElementaldrakes: number;

  infernals: number;
  mountains: number;
  clouds: number;
  oceans: number;
  chemtechs: number;
  hextechs: number;

  elders: number;
  oppElders: number;

  firstherald: boolean;
  heralds: number;
  oppHeralds: number;

  voidGrubs: number;
  oppVoidGrubs: number;

  firstbaron: boolean;
  barons: number;
  oppBarons: number;

  firsttower: boolean;
  towers: number;
  oppTowers: number;

  turretPlates: number;
  oppTurretPlates: number;

  inhibitors: number;
  oppInhibitors: number;

  gspd: number;

  kills: number;
  deaths: number;
  assists: number;

  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;

  isFirstBloodKill: boolean;
  isFirstBloodAssist: boolean;
  isFirstBloodVictim: boolean;

  damageToChampions: number;
  dpm: number;
  damageShare: number;

  damageTakenPerMinute: number;
  damageMitigatedPerMinute: number;

  wardsPlaced: number;
  wpm: number;
  wardsKilled: number;
  wcpm: number;

  controlWardsBought: number;
  visionScore: number;
  vspm: number;

  totalGold: number;
  earnedGold: number;
  earnedGpm: number;
  earnedGoldShare: number;
  goldSpent: number;

  totalCs: number;
  cspm: number;
  minionKills: number;
  monsterKills: number;

  goldAt10: number;
  oppGoldAt10: number;
  goldDiffAt10: number;

  xpAt10: number;
  oppXpAt10: number;
  xpDiffAt10: number;

  csAt10: number;
  oppCsAt10: number;
  csdiffAt10: number;

  killsAt10: number;
  assistsAt10: number;
  deathsAt10: number;
  oppKillsAt10: number;
  oppAssistsAt10: number;
  oppDeathsAt10: number;

  goldAt15: number;
  oppGoldAt15: number;
  goldDiffAt15: number;

  xpAt15: number;
  oppXpAt15: number;
  xpDiffAt15: number;

  csAt15: number;
  oppCsAt15: number;
  csdiffAt15: number;

  killsAt15: number;
  assistsAt15: number;
  deathsAt15: number;
  oppKillsAt15: number;
  oppAssistsAt15: number;
  oppDeathsAt15: number;

  goldAt20: number;
  oppGoldAt20: number;
  goldDiffAt20: number;

  xpAt20: number;
  oppXpAt20: number;
  xpDiffAt20: number;

  csAt20: number;
  oppCsAt20: number;
  csdiffAt20: number;

  killsAt20: number;
  assistsAt20: number;
  deathsAt20: number;
  oppKillsAt20: number;
  oppAssistsAt20: number;
  oppDeathsAt20: number;

  goldAt25: number;
  oppGoldAt25: number;
  goldDiffAt25: number;

  xpAt25: number;
  oppXpAt25: number;
  xpDiffAt25: number;

  csAt25: number;
  oppCsAt25: number;
  csdiffAt25: number;

  killsAt25: number;
  assistsAt25: number;
  deathsAt25: number;
  oppKillsAt25: number;
  oppAssistsAt25: number;
  oppDeathsAt25: number;
}

export interface GameDetailData {
  gameid: string;
  datacompleteness: string;
  league: string;
  year: number;
  split: string;
  playoffs: number;
  date: string;
  game: number;
  patch: string;
  gamelength: number;

  bans: GameBans;
  players: GameDetailPlayer[];
}

export type GameDetailResponseDTO = ApiResponse<GameDetailData>;
export type GameListResponseDTO = ApiResponse<GameListData>;
