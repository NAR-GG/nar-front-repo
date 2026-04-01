import type { GameDetailData, GameDetailPlayer } from "@/entities/games/api/games.dto";
import type {
  GameInfoViewModel,
  ProcessedTeamViewModel,
  TeamStatsViewModel,
} from "./game-record.view-model";

export function calculateTeamStats(players: GameDetailPlayer[]): TeamStatsViewModel {
  const first = players[0];
  return {
    kills: players.reduce((sum, p) => sum + p.kills, 0),
    deaths: players.reduce((sum, p) => sum + p.deaths, 0),
    assists: players.reduce((sum, p) => sum + p.assists, 0),
    totalGold: players.reduce((sum, p) => sum + p.totalGold, 0),
    totalDamage: players.reduce((sum, p) => sum + p.damageToChampions, 0),
    visionScore: players.reduce((sum, p) => sum + p.visionScore, 0),
    dragons: first?.dragons ?? 0,
    barons: first?.barons ?? 0,
    heralds: first?.heralds ?? 0,
    towers: first?.towers ?? 0,
    inhibitors: first?.inhibitors ?? 0,
    voidGrubs: first?.voidGrubs ?? 0,
    elders: first?.elders ?? 0,
    infernals: first?.infernals ?? 0,
    mountains: first?.mountains ?? 0,
    clouds: first?.clouds ?? 0,
    oceans: first?.oceans ?? 0,
    chemtechs: first?.chemtechs ?? 0,
    hextechs: first?.hextechs ?? 0,
    turretPlates: first?.turretPlates ?? 0,
    firstDragon: first?.firstdragon ?? false,
    firstBaron: first?.firstbaron ?? false,
    firstHerald: first?.firstherald ?? false,
    firstTower: first?.firsttower ?? false,
    oppElders: first?.oppElders ?? 0,
    oppTurretPlates: first?.oppTurretPlates ?? 0,
  };
}

export function mapGameDetailToViewModel(gameData: GameDetailData): {
  gameInfo: GameInfoViewModel;
  blueTeam: ProcessedTeamViewModel;
  redTeam: ProcessedTeamViewModel;
} {
  const bluePlayers = gameData.players.filter(
    (p) => p.side.toLowerCase() === "blue",
  );
  const redPlayers = gameData.players.filter(
    (p) => p.side.toLowerCase() === "red",
  );

  const gameInfo: GameInfoViewModel = {
    league: gameData.league,
    matchTitle: gameData.matchTitle || `${gameData.league} ${gameData.split}`,
    split: gameData.split,
    playoffs: gameData.playoffs,
    date: gameData.date,
    game: gameData.game,
    patch: gameData.patch,
    gamelength: gameData.gamelength,
    gamelengthInMin: gameData.gamelength / 60,
  };

  const blueTeam: ProcessedTeamViewModel = {
    name: bluePlayers[0]?.teamname ?? "Blue Team",
    result: bluePlayers[0]?.result ?? 0,
    players: bluePlayers,
    bans: gameData.bans?.blue ?? [],
    stats: calculateTeamStats(bluePlayers),
  };

  const redTeam: ProcessedTeamViewModel = {
    name: redPlayers[0]?.teamname ?? "Red Team",
    result: redPlayers[0]?.result ?? 0,
    players: redPlayers,
    bans: gameData.bans?.red ?? [],
    stats: calculateTeamStats(redPlayers),
  };

  return { gameInfo, blueTeam, redTeam };
}
