"use client";

import { Stack, Paper, Title } from "@mantine/core";
import { StatComparisonBar } from "./stat-comparison-bar";

interface TeamStats {
  kills: number;
  totalGold: number;
  totalDamage: number;
  visionScore: number;
  dragons: number;
  barons: number;
  heralds: number;
  towers: number;
  inhibitors: number;
  voidGrubs: number;
  firstDragon: boolean;
  firstBaron: boolean;
  firstHerald: boolean;
  firstTower: boolean;
}

interface TeamData {
  name: string;
  stats: TeamStats;
}

interface OverviewTabProps {
  blueTeam: TeamData;
  redTeam: TeamData;
}

export function OverviewTab({ blueTeam, redTeam }: OverviewTabProps) {
  if (!blueTeam?.stats || !redTeam?.stats) return null;

  const formatK = (v: number) => `${((v || 0) / 1000).toFixed(1)}K`;

  const teamStats = [
    { label: "킬", blue: blueTeam.stats.kills, red: redTeam.stats.kills },
    {
      label: "골드",
      blue: blueTeam.stats.totalGold,
      red: redTeam.stats.totalGold,
      format: formatK,
    },
    {
      label: "데미지",
      blue: blueTeam.stats.totalDamage,
      red: redTeam.stats.totalDamage,
      format: formatK,
    },
    {
      label: "시야 점수",
      blue: blueTeam.stats.visionScore,
      red: redTeam.stats.visionScore,
    },
  ];

  const objectiveStats = [
    {
      label: "드래곤",
      blue: blueTeam.stats.dragons,
      red: redTeam.stats.dragons,
      first: blueTeam.stats.firstDragon
        ? "blue"
        : redTeam.stats.firstDragon
          ? "red"
          : null,
    },
    {
      label: "바론",
      blue: blueTeam.stats.barons,
      red: redTeam.stats.barons,
      first: blueTeam.stats.firstBaron
        ? "blue"
        : redTeam.stats.firstBaron
          ? "red"
          : null,
    },
    {
      label: "전령",
      blue: blueTeam.stats.heralds,
      red: redTeam.stats.heralds,
      first: blueTeam.stats.firstHerald
        ? "blue"
        : redTeam.stats.firstHerald
          ? "red"
          : null,
    },
    {
      label: "타워",
      blue: blueTeam.stats.towers,
      red: redTeam.stats.towers,
      first: blueTeam.stats.firstTower
        ? "blue"
        : redTeam.stats.firstTower
          ? "red"
          : null,
    },
    {
      label: "억제기",
      blue: blueTeam.stats.inhibitors,
      red: redTeam.stats.inhibitors,
    },
    {
      label: "공허 유충",
      blue: blueTeam.stats.voidGrubs,
      red: redTeam.stats.voidGrubs,
    },
  ];

  return (
    <Stack gap="lg" mt="lg">
      <Paper p={{ base: "md", sm: "lg" }} withBorder radius="sm">
        <Title order={3} mb="lg" ta="center">
          팀 스탯 비교
        </Title>
        <Stack gap="xl">
          {teamStats.map((stat) => (
            <StatComparisonBar
              key={stat.label}
              label={stat.label}
              blueValue={stat.blue}
              redValue={stat.red}
              format={stat.format}
            />
          ))}
        </Stack>
      </Paper>

      <Paper p={{ base: "md", sm: "lg" }} withBorder radius="sm">
        <Title order={3} mb="lg" ta="center">
          오브젝트 관리
        </Title>
        <Stack gap="xl">
          {objectiveStats.map((obj) => (
            <StatComparisonBar
              key={obj.label}
              label={obj.label}
              blueValue={obj.blue}
              redValue={obj.red}
              firstObjectiveSide={obj.first as "blue" | "red" | null}
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
