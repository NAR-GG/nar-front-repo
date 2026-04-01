import { memo } from "react";
import { Group, Table, Text, Avatar } from "@mantine/core";
import playerImageMap from "@/shared/config/player-image-map.json";
import type { ProgamerTop5Mode, ProgamerTop5ViewModel } from "../model/home.viewmodel";

interface ProgamerTop5TableProps {
  data: ProgamerTop5ViewModel[];
  mode: ProgamerTop5Mode;
}

interface ProgamerTop5RowProps {
  row: ProgamerTop5ViewModel;
  formatValue: (v: number) => string;
}

const TD_CLASS = "bg-(--nar-bg-cont-livebox) !py-[12px]";
const TH_CLASS = "!py-[12px] !border-b-0";
const TR_CLASS = "!border-b-0";
const STICKY_HEADER_CLASS = "sticky top-0 z-20 bg-(--nar-bg-cont-livebox)";
const STICKY_FIRST_COL_CLASS = "sticky left-0 z-10 bg-(--nar-bg-cont-livebox)";

const MODE_CONFIG: Record<
  ProgamerTop5Mode,
  { header: string; format: (v: number) => string }
> = {
  kda: { header: "K/DA", format: (v) => v.toFixed(2) },
  gpm: { header: "GPM", format: (v) => v.toFixed(1) },
  dpm: { header: "DPM", format: (v) => `${v.toFixed(1)}%` },
};

const getPlayerImageSrc = (row: ProgamerTop5ViewModel): string | undefined => {
  const mapped = playerImageMap[row.playerName as keyof typeof playerImageMap];
  if (mapped) return mapped;
  return row.playerImageUrl || undefined;
};

const ProgamerTop5Row = memo(function ProgamerTop5Row({
  row,
  formatValue,
}: ProgamerTop5RowProps) {
  return (
    <Table.Tr key={`${row.rank}-${row.playerName}`} className={TR_CLASS}>
      <Table.Td className={`${TD_CLASS} ${STICKY_FIRST_COL_CLASS}`}>
        <div className="w-6 h-6 flex items-center justify-center">
          <Text fw={600} fz={18} c="var(--nar-text-secondary)">
            {row.rank}
          </Text>
        </div>
      </Table.Td>

      <Table.Td className={TD_CLASS}>
        <Group gap={13} wrap="nowrap" style={{ minWidth: 0 }}>
          <Avatar src={getPlayerImageSrc(row)} size={46} radius={0} />
          <Text fw={600} fz={16} c="var(--nar-text-secondary)" lineClamp={1}>
            {row.playerName}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td className={TD_CLASS}>
        <Text fw={600} fz={16} c="var(--nar-text-secondary)" lineClamp={1}>
          {row.games}
        </Text>
      </Table.Td>

      <Table.Td className={TD_CLASS}>
        <Text fw={600} fz={16} c="var(--nar-purple-2)" lineClamp={1}>
          {formatValue(row.value)}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
});

export function ProgamerTop5Table({ data, mode }: ProgamerTop5TableProps) {
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
                소속 / 플레이어
              </Text>
            </Table.Th>
            <Table.Th className={`${TH_CLASS} ${STICKY_HEADER_CLASS}`}>
              <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                경기 수
              </Text>
            </Table.Th>
            <Table.Th className={`${TH_CLASS} ${STICKY_HEADER_CLASS}`}>
              <Text fw={600} fz={14} c="var(--nar-text-4)" lineClamp={1}>
                {config.header}
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody className="bg-(--nar-bg-cont-livebox)">
          {data.map((row) => (
            <ProgamerTop5Row
              key={`${mode}-${row.rank}-${row.playerName}`}
              row={row}
              formatValue={config.format}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
