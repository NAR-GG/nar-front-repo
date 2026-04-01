import type { GameDetailPlayer } from "@/entities/games/api/games.dto";

export interface TeamStatsViewModel {
  kills: number;
  deaths: number;
  assists: number;
  totalGold: number;
  totalDamage: number;
  visionScore: number;
  dragons: number;
  barons: number;
  heralds: number;
  towers: number;
  inhibitors: number;
  voidGrubs: number;
  elders: number;
  infernals: number;
  mountains: number;
  clouds: number;
  oceans: number;
  chemtechs: number;
  hextechs: number;
  turretPlates: number;
  firstDragon: boolean;
  firstBaron: boolean;
  firstHerald: boolean;
  firstTower: boolean;
  oppElders: number;
  oppTurretPlates: number;
}

export interface ProcessedTeamViewModel {
  name: string;
  result: number;
  players: GameDetailPlayer[];
  bans: string[];
  stats: TeamStatsViewModel;
}

export interface GameInfoViewModel {
  league: string;
  matchTitle: string;
  split: string;
  playoffs: number;
  date: string;
  game: number;
  patch: string;
  gamelength: number;
  gamelengthInMin: number;
}
