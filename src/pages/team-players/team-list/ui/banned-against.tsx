"use client";

import { useState } from "react";
import { Avatar, Table, Text } from "@mantine/core";
import Image from "next/image";
import type { TeamSideBanDataViewModel } from "../model/teams.view-model";
import { BAN_SIDE_MENU } from "../config/team-players.config";
import { GradientTabs } from "@/shared/ui/gradient-tabs";

interface BannedAgainstProps {
  data: TeamSideBanDataViewModel;
}

export function BannedAgainst({ data }: BannedAgainstProps) {
  const [side, setSide] = useState<"all" | "blue" | "red">("all");

  const bans = data[side];

  return (
    <div className="flex flex-col gap-2">
      <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
        벤 한 챔피언
      </Text>
      <div className="rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary)">
        <GradientTabs
          items={[...BAN_SIDE_MENU]}
          value={side}
          onChange={(v) => setSide(v as typeof side)}
        />

        <Table.ScrollContainer minWidth={346}>
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
                <Table.Th w={40}>
                  <Text fw={500} fz={14} c="var(--nar-text-tertiary-sub)">
                    #
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text fw={500} fz={14} c="var(--nar-text-tertiary-sub)">
                    챔피언
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  <Text fw={500} fz={14} c="var(--nar-text-tertiary-sub)">
                    벤률
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {bans.map((ban, index) => (
                <Table.Tr key={ban.championId}>
                  <Table.Td>
                    <Text fz={14} fw={500} c="var(--nar-text-tertiary-sub)">
                      {index + 1}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={ban.championImageUrl}
                        size={40}
                        radius="sm"
                      />
                      {ban.positionImageUrl && (
                        <Image
                          src={ban.positionImageUrl}
                          width={20}
                          height={20}
                          alt=""
                        />
                      )}
                      <Text fz={14} c="var(--nar-text-secondary)">
                        {ban.championName}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td ta="center">
                    <div className="flex flex-col">
                      <Text fz={16} fw={600} c="var(--nar-text-percent)">
                        {ban.banRatePct}
                      </Text>
                      <Text fz={13} fw={300} c="var(--nar-text-tertiary-sub)">
                        {ban.banCount}경기
                      </Text>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>
    </div>
  );
}
