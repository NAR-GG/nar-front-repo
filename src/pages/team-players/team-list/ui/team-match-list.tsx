"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Stack,
  Flex,
  Text,
  Center,
  Pagination,
  Loader,
  Paper,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { gamesQueries } from "@/entities/games/model/games.queries";
import { FilterSection } from "@/shared/ui/filter-section";
import { SortControl } from "@/shared/ui/sort-control";
import type { Filters, SortValue } from "@/shared/types/filter.types";
import { GameRow } from "@/pages/pro-matches/list/ui/game-row";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import dayjs from "dayjs";
import {
  toGameRowViewModel,
  groupGamesByDate,
} from "@/pages/pro-matches/list/model/match-list.mapper";

interface TeamMatchListProps {
  teamName: string | null;
}

export function TeamMatchList({ teamName }: TeamMatchListProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { getChampionImageUrl } = useChampionImage();
  const { data } = useQuery(combinationsQueries.lastUpdate());

  const [filters, setFilters] = useState<Filters>({
    year: 2026,
    split: null,
    leagueName: null,
    teamName: teamName,
    patch: null,
    leagueNames: [],
    splitNames: [],
    teamNames: teamName ? [teamName] : [],
  });

  // 부모로부터 teamName이 변경되면 필터를 동기화합니다.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      teamName: teamName,
      teamNames: teamName ? [teamName] : prev.teamNames, // 유지하거나 덮어쓰거나
    }));
  }, [teamName]);

  const [activePage, setActivePage] = useState(1);
  const [sort, setSort] = useState<SortValue>("DESC");

  const queryParams = useMemo(
    () => ({
      leagueNames: filters.leagueNames,
      splitNames: filters.splitNames,
      teamNames: teamName ? [teamName] : [],
      page: activePage - 1,
      sort,
    }),
    [
      filters.leagueNames,
      filters.splitNames,
      teamName,
      activePage,
      sort,
    ],
  );

  const {
    data: matchData,
    isLoading,
    error,
  } = useQuery(gamesQueries.list(queryParams));

  const handleNavigateToRecord = useCallback(
    (gameId: number) => {
      router.push(`/pro-matches/${gameId}/record`);
    },
    [router],
  );

  const groupedGames = useMemo(() => {
    if (!matchData?.content) return {};
    return groupGamesByDate(matchData.content);
  }, [matchData]);

  const groupedViewModels = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(groupedGames).map(([date, games]) => [
          date,
          games.map((g) => toGameRowViewModel(g, getChampionImageUrl)),
        ]),
      ),
    [groupedGames, getChampionImageUrl],
  );

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
    <Paper p={24} withBorder radius="0 24px 24px 24px">
      <Text c="var(--nar-text-tertiary-sub)" fz={14} fw={400}>
        {dayjs(data?.data?.lastUpdateTime).format("YYYY년 MM월 DD일 업데이트")}
      </Text>
      <div className="flex flex-col gap-[13px] mt-4">
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
          hideTeamSelection={true}
        />

        {isLoading ? (
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        ) : matchData?.content && matchData.content.length > 0 ? (
          <Stack gap="md">
            {Object.entries(groupedViewModels).map(([date, games]) => (
              <Stack key={date} gap="sm">
                <Text fw={600} fz={16} c="var(--nar-text-primary)">
                  {date}
                </Text>
                {games.map((game) => (
                  <GameRow
                    key={game.gameId}
                    game={game}
                    onNavigateToRecord={handleNavigateToRecord}
                  />
                ))}
              </Stack>
            ))}

            {matchData.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={matchData.totalPages}
                  value={activePage}
                  onChange={setActivePage}
                  size={isMobile ? "sm" : "md"}
                  withControls
                  nextIcon={() => (
                    <span className="flex items-center gap-1">
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        next
                      </span>
                      <IconChevronRight size={23} />
                    </span>
                  )}
                  previousIcon={() => (
                    <span className="flex items-center gap-1">
                      <IconChevronLeft size={23} />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        prev
                      </span>
                    </span>
                  )}
                />
              </div>
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
