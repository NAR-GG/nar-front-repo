import type { TeamDetailStatsItemData } from "@/entities/teams/api/teams.dto";
import { teamsQueries } from "@/entities/teams/model/teams.queries";
import type { Filters } from "@/shared/types/filter.types";
import Info from "@/shared/assets/icons/info-circle.svg";
import { Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GameDetailProps = {
  filters: Filters;
};

function formatMatchRecord(item: TeamDetailStatsItemData) {
  return `${item.matchesPlayed} (${item.matchWins}/${item.matchLosses})`;
}

function formatSetRecord(item: TeamDetailStatsItemData) {
  return `${item.setsPlayed} (${item.setWins}/${item.setLosses})`;
}

function formatPercent(value: number | undefined) {
  return `${(value ?? 0).toFixed(1)}%`;
}

function formatNumber(value: number | undefined) {
  return value ?? 0;
}

export function GameDetail({ filters }: GameDetailProps) {
  const router = useRouter();
  const [isFirstKillOpen, setIsFirstKillOpen] = useState(false);
  const [isGoldOpen, setIsGoldOpen] = useState(false);

  const { data, isLoading, isError } = useQuery(
    teamsQueries.detailStats({
      year: filters.year,
      league: filters.leagueName ?? "LCK",
      split: filters.split ?? undefined,
      patch: filters.patch ?? undefined,
      side: filters.side ?? undefined,
    }),
  );

  const items = data?.items ?? [];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex w-full justify-between items-center">
        <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
          경기 데이터 상세
        </Text>
      </div>

      <div className="rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary) overflow-x-auto">
        <Table
          miw={1080}
          withRowBorders
          withTableBorder={false}
          styles={{
            td: { borderColor: "var(--nar-line-2)" },
            th: { borderColor: "var(--nar-line-2)" },
          }}
        >
          <Table.Thead className="[&_th]:font-normal [&_th]:whitespace-nowrap [&_th]:text-[14px] [&_th]:leading-[155%] [&_th]:text-(--nar-text-tertiary-sub) [&>tr>th]:!py-4.5">
            <Table.Tr>
              <Table.Th ta="center">#</Table.Th>
              <Table.Th ta="left">팀</Table.Th>
              <Table.Th ta="center">매치(승/패)</Table.Th>
              <Table.Th ta="center">세트(승/패)</Table.Th>
              <Table.Th ta="center">승률</Table.Th>
              <Table.Th ta="center">킬</Table.Th>
              <Table.Th ta="center">
                <div
                  className={
                    "flex items-center justify-center gap-1 " +
                    (isGoldOpen
                      ? "text-(--nar-purple-3)"
                      : "text-(--nar-text-tertiary-sub)")
                  }
                  onClick={() => setIsGoldOpen((prev) => !prev)}
                >
                  골드
                  <div className="relative">
                    <Info className="w-4.25 h-4.25 cursor-pointer" />
                    {isGoldOpen && (
                      <div className="absolute left-1/2 top-full z-10 mt-2 w-63.25 -translate-x-1/2 rounded-[14px] border border-(--nar-line-2) bg-(--nar-bg-primary) p-3.5 shadow-[3px_4px_9px_0_rgba(20,21,23,0.15)]">
                        <p className="whitespace-normal break-keep text-[14px] leading-[155%] text-(--nar-text-tertiary-sub)">
                          해당 경기에서 획득한 평균 골드를 기준으로 합니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Table.Th>
              <Table.Th ta="center">내셔</Table.Th>
              <Table.Th ta="center">드래곤</Table.Th>
              <Table.Th ta="center">타워</Table.Th>
              <Table.Th ta="center">
                <div
                  className={
                    "flex items-center justify-center gap-1 " +
                    (isFirstKillOpen
                      ? "text-(--nar-purple-3)"
                      : "text-(--nar-text-tertiary-sub)")
                  }
                  onClick={() => setIsFirstKillOpen((prev) => !prev)}
                >
                  첫 킬
                  <div className="relative">
                    <Info className="w-4.25 h-4.25 cursor-pointer" />
                    {isFirstKillOpen && (
                      <div className="absolute left-1/2 top-full z-10 mt-2 w-63.25 -translate-x-1/2 rounded-[14px] border border-(--nar-line-2) bg-(--nar-bg-primary) p-3.5 shadow-[3px_4px_9px_0_rgba(20,21,23,0.15)]">
                        <p className="whitespace-normal break-keep text-[14px] leading-[155%] text-(--nar-text-tertiary-sub)">
                          해당 경기에서 첫 킬을 냈을 때의 비율을 기준으로
                          합니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Table.Th>
              <Table.Th ta="center">첫 타워</Table.Th>
              <Table.Th ta="center">첫 드래곤</Table.Th>
              <Table.Th ta="center">첫 전령</Table.Th>
              <Table.Th ta="center">첫 바론</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="[&>tr>td]:!px-4 [&>tr>td]:!py-5">
            {isLoading && (
              <Table.Tr>
                <Table.Td colSpan={15} ta="center">
                  <Text c="var(--nar-text-tertiary-sub)">
                    데이터를 불러오는 중...
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}

            {isError && (
              <Table.Tr>
                <Table.Td colSpan={15} ta="center">
                  <Text c="var(--nar-text-red)">
                    데이터를 불러오지 못했습니다.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}

            {!isLoading && !isError && items.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={15} ta="center">
                  <Text c="var(--nar-text-tertiary-sub)">
                    표시할 팀 데이터가 없습니다.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}

            {items.map((team) => (
              <Table.Tr key={team.teamId}>
                <Table.Td ta="center">
                  <Text fw={500} fz={14} c="var(--nar-text-primary)">
                    {team.rank}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <button
                    className="flex items-center gap-2 min-w-35 cursor-pointer!"
                    onClick={() => router.push(`/team-players/team-list?team=${team.teamName}`)}
                  >
                    {team.teamImageUrl && (
                      <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-(--nar-BG-teamlogobox)">
                        <Image
                          src={team.teamImageUrl}
                          alt={team.teamCode}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <Text fw={600} fz={15} c="var(--nar-text-secondary)">
                        {team.teamCode}
                      </Text>
                    </div>
                  </button>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatMatchRecord(team)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatSetRecord(team)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-score)">
                    {formatPercent(team.winRatePct)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatNumber(team.avgKills)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-purple-1)">
                    {formatNumber(team.avgGold)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatNumber(team.avgBarons)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatNumber(team.avgDragons)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatNumber(team.avgTowers)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatPercent(team.firstBloodRatePct)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatPercent(team.firstTowerRatePct)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatPercent(team.firstDragonRatePct)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatPercent(team.firstHeraldRatePct)}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-primary)">
                    {formatPercent(team.firstBaronRatePct)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
