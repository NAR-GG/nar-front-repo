import type { ChampionData } from "@/entities/champions/api/champions.dto";
import type { ChampionInfoViewModel } from "../model/champions-meta.view-model";

export function orderChampionsBySelection(
  champions: ChampionInfoViewModel[],
  selectedChampions: (ChampionData | null)[],
): ChampionInfoViewModel[] {
  if (selectedChampions.length === 0) return champions;

  const championMap = new Map<string, ChampionInfoViewModel>();
  champions.forEach((c) => championMap.set(c.championNameEn, c));

  const selectedNames = selectedChampions
    .filter((c): c is ChampionData => c !== null)
    .map((c) => c.championNameEn);

  const selectedInOrder = selectedNames
    .map((name) => championMap.get(name))
    .filter((c): c is ChampionInfoViewModel => c !== undefined);

  const remaining = champions.filter(
    (c) => !selectedNames.includes(c.championNameEn),
  );

  return [...selectedInOrder, ...remaining];
}
