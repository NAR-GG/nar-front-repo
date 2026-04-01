import type { CtgoTreeData } from "@/entities/categories/api/categories.dto";
import type { TeamDetailStatsData } from "@/entities/teams/api/teams.dto";

export function extractTeamOptions(
  categoryData: CtgoTreeData | undefined,
  leagueName: string,
): { value: string; label: string }[] {
  if (!categoryData) return [];
  const allTeams = categoryData.seasons
    .flatMap((season) => season.leagues)
    .filter((league) => league.name === leagueName)
    .flatMap((league) => league.splits)
    .flatMap((split) => split.teams)
    .map((team) => team.name);
  return [...new Set(allTeams)].sort().map((name) => ({ value: name, label: name }));
}

export function findTeamId(
  detailStats: TeamDetailStatsData | undefined,
  teamName: string | null,
): number | undefined {
  if (!teamName || !detailStats) return undefined;
  return detailStats.items.find((item) => item.teamName === teamName)?.teamId;
}
