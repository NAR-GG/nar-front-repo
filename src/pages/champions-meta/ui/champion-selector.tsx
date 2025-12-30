"use client";

import Image from "next/image";
import { Avatar, Button, Group, Paper, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { Mode } from "../model/types";

const RADIUS = "sm";

const POSITION_IMAGES = [
  { name: "탑", image: "/images/top-dark.svg" },
  { name: "정글", image: "/images/jungle-dark.svg" },
  { name: "미드", image: "/images/mid-dark.svg" },
  { name: "원딜", image: "/images/bottom-dark.svg" },
  { name: "서폿", image: "/images/support-dark.svg" },
];

interface ChampionSelectorProps {
  selectedChampions: (ChampionData | null)[];
  selected1v1Champions: (ChampionData | null)[];
  onChampionRemove: (champion: ChampionData) => void;
  on1v1ChampionRemove: (champion: ChampionData) => void;
  onEmptySlotClick: (slotIndex: number) => void;
  onEmpty1v1SlotClick: (slotIndex: number) => void;
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ChampionSelector({
  selectedChampions = [],
  selected1v1Champions = [],
  onChampionRemove,
  on1v1ChampionRemove,
  onEmptySlotClick,
  onEmpty1v1SlotClick,
  currentMode = "team",
  onModeChange,
}: ChampionSelectorProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleTabChange = (newMode: Mode) => {
    onModeChange?.(newMode);
  };

  const renderSlot = (
    champ: ChampionData | null,
    index: number,
    onRemove: (champion: ChampionData) => void,
    onEmptyClick: (index: number) => void,
    slotType: string
  ) => (
    <div
      key={`${slotType}-${index}`}
      style={{
        position: "relative",
        minWidth: isMobile ? 56 : 80,
        maxWidth: isMobile ? 56 : 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        minHeight: isMobile ? 90 : 110,
      }}
    >
      {champ ? (
        <>
          <Avatar
            src={champ.imageUrl}
            alt={champ.championNameKr}
            size={isMobile ? 56 : 80}
            radius={RADIUS}
            style={{ cursor: "pointer", transition: "all .15s ease" }}
            onClick={() => onRemove?.(champ)}
          />
          <Text
            size="xs"
            mt={4}
            truncate="end"
            style={{
              maxWidth: isMobile ? 56 : 80,
              fontSize: isMobile ? "9px" : "12px",
              lineHeight: "1.2",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
          >
            {champ.championNameKr}
          </Text>
        </>
      ) : (
        <>
          <div
            style={{
              width: isMobile ? 56 : 80,
              height: isMobile ? 56 : 80,
              borderRadius: "var(--mantine-radius-sm)",
              backgroundColor: "#f8f9fa",
              border: "1px dashed #ced4da",
              cursor: "pointer",
              transition: "all .15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => onEmptyClick?.(index)}
          >
            {slotType === "team" && (
              <Image
                src={POSITION_IMAGES[index].image}
                alt={POSITION_IMAGES[index].name}
                width={isMobile ? 36 : 50}
                height={isMobile ? 36 : 50}
                style={{ opacity: 0.6 }}
              />
            )}
          </div>
          <Text
            size="xs"
            c="dimmed"
            mt={4}
            style={{
              fontSize: isMobile ? "9px" : "12px",
              textAlign: "center",
              maxWidth: isMobile ? 56 : 80,
            }}
          >
            {slotType === "team" ? POSITION_IMAGES[index].name : "챔피언 선택"}
          </Text>
        </>
      )}
    </div>
  );

  const render1v1 = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: isMobile ? 6 : 16,
        overflowX: "auto",
        padding: "0 8px 4px",
      }}
    >
      {renderSlot(
        selected1v1Champions[0] ?? null,
        0,
        on1v1ChampionRemove,
        onEmpty1v1SlotClick,
        "1v1"
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: isMobile ? 56 : 80,
          paddingTop: 0,
        }}
      >
        <Text
          fw={700}
          c="gray.6"
          mx={isMobile ? 4 : 8}
          style={{ userSelect: "none", fontSize: isMobile ? 14 : 18 }}
        >
          VS
        </Text>
      </div>

      {renderSlot(
        selected1v1Champions[1] ?? null,
        1,
        on1v1ChampionRemove,
        onEmpty1v1SlotClick,
        "1v1"
      )}
    </div>
  );

  const renderTeam = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? 6 : 16,
        overflowX: "auto",
        padding: "0 8px 4px",
      }}
    >
      {Array.from({ length: 5 }).map((_, i) =>
        renderSlot(
          selectedChampions[i] ?? null,
          i,
          onChampionRemove,
          onEmptySlotClick,
          "team"
        )
      )}
    </div>
  );

  return (
    <Paper p={isMobile ? "xs" : "md"} withBorder radius={RADIUS}>
      <Group justify="center" mb="md" gap="xs">
        <Button
          radius={RADIUS}
          size={isMobile ? "xs" : "sm"}
          variant={currentMode === "team" ? "filled" : "default"}
          color="blue"
          onClick={() => handleTabChange("team")}
        >
          팀 조합
        </Button>

        <Button
          radius={RADIUS}
          size={isMobile ? "xs" : "sm"}
          variant={currentMode === "1v1" ? "filled" : "default"}
          color="red"
          onClick={() => handleTabChange("1v1")}
        >
          1vs1
        </Button>
      </Group>

      {currentMode === "team" ? renderTeam() : render1v1()}

      <Text
        size="xs"
        c="dimmed"
        ta="center"
        mt="md"
        style={{ fontSize: isMobile ? "10px" : "12px" }}
      >
        {currentMode === "team"
          ? "최대 5명의 챔피언으로 팀을 구성하세요"
          : "1vs1 분석할 챔피언 2명을 선택하세요"}
      </Text>
    </Paper>
  );
}
