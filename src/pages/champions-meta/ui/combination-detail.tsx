"use client";

import { Text, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import type { ChampionInfo } from "../model/types";
// TODO: MatchHistory 컴포넌트 마이그레이션 후 주석 해제
// import { MatchHistory } from "./match-history";

interface CombinationDetailProps {
  combination: {
    combinationId: string;
    champions: ChampionInfo[];
  };
}

export function CombinationDetail({ combination }: CombinationDetailProps) {
  const championNames = combination.champions.map((c) => c.championNameEn);

  const {
    data: detailResponse,
    isLoading,
    isError,
    error,
  } = useQuery(combinationsQueries.detail({ champions: championNames }));

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

  const gameDetails = detailResponse?.data?.gameDetails || [];

  return gameDetails.length > 0 ? (
    // TODO: MatchHistory 컴포넌트 마이그레이션 후 교체
    <Text size="sm" c="dimmed" ta="center" py="sm">
      {gameDetails.length}개의 매치 기록이 있습니다. (MatchHistory 컴포넌트
      마이그레이션 필요)
    </Text>
  ) : (
    // <MatchHistory
    //   champions={combination.champions || []}
    //   gameDetails={gameDetails}
    // />
    <Text size="sm" c="dimmed" ta="center" py="sm">
      매치 기록이 없습니다.
    </Text>
  );
}
