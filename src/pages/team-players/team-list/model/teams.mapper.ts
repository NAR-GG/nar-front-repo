import dayjs from "dayjs";

import type {
  BannedChampionViewModel,
  PlayedChampionPlayerViewModel,
  PlayedChampionsViewModel,
  PlayerRecordViewModel,
  RecentMatchViewModel,
  TeamDashboardViewModel,
  TeamProfileHeaderViewModel,
  TeamSideBanDataViewModel,
} from "./teams.view-model";
import type {
  TeamChampionBanData,
  TeamDashboardData,
  TeamPlayedChampionPlayerData,
  TeamProfileHeaderData,
} from "@/entities/teams/api/teams.dto";

export function mapTeamProfileHeaderToViewModel(
  dto: TeamProfileHeaderData,
): TeamProfileHeaderViewModel {
  return {
    teamId: dto.teamId,
    teamName: dto.teamName,
    teamCode: dto.teamCode,
    teamImageUrl: dto.teamImageUrl,
    socialLinks: {
      homepage: dto.socialLinks?.homepage,
      youtube: dto.socialLinks?.youtube,
      instagram: dto.socialLinks?.instagram,
      twitter: dto.socialLinks?.twitter,
    },
    recentMatches: dto.recentMatches.map(
      (match): RecentMatchViewModel => ({
        matchId: match.matchId,
        scheduledAt: match.scheduledAt,
        blueTeamCode: match.blueTeamCode,
        redTeamCode: match.redTeamCode,
        daysAgoLabel: getDaysAgoLabel(match.scheduledAt),
        isToday: match.state === "inProgress",
      }),
    ),
  };
}

const mapBannedChampion = (
  ban: TeamChampionBanData,
): BannedChampionViewModel => ({
  championId: ban.championId,
  championName: ban.championNameKr,
  championImageUrl: ban.championImageUrl,
  banCount: ban.banCount,
  banRatePct: `${ban.banRatePct.toFixed(1)}%`,
});

const mapBannedByTeam = (banned: {
  all: TeamChampionBanData[];
  blue: TeamChampionBanData[];
  red: TeamChampionBanData[];
}): TeamSideBanDataViewModel => ({
  all: banned.all.map(mapBannedChampion),
  blue: banned.blue.map(mapBannedChampion),
  red: banned.red.map(mapBannedChampion),
});

const mapPlayedChampionPlayer = (
  p: TeamPlayedChampionPlayerData,
): PlayedChampionPlayerViewModel => ({
  playerId: p.playerId,
  playerName: p.playerName,
  position: p.position,
  champions: p.champions.map((c) => ({
    championId: c.championId,
    championName: c.championNameKr,
    championImageUrl: c.championImageUrl,
    gamesPlayed: c.gamesPlayed,
    winRateLabel: `${c.winRatePct.toFixed(1)}%`,
    kdaLabel: c.avgKda.toFixed(2),
    lastUsedLabel: dayjs(c.lastUsedAt).format("YYYY.MM.DD"),
  })),
});

const mapPlayedChampions = (data: {
  all: TeamPlayedChampionPlayerData[];
  blue: TeamPlayedChampionPlayerData[];
  red: TeamPlayedChampionPlayerData[];
}): PlayedChampionsViewModel => ({
  all: data.all.map(mapPlayedChampionPlayer),
  blue: data.blue.map(mapPlayedChampionPlayer),
  red: data.red.map(mapPlayedChampionPlayer),
});

export function mapTeamDashboardToViewModel(
  dto: TeamDashboardData,
): TeamDashboardViewModel {
  return {
    teamId: dto.teamId,
    teamName: dto.teamName,
    teamCode: dto.teamCode,
    teamImageUrl: dto.teamImageUrl,
    gameSummary: {
      ...dto.gameSummary,
      avgGameTime: `${(dto.gameSummary.avgGameLengthSeconds / 60).toFixed(1)}m`,
    },
    playerRecords: dto.playerRecords.map(
      (p): PlayerRecordViewModel => ({
        playerId: p.playerId,
        playerName: p.playerName,
        playerImageUrl: p.playerImageUrl,
        position: p.position,
        gamesPlayed: p.gamesPlayed,
        wins: p.wins,
        losses: p.losses,
        winRateLabel: `${p.winRatePct.toFixed(1)}%`,
        kdaLabel:
          p.avgDeaths === 0
            ? "Perfect"
            : ((p.avgKills + p.avgAssists) / p.avgDeaths).toFixed(2),
        avgKills: p.avgKills,
        avgDeaths: p.avgDeaths,
        avgAssists: p.avgAssists,
        avgKillParticipationPct: `${p.avgKillParticipationPct.toFixed(1)}%`,
        firstKillCount: p.firstKillCount,
        firstDeathCount: p.firstDeathCount,
        pentaKillCount: p.pentaKillCount,
        avgDamageSharePct: `${p.avgDamageSharePct.toFixed(1)}%`,
        avgGoldSharePct: `${p.avgGoldSharePct.toFixed(1)}%`,
        avgVisionScore: `${p.avgVisionScore.toFixed(1)}%`,
        avgVisionScorePerMinute: `${p.avgVisionScorePerMinute.toFixed(1)}%`,
      }),
    ),
    bannedByTeam: mapBannedByTeam(dto.bannedByTeam),
    bannedAgainst: mapBannedByTeam(dto.bannedAgainst),
    playedChampions: mapPlayedChampions(dto.playedChampions),
  };
}

function getDaysAgoLabel(scheduledAt: string): string {
  const today = dayjs().startOf("day");
  const scheduledDate = dayjs(scheduledAt).startOf("day");
  const days = today.diff(scheduledDate, "day");
  if (days === 0) return "오늘";
  if (days < 0) return `${Math.abs(days)}일 후`;
  return `${days}일 전`;
}
