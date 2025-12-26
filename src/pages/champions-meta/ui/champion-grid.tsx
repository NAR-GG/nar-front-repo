"use client";

import { useState, useMemo } from "react";
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
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import { championPositions } from "../model/champion-positions";

interface ChampionGridProps {
  onChampionSelect: (champion: ChampionData) => void;
  selectedChampions: (ChampionData | null)[];
  highlightSlot: number | null;
}

type PositionId = "*" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";

interface Position {
  id: PositionId;
  name: string;
  iconSrc: string;
}

const positions: Position[] = [
  { id: "*", name: "전체", iconSrc: "/images/nothing.png" },
  { id: "TOP", name: "탑", iconSrc: "/images/top.png" },
  { id: "JUG", name: "정글", iconSrc: "/images/jungle.png" },
  { id: "MID", name: "미드", iconSrc: "/images/mid.png" },
  { id: "ADC", name: "원딜", iconSrc: "/images/bottom.png" },
  { id: "SUP", name: "서포터", iconSrc: "/images/support.png" },
];

export function ChampionGrid({
  onChampionSelect,
  selectedChampions,
}: ChampionGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<PositionId>("*");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: champions = [],
    isLoading,
    isError,
    error,
  } = useQuery(championsQueries.list());

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      const matchesSearch =
        champion.championNameKr.includes(searchTerm) ||
        champion.championNameEn
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesPosition =
        selectedPosition === "*" ||
        championPositions[champion.championNameEn]?.includes(selectedPosition);

      return matchesSearch && matchesPosition;
    });
  }, [champions, searchTerm, selectedPosition]);

  const isChampionSelected = (champion: ChampionData) => {
    return selectedChampions.some((c) => c && c.id === champion.id);
  };

  if (isError) {
    return (
      <Alert color="red" title="오류 발생">
        챔피언 데이터를 불러오는데 실패했습니다:{" "}
        {error instanceof Error ? error.message : "알 수 없는 오류"}
      </Alert>
    );
  }

  const renderPositionFilter = () => (
    <div
      style={{
        display: "flex",
        width: isMobile ? "100%" : "auto",
        maxWidth: isMobile ? "100%" : "auto",
      }}
    >
      {positions.map(({ id, name, iconSrc }, index) => (
        <div
          key={id}
          style={{
            padding: isMobile ? "8px 4px" : "12px 14px",
            cursor: "pointer",
            backgroundColor: selectedPosition === id ? "#4c6ef5" : "#f8f9fa",
            border: "1px solid #e9ecef",
            borderLeft: index === 0 ? "1px solid #e9ecef" : "none",
            borderRight: "1px solid #e9ecef",
            borderRadius:
              index === 0
                ? "6px 0 0 6px"
                : index === positions.length - 1
                ? "0 6px 6px 0"
                : "0",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "44px",
            flex: isMobile ? "1" : "unset",
            minWidth: isMobile ? 0 : "50px",
            overflow: "hidden",
          }}
          onClick={() => setSelectedPosition(id)}
          title={name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconSrc}
            alt={name}
            width={isMobile ? 20 : 24}
            height={isMobile ? 20 : 24}
            style={{
              objectFit: "contain",
              filter:
                selectedPosition === id
                  ? "brightness(0) invert(1)"
                  : "brightness(0.4) opacity(0.6) sepia(1) saturate(0.8) hue-rotate(200deg)",
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Paper p="md" withBorder radius="md" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      <Stack gap="md">
        {isMobile ? (
          <Stack gap="md">
            <TextInput
              placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {renderPositionFilter()}
            </div>
          </Stack>
        ) : (
          <Group justify="space-between">
            <TextInput
              placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
            {renderPositionFilter()}
          </Group>
        )}

        <ScrollArea h={400}>
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
        </ScrollArea>
      </Stack>
    </Paper>
  );
}
