import { useQuery } from "@tanstack/react-query";
import { categoriesQueries } from "@/entities/categories/model/categories.queries";
import { teamsQueries } from "@/entities/teams/model/teams.queries";
import type { Filters } from "@/shared/types/filter.types";
import { extractTeamOptions, findTeamId } from "../lib/team-players-page.lib";
import {
  mapTeamDashboardToViewModel,
  mapTeamProfileHeaderToViewModel,
} from "./teams.mapper";

export function useTeamPlayersPage(teamName: string | null, filters: Filters) {
  const { data: categoryData } = useQuery(categoriesQueries.tree());
  const { data: detailStats } = useQuery(teamsQueries.detailStats());

  const teamOptions = categoryData
    ? extractTeamOptions(categoryData, filters.leagueName ?? "LCK")
    : [];
  const selectedTeamId =
    detailStats && teamName ? findTeamId(detailStats, teamName) : null;

  const { data: profileHeaderRaw } = useQuery({
    ...teamsQueries.profileHeader({ teamId: selectedTeamId! }),
    enabled: !!selectedTeamId,
  });

  const { data: dashboardRaw } = useQuery({
    ...teamsQueries.dashboard({
      teamId: selectedTeamId!,
      league: filters.leagueName ?? undefined,
      year: filters.year,
      split: filters.split ?? undefined,
      patch: filters.patch ?? undefined,
      side: filters.side,
    }),
    enabled: !!selectedTeamId,
  });

  const profileHeader = profileHeaderRaw
    ? mapTeamProfileHeaderToViewModel(profileHeaderRaw)
    : undefined;
  const dashboard = dashboardRaw
    ? mapTeamDashboardToViewModel(dashboardRaw)
    : undefined;

  return { teamOptions, profileHeader, dashboard };
}
