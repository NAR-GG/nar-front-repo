"use client";

import { useMemo } from "react";
import { Group, Avatar, Text, Button, Stack, Progress } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { ChampionInfo, CombinationCardData } from "../model/types";

interface CombinationCardProps {
  combination: CombinationCardData;
  isExpanded: boolean;
  selectedChampions: (ChampionData | null)[];
}

export function CombinationCard({
  combination,
  isExpanded,
  selectedChampions,
}: CombinationCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    champions = [],
    winRate = 0,
    wins = 0,
    losses = 0,
    recentGame = "",
    latestPatch = "",
  } = combination;

  const totalGames = wins + losses;
  const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const lossPercentage = totalGames > 0 ? (losses / totalGames) * 100 : 0;
  // API에서 winRate가 100.0 형태(이미 퍼센트)로 오면 그대로 사용, 0~1 사이면 *100
  const displayWinRate = winRate > 1 ? Math.round(winRate) : Math.round(winRate * 100);

  const orderedChampions = useMemo(() => {
    if (!selectedChampions || selectedChampions.length === 0) {
      return champions;
    }

    const championMap = new Map<string, ChampionInfo>();
    champions.forEach((champion) => {
      championMap.set(champion.championNameEn, champion);
    });

    const selectedChampionNames = selectedChampions
      .filter((c): c is ChampionData => c !== null)
      .map((c) => c.championNameEn);

    const selectedInOrder = selectedChampionNames
      .map((name) => championMap.get(name))
      .filter((c): c is ChampionInfo => c !== undefined);

    const remaining = champions.filter(
      (champion) => !selectedChampionNames.includes(champion.championNameEn)
    );

    return [...selectedInOrder, ...remaining];
  }, [champions, selectedChampions]);

  return (
    <Stack gap="xs">
      {isMobile ? (
        <>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="xs">
              {orderedChampions.map((champion, index) => (
                <Avatar
                  key={index}
                  src={champion.imageUrl}
                  size={32}
                  radius="md"
                />
              ))}
            </Group>

            <Button
              variant="light"
              size="sm"
              color="gray"
              style={{
                flexShrink: 0,
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              {isExpanded ? (
                <IconChevronUp size={16} />
              ) : (
                <IconChevronDown size={16} />
              )}
            </Button>
          </Group>

          <Group gap="xs" align="center">
            <Progress.Root size="md" style={{ flex: 1, height: "20px" }}>
              <Progress.Section
                value={winPercentage}
                color="#5383e8"
                style={{ borderRadius: "2px 0 0 2px" }}
              >
                <Progress.Label
                  style={{
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  {wins}승
                </Progress.Label>
              </Progress.Section>
              <Progress.Section
                value={lossPercentage}
                color="#e84057"
                style={{ borderRadius: "0 2px 2px 0" }}
              >
                <Progress.Label
                  style={{
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  {losses}패
                </Progress.Label>
              </Progress.Section>
            </Progress.Root>

            <Text size="sm" fw={600} c={displayWinRate >= 50 ? "#5383e8" : "#e84057"}>
              {displayWinRate}%
            </Text>
          </Group>

          <Group gap="xs" justify="center">
            <Text size="xs" c="dimmed">
              {totalGames}게임
            </Text>
            <Text size="xs" c="dimmed">
              최근: {recentGame}
            </Text>
            <Text size="xs" c="dimmed">
              패치: {latestPatch}
            </Text>
          </Group>
        </>
      ) : (
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="sm" style={{ flex: 1 }}>
            <Group gap="xs">
              {orderedChampions.map((champion, index) => (
                <Avatar
                  key={index}
                  src={champion.imageUrl}
                  size={44}
                  radius="md"
                />
              ))}
            </Group>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: "180px",
                }}
              >
                <Progress.Root size="xl" style={{ flex: 1, height: "24px" }}>
                  <Progress.Section
                    value={winPercentage}
                    color="#5383e8"
                    style={{ borderRadius: "2px 0 0 2px" }}
                  >
                    <Progress.Label
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {wins}승
                    </Progress.Label>
                  </Progress.Section>
                  <Progress.Section
                    value={lossPercentage}
                    color="#e84057"
                    style={{ borderRadius: "0 2px 2px 0" }}
                  >
                    <Progress.Label
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {losses}패
                    </Progress.Label>
                  </Progress.Section>
                </Progress.Root>
              </div>

              <Text
                size="sm"
                fw={600}
                c={displayWinRate >= 50 ? "#5383e8" : "#e84057"}
              >
                {displayWinRate}%
              </Text>
            </div>

            <Group gap="md">
              <Text size="sm" c="dimmed">
                {totalGames}게임
              </Text>
              <Text size="sm" c="dimmed">
                최근: {recentGame}
              </Text>
              <Text size="xs" c="dimmed">
                패치: {latestPatch}
              </Text>
            </Group>
          </Group>

          <Button
            variant="light"
            size="xs"
            color="gray"
            rightSection={
              isExpanded ? (
                <IconChevronUp size={14} />
              ) : (
                <IconChevronDown size={14} />
              )
            }
            style={{ flexShrink: 0 }}
          >
            상세정보
          </Button>
        </Group>
      )}
    </Stack>
  );
}
