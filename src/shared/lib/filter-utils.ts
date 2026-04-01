import type { Filters } from "@/shared/types/filter.types";

type FilterTagType = "league" | "split" | "team";

const filterTagFieldMap: Record<FilterTagType, keyof Pick<Filters, "leagueNames" | "splitNames" | "teamNames">> = {
  league: "leagueNames",
  split: "splitNames",
  team: "teamNames",
};

export function removeFilterTagValue(
  filters: Filters,
  type: FilterTagType,
  value: string,
): [field: "leagueNames" | "splitNames" | "teamNames", values: string[]] {
  const field = filterTagFieldMap[type];
  const values = (filters[field] ?? []).filter((name) => name !== value);
  return [field, values];
}
