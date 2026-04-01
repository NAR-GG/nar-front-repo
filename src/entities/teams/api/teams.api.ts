import { publicApi } from "@/shared/lib/api-client";
import { teamsApiEndPoint } from "./teams-endpoint";
import type {
  TeamDashboardData,
  TeamDetailStatsData,
  TeamProfileHeaderData,
  TeamRadarData,
  TeamRankingData,
  TeamScatterData,
  TeamsDashboardParams,
  TeamsDetailStatsParams,
  TeamsProfileHeaderParams,
  TeamsRadarParams,
  TeamsRankingsParams,
  TeamsScatterParams,
} from "../api/teams.dto";

export const getTeamsDashboard = async (params: TeamsDashboardParams) => {
  const response = await publicApi.get<TeamDashboardData>(
    teamsApiEndPoint.getTeamsDashboard(params),
  );
  return response.data;
};

export const getTeamsProfileHeader = async (
  params: TeamsProfileHeaderParams,
) => {
  const response = await publicApi.get<TeamProfileHeaderData>(
    teamsApiEndPoint.getTeamsProfileHeader(params),
  );
  return response.data;
};

export const getTeamsRadar = async (params: TeamsRadarParams) => {
  const response = await publicApi.get<TeamRadarData>(
    teamsApiEndPoint.getTeamsRadar(params),
  );
  return response.data;
};

export const getTeamsDetailStats = async (params?: TeamsDetailStatsParams) => {
  const response = await publicApi.get<TeamDetailStatsData>(
    teamsApiEndPoint.getTeamsDetailStats(params),
  );
  return response.data;
};

export const getTeamsScatter = async (params?: TeamsScatterParams) => {
  const response = await publicApi.get<TeamScatterData>(
    teamsApiEndPoint.getTeamsScatter(params),
  );
  return response.data;
};

export const getTeamsRankings = async (params?: TeamsRankingsParams) => {
  const response = await publicApi.get<TeamRankingData>(
    teamsApiEndPoint.getTeamsRankings(params),
  );
  return response.data;
};
