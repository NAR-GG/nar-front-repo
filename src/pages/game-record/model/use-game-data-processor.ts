"use client";

import { useMemo } from "react";
import type { GameDetailData } from "@/entities/games/api/games.dto";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import { mapGameDetailToViewModel } from "./game-record.mapper";

export function useGameDataProcessor(
  gameData: GameDetailData | null | undefined,
) {
  const { getChampionImageUrl } = useChampionImage();

  const processed = useMemo(() => {
    if (!gameData) return null;
    return mapGameDetailToViewModel(gameData);
  }, [gameData]);

  return {
    gameInfo: processed?.gameInfo ?? null,
    blueTeam: processed?.blueTeam ?? null,
    redTeam: processed?.redTeam ?? null,
    setNav: gameData?.setNav ?? null,
    bans: gameData?.bans ?? null,
    getChampionImageUrl,
  };
}
