"use client";

import { Table, ScrollArea, Group, Avatar, Stack, Text, Badge } from "@mantine/core";
import type { GameDetailPlayer } from "@/entities/games/model/games.dto";

interface PlayerStatsTableProps {
  players: GameDetailPlayer[];
  teamKills: number;
  gameLengthInMin: number;
  getChampionImageUrl: (name: string) => string;
}

const calculateKP = (kills: number, assists: number, teamKills: number) => {
  if (teamKills === 0) return "0%";
  return `${Math.round(((kills + assists) / teamKills) * 100)}%`;
};

const renderKeyRecords = (player: GameDetailPlayer) => {
  const records: React.ReactNode[] = [];
  const badgeProps = { variant: "light" as const, size: "sm" as const, radius: "xs" as const };

  // '퍼블 당함' 기록 (부정적 지표이므로 다른 스타일 적용)
  if (player.isFirstBloodVictim) {
    records.push(
      <Badge key="fbv" color="gray" variant="filled" size="sm" radius="xs">
        퍼블 당함
      </Badge>
    );
  }
  // '퍼블' 기록
  if (player.isFirstBloodKill) {
    records.push(
      <Badge key="fbk" color="gray" {...badgeProps}>
        퍼블
      </Badge>
    );
  }
  // 멀티킬 기록 (x2, x3 형식으로 변경)
  if (player.doubleKills > 0) {
    records.push(
      <Badge key="double" color="gray" {...badgeProps}>
        더블킬 x{player.doubleKills}
      </Badge>
    );
  }
  if (player.tripleKills > 0) {
    records.push(
      <Badge key="triple" color="gray" {...badgeProps}>
        트리플킬 x{player.tripleKills}
      </Badge>
    );
  }
  if (player.quadraKills > 0) {
    records.push(
      <Badge key="quadra" color="gray" {...badgeProps}>
        쿼드라킬 x{player.quadraKills}
      </Badge>
    );
  }
  if (player.pentaKills > 0) {
    records.push(
      <Badge key="penta" color="gray" {...badgeProps}>
        펜타킬 x{player.pentaKills}
      </Badge>
    );
  }

  if (records.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        -
      </Text>
    );
  }

  return (
    <Stack gap={4} align="flex-start">
      {records}
    </Stack>
  );
};

export function PlayerStatsTable({
  players,
  teamKills,
  gameLengthInMin,
  getChampionImageUrl,
}: PlayerStatsTableProps) {
  return (
    <ScrollArea>
      <Table striped highlightOnHover miw={700}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>선수</Table.Th>
            <Table.Th>KDA</Table.Th>
            <Table.Th>주요 기록</Table.Th>
            <Table.Th>데미지(DPM)</Table.Th>
            <Table.Th>CS(CSPM)</Table.Th>
            <Table.Th visibleFrom="sm">골드</Table.Th>
            <Table.Th visibleFrom="sm">시야(VSPM)</Table.Th>
            <Table.Th visibleFrom="sm">KP</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {players.map((p) => (
            <Table.Tr key={p.participantid}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar src={getChampionImageUrl(p.champion)} radius="sm" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600}>
                      {p.playername}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {p.champion}
                    </Text>
                  </Stack>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {p.kills}/{p.deaths}/{p.assists}
                </Text>
              </Table.Td>
              <Table.Td>{renderKeyRecords(p)}</Table.Td>
              <Table.Td>
                <Stack gap={0}>
                  <Text size="sm">{(p.damageToChampions / 1000).toFixed(1)}K</Text>
                  <Text size="xs" c="dimmed">
                    {p.dpm}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Stack gap={0}>
                  <Text size="sm">{p.totalCs}</Text>
                  <Text size="xs" c="dimmed">
                    {p.cspm.toFixed(1)}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td visibleFrom="sm">
                <Text size="sm">{(p.totalGold / 1000).toFixed(1)}K</Text>
              </Table.Td>
              <Table.Td visibleFrom="sm">
                <Stack gap={0}>
                  <Text size="sm">{p.visionScore}</Text>
                  <Text size="xs" c="dimmed">
                    {p.vspm.toFixed(1)}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td visibleFrom="sm">
                <Text size="sm">{calculateKP(p.kills, p.assists, teamKills)}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
