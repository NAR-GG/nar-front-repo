"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Button,
  LoadingOverlay,
  Paper,
  Group,
  Pagination,
  Avatar,
  Progress,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import type { GameDetail } from "@/entities/combinations/model/combinations.dto";
import type { Filters } from "../model/types";

interface MatchupResultsProps {
  champion1?: string;
  champion2?: string;
  filters: Filters;
  onBackToSelection: () => void;
}

export function MatchupResults({
  champion1,
  champion2,
  filters,
  onBackToSelection,
}: MatchupResultsProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useQuery(
    combinationsQueries.matchUp1v1({
      champion1: champion1 ?? "",
      champion2: champion2 ?? "",
      year: filters.year,
      splits: filters.splitNames.length > 0 ? filters.splitNames : undefined,
      leagueNames:
        filters.leagueNames.length > 0 ? filters.leagueNames : undefined,
      teamNames: filters.teamNames.length > 0 ? filters.teamNames : undefined,
      patch: filters.patch ?? undefined,
      page: page - 1,
      size: pageSize,
    })
  );

  const gameDetails = data?.data?.content ?? [];
  const totalCount = data?.data?.totalMatches ?? 0;
  const winRateForChampion1 = data?.data?.winRateForChampion1 ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const champion1WinRate = Math.round(winRateForChampion1 * 100);
  const champion2WinRate = 100 - champion1WinRate;

  if (isLoading) {
    return (
      <div style={{ position: "relative", minHeight: "200px" }}>
        <LoadingOverlay
          visible={true}
          transitionProps={{ transition: "fade", duration: 150 }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <Stack gap="md" align="center">
        <Text c="red">
          오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
        </Text>
        <Button variant="light" onClick={onBackToSelection}>
          다시 검색하기
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBackToSelection}
        >
          챔피언 선택으로 돌아가기
        </Button>
        <Text size="sm" c="dimmed">
          총 {totalCount}경기
        </Text>
      </Group>

      <Paper p="lg" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Group gap="xl" justify="center" align="center">
            <Stack align="center" gap="xs">
              <Avatar
                src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion1}.png`}
                size={64}
                radius="md"
              />
              <Text fw={600}>{champion1}</Text>
              <Text
                size="xl"
                fw={700}
                c={champion1WinRate >= 50 ? "#5383e8" : "#e84057"}
              >
                {champion1WinRate}%
              </Text>
            </Stack>

            <Text size="xl" fw={700} c="dimmed">
              VS
            </Text>

            <Stack align="center" gap="xs">
              <Avatar
                src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion2}.png`}
                size={64}
                radius="md"
              />
              <Text fw={600}>{champion2}</Text>
              <Text
                size="xl"
                fw={700}
                c={champion2WinRate >= 50 ? "#5383e8" : "#e84057"}
              >
                {champion2WinRate}%
              </Text>
            </Stack>
          </Group>

          <Progress.Root size="xl" style={{ width: "100%", height: "28px" }}>
            <Progress.Section
              value={champion1WinRate}
              color="#5383e8"
              style={{ borderRadius: "4px 0 0 4px" }}
            >
              <Progress.Label
                style={{ color: "white", fontSize: "12px", fontWeight: 600 }}
              >
                {champion1WinRate}%
              </Progress.Label>
            </Progress.Section>
            <Progress.Section
              value={champion2WinRate}
              color="#e84057"
              style={{ borderRadius: "0 4px 4px 0" }}
            >
              <Progress.Label
                style={{ color: "white", fontSize: "12px", fontWeight: 600 }}
              >
                {champion2WinRate}%
              </Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Stack>
      </Paper>

      {gameDetails.length === 0 ? (
        <Text ta="center" c="dimmed" py="xl">
          매치 기록이 없습니다.
        </Text>
      ) : (
        <Stack gap="sm">
          <Text fw={600}>매치 기록</Text>
          {gameDetails.map((game: GameDetail) => (
            <Paper key={game.id} p="md" radius="md" withBorder>
              <Group justify="space-between" align="center">
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Game {game.gameNumber}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {Math.floor(game.gameLengthSeconds / 60)}분{" "}
                    {game.gameLengthSeconds % 60}초
                  </Text>
                </Stack>

                {game.blueTeam && game.redTeam && (
                  <Group gap="lg">
                    <Stack align="center" gap={4}>
                      <Text
                        size="sm"
                        fw={600}
                        c={game.blueTeam.isWin ? "#5383e8" : "#e84057"}
                      >
                        {game.blueTeam.teamName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {game.blueTeam.isWin ? "승리" : "패배"}
                      </Text>
                    </Stack>

                    <Text c="dimmed">vs</Text>

                    <Stack align="center" gap={4}>
                      <Text
                        size="sm"
                        fw={600}
                        c={game.redTeam.isWin ? "#5383e8" : "#e84057"}
                      >
                        {game.redTeam.teamName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {game.redTeam.isWin ? "승리" : "패배"}
                      </Text>
                    </Stack>
                  </Group>
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      )}
    </Stack>
  );
}
