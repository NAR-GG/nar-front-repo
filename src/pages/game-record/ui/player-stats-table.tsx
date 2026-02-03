"use client";

import {
  Table,
  ScrollArea,
  Group,
  Avatar,
  Stack,
  Text,
  Badge,
  Progress,
} from "@mantine/core";

import type { GameDetailPlayer } from "@/entities/games/model/games.dto";

import TopIcon from "@/shared/assets/icons/nar_top.svg";
import JungleIcon from "@/shared/assets/icons/nar_jungle.svg";
import MidIcon from "@/shared/assets/icons/nar_mid.svg";
import BottomIcon from "@/shared/assets/icons/nar_bottom.svg";
import SupportIcon from "@/shared/assets/icons/nar_support.svg";

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

const POSITION_ORDER: Record<string, number> = {
  top: 1,
  jungle: 2,
  jng: 2,
  mid: 3,
  middle: 3,
  bottom: 4,
  bot: 4,
  adc: 4,
  support: 5,
  sup: 5,
  utility: 5,
};

export function PlayerStatsTable({
  players,
  teamKills,
  gameLengthInMin,
  getChampionImageUrl,
}: PlayerStatsTableProps) {
  const maxDamage = Math.max(...players.map((p) => p.damageToChampions));

  const sortedPlayers = [...players].sort((a, b) => {
    const orderA = POSITION_ORDER[a.position.toLowerCase()] || 99;
    const orderB = POSITION_ORDER[b.position.toLowerCase()] || 99;
    return orderA - orderB;
  });

  const getRoleIcon = (position: string) => {
    const pos = position.toLowerCase();
    if (POSITION_ORDER[pos] === 1) return TopIcon;
    if (POSITION_ORDER[pos] === 2) return JungleIcon;
    if (POSITION_ORDER[pos] === 3) return MidIcon;
    if (POSITION_ORDER[pos] === 4) return BottomIcon;
    if (POSITION_ORDER[pos] === 5) return SupportIcon;
    return TopIcon; // Fallback
  };

  return (
    <ScrollArea>
      <Table
        miw={800}
        bg="var(--nar-bg-secondary)"
        withRowBorders={false}
        withColumnBorders={false}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="py-3.25 w-11 min-w-11 sticky left-0 z-10 bg-(--nar-bg-secondary)">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                라인
              </Text>
            </Table.Th>
            <Table.Th className="py-3.25 w-14 min-w-14 sticky left-11 z-10 bg-(--nar-bg-secondary)">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                챔피언
              </Text>
            </Table.Th>
            <Table.Th className="py-3.25 px-2 min-w-20 sticky left-25 z-10 bg-(--nar-bg-secondary) sticky-col-end">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                선수
              </Text>
            </Table.Th>
            <Table.Th className="px-5.5 py-3.25">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                KDA/킬관여
              </Text>
            </Table.Th>
            <Table.Th className="px-5.5 py-3.25">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                가한 피해량
              </Text>
            </Table.Th>
            <Table.Th className="px-5.5 py-3.25">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                CS/분당CS
              </Text>
            </Table.Th>
            <Table.Th className="px-5.5 py-3.25">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                골드
              </Text>
            </Table.Th>
            <Table.Th className="px-5.5 py-3.25">
              <Text
                c="var(--nar-text-tertiary-sub)"
                fz={14}
                ta="center"
                className="whitespace-nowrap"
              >
                시야/분당시야
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedPlayers.map((p) => {
            const kdaRatio =
              p.deaths === 0
                ? "Perfect"
                : ((p.kills + p.assists) / p.deaths).toFixed(2);
            const isPerfect = p.deaths === 0;
            const damagePercent = (p.damageToChampions / maxDamage) * 100;

            return (
              <Table.Tr key={p.participantid}>
                <Table.Td className="p-0! sm:p-5! w-11 min-w-11 sticky left-0 z-10 bg-(--nar-bg-secondary)">
                  <div className="flex items-center justify-center">
                    {(() => {
                      const RoleIcon = getRoleIcon(p.position);
                      return <RoleIcon width={24} height={24} />;
                    })()}
                  </div>
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! w-14 min-w-14 text-center sticky left-11 z-10 bg-(--nar-bg-secondary)">
                  <Avatar
                    src={getChampionImageUrl(p.champion) || null}
                    radius="sm"
                    size="md"
                    mx="auto"
                  />
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! min-w-20 sticky left-25 z-10 bg-(--nar-bg-secondary) hover:bg-(--nar-BG-last) cursor-pointer transition-colors">
                  <Text fw={400} fz={16} c="--nar-text-tertiary">
                    {p.playername}
                  </Text>
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! text-center">
                  <Stack gap={2} align="center">
                    {p.pentaKills > 0 && (
                      <div className="badge-mini-hub-line"><span>펜타킬</span></div>
                    )}
                    {!p.pentaKills && p.quadraKills > 0 && (
                      <div className="badge-mini-hub-line"><span>쿼드라킬</span></div>
                    )}
                    {!p.pentaKills && !p.quadraKills && p.tripleKills > 0 && (
                      <div className="badge-mini-hub-line"><span>트리플킬</span></div>
                    )}
                    {!p.pentaKills &&
                      !p.quadraKills &&
                      !p.tripleKills &&
                      p.doubleKills > 0 && (
                        <div className="badge-mini-hub-line"><span>더블킬</span></div>
                      )}
                    {p.isFirstBloodKill && (
                      <Badge className="badge-mini-hub">퍼블</Badge>
                    )}
                    {p.isFirstBloodVictim && (
                      <Badge className="badge-mini-gray">퍼블당함</Badge>
                    )}

                    <Group gap={4}>
                      <Text fw={400} fz={16} c="var(--nar-text-tertiary)">
                        {p.kills}/{p.deaths}/{p.assists}
                      </Text>
                      <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
                        ({calculateKP(p.kills, p.assists, teamKills)})
                      </Text>
                    </Group>
                    <Text fz={14} c="var(--nar-text-score)">
                      {kdaRatio}
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! text-center">
                  <Stack gap={2} w={100} mx="auto">
                    <Text
                      fw={400}
                      fz={16}
                      c="var(--nar-text-tertiary)"
                      ta="center"
                    >
                      {(p.damageToChampions / 1000).toFixed(1)}K
                    </Text>
                    <Progress
                      value={damagePercent}
                      size="sm"
                      color="blue.3"
                      radius="xl"
                    />
                  </Stack>
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! text-center">
                  <Stack gap={0} align="center">
                    <Text fw={400} fz={16} c="var(--nar-text-tertiary)">
                      {p.totalCs}
                    </Text>
                    <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
                      ({p.cspm.toFixed(1)})
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! text-center">
                  <Text fw={400} fz={16} c="var(--nar-text-tertiary)">
                    {(p.totalGold / 1000).toFixed(1)}K
                  </Text>
                </Table.Td>
                <Table.Td className="p-0! sm:p-5! text-center">
                  <Stack gap={0} align="center">
                    <Text fw={400} fz={16} c="var(--nar-text-tertiary)">
                      {p.visionScore}
                    </Text>
                    <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
                      ({p.vspm.toFixed(1)})
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
