"use client";

import { Text, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import type { ChampionInfo } from "../model/types";
import { MatchHistory } from "./match-history";

interface CombinationDetailProps {
  combination: {
    combinationId: string;
    champions: ChampionInfo[];
  };
}

export function CombinationDetail({ combination }: CombinationDetailProps) {
  const {
    data: detailResponse,
    isLoading,
    isError,
    error,
  } = useQuery(combinationsQueries.gameDetails(combination.combinationId));

  if (isLoading) {
    return (
      <div style={{ position: "relative", minHeight: "100px" }}>
        <LoadingOverlay
          visible={true}
          transitionProps={{ transition: "fade", duration: 150 }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <Text size="sm" c="red" ta="center" py="sm">
        오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
      </Text>
    );
  }

  const gameDetails = detailResponse?.data?.gameDetails || detailResponse?.data || [];

  return (
    <MatchHistory
      champions={combination.champions || []}
      gameDetails={gameDetails}
    />
  );
}
