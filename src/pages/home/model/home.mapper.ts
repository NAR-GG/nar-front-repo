import type { PlayerTop5Data, ChampionTop5Data } from "@/entities/home/api/home.dto";
import { getLaneIcon } from "@/shared/lib/get-lane-icon";
import type {
  ProgamerTop5Mode,
  ProgamerTop5ViewModel,
  ChampionTop5Mode,
  ChampionTop5ViewModel,
} from "./home.viewmodel";

export const toProgamerTop5ViewModels = (
  data: PlayerTop5Data,
  mode: ProgamerTop5Mode,
): ProgamerTop5ViewModel[] => {
  const players =
    mode === "kda" ? data.kdaTop5 : mode === "gpm" ? data.gpmTop5 : data.dpmTop5;

  return players.slice(0, 5).map((player, index) => ({
    rank: index + 1,
    playerName: player.playerName,
    playerImageUrl: player.playerImgUrl,
    teamName: player.teamName,
    games: player.totalGames,
    value: player.statValue,
  }));
};

export const toChampionTop5ViewModels = (
  data: ChampionTop5Data,
  mode: ChampionTop5Mode,
  getChampionImageUrl: (name: string) => string,
): ChampionTop5ViewModel[] => {
  if (mode === "ban") {
    return data.topBans.slice(0, 5).map((ban, index) => ({
      rank: index + 1,
      championName: ban.championNameKr,
      championImageUrl: getChampionImageUrl(ban.championNameEn),
      laneIcon: getLaneIcon(ban.lane),
      winRate: ban.winRate,
      winGames: ban.wins,
      banRate: ban.banRate,
      banCount: ban.banCount,
    }));
  }

  return data.topPicks.slice(0, 5).map((pick, index) => ({
    rank: index + 1,
    championName: pick.championNameKr,
    championImageUrl: getChampionImageUrl(pick.championNameEn),
    laneIcon: getLaneIcon(pick.lane),
    winRate: pick.winRate,
    winGames: pick.wins,
    pickRate: pick.pickRate,
    totalGames: pick.totalGames,
  }));
};
