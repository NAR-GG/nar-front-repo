"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Stack,
  Group,
  Flex,
  Text,
  Center,
  Pagination,
  Loader,
  Paper,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { gamesQueries } from "@/entities/games/model/games.queries";
import { FilterSection } from "@/shared/ui/filter-section";
import { SortControl } from "@/shared/ui/sort-control";
import type { Filters, SortValue } from "@/shared/types/filter.types";
import { GameRow } from "./game-row";
import type { GameData } from "@/entities/games/model/games.dto";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import { combinationsQueries } from "@/src/entities/combinations/model/combinations.queries";
import dayjs from "dayjs";

export function MatchListPage() {
  const router = useRouter();
  const { getChampionImageUrl } = useChampionImage();
  const { data } = useQuery(combinationsQueries.lastUpdate());

  const [filters, setFilters] = useState<Filters>({
    year: 2026,
    split: null,
    leagueName: null,
    teamName: null,
    patch: null,
    leagueNames: [],
    splitNames: [],
    teamNames: [],
  });

  const [activePage, setActivePage] = useState(1);
  const [sort, setSort] = useState<SortValue>("DESC");

  const queryParams = useMemo(
    () => ({
      leagueNames: filters.leagueNames,
      splitNames: filters.splitNames,
      teamNames: filters.teamNames,
      page: activePage - 1,
      sort,
    }),
    [
      filters.leagueNames,
      filters.splitNames,
      filters.teamNames,
      activePage,
      sort,
    ],
  );

  const {
    data: matchData,
    isLoading,
    error,
  } = useQuery(gamesQueries.list(queryParams));

  const handleNavigateToRecord = (gameId: number) => {
    router.push(`/pro-matches/${gameId}/record`);
  };

  const groupGamesByDate = (games: GameData[]) => {
    const grouped: Record<string, GameData[]> = {};

    games.forEach((game) => {
      const date = new Date(game.gameDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(game);
    });

    return grouped;
  };

  const groupedGames = useMemo(() => {
    if (!matchData?.content) return {};
    return groupGamesByDate(matchData.content);
  }, [matchData]);

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Text c="red">데이터를 불러오는데 실패했습니다.</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Paper p="lg" withBorder radius="lg">
      <Text c="var(--nar-text-tertiary-sub)" fz={14} fw={400}>
        {dayjs(data?.data.lastUpdateTime).format("YYYY년 MM월 DD일 업데이트")}
      </Text>
      <div className="flex flex-col gap-[13px]">
        <Flex justify="flex-end" mb="sm">
          <SortControl value={sort} onChange={setSort} />
        </Flex>

        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          selectedChampions={[]}
          onCombinationSearch={() => {}}
          currentMode="team"
          showSearchButton={false}
        />

        {isLoading ? (
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        ) : matchData?.content && matchData.content.length > 0 ? (
          <Stack gap="md">
            {Object.entries(groupedGames).map(([date, games]) => (
              <Stack key={date} gap="sm">
                {games.map((game) => (
                  <GameRow
                    key={game.gameId}
                    game={game}
                    getChampionImageUrl={getChampionImageUrl}
                    onNavigateToRecord={handleNavigateToRecord}
                  />
                ))}
              </Stack>
            ))}

            {matchData.totalPages > 1 && (
              <Center mt="xl">
                <Pagination
                  total={matchData.totalPages}
                  value={activePage}
                  onChange={setActivePage}
                  size="md"
                />
              </Center>
            )}
          </Stack>
        ) : (
          <Paper withBorder p="xl" radius="md">
            <Center>
              <Text c="dimmed">조건에 맞는 경기 기록이 없습니다.</Text>
            </Center>
          </Paper>
        )}
      </div>
    </Paper>
  );
}
