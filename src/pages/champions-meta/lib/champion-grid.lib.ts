import type { ChampionData } from "@/entities/champions/api/champions.dto";
import type { Mode } from "@/shared/types/filter.types";
import type { PositionFilterId } from "@/shared/ui/position-filter";
import { championPositions } from "../model/champion-positions";

const SLOT_TO_POSITION: PositionFilterId[] = ["TOP", "JUG", "MID", "ADC", "SUP"];

export function getSlotPosition(
  mode: Mode,
  highlightSlot: number | null,
): PositionFilterId | null {
  if (mode !== "team" || highlightSlot == null) return null;
  return SLOT_TO_POSITION[highlightSlot] ?? null;
}

export function filterChampions(
  champions: ChampionData[],
  searchTerm: string,
  position: PositionFilterId,
): ChampionData[] {
  return champions.filter((champion) => {
    const matchesSearch =
      champion.championNameKr.includes(searchTerm) ||
      champion.championNameEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      position === "*" ||
      championPositions[champion.championNameEn]?.includes(position);

    return matchesSearch && matchesPosition;
  });
}
