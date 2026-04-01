import { queryOptions } from "@tanstack/react-query";
import {
  getTeamsDashboard,
  getTeamsDetailStats,
  getTeamsProfileHeader,
  getTeamsRadar,
  getTeamsRankings,
  getTeamsScatter,
} from "../api/teams.api";
import type {
  TeamsDashboardParams,
  TeamsDetailStatsParams,
  TeamsProfileHeaderParams,
  TeamsRadarParams,
  TeamsRankingsParams,
  TeamsScatterParams,
} from "../api/teams.dto";

export const teamsQueries = {
  all: () => ["teams"] as const,
  dashboards: () => [...teamsQueries.all(), "dashboard"] as const,
  dashboard: (params: TeamsDashboardParams) =>
    queryOptions({
      queryKey: [...teamsQueries.dashboards(), params] as const,
      queryFn: () => getTeamsDashboard(params),
    }),

  profileHeaders: () => [...teamsQueries.all(), "profile-header"] as const,
  profileHeader: (params: TeamsProfileHeaderParams) =>
    queryOptions({
      queryKey: [...teamsQueries.profileHeaders(), params] as const,
      queryFn: () => getTeamsProfileHeader(params),
    }),

  radars: () => [...teamsQueries.all(), "radar"] as const,
  radar: (params: TeamsRadarParams) =>
    queryOptions({
      queryKey: [...teamsQueries.radars(), params] as const,
      queryFn: () => getTeamsRadar(params),
    }),

  detailStatsLists: () => [...teamsQueries.all(), "detail-stats"] as const,
  detailStats: (params?: TeamsDetailStatsParams) =>
    queryOptions({
      queryKey: [...teamsQueries.detailStatsLists(), params] as const,
      queryFn: () => getTeamsDetailStats(params),
    }),

  scatterLists: () => [...teamsQueries.all(), "scatter"] as const,
  scatter: (params?: TeamsScatterParams) =>
    queryOptions({
      queryKey: [...teamsQueries.scatterLists(), params] as const,
      queryFn: () => getTeamsScatter(params),
    }),

  rankingsLists: () => [...teamsQueries.all(), "rankings"] as const,
  rankings: (params?: TeamsRankingsParams) =>
    queryOptions({
      queryKey: [...teamsQueries.rankingsLists(), params] as const,
      queryFn: () => getTeamsRankings(params),
    }),
};
