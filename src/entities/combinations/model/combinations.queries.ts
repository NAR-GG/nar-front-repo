import { queryOptions } from "@tanstack/react-query";
import * as combinationsApi from "../api/combinations.api";

export const combinationsQueries = {
  all: () => ["combinations"] as const,
  infos: () => [...combinationsQueries.all(), "info"] as const,
  info: () =>
    queryOptions({
      queryKey: combinationsQueries.infos(),
      queryFn: combinationsApi.getCombinationInfo,
    }),
  detail: (params: {
    champions: string[];
    year?: number;
    splits?: string[];
    leagueNames?: string[];
    teamNames?: string[];
    patch?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) =>
    queryOptions({
      queryKey: [...combinationsQueries.all(), "detail", params] as const,
      queryFn: () => combinationsApi.getCombinationDetail(params),
      enabled: params.champions.length > 0,
    }),
  matchUp1v1: (params: {
    champion1: string;
    champion2: string;
    year?: number;
    splits?: string[];
    leagueNames?: string[];
    teamNames?: string[];
    patch?: string;
    page?: number;
    size?: number;
  }) =>
    queryOptions({
      queryKey: [
        ...combinationsQueries.all(),
        "matchup",
        "1v1",
        params,
      ] as const,
      queryFn: () => combinationsApi.get1v1MatchUp(params),
    }),

  lastUpdate: () =>
    queryOptions({
      queryKey: [...combinationsQueries.all(), "last-update"] as const,
      queryFn: combinationsApi.getLastUpdate,
    }),
};
