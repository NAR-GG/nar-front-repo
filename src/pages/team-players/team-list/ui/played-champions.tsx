"use client";

import { useState } from "react";
import { Avatar, HoverCard, Table, Text } from "@mantine/core";
import type { PlayedChampionsViewModel } from "../model/teams.view-model";
import { BAN_SIDE_MENU } from "../config/team-players.config";
import { GradientTabs } from "@/shared/ui/gradient-tabs";

import NarTop from "@/shared/assets/icons/nar_top.svg";
import NarJungle from "@/shared/assets/icons/nar_jungle.svg";
import NarMid from "@/shared/assets/icons/nar_mid.svg";
import NarBottom from "@/shared/assets/icons/nar_bottom.svg";
import NarSupport from "@/shared/assets/icons/nar_support.svg";

const POSITION_ICONS: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  top: NarTop,
  jungle: NarJungle,
  jng: NarJungle,
  mid: NarMid,
  bottom: NarBottom,
  bot: NarBottom,
  support: NarSupport,
  sup: NarSupport,
};

interface PlayedChampionsProps {
  data: PlayedChampionsViewModel;
}

export function PlayedChampions({ data }: PlayedChampionsProps) {
  const [side, setSide] = useState<"all" | "blue" | "red">("all");

  const players = data[side];

  return (
    <div className="flex flex-col gap-2">
      <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
        플레이한 챔피언
      </Text>
      <div>
        <GradientTabs
          items={[...BAN_SIDE_MENU]}
          value={side}
          onChange={(v) => setSide(v as typeof side)}
        />
        <Table.ScrollContainer minWidth={500}>
          <Table
            withRowBorders
            withTableBorder={false}
            verticalSpacing="md"
            horizontalSpacing="sm"
            styles={{
              td: { borderColor: "var(--nar-line-2)" },
              th: { borderColor: "var(--nar-line-2)" },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={60}>
                  <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
                    라인
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
                    선수
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
                    챔피언 리스트 / 챔프 사용 횟수
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {players.map((player) => {
                const Icon = POSITION_ICONS[player.position.toLowerCase()];
                return (
                  <Table.Tr key={player.playerId}>
                    <Table.Td>
                      {Icon && <Icon width={32} height={32} />}
                    </Table.Td>
                    <Table.Td>
                      <Text fz={14} c="var(--nar-text-secondary)">
                        {player.playerName}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-2 flex-wrap">
                        {player.champions.map((champ) => (
                          <HoverCard
                            key={champ.championId}
                            width="auto"
                            withArrow
                            openDelay={100}
                          >
                            <HoverCard.Target>
                              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                                <Avatar
                                  src={champ.championImageUrl}
                                  size={40}
                                  radius="sm"
                                />
                                <Text fz={12} c="var(--nar-text-tertiary-sub)">
                                  {champ.gamesPlayed}
                                </Text>
                              </div>
                            </HoverCard.Target>
                            <HoverCard.Dropdown
                              className="!flex !flex-col !items-start !gap-[9px] !p-[14px] !rounded-[14px] !border !border-[var(--nar-line-2)] !bg-[var(--nar-bg-primary)] !shadow-[3px_4px_9px_0_var(--nar-dark-opacity15)]"
                            >
                              <div className="flex w-full justify-between gap-6">
                                <Text fz={14} c="var(--nar-text-tertiary-sub)">
                                  승률
                                </Text>
                                <Text fz={14} fw={600} c="var(--nar-text-red)">
                                  {champ.winRateLabel}
                                </Text>
                              </div>
                              <div className="flex w-full justify-between gap-6">
                                <Text fz={14} c="var(--nar-text-tertiary-sub)">
                                  평균 KDA
                                </Text>
                                <Text
                                  fz={14}
                                  fw={600}
                                  c="var(--nar-text-purple)"
                                >
                                  {champ.kdaLabel}
                                </Text>
                              </div>
                              <div className="flex w-full justify-between gap-6">
                                <Text fz={14} c="var(--nar-text-tertiary-sub)">
                                  최근 사용일
                                </Text>
                                <Text
                                  fz={14}
                                  fw={600}
                                  c="var(--nar-text-secondary)"
                                >
                                  {champ.lastUsedLabel}
                                </Text>
                              </div>
                            </HoverCard.Dropdown>
                          </HoverCard>
                        ))}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>
    </div>
  );
}
