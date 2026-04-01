"use client";

import { Avatar, Group, SegmentedControl, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ChampionData } from "@/entities/champions/api/champions.dto";
import type { Mode } from "@/shared/types/filter.types";
import NarGrayTop from "@/shared/assets/icons/nar_gray_top.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_gray_jungle.svg";
import NarGrayMid from "@/shared/assets/icons/nar_gray_mid.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_gray_bottom.svg";
import NarGraySupport from "@/shared/assets/icons/nar_gray_support.svg";
import NarTop from "@/shared/assets/icons/nar_top.svg";
import NarJungle from "@/shared/assets/icons/nar_jungle.svg";
import NarMid from "@/shared/assets/icons/nar_mid.svg";
import NarBottom from "@/shared/assets/icons/nar_bottom.svg";
import NarSupport from "@/shared/assets/icons/nar_support.svg";

const RADIUS = "sm";

const POSITION_ICONS = [
  { name: "탑", inactiveIcon: NarGrayTop, activeIcon: NarTop },
  { name: "정글", inactiveIcon: NarGrayJungle, activeIcon: NarJungle },
  { name: "미드", inactiveIcon: NarGrayMid, activeIcon: NarMid },
  { name: "원딜", inactiveIcon: NarGrayBottom, activeIcon: NarBottom },
  { name: "서폿", inactiveIcon: NarGraySupport, activeIcon: NarSupport },
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
  highlightSlot?: number | null;
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
  highlightSlot = null,
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
    slotType: string,
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
              maxWidth: isMobile ? 32 : 53,
              fontSize: isMobile ? "14px" : "16px",
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
            className={`${
              slotType === "1v1" ? "bg-(--nar-bg-tertiary)" : ""
            } flex h-14 w-14 items-center justify-center cursor-pointer transition-all duration-150 md:h-20 md:w-20`}
            onClick={() => onEmptyClick?.(index)}
          >
            {(() => {
              const iconData = POSITION_ICONS[index];
              const isActive = highlightSlot === index;
              const ActiveIcon = iconData?.activeIcon;
              const InactiveIcon = iconData?.inactiveIcon;

              if (slotType !== "team") return null;

              if (isActive && ActiveIcon) {
                return (
                  <ActiveIcon
                    width={isMobile ? 32 : 53}
                    height={isMobile ? 32 : 53}
                  />
                );
              }

              if (InactiveIcon) {
                return (
                  <InactiveIcon
                    width={isMobile ? 32 : 53}
                    height={isMobile ? 32 : 53}
                  />
                );
              }

              return null;
            })()}
          </div>
          <Text
            fz={isMobile ? 14 : 16}
            c="var(--nar-text-tertiary-sub)"
            mt={4}
            style={{
              textAlign: "center",
              maxWidth:
                slotType === "1v1" ? (isMobile ? 84 : 96) : isMobile ? 32 : 53,
              whiteSpace: slotType === "1v1" ? "nowrap" : "normal",
            }}
          >
            {slotType === "team" ? POSITION_ICONS[index].name : "챔피언 선택"}
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
        "1v1",
      )}

      <div className={`${isMobile ? "h-8" : "h-[53px]"} flex items-end pt-0`}>
        <Text
          fw={700}
          fz={18}
          c="var(--nar-text-tertiary-sub)"
          mx={isMobile ? 4 : 8}
          style={{ userSelect: "none", fontSize: isMobile ? 14 : 18 }}
        >
          vs
        </Text>
      </div>

      {renderSlot(
        selected1v1Champions[1] ?? null,
        1,
        on1v1ChampionRemove,
        onEmpty1v1SlotClick,
        "1v1",
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
          "team",
        ),
      )}
    </div>
  );

  return (
    <div>
      <Group justify="center" mb="md" gap="xs">
        <SegmentedControl
          radius={RADIUS}
          size={isMobile ? "xs" : "sm"}
          value={currentMode}
          onChange={(value) => handleTabChange(value as Mode)}
          data={[
            { label: "팀 조합", value: "team" },
            { label: "1vs1", value: "1v1" },
          ]}
        />
      </Group>

      <Text
        size="xs"
        c="dimmed"
        ta="center"
        mt="md"
        mb={24}
        style={{ fontSize: isMobile ? "10px" : "12px" }}
      >
        {currentMode === "team"
          ? "최대 5명의 챔피언으로 팀을 구성해보세요."
          : "* 1:1 분석할 챔피언 2명을 선택하세요"}
      </Text>
      {currentMode === "team" ? renderTeam() : render1v1()}
    </div>
  );
}
