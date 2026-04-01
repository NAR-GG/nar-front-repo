import type { CtgoTreeData } from "@/entities/categories/api/categories.dto";
import type { SelectOption, Filters, Mode } from "@/shared/types/filter.types";

const FILTER_YEAR = 2025;

export function getLeagueOptions(categoryData: CtgoTreeData): SelectOption[] {
  const season = categoryData.seasons.find((s) => s.year === FILTER_YEAR);
  if (!season) return [];
  return season.leagues.map((l) => ({ value: l.name, label: l.name }));
}

export function getSplitOptions(
  categoryData: CtgoTreeData,
  leagueNames: string[],
): SelectOption[] {
  if (leagueNames.length === 0) return [];
  const season = categoryData.seasons.find((s) => s.year === FILTER_YEAR);
  if (!season) return [];

  const selectedLeagues = season.leagues.filter((l) =>
    leagueNames.includes(l.name),
  );
  const allSplits = selectedLeagues.flatMap((l) =>
    l.splits.filter((s) => s.name?.trim()).map((s) => s.name),
  );
  return [...new Set(allSplits)].map((name) => ({ value: name, label: name }));
}

export function getTeamOptions(
  categoryData: CtgoTreeData,
  leagueNames: string[],
  splitNames: string[],
): SelectOption[] {
  if (leagueNames.length === 0) return [];
  const season = categoryData.seasons.find((s) => s.year === FILTER_YEAR);
  if (!season) return [];

  const selectedLeagues = season.leagues.filter((l) =>
    leagueNames.includes(l.name),
  );
  const relevantSplits = selectedLeagues.flatMap((l) =>
    l.splits.filter((s) => {
      if (!s.name?.trim()) return false;
      if (splitNames.length === 0) return true;
      return splitNames.includes(s.name);
    }),
  );

  const allTeams = relevantSplits.flatMap((s) => s.teams.map((t) => t.name));
  return [...new Set(allTeams)]
    .sort()
    .map((name) => ({ value: name, label: name }));
}

export function cascadeFiltersOnChange(
  filters: Filters,
  field: keyof Filters,
  value: string[],
  categoryData: CtgoTreeData,
): Filters {
  const next = { ...filters, [field]: value };

  if (field === "leagueNames") {
    const validSplits = getSplitOptions(categoryData, value).map((o) => o.value);
    next.splitNames = (next.splitNames ?? []).filter((s) =>
      validSplits.includes(s),
    );
    const validTeams = getTeamOptions(categoryData, value, next.splitNames).map(
      (o) => o.value,
    );
    next.teamNames = (next.teamNames ?? []).filter((t) =>
      validTeams.includes(t),
    );
  }

  if (field === "splitNames") {
    const validTeams = getTeamOptions(
      categoryData,
      next.leagueNames,
      value,
    ).map((o) => o.value);
    next.teamNames = (next.teamNames ?? []).filter((t) =>
      validTeams.includes(t),
    );
  }

  return next;
}

export function getSearchButtonText(mode: Mode): string {
  return mode === "1v1" ? "매치업 보기" : "조합 보기";
}

export function getSelectedCountText(
  mode: Mode,
  selectedCount: number,
): string {
  const max = mode === "1v1" ? 2 : 5;
  return `선택된 챔피언: ${selectedCount}/${max}`;
}

export function getSelectorHintText(mode: Mode): string {
  if (mode === "team") return "최대 5명의 챔피언으로 팀을 구성해보세요.";
  return "* 1:1 분석할 챔피언 2명을 선택하세요";
}

export function getMultiSelectDisplayText(
  label: string,
  value: string[],
  placeholder: string,
): string {
  if (label === "시즌") return "2025";
  if (value.length > 0) return `${value.length}개 선택됨`;
  return placeholder;
}

export function getTagClassName(type: "league" | "split" | "team"): string {
  const base =
    "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer border-none outline-none transition-all";
  if (type === "league") return `${base} bg-blue-50 text-blue-700`;
  if (type === "split") return `${base} bg-green-50 text-green-700`;
  return `${base} bg-orange-50 text-orange-700`;
}
