import { Flex, Table, Text } from "@mantine/core";
import Info from "@/shared/assets/icons/info-circle.svg";
import { useState } from "react";
import { getRoleIcon } from "@/src/pages/game-record/lib/game-record.lib";
import { PlayerRecordViewModel } from "../model/teams.view-model";
interface PlayerRecordProps {
  data: PlayerRecordViewModel[];
}

export function PlayerRecord({ data }: PlayerRecordProps) {
  const [isfirstKillOpen, setIsfirstKillOpen] = useState(false);
  const [isfirstDeathOpen, setIsfirstDeathOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
        선수 기록
      </Text>
      <div className="rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary) overflow-x-auto">
        <Table
          miw={640}
          withRowBorders
          withTableBorder={false}
          styles={{
            td: { borderColor: "var(--nar-line-2)" },
            th: { borderColor: "var(--nar-line-2)" },
          }}
        >
          <Table.Thead className="[&_th]:font-normal [&_th]:whitespace-nowrap [&_th]:text-[14px] [&_th]:leading-[155%] [&_th]:text-(--nar-text-tertiary-sub) [&>tr>th]:!py-4.5">
            <Table.Tr>
              <Table.Th ta="center" className="whitespace-nowrap">
                라인
              </Table.Th>
              <Table.Th ta="center">선수</Table.Th>
              <Table.Th ta="center">KDA/킬관여</Table.Th>
              <Table.Th ta="center">
                <div
                  className={
                    "flex items-center justify-center gap-1 " +
                    (isfirstKillOpen
                      ? "text-(--nar-purple-3)"
                      : "text-(--nar-text-tertiary-sub)")
                  }
                  onClick={() => setIsfirstKillOpen((prev) => !prev)}
                >
                  첫 킬
                  <div className="relative">
                    <Info className="w-4.25 h-4.25 cursor-pointe" />
                    {isfirstKillOpen && (
                      <div className="absolute left-0 top-full mt-2 -translate-x-1/2 w-63.25 rounded-[14px] border border-(--nar-line-2) bg-(--nar-bg-primary) p-3.5 shadow-[3px_4px_9px_0_rgba(20,21,23,0.15)]">
                        <p className="whitespace-normal break-keep text-[14px] leading-[155%] text-(--nar-text-tertiary-sub)">
                          해당 경기에서 첫 킬을 냈을때 평균 시간(분)을 기준으로
                          합니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Table.Th>
              <Table.Th ta="center">
                <div
                  className={
                    "flex items-center justify-center gap-1 " +
                    (isfirstDeathOpen
                      ? "text-(--nar-purple-3)"
                      : "text-(--nar-text-tertiary-sub)")
                  }
                  onClick={() => setIsfirstDeathOpen((prev) => !prev)}
                >
                  첫 데스
                  <div className="relative">
                    <Info className="w-4.25 h-4.25 cursor-pointe" />
                    {isfirstDeathOpen && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-63.25 rounded-[14px] border border-(--nar-line-2) bg-(--nar-bg-primary) p-3.5 shadow-[3px_4px_9px_0_rgba(20,21,23,0.15)]">
                        <p className="whitespace-normal break-keep text-[14px] leading-[155%] text-(--nar-text-tertiary-sub)">
                          해당 경기에서 첫 데스를 당했을때 평균 시간(분)을
                          기준으로 합니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Table.Th>
              <Table.Th ta="center">펜타킬 수</Table.Th>
              <Table.Th ta="center">팀내 데미지 비율</Table.Th>
              <Table.Th ta="center">팀내 골드 비율</Table.Th>
              <Table.Th ta="center">시야/분당시야</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="[&>tr>td]:!p-6">
            {data.map((player) => (
              <Table.Tr key={player.playerId}>
                <Table.Td>
                  <div className="flex items-center justify-center">
                    {(() => {
                      const RoleIcon = getRoleIcon(player.position);
                      return <RoleIcon className="w-5 h-5 sm:w-6 sm:h-6" />;
                    })()}
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text fw={400} fz={16} c="--nar-text-tertiary">
                    {player.playerName}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <div className="flex flex-col items-center">
                    <Text fz={14} fw={400} c="var(--nar-text-score)">
                      {player.kdaLabel}
                    </Text>
                    <Text fz={14} fw={400} c="var(--nar-text-tertiary-sub)">
                      {player.avgKillParticipationPct}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} fw={400} c="var(--nar-text-secondary)">
                    {player.firstKillCount}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-score)">
                    {player.firstDeathCount}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-2)">
                    {player.pentaKillCount}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Flex direction="column" align="center" justify="center">
                    <Text fz={14} c="var(--nar-text-secondary)">
                      {player.avgDamageSharePct}
                    </Text>
                    <div className="w-full h-2 bg-(--nar-bg-secondary) rounded-full overflow-hidden">
                      <div
                        className="h-full bg-(--nar-blue-600) rounded-full opacity-50"
                        style={{
                          width: player.avgDamageSharePct,
                        }}
                      />
                    </div>
                  </Flex>
                </Table.Td>
                <Table.Td ta="center">
                  <Flex direction="column" align="center" justify="center">
                    <Text fz={14} c="var(--nar-text-secondary)">
                      {player.avgGoldSharePct}
                    </Text>
                    <div className="w-full h-2 bg-(--nar-bg-secondary) rounded-full overflow-hidden">
                      <div
                        className="h-full bg-(--nar-purple-1) rounded-full opacity-50"
                        style={{
                          width: player.avgGoldSharePct,
                        }}
                      />
                    </div>
                  </Flex>
                </Table.Td>
                <Table.Td ta="center">
                  <Text fz={14} c="var(--nar-text-secondary)">
                    {player.avgVisionScore} / {player.avgVisionScorePerMinute}
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
