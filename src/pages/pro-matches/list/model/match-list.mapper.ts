import type { GameData } from "@/entities/games/api/games.dto";
import { getTeamShortName } from "@/shared/config/team-name-map";
import { formatGameTime } from "@/shared/lib/format-game-time";
import type { GameRowViewModel, TeamViewModel } from "./match-list.viewmodel";

function toTeamViewModel(
  team: GameData["blueTeam"] | GameData["redTeam"] | undefined,
  getChampionImageUrl: (name: string) => string,
): TeamViewModel {
  const teamName = team?.teamName ?? "TBD";

  return {
    teamName,
    teamShortName: getTeamShortName(teamName),
    isWin: team?.isWin ?? false,
    players: (team?.players ?? []).map((player) => ({
      playerName: player.playerName,
      championName: player.championName,
      position: player.position,
      championImageUrl: getChampionImageUrl(player.championName),
    })),
  };
}

export const toGameRowViewModel = (
  game: GameData,
  getChampionImageUrl: (name: string) => string,
): GameRowViewModel => ({
  gameId: game.gameId,
  league: game.league,
  patch: game.patch,
  gameDate: game.gameDate,
  gameLengthLabel: formatGameTime(game.gameLengthSeconds),
  blueTeam: toTeamViewModel(game.blueTeam, getChampionImageUrl),
  redTeam: toTeamViewModel(game.redTeam, getChampionImageUrl),
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
