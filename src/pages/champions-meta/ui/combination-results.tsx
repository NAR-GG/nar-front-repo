"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Button,
  LoadingOverlay,
  Paper,
  Collapse,
  Group,
  Pagination,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import type { CombinationSummary } from "@/entities/combinations/model/combinations.dto";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { Filters, Mode } from "../model/types";
import { CombinationCard } from "./combination-card";
import { CombinationDetail } from "./combination-detail";

interface CombinationResultsProps {
  selectedChampions: (ChampionData | null)[];
  filters: Filters;
  onBackToSelection: () => void;
  mode: Mode;
}

export function CombinationResults({
  selectedChampions,
  filters,
  onBackToSelection,
}: CombinationResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const championNames = selectedChampions
    .filter((c): c is ChampionData => c !== null)
    .map((c) => c.championNameEn);

  const { data, isLoading, isError, error } = useQuery(
    combinationsQueries.detail({
      champions: championNames,
      year: filters.year,
      splits: filters.splitNames.length > 0 ? filters.splitNames : undefined,
      leagueNames:
        filters.leagueNames.length > 0 ? filters.leagueNames : undefined,
      teamNames: filters.teamNames.length > 0 ? filters.teamNames : undefined,
      patch: filters.patch ?? undefined,
      page: page - 1,
      size: pageSize,
      sort: "frequency",
    })
  );

  const combinations = data?.data?.content ?? [];
  const totalCount = data?.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleCardClick = (combinationId: string) => {
    setExpandedId(expandedId === combinationId ? null : combinationId);
  };

  if (isLoading) {
    return (
      <div style={{ position: "relative", minHeight: "200px" }}>
        <LoadingOverlay
          visible={true}
          transitionProps={{ transition: "fade", duration: 150 }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <Stack gap="md" align="center">
        <Text c="red">
          오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
        </Text>
        <Button variant="light" onClick={onBackToSelection}>
          다시 검색하기
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBackToSelection}
        >
          챔피언 선택으로 돌아가기
        </Button>
        <Text size="sm" c="dimmed">
          총 {totalCount}개의 조합
        </Text>
      </Group>

      {combinations.length === 0 ? (
        <Paper p="md" withBorder radius="md">
          <Stack gap="md" align="center">
            <Text ta="center" c="dimmed">
              유효한 챔피언 데이터가 없습니다.
            </Text>
            <Button
              leftSection={<IconArrowLeft size={16} />}
              onClick={onBackToSelection}
              variant="light"
            >
              챔피언 선택하러 가기
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="sm">
          {combinations.map((combination: CombinationSummary) => {
            const cardData = {
              combinationId: combination.combinationId,
              champions: combination.champions.map((name) => ({
                championNameKr: name,
                championNameEn: name,
                imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${name}.png`,
              })),
              winRate: combination.winRate,
              wins: combination.winCount,
              losses: combination.lossCount,
              recentGame: combination.latestGameDate,
              latestPatch: combination.latestPatch,
              frequency: combination.frequency,
            };

            return (
              <Paper
                key={combination.combinationId}
                p="md"
                radius="md"
                withBorder
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(combination.combinationId)}
              >
                <CombinationCard
                  combination={cardData}
                  isExpanded={expandedId === combination.combinationId}
                  selectedChampions={selectedChampions}
                />
                <Collapse in={expandedId === combination.combinationId}>
                  <CombinationDetail
                    combination={{
                      combinationId: combination.combinationId,
                      champions: cardData.champions,
                    }}
                  />
                </Collapse>
              </Paper>
            );
          })}
        </Stack>
      )}

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      )}
    </Stack>
  );
}
