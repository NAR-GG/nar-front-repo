"use client";

import { useMemo, useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { IconSearch } from "@tabler/icons-react";
import { CommonTabs } from "@/shared/ui/common-tabs";
import { FilterSection } from "@/shared/ui/filter-section";
import type { Filters } from "@/shared/types/filter.types";
import {
  PositionFilter,
  type PositionFilterId,
} from "@/shared/ui/position-filter";
import { playersQueries } from "@/entities/players/model/players.queries";
import type { PlayerCardData } from "@/entities/players/api/players.dto";
import { PlayerCard } from "./player-card";
import { filterPlayers } from "../lib/player-list.lib";

export function PlayerListPageComponent() {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"player-cards" | "player-stats">(
    "player-cards",
  );
  const [selectedPosition, setSelectedPosition] =
    useState<PositionFilterId>("*");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    year: 2026,
    split: null,
    leagueName: "LCK",
    teamName: null,
    patch: null,
    side: "ALL",
    leagueNames: ["LCK"],
    splitNames: [],
    teamNames: [],
  });

  const { data, isLoading, isError } = useQuery(
    playersQueries.list({
      league: filters.leagueName ?? "LCK",
      year: filters.year,
      split: filters.split ?? undefined,
      patch: filters.patch ?? undefined,
      side: filters.side ?? "ALL",
      page: 1,
      size: 100,
    }),
  );

  const filteredPlayers = useMemo(
    () => filterPlayers(data?.players ?? [], searchTerm, selectedPosition),
    [data?.players, searchTerm, selectedPosition],
  );

  const tabItems = useMemo(
    () => [{ id: "player-cards", label: "선수 카드", value: "player-cards" }],
    [],
  );

  return (
    <Container size="xl" px={{ base: 0, sm: 24, md: 32 }}>
      <Stack mt="md" gap={0}>
        <CommonTabs
          variant="set-nav"
          value={activeTab}
          items={tabItems}
          onChange={(nextValue) => {
            if (nextValue === "player-cards" || nextValue === "player-stats") {
              setActiveTab(nextValue);
            }
          }}
        />
        <Paper withBorder p={0} radius="0 24px 24px 24px">
          {activeTab === "player-cards" && (
            <Stack px={16} py={24} gap={22}>
              <div className="flex items-center px-[21px] py-[14px] rounded-[14px] bg-(--nar-BG-last)">
                <FilterSection
                  variant="players"
                  filters={filters}
                  onFiltersChange={setFilters}
                  showSearchButton={false}
                />
              </div>

              <div className="flex flex-col items-end sm:flex-row sm:items-center justify-between gap-4 px-[21px] py-[14px] rounded-[14px] bg-(--nar-BG-last)">
                {isMobile ? (
                  <>
                    <TextInput
                      placeholder="선수 이름을 검색하세요."
                      rightSection={
                        <IconSearch stroke="var(--nar-text-3)" size={15} />
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      styles={{
                        input: {
                          backgroundColor: "var(--nar-bg-secondary)",
                          border: "1px solid var(--nar-line)",
                          borderRadius: "10px",
                        },
                      }}
                      style={{ width: 231 }}
                    />
                    <PositionFilter
                      selectedId={selectedPosition}
                      onSelect={setSelectedPosition}
                    />
                  </>
                ) : (
                  <>
                    <PositionFilter
                      selectedId={selectedPosition}
                      onSelect={setSelectedPosition}
                    />
                    <TextInput
                      placeholder="선수 이름을 검색하세요."
                      rightSection={
                        <IconSearch stroke="var(--nar-text-3)" size={15} />
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      styles={{
                        input: {
                          backgroundColor: "var(--nar-bg-secondary)",
                          border: "1px solid var(--nar-line)",
                          borderRadius: "10px",
                        },
                      }}
                      style={{ width: 382 }}
                    />
                  </>
                )}
              </div>

              {isLoading && (
                <Text c="var(--nar-text-tertiary-sub)">
                  선수 데이터를 불러오는 중...
                </Text>
              )}

              {isError && (
                <Text c="red.6">선수 데이터를 불러오지 못했습니다.</Text>
              )}

              {!isLoading && !isError && (
                <>
                  {isMobile ? (
                    <div
                      className={`-mx-1 flex snap-x snap-mandatory gap-4 px-1 pb-2 ${isCardExpanded ? "overflow-visible" : "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}`}
                    >
                      {filteredPlayers.map((player: PlayerCardData) => (
                        <div
                          key={player.playerId}
                          className="shrink-0 snap-center first:pl-1 last:pr-4"
                        >
                          <PlayerCard
                            player={player}
                            onActiveChange={setIsCardExpanded}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <SimpleGrid
                      cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                      spacing="lg"
                    >
                      {filteredPlayers.map((player: PlayerCardData) => (
                        <PlayerCard key={player.playerId} player={player} />
                      ))}
                    </SimpleGrid>
                  )}
                </>
              )}
            </Stack>
          )}

          {activeTab === "player-stats" && (
            <Stack p="md" gap="md">
              <FilterSection
                variant="players"
                filters={filters}
                onFiltersChange={setFilters}
                showSearchButton={false}
              />
              <PositionFilter
                selectedId={selectedPosition}
                onSelect={setSelectedPosition}
              />
              <Text fz={16} fw={600} c="var(--nar-text-secondary)">
                선수 통계
              </Text>
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
