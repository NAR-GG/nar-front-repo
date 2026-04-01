import { memo, useMemo } from "react";
import { cn } from "@/shared/lib/cn";
import { Group, Table, Text, Avatar } from "@mantine/core";
import type {
  ChampionTop5Mode,
  ChampionTop5ViewModel,
} from "../model/home.viewmodel";

interface ChampionTop5TableProps {
  data: ChampionTop5ViewModel[];
  mode: ChampionTop5Mode;
}

type Column = {
  key: string;
  header: string;
  valueColor?: string;
  getRate: (row: ChampionTop5ViewModel) => number;
  getGames: (row: ChampionTop5ViewModel) => number;
};

const TD_CLASS = "bg-(--nar-bg-cont-livebox) !py-[12px]";
const TH_CLASS = "!py-[12px] !border-b-0";
const TR_CLASS = "!border-b-0";
const STICKY_HEADER_CLASS = "sticky top-0 z-20 bg-(--nar-bg-cont-livebox)";
const STICKY_FIRST_COL_CLASS = "sticky left-0 z-10 bg-(--nar-bg-cont-livebox)";

const WIN_COLUMN: Column = {
  key: "win",
  header: "승률",
  valueColor: "var(--nar-text-secondary)",
  getRate: (row) => row.winRate,
  getGames: (row) => row.winGames ?? 0,
};

const PICK_COLUMN: Column = {
  key: "pick",
  header: "픽률",
  valueColor: "var(--nar-text-percent)",
  getRate: (row) => row.pickRate ?? 0,
  getGames: (row) => row.totalGames ?? 0,
};

const BAN_COLUMN: Column = {
  key: "ban",
  header: "밴률",
  valueColor: "var(--nar-text-percent)",
  getRate: (row) => row.banRate ?? 0,
  getGames: (row) => row.banCount ?? 0,
};

interface ChampionRowProps {
  row: ChampionTop5ViewModel;
  columns: Column[];
}

const ChampionRow = memo(function ChampionRow({
  row,
  columns,
}: ChampionRowProps) {
  return (
    <Table.Tr className={TR_CLASS}>
      <Table.Td
        className={cn(TD_CLASS, STICKY_FIRST_COL_CLASS, "align-center")}
      >
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
            <Text
              fw={600}
              fz={16}
              c="var(--nar-text-secondary)"
              style={{ whiteSpace: "nowrap" }}
            >
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
  );
});

export function ChampionTop5Table({
  data,
  mode = "ban",
}: ChampionTop5TableProps) {
  const columns = useMemo<Column[]>(
    () =>
      mode === "pick" ? [WIN_COLUMN, PICK_COLUMN] : [WIN_COLUMN, BAN_COLUMN],
    [mode],
  );

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
            <Table.Th
              className={`${TH_CLASS} ${STICKY_HEADER_CLASS} ${STICKY_FIRST_COL_CLASS} z-30`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Text fw={600} fz={18} c="var(--nar-text-4)" lineClamp={1}>
                  #
                </Text>
              </div>
            </Table.Th>
            <Table.Th className={`${TH_CLASS} ${STICKY_HEADER_CLASS}`}>
              <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                라인 / 챔피언
              </Text>
            </Table.Th>
            {columns.map((col) => (
              <Table.Th
                key={col.key}
                className={`${TH_CLASS} ${STICKY_HEADER_CLASS}`}
              >
                <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                  {col.header}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody className="bg-(--nar-bg-cont-livebox)">
          {data.map((row) => (
            <ChampionRow
              key={`${mode}-${row.rank}-${row.championName}`}
              row={row}
              columns={columns}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
