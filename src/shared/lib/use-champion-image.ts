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

  const championLoadingImageMap = useMemo(() => {
    if (!champions || champions.length === 0) return new Map<string, string>();
    return new Map(
      champions.map((c) => [c.championNameEn.toLowerCase(), c.loadingImageUrl])
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

  const getChampionLoadingImageUrl = useCallback(
    (championName: string): string => {
      return (
        championLoadingImageMap.get(championName.toLowerCase()) ||
        `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_0.jpg`
      );
    },
    [championLoadingImageMap]
  );

  return {
    getChampionImageUrl,
    getChampionLoadingImageUrl,
    championImageMap,
  };
}
