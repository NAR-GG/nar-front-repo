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
import NarGrayTop from "@/shared/assets/icons/nar_gray_top.svg";
import NarGrayAll from "@/shared/assets/icons/nar_gray_all.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_gray_jungle.svg";
import NarGrayMid from "@/shared/assets/icons/nar_gray_mid.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_gray_bottom.svg";
import NarGraySupport from "@/shared/assets/icons/nar_gray_support.svg";
import NarAll from "@/shared/assets/icons/nar_all.svg";
import NarTop from "@/shared/assets/icons/nar_top.svg";
import NarJungle from "@/shared/assets/icons/nar_jungle.svg";
import NarMid from "@/shared/assets/icons/nar_mid.svg";
import NarBottom from "@/shared/assets/icons/nar_bottom.svg";
import NarSupport from "@/shared/assets/icons/nar_support.svg";

interface ChampionGridProps {
  onChampionSelect: (champion: ChampionData) => void;
  selectedChampions: (ChampionData | null)[];
  highlightSlot: number | null;
}

type PositionId = "*" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";

interface Position {
  id: PositionId;
  name: string;
  inactiveIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const positions: Position[] = [
  { id: "*", name: "전체", inactiveIcon: NarGrayAll, activeIcon: NarAll },
  { id: "TOP", name: "탑", inactiveIcon: NarGrayTop, activeIcon: NarTop },
  {
    id: "JUG",
    name: "정글",
    inactiveIcon: NarGrayJungle,
    activeIcon: NarJungle,
  },
  { id: "MID", name: "미드", inactiveIcon: NarGrayMid, activeIcon: NarMid },
  {
    id: "ADC",
    name: "원딜",
    inactiveIcon: NarGrayBottom,
    activeIcon: NarBottom,
  },
  {
    id: "SUP",
    name: "서포터",
    inactiveIcon: NarGraySupport,
    activeIcon: NarSupport,
  },
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

  const renderPositionFilter = () => (
    <div
      style={{
        display: "flex",
        width: isMobile ? "100%" : "auto",
        maxWidth: isMobile ? "100%" : "auto",
      }}
    >
      {positions.map(
        (
          { id, name, inactiveIcon: InactiveIcon, activeIcon: ActiveIcon },
          index,
        ) => (
          <div
            key={id}
            style={{
              padding: isMobile ? "8px 4px" : "12px 14px",
              cursor: "pointer",
              backgroundColor: "transparent",
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
            {selectedPosition === id && ActiveIcon ? (
              <ActiveIcon
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            ) : InactiveIcon ? (
              <InactiveIcon
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            ) : null}
          </div>
        ),
      )}
    </div>
  );

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
              {renderPositionFilter()}
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
            {renderPositionFilter()}
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
