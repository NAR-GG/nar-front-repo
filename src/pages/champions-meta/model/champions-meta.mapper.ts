import type {
  CombinationSummary,
  GameDetail,
  GameTeam,
  GamePlayer,
  MatchUp1v1Data,
} from "@/entities/combinations/api/combinations.dto";
import { formatGameTime } from "@/shared/lib/format-game-time";
import type {
  ChampionInfoViewModel,
  CombinationCardViewModel,
  GameMatchViewModel,
  MatchPlayerViewModel,
  MatchTeamViewModel,
  MatchUp1v1ViewModel,
} from "./champions-meta.view-model";

function mapPlayerToViewModel(
  player: GamePlayer,
  getImageUrl: (name: string) => string,
): MatchPlayerViewModel {
  return {
    position: player.position,
    playerName: player.playerName,
    championName: player.championName,
    championImageUrl: getImageUrl(player.championName),
  };
}

function mapTeamToViewModel(
  team: GameTeam | undefined,
  side: "blue" | "red",
  getImageUrl: (name: string) => string,
): MatchTeamViewModel {
  return {
    teamName: team?.teamName ?? "TBD",
    isWin: team?.isWin ?? false,
    side,
    players: (team?.players ?? []).map((p) =>
      mapPlayerToViewModel(p, getImageUrl),
    ),
  };
}

function normalizeWinRate(raw: number): number {
  return raw > 1 ? raw : raw * 100;
}

export function mapCombinationSummaryToCardViewModel(
  dto: CombinationSummary,
  getImageUrl: (name: string) => string,
): CombinationCardViewModel {
  const champions: ChampionInfoViewModel[] = dto.champions.map((name) => ({
    championNameKr: name,
    championNameEn: name,
    imageUrl: getImageUrl(name),
  }));

  const totalGames = dto.winCount + dto.lossCount;
  const winPct = totalGames > 0 ? (dto.winCount / totalGames) * 100 : 0;

  return {
    combinationId: dto.combinationId,
    champions,
    displayWinRate: normalizeWinRate(dto.winRate),
    wins: dto.winCount,
    losses: dto.lossCount,
    totalGames,
    winPct,
    lossPct: 100 - winPct,
    recentGame: dto.latestGameDate,
    latestPatch: dto.latestPatch,
    frequency: dto.frequency,
  };
}

export function mapGameDetailToMatchViewModel(
  dto: GameDetail,
  getImageUrl: (name: string) => string,
): GameMatchViewModel {
  return {
    id: dto.id,
    gameNumber: dto.gameNumber,
    gameLengthSeconds: dto.gameLengthSeconds,
    formattedGameLength: formatGameTime(dto.gameLengthSeconds),
    vodUrl: dto.vodUrl,
    blueTeam: mapTeamToViewModel(dto.blueTeam, "blue", getImageUrl),
    redTeam: mapTeamToViewModel(dto.redTeam, "red", getImageUrl),
  };
}

export function resolveMatchupTeams(
  game: GameMatchViewModel,
  champion1: string,
): { champion1Team: MatchTeamViewModel; champion2Team: MatchTeamViewModel } {
  const champion1Team = game.blueTeam.players.some(
    (p) => p.championName === champion1,
  )
    ? game.blueTeam
    : game.redTeam;
  const champion2Team =
    champion1Team === game.blueTeam ? game.redTeam : game.blueTeam;
  return { champion1Team, champion2Team };
}

export function mapMatchUp1v1DataToViewModel(
  dto: MatchUp1v1Data,
  getImageUrl: (name: string) => string,
): MatchUp1v1ViewModel {
  const champion1WinRatePct = Math.round(normalizeWinRate(dto.winRateForChampion1));

  return {
    totalMatches: dto.totalMatches,
    champion1WinRatePct,
    champion2WinRatePct: 100 - champion1WinRatePct,
    games: dto.content.map((game) =>
      mapGameDetailToMatchViewModel(game, getImageUrl),
    ),
    hasNextPage: dto.hasNext,
  };
}
