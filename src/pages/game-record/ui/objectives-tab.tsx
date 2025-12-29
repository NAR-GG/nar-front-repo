"use client";

import { Paper, Stack, Title, Grid, Text, Divider } from "@mantine/core";

interface TeamStats {
  dragons: number;
  heralds: number;
  barons: number;
  elders: number;
  voidGrubs: number;
  infernals: number;
  mountains: number;
  clouds: number;
  oceans: number;
  chemtechs: number;
  hextechs: number;
  towers: number;
  inhibitors: number;
  turretPlates: number;
}

interface TeamData {
  name: string;
  stats: TeamStats;
}

interface ObjectivesTabProps {
  blueTeam: TeamData;
  redTeam: TeamData;
}

interface ObjectiveRowProps {
  label: string;
  blue: number;
  red: number;
}

function ObjectiveRow({ label, blue, red }: ObjectiveRowProps) {
  return (
    <Grid align="center" gutter="xs">
      <Grid.Col span={5}>
        <Text
          ta="right"
          fw={blue > red ? 700 : 400}
          c={blue > red ? "dark" : "dimmed"}
        >
          {blue}
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <Text ta="center" c="dimmed" size="sm">
          {label}
        </Text>
      </Grid.Col>
      <Grid.Col span={5}>
        <Text
          ta="left"
          fw={red > blue ? 700 : 400}
          c={red > blue ? "dark" : "dimmed"}
        >
          {red}
        </Text>
      </Grid.Col>
    </Grid>
  );
}

export function ObjectivesTab({ blueTeam, redTeam }: ObjectivesTabProps) {
  const majorObjectives = [
    {
      label: "드래곤",
      blue: blueTeam.stats.dragons,
      red: redTeam.stats.dragons,
    },
    { label: "전령", blue: blueTeam.stats.heralds, red: redTeam.stats.heralds },
    { label: "바론", blue: blueTeam.stats.barons, red: redTeam.stats.barons },
    { label: "장로", blue: blueTeam.stats.elders, red: redTeam.stats.elders },
    {
      label: "공허 유충",
      blue: blueTeam.stats.voidGrubs,
      red: redTeam.stats.voidGrubs,
    },
  ];

  const elementalDrakes = [
    {
      label: "화염",
      blue: blueTeam.stats.infernals,
      red: redTeam.stats.infernals,
    },
    {
      label: "산악",
      blue: blueTeam.stats.mountains,
      red: redTeam.stats.mountains,
    },
    { label: "바람", blue: blueTeam.stats.clouds, red: redTeam.stats.clouds },
    { label: "대양", blue: blueTeam.stats.oceans, red: redTeam.stats.oceans },
    {
      label: "화공",
      blue: blueTeam.stats.chemtechs,
      red: redTeam.stats.chemtechs,
    },
    {
      label: "마공",
      blue: blueTeam.stats.hextechs,
      red: redTeam.stats.hextechs,
    },
  ].filter((drake) => drake.blue > 0 || drake.red > 0);

  const structures = [
    { label: "타워", blue: blueTeam.stats.towers, red: redTeam.stats.towers },
    {
      label: "억제기",
      blue: blueTeam.stats.inhibitors,
      red: redTeam.stats.inhibitors,
    },
    {
      label: "타워 플레이트",
      blue: blueTeam.stats.turretPlates,
      red: redTeam.stats.turretPlates,
    },
  ];

  return (
    <Stack gap="lg" mt="lg">
      <Paper p="lg" withBorder radius="md">
        <Title order={3} mb="lg" ta="center">
          오브젝트 상세
        </Title>

        <Grid>
          <Grid.Col span={5}>
            <Text ta="right" fw={700} c="blue">
              {blueTeam.name}
            </Text>
          </Grid.Col>
          <Grid.Col span={2}></Grid.Col>
          <Grid.Col span={5}>
            <Text ta="left" fw={700} c="red">
              {redTeam.name}
            </Text>
          </Grid.Col>
        </Grid>

        <Divider my="sm" />

        <Stack gap="sm">
          <Text size="sm" fw={500} c="dimmed" ta="center">
            주요 오브젝트
          </Text>
          {majorObjectives.map((obj) => (
            <ObjectiveRow key={obj.label} {...obj} />
          ))}
        </Stack>

        <Divider my="md" label="구조물" labelPosition="center" />

        <Stack gap="sm">
          {structures.map((obj) => (
            <ObjectiveRow key={obj.label} {...obj} />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
