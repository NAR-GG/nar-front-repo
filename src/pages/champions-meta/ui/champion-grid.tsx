"use client";

import { useState, useCallback } from "react";
import {
  SimpleGrid,
  TextInput,
  Paper,
  Text,
  LoadingOverlay,
  Avatar,
  Stack,
  Group,
  ScrollArea,
  Alert,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { championsQueries } from "@/entities/champions/model/champions.queries";
import type { ChampionData } from "@/entities/champions/api/champions.dto";
import type { Mode } from "@/shared/types/filter.types";
import {
  PositionFilter,
  type PositionFilterId,
} from "@/shared/ui/position-filter";
import { filterChampions, getSlotPosition } from "../lib/champion-grid.lib";

interface ChampionGridProps {
  onChampionSelect: (champion: ChampionData) => void;
  selectedChampions: (ChampionData | null)[];
  highlightSlot: number | null;
  currentMode: Mode;
}

type PositionId = PositionFilterId;

export function ChampionGrid({
  onChampionSelect,
  selectedChampions,
  highlightSlot,
  currentMode,
}: ChampionGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<PositionId>("*");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const effectiveSelectedPosition = getSlotPosition(currentMode, highlightSlot) ?? selectedPosition;

  const {
    data: champions = [],
    isLoading,
    isError,
    error,
  } = useQuery(championsQueries.list());

  const filteredChampions = filterChampions(champions, searchTerm, effectiveSelectedPosition);

  const isChampionSelected = useCallback((champion: ChampionData) => {
    return selectedChampions.some((c) => c && c.id === champion.id);
  }, [selectedChampions]);

  const searchInputStyles = {
    input: {
      backgroundColor: "var(--nar-bg-secondary)",
      border: "1px solid var(--nar-line)",
      borderRadius: "10px",
    },
  } as const;

  if (isError) {
    return (
      <Alert color="red" title="오류 발생">
        챔피언 데이터를 불러오는데 실패했습니다:{" "}
        {error instanceof Error ? error.message : "알 수 없는 오류"}
      </Alert>
    );
  }

  return (
    <Paper
      px={18}
      py={14}
      withBorder
      radius={24}
      bg="var(--nar-bg-tertiary)"
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={isLoading} />
      <Text fz={20} fw={500} lh={2.4} c="var(--nar-text-tertiary-sub)">
        챔피언 선택
      </Text>
      <Stack gap="md">
        {isMobile ? (
          <Stack gap="md">
            <TextInput
              placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
              rightSection={<IconSearch size={15} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              styles={searchInputStyles}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                paddingBottom: "4px",
              }}
            >
              <PositionFilter
                selectedId={effectiveSelectedPosition}
                onSelect={setSelectedPosition}
              />
            </div>
          </Stack>
        ) : (
          <Group justify="space-between">
            <TextInput
              placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
              rightSection={<IconSearch size={15} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              styles={searchInputStyles}
              style={{ width: 300 }}
            />
            <PositionFilter
              selectedId={effectiveSelectedPosition}
              onSelect={setSelectedPosition}
            />
          </Group>
        )}

        <ScrollArea h={400}>
          {filteredChampions.length === 0 ? (
            <div className="flex h-[400px] w-full flex-col items-center justify-center">
              <Text c="var(--nar-text-secondary)" fz={16} fw={600}>
                검색결과가 없습니다.
              </Text>
              <Text c="var(--nar-text-tertiary-sub)" fz={13} fw={600} mt={7}>
                챔피언명을 다시 한번 확인해주세요.
              </Text>
            </div>
          ) : (
            <SimpleGrid cols={{ base: 4, sm: 6, md: 8, lg: 10 }} spacing="md">
              {filteredChampions.map((champion) => {
                const isSelected = isChampionSelected(champion);

                return (
                  <div
                    key={champion.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      opacity: 1,
                      transition: "all 0.2s",
                      padding: "8px",
                    }}
                    onClick={() => onChampionSelect(champion)}
                  >
                    <Avatar
                      src={champion.imageUrl}
                      size={60}
                      radius="md"
                      style={{
                        border: isSelected
                          ? "3px solid #4c6ef5"
                          : "2px solid transparent",
                        marginBottom: "8px",
                      }}
                    />
                    <Text
                      size="xs"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        wordBreak: "keep-all",
                        lineHeight: "1.2",
                        fontSize: "11px",
                        color: isSelected ? "#4c6ef5" : "inherit",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {champion.championNameKr}
                    </Text>
                    <div style={{ height: "2px" }}>
                      {isSelected && (
                        <Text size="xs" c="blue" mt={2}>
                          선택됨
                        </Text>
                      )}
                    </div>
                  </div>
                );
              })}
            </SimpleGrid>
          )}
        </ScrollArea>
      </Stack>
    </Paper>
  );
}
