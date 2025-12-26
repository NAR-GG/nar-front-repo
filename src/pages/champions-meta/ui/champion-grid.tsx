"use client";

import { useState, useMemo } from "react";
import {
  SimpleGrid,
  TextInput,
  Paper,
  Text,
  LoadingOverlay,
  Avatar,
  Box,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { championsQueries } from "@/entities/champions/model/champions.queries";
import type { ChampionData } from "@/entities/champions/model/champions.dto";

interface ChampionGridProps {
  onChampionSelect: (champion: ChampionData) => void;
  selectedChampions: (ChampionData | null)[];
  highlightSlot: number | null;
}

export function ChampionGrid({
  onChampionSelect,
  selectedChampions,
}: ChampionGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: champions = [], isLoading, isError, error } = useQuery(championsQueries.list());

  const filteredChampions = useMemo(() => {
    if (!searchQuery.trim()) return champions;

    const query = searchQuery.toLowerCase().trim();
    return champions.filter(
      (champion) =>
        champion.championNameKr.toLowerCase().includes(query) ||
        champion.championNameEn.toLowerCase().includes(query)
    );
  }, [champions, searchQuery]);

  const isChampionSelected = (champion: ChampionData) => {
    return selectedChampions.some((c) => c && c.id === champion.id);
  };

  if (isLoading) {
    return (
      <div style={{ position: "relative", minHeight: "300px" }}>
        <LoadingOverlay
          visible={true}
          transitionProps={{ transition: "fade", duration: 150 }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <Text c="red" ta="center">
        오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
      </Text>
    );
  }

  return (
    <Paper p="md" radius="md" withBorder>
      <TextInput
        placeholder="챔피언 검색..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />

      {filteredChampions.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          검색 결과가 없습니다.
        </Text>
      ) : (
        <SimpleGrid
          cols={{ base: 5, xs: 6, sm: 8, md: 10, lg: 12 }}
          spacing="xs"
        >
          {filteredChampions.map((champion) => {
            const selected = isChampionSelected(champion);

            return (
              <Box
                key={champion.id}
                onClick={() => onChampionSelect(champion)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: selected
                    ? "var(--mantine-color-blue-light)"
                    : "transparent",
                  border: selected
                    ? "2px solid var(--mantine-color-blue-filled)"
                    : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Avatar
                  src={champion.imageUrl}
                  size={48}
                  radius="md"
                  style={{
                    opacity: selected ? 1 : 0.8,
                  }}
                />
                <Text
                  size="xs"
                  ta="center"
                  lineClamp={1}
                  style={{
                    width: "100%",
                    fontSize: "10px",
                  }}
                >
                  {champion.championNameKr}
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Paper>
  );
}
