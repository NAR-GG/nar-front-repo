import { cn } from "@/src/shared/lib/cn";
import { Group, Table, Text, Avatar } from "@mantine/core";

export type Top5Mode = "win" | "ban" | "pick";

export interface ChampionTop5Row {
  rank: number;
  championName: string;
  championImageUrl: string;
  laneIcon: React.ReactNode;

  winRate: number;
  winGames: number;

  pickRate?: number;
  pickGames?: number;

  banRate?: number;
  banGames?: number;
}

interface ChampionTop5TableProps {
  data: ChampionTop5Row[];
  mode: Top5Mode;
}

type Column = {
  key: string;
  header: string;
  valueColor?: string;
  getRate: (row: ChampionTop5Row) => number;
  getGames: (row: ChampionTop5Row) => number;
};

export function ChampionTop5Table({ data, mode }: ChampionTop5TableProps) {
  const TD_CLASS = "bg-(--nar-bg-cont-livebox) !py-[12px]";
  const TH_CLASS = "!py-[12px] !border-b-0";
  const TR_CLASS = "!border-b-0";

  const winColumn: Column = {
    key: "win",
    header: "승률",
    valueColor: "var(--nar-text-secondary)",
    getRate: (row) => row.winRate,
    getGames: (row) => row.winGames,
  };

  const pickColumn: Column = {
    key: "pick",
    header: "픽률",
    valueColor: "var(--nar-text-percent)",
    getRate: (row) => row.pickRate ?? 0,
    getGames: (row) => row.pickGames ?? 0,
  };

  const banColumn: Column = {
    key: "ban",
    header: "벤률",
    valueColor: "var(--nar-text-percent)",
    getRate: (row) => row.banRate ?? 0,
    getGames: (row) => row.banGames ?? 0,
  };

  const columns: Column[] =
    mode === "win"
      ? [winColumn]
      : mode === "pick"
      ? [winColumn, pickColumn]
      : [winColumn, banColumn];

  const rows = data.map((row) => (
    <Table.Tr
      key={`${mode}-${row.rank}-${row.championName}`}
      className={TR_CLASS}
    >
      <Table.Td className={cn({ TD_CLASS }, "align-center")}>
        <div className="w-6 h-6 flex items-center justify-center">
          <Text fw={600} fz={18} c="var(--nar-text-secondary)" lineClamp={1}>
            {row.rank}
          </Text>
        </div>
      </Table.Td>

      <Table.Td className={TD_CLASS}>
        <Group gap={13} wrap="nowrap" style={{ minWidth: 0 }}>
          <Avatar src={row.championImageUrl} size={46} radius={0} />
          <Group gap={9} wrap="nowrap" style={{ minWidth: 0 }}>
            {row.laneIcon}
            <Text fw={600} fz={16} c="var(--nar-text-secondary)" style={{ whiteSpace: "nowrap" }}>
              {row.championName}
            </Text>
          </Group>
        </Group>
      </Table.Td>

      {columns.map((col) => (
        <Table.Td key={col.key} className={TD_CLASS}>
          <Text
            fw={600}
            fz={16}
            c={col.valueColor ?? "var(--nar-text-tertiary-sub)"}
            lineClamp={1}
          >
            {col.getRate(row).toFixed(1)}%
          </Text>
          <Text fw={500} fz={14} c="var(--nar-text-tertiary-sub)" lineClamp={1}>
            {col.getGames(row)} 경기
          </Text>
        </Table.Td>
      ))}
    </Table.Tr>
  ));

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
                라인 / 챔피언
              </Text>
            </Table.Th>

            {columns.map((col) => (
              <Table.Th key={col.key} className={TH_CLASS}>
                <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                  {col.header}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody className="bg-(--nar-bg-cont-livebox)">{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
