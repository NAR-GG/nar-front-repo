"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Stack,
  Text,
  Title,
  Button,
  LoadingOverlay,
  Paper,
  Collapse,
  Group,
  Divider,
  Select,
  ActionIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconChevronDown } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCombinationDetail } from "@/entities/combinations/api/combinations.api";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { Filters, Mode } from "../model/types";
import { CombinationCard } from "./combination-card";
import { CombinationDetail } from "./combination-detail";

// 챔피언 이미지 URL 변환 함수
const getChampionImageUrl = (championName: string): string => {
  const imageNameMap: Record<string, string> = {
    Drmundo: "DrMundo",
    Jarvaniv: "JarvanIV",
    Kogmaw: "KogMaw",
    Leesin: "LeeSin",
    Masteryi: "MasterYi",
    Missfortune: "MissFortune",
    Monkeyking: "MonkeyKing",
    Twistedfate: "TwistedFate",
    Velkoz: "Velkoz",
    Xinzhao: "XinZhao",
    Aurelionsol: "AurelionSol",
    Reksai: "RekSai",
    Tahmkench: "TahmKench",
    Khazix: "Khazix",
    Chogath: "Chogath",
    Belveth: "Belveth",
    Kaisa: "Kaisa",
    Renata: "Renata",
    Ksante: "KSante",
  };

  const imageName = imageNameMap[championName] || championName;
  return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${imageName}.png`;
};

interface CombinationResultsProps {
  selectedChampions: (ChampionData | null)[];
  filters: Filters;
  onBackToSelection: () => void;
  mode: Mode;
}

type SortType = "frequency" | "recency" | "patch";

export function CombinationResults({
  selectedChampions,
  filters,
  onBackToSelection,
}: CombinationResultsProps) {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {}
  );
  const [sort, setSort] = useState<SortType>("frequency");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pageSize = 10;

  const safeSelectedChampions = useMemo(
    () => selectedChampions.filter((c): c is ChampionData => c !== null),
    [selectedChampions]
  );

  const championNames = useMemo(
    () => safeSelectedChampions.map((c) => c.championNameEn),
    [safeSelectedChampions]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "combinations",
      "detail",
      championNames,
      filters.year,
      filters.splitNames,
      filters.leagueNames,
      filters.teamNames,
      filters.patch,
      sort,
    ],
    queryFn: ({ pageParam = 0 }) =>
      getCombinationDetail({
        champions: championNames,
        year: filters.year,
        splits: filters.splitNames.length > 0 ? filters.splitNames : undefined,
        leagueNames:
          filters.leagueNames.length > 0 ? filters.leagueNames : undefined,
        teamNames:
          filters.teamNames.length > 0 ? filters.teamNames : undefined,
        patch: filters.patch ?? undefined,
        page: pageParam,
        size: pageSize,
        sort,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage?.data?.totalCount ?? 0;
      const loadedCount = allPages.reduce(
        (acc, page) => acc + (page?.data?.content?.length ?? 0),
        0
      );
      return loadedCount < totalCount ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: championNames.length > 0,
  });

  const allCombinations = useMemo(
    () => data?.pages.flatMap((page) => page?.data?.content ?? []) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.data?.totalCount ?? 0;

  const handleSortChange = useCallback((value: string | null) => {
    if (value) {
      setSort(value as SortType);
      setExpandedCards({});
    }
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleCard = useCallback((index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // 챔피언이 선택되지 않은 경우
  if (safeSelectedChampions.length === 0) {
    return (
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
    );
  }

  // 에러 처리
  if (isError) {
    return (
      <Paper p="md" withBorder radius="md">
        <Stack gap="md">
          <Text c="red" ta="center">
            조합 데이터를 불러오는데 실패했습니다:{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </Text>
          <Button onClick={onBackToSelection} variant="light">
            다시 시도하기
          </Button>
        </Stack>
      </Paper>
    );
  }

  // 헤더 렌더링
  const renderHeader = () => {
    const loadText = (
      <Text size="sm" c="dimmed">
        {safeSelectedChampions.length}개 챔피언 조합 • 총 {totalCount}개 중{" "}
        {allCombinations.length}개 로드
      </Text>
    );

    const sortSelect = (
      <Select
        size="sm"
        placeholder="정렬 기준"
        data={[
          { value: "frequency", label: "빈도순" },
          { value: "recency", label: "최신순" },
          { value: "patch", label: "패치순" },
        ]}
        value={sort}
        onChange={handleSortChange}
        styles={{ input: { width: "120px" } }}
        allowDeselect={false}
      />
    );

    const backButton = (
      <Button
        size="sm"
        color="gray"
        leftSection={<IconArrowLeft size={16} />}
        onClick={onBackToSelection}
      >
        돌아가기
      </Button>
    );

    if (isMobile) {
      return (
        <Stack gap="xs">
          <Title order={2} c="dark">
            조합 분석 결과
          </Title>
          {loadText}
          <Group justify="flex-end" gap="xs">
            {sortSelect}
            {backButton}
          </Group>
        </Stack>
      );
    }

    return (
      <Group justify="space-between" align="center">
        <Title order={2} c="dark">
          조합 분석 결과
        </Title>
        <Group>
          {loadText}
          {sortSelect}
          {backButton}
        </Group>
      </Group>
    );
  };

  return (
    <Paper
      p="md"
      withBorder
      radius="md"
      style={{ position: "relative", minHeight: "400px" }}
    >
      <LoadingOverlay visible={isLoading} />

      {!isLoading && (
        <Stack gap="sm">
          {renderHeader()}

          <Divider color="#e9ecef" size="sm" />

          <Stack gap={0}>
            {allCombinations.length === 0 ? (
              <Text ta="center" c="dimmed" py="xl">
                선택한 조합에 대한 데이터가 없습니다.
              </Text>
            ) : (
              allCombinations.map((combination, index) => {
                if (!combination) return null;
                const isExpanded = expandedCards[index] || false;

                const cardData = {
                  combinationId: combination.combinationId,
                  champions: combination.champions.map((name: string) => ({
                    championNameKr: name,
                    championNameEn: name,
                    imageUrl: getChampionImageUrl(name),
                  })),
                  winRate: combination.winRate,
                  wins: combination.winCount,
                  losses: combination.lossCount,
                  recentGame: combination.latestGameDate,
                  latestPatch: combination.latestPatch,
                  frequency: combination.frequency,
                };

                return (
                  <div key={`combination-${index}-${combination.combinationId}`}>
                    <div
                      style={{ padding: "12px 0", cursor: "pointer" }}
                      onClick={() => toggleCard(index)}
                    >
                      <CombinationCard
                        combination={cardData}
                        isExpanded={isExpanded}
                        selectedChampions={selectedChampions}
                      />
                    </div>
                    <Collapse in={isExpanded}>
                      <div style={{ padding: "0 8px 12px 8px" }}>
                        {isExpanded && (
                          <CombinationDetail combination={cardData} />
                        )}
                      </div>
                    </Collapse>
                    {index < allCombinations.length - 1 && (
                      <Divider color="#e9ecef" size="sm" />
                    )}
                  </div>
                );
              })
            )}
          </Stack>

          {hasNextPage && (
            <Group justify="center" mt="md">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="xl"
                radius="xl"
                onClick={loadMore}
                loading={isFetchingNextPage}
              >
                <IconChevronDown size={24} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      )}
    </Paper>
  );
}
