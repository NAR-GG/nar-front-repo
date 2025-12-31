"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Stack,
  Text,
  Center,
  Pagination,
  Loader,
  Paper,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { gamesQueries } from "@/entities/games/model/games.queries";
import { FilterSection } from "@/pages/champions-meta/ui/filter-section";
import type { Filters } from "@/pages/champions-meta/model/types";
import type { SortValue } from "../model/types";
import { Dateheader } from "./date-header";
import { GameRow } from "./game-row";
import type { GameData } from "@/entities/games/model/games.dto";
import { useChampionImage } from "@/shared/lib/use-champion-image";

export function MatchListPage() {
  const router = useRouter();
  const { getChampionImageUrl } = useChampionImage();

  const [filters, setFilters] = useState<Filters>({
    year: 2025,
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
    ]
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
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          selectedChampions={[]}
          onCombinationSearch={() => {}}
          currentMode="team"
          isSearchable={false}
          sort={sort}
          onSortChange={setSort}
        />

        {isLoading ? (
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        ) : matchData?.content && matchData.content.length > 0 ? (
          <Stack gap="md">
            {Object.entries(groupedGames).map(([date, games]) => (
              <Stack key={date} gap="sm">
                <Dateheader date={date} />
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
      </Stack>
    </Container>
  );
}
