import type {
  TeamsDashboardParams,
  TeamsDetailStatsParams,
  TeamsProfileHeaderParams,
  TeamsRadarParams,
  TeamsRankingsParams,
  TeamsScatterParams,
} from "../api/teams.dto";

const TEAMS_PREFIX = {
  teams: "/teams",
};

export const teamsApiEndPoint = {
  getTeamsDashboard: ({
    teamId,
    league,
    year,
    split,
    patch,
    side,
  }: TeamsDashboardParams) => {
    const searchParams = new URLSearchParams();
    if (league) searchParams.set("league", league);
    if (year !== undefined) searchParams.set("year", year.toString());
    if (split) searchParams.set("split", split);
    if (patch) searchParams.set("patch", patch);
    if (side) searchParams.set("side", side);
    const queryString = searchParams.toString();
    return queryString
      ? `${TEAMS_PREFIX.teams}/${teamId}/dashboard?${queryString}`
      : `${TEAMS_PREFIX.teams}/${teamId}/dashboard`;
  },

  getTeamsProfileHeader: ({ teamId, league }: TeamsProfileHeaderParams) => {
    const searchParams = new URLSearchParams();
    if (league) searchParams.set("league", league);
    const queryString = searchParams.toString();
    return queryString
      ? `${TEAMS_PREFIX.teams}/${teamId}/profile-header?${queryString}`
      : `${TEAMS_PREFIX.teams}/${teamId}/profile-header`;
  },

  getTeamsRadar: ({ teamId, year, league, split, patch, side }: TeamsRadarParams) => {
    const searchParams = new URLSearchParams();
    if (year !== undefined) searchParams.set("year", year.toString());
    if (league) searchParams.set("league", league);
    if (split) searchParams.set("split", split);
    if (patch) searchParams.set("patch", patch);
    if (side) searchParams.set("side", side);
    const queryString = searchParams.toString();
    return queryString
      ? `${TEAMS_PREFIX.teams}/${teamId}/radar?${queryString}`
      : `${TEAMS_PREFIX.teams}/${teamId}/radar`;
  },

  getTeamsDetailStats: (params?: TeamsDetailStatsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.year !== undefined)
      searchParams.set("year", params.year.toString());
    if (params?.league) searchParams.set("league", params.league);
    if (params?.split) searchParams.set("split", params.split);
    if (params?.patch) searchParams.set("patch", params.patch);
    if (params?.side) searchParams.set("side", params.side);
    const queryString = searchParams.toString();
    return queryString
      ? `${TEAMS_PREFIX.teams}/detail-stats?${queryString}`
      : `${TEAMS_PREFIX.teams}/detail-stats`;
  },

  getTeamsScatter: (params?: TeamsScatterParams) => {
    const searchParams = new URLSearchParams();
    if (params?.year !== undefined)
      searchParams.set("year", params.year.toString());
    if (params?.league) searchParams.set("league", params.league);
    if (params?.split) searchParams.set("split", params.split);
    if (params?.patch) searchParams.set("patch", params.patch);
    if (params?.side) searchParams.set("side", params.side);
    if (params?.metric) searchParams.set("metric", params.metric);
    const queryString = searchParams.toString();
    return queryString
      ? `${TEAMS_PREFIX.teams}/scatter?${queryString}`
      : `${TEAMS_PREFIX.teams}/scatter`;
  },

  getTeamsRankings: (params?: TeamsRankingsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.year !== undefined)
      searchParams.set("year", params.year.toString());
    if (params?.splits?.length)
      params.splits.forEach((s) => searchParams.append("splits", s));
    if (params?.leagueNames?.length)
      params.leagueNames.forEach((l) => searchParams.append("leagueNames", l));
    if (params?.patch) searchParams.set("patch", params.patch);
    if (params?.side) searchParams.set("side", params.side);
    const queryString = searchParams.toString();
    return queryString
      ? `${TEAMS_PREFIX.teams}/rankings?${queryString}`
      : `${TEAMS_PREFIX.teams}/rankings`;
  },
};
