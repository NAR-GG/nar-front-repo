import type { GameData } from "@/entities/games/api/games.dto";
import { getTeamShortName } from "@/shared/config/team-name-map";
import { formatGameTime } from "@/shared/lib/format-game-time";
import type { GameRowViewModel } from "./match-list.viewmodel";

export const toGameRowViewModel = (
  game: GameData,
  getChampionImageUrl: (name: string) => string,
): GameRowViewModel => ({
  gameId: game.gameId,
  league: game.league,
  patch: game.patch,
  gameDate: game.gameDate,
  gameLengthLabel: formatGameTime(game.gameLengthSeconds),
  blueTeam: {
    teamName: game.blueTeam.teamName,
    teamShortName: getTeamShortName(game.blueTeam.teamName),
    isWin: game.blueTeam.isWin,
    players: game.blueTeam.players.map((p) => ({
      playerName: p.playerName,
      championName: p.championName,
      position: p.position,
      championImageUrl: getChampionImageUrl(p.championName),
    })),
  },
  redTeam: {
    teamName: game.redTeam.teamName,
    teamShortName: getTeamShortName(game.redTeam.teamName),
    isWin: game.redTeam.isWin,
    players: game.redTeam.players.map((p) => ({
      playerName: p.playerName,
      championName: p.championName,
      position: p.position,
      championImageUrl: getChampionImageUrl(p.championName),
    })),
  },
});

export const groupGamesByDate = (games: GameData[]): Record<string, GameData[]> => {
  const grouped: Record<string, GameData[]> = {};
  games.forEach((game) => {
    const date = new Date(game.gameDate).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(game);
  });
  return grouped;
};
