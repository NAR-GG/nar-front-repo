import { Text } from "@mantine/core";
import { TeamGameSummaryViewModel } from "../model/teams.view-model";

interface GameSummaryProps {
  data: TeamGameSummaryViewModel;
}

const statItems = (data: TeamGameSummaryViewModel) => [
  {
    label: "게임 수",
    value: data.setsPlayed,
    color: "var(--nar-text-secondary)",
    fw: 700,
  },
  {
    label: "승리",
    value: data.setWins,
    color: "var(--nar-text-score)",
    fw: 700,
  },
  {
    label: "패배",
    value: data.setLosses,
    color: "var(--nar-text-2)",
    fw: 700,
  },
  {
    label: "평균 게임 시간",
    // TODO: avgGameTime not in TeamGameSummaryViewModel — request BE to add
    value: "-",
    color: "var(--nar-text-purple)",
    fw: 400,
  },
];

export function GameSummary({ data }: GameSummaryProps) {
  const items = statItems(data);

  return (
    <div className="flex flex-col gap-2">
      <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
        게임 요약
      </Text>
      <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary)">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-7 py-4.5 "
          >
            <Text c="var(--nar-text-secondary)" fz={16} fw={400}>
              {item.label}
            </Text>
            <Text c={item.color} fz={16} fw={item.fw}>
              {item.value}
            </Text>
            {i < items.length - 1 && (
              <div className="hidden sm:block h-full border-l border-(--nar-line)" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
