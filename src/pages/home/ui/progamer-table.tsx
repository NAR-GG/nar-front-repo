import { Group, Table, Text, Avatar } from "@mantine/core";

export type Top5Mode = "kda" | "gpm" | "dpm";

export interface ProgamerTop5Row {
  rank: number;
  playerName: string;
  playerImageUrl: string;
  teamName: string;
  games: number;
  value: number;
}

interface ProgamerTop5TableProps {
  data: ProgamerTop5Row[];
  mode: Top5Mode;
}

const MODE_CONFIG: Record<
  Top5Mode,
  { header: string; format: (v: number) => string }
> = {
  kda: {
    header: "K/DA",
    format: (v) => v.toFixed(2),
  },
  gpm: {
    header: "GPM",
    format: (v) => `${v.toFixed(1)}`,
  },
  dpm: {
    header: "DPM",
    format: (v) => `${v.toFixed(1)}%`,
  },
};

export function ProgamerTop5Table({ data, mode }: ProgamerTop5TableProps) {
  const TD_CLASS = "bg-(--nar-bg-cont-livebox) !py-[12px]";
  const TH_CLASS = "!py-[12px] !border-b-0";
  const TR_CLASS = "!border-b-0";

  const config = MODE_CONFIG[mode];

  return (
    <Table.ScrollContainer h={384} minWidth={346}>
      <Table
        withRowBorders={false}
        withTableBorder={false}
        verticalSpacing={0}
        horizontalSpacing="sm"
      >
        <Table.Thead>
          <Table.Tr className={TR_CLASS}>
            <Table.Th className={TH_CLASS}>
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <Text fw={600} fz={18} c="var(--nar-text-4)" lineClamp={1}>
                  #
                </Text>
              </div>
            </Table.Th>

            <Table.Th className={TH_CLASS}>
              <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                소속 / 플레이어
              </Text>
            </Table.Th>

            <Table.Th className={TH_CLASS}>
              <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                경기 수
              </Text>
            </Table.Th>

            <Table.Th className={TH_CLASS}>
              <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                {config.header}
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody className="bg-(--nar-bg-cont-livebox)">
          {data.map((row) => (
            <Table.Tr
              key={`${mode}-${row.rank}-${row.playerName}`}
              className={TR_CLASS}
            >
              <Table.Td className={TD_CLASS}>
                <div className="w-[24px] h-[24px] flex items-center justify-center">
                  <Text fw={600} fz={18} c="var(--nar-text-secondary)">
                    {row.rank}
                  </Text>
                </div>
              </Table.Td>

              <Table.Td className={TD_CLASS}>
                <Group gap={13} wrap="nowrap" style={{ minWidth: 0 }}>
                  <Avatar src={row.playerImageUrl} size={46} radius={0} />
                  <Text
                    fw={600}
                    fz={16}
                    c="var(--nar-text-secondary)"
                    lineClamp={1}
                  >
                    {row.playerName}
                  </Text>
                </Group>
              </Table.Td>

              <Table.Td className={TD_CLASS}>
                <Text
                  fw={600}
                  fz={16}
                  c="var(--nar-text-secondary)"
                  lineClamp={1}
                >
                  {row.games}
                </Text>
              </Table.Td>

              <Table.Td className={TD_CLASS}>
                <Text fw={600} fz={16} c="var(--nar-purple-2)" lineClamp={1}>
                  {config.format(row.value)}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
