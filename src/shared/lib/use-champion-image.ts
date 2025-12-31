"use client";

import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { championsQueries } from "@/entities/champions/model/champions.queries";

export function useChampionImage() {
  const { data: champions = [] } = useQuery(championsQueries.list());

  const championImageMap = useMemo(() => {
    if (!champions || champions.length === 0) return new Map<string, string>();
    return new Map(
      champions.map((c) => [c.championNameEn.toLowerCase(), c.imageUrl])
    );
  }, [champions]);

  const getChampionImageUrl = useCallback(
    (championName: string): string => {
      return (
        championImageMap.get(championName.toLowerCase()) ||
        `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${championName}.png`
      );
    },
    [championImageMap]
  );

  return { getChampionImageUrl, championImageMap };
}
