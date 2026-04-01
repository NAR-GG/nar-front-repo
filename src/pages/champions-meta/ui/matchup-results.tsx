"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Title,
  Button,
  LoadingOverlay,
  Paper,
  Group,
  Pagination,
  Avatar,
  Progress,
  Divider,
  Badge,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import type { Filters } from "@/shared/types/filter.types";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import { sortByPosition } from "@/shared/lib/sort-by-position";
import {
  mapMatchUp1v1DataToViewModel,
  resolveMatchupTeams,
} from "../model/champions-meta.mapper";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { getChampionImageUrl } = useChampionImage();

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
    }),
  );

  const vm = data?.data
    ? mapMatchUp1v1DataToViewModel(data.data, getChampionImageUrl)
    : null;

  const totalPages = Math.ceil((vm?.totalMatches ?? 0) / pageSize);

  const renderHeader = () => {
    const loadText = (
      <Text size="sm" c="dimmed">
        총 {vm?.totalMatches ?? 0}경기
      </Text>
    );

    const backButton = (
      <button className="btn-sm btn-gray" onClick={onBackToSelection}>
        돌아가기
      </button>
    );

    if (isMobile) {
      return (
        <Stack gap="xs">
          <Title order={2} c="dark">
            1v1 매치업 분석
          </Title>
          {loadText}
          <Group justify="flex-end" gap="xs">
            {backButton}
          </Group>
        </Stack>
      );
    }

    return (
      <Group justify="space-between" align="center">
        <Title order={2} c="dark">
          1v1 매치업 분석
        </Title>
        <Group>
          {loadText}
          {backButton}
        </Group>
      </Group>
    );
  };

  if (isError) {
    return (
      <Paper p="md" withBorder radius="md">
        <Stack gap="md">
          <Text c="red" ta="center">
            매치업 데이터를 불러오는데 실패했습니다:{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </Text>
          <Button onClick={onBackToSelection} variant="light">
            다시 시도하기
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      p="md"
      withBorder
      radius="md"
      style={{ position: "relative", minHeight: "400px" }}
    >
      <LoadingOverlay visible={isLoading} />

      {!isLoading && vm && (
        <Stack gap="sm">
          {renderHeader()}

          <Divider color="#e9ecef" size="sm" />

          <Paper p="lg" radius="md" bg="gray.0">
            <Stack gap="md" align="center">
              <Group gap="xl" justify="center" align="center">
                <Stack align="center" gap="xs">
                  <Avatar
                    src={getChampionImageUrl(champion1 ?? "")}
                    size={isMobile ? 56 : 64}
                    radius="md"
                  />
                  <Text fw={600} size={isMobile ? "sm" : "md"}>
                    {champion1}
                  </Text>
                  <Text
                    size={isMobile ? "lg" : "xl"}
                    fw={700}
                    c={vm.champion1WinRatePct >= 50 ? "#5383e8" : "#e84057"}
                  >
                    {vm.champion1WinRatePct}%
                  </Text>
                </Stack>

                <Text size="xl" fw={700} c="dimmed">
                  VS
                </Text>

                <Stack align="center" gap="xs">
                  <Avatar
                    src={getChampionImageUrl(champion2 ?? "")}
                    size={isMobile ? 56 : 64}
                    radius="md"
                  />
                  <Text fw={600} size={isMobile ? "sm" : "md"}>
                    {champion2}
                  </Text>
                  <Text
                    size={isMobile ? "lg" : "xl"}
                    fw={700}
                    c={vm.champion2WinRatePct >= 50 ? "#5383e8" : "#e84057"}
                  >
                    {vm.champion2WinRatePct}%
                  </Text>
                </Stack>
              </Group>

              <Progress.Root size="xl" style={{ width: "100%", height: "28px" }}>
                <Progress.Section
                  value={vm.champion1WinRatePct}
                  color="#5383e8"
                  style={{ borderRadius: "4px 0 0 4px" }}
                >
                  <Progress.Label
                    style={{ color: "white", fontSize: "12px", fontWeight: 600 }}
                  >
                    {vm.champion1WinRatePct}%
                  </Progress.Label>
                </Progress.Section>
                <Progress.Section
                  value={vm.champion2WinRatePct}
                  color="#e84057"
                  style={{ borderRadius: "0 4px 4px 0" }}
                >
                  <Progress.Label
                    style={{ color: "white", fontSize: "12px", fontWeight: 600 }}
                  >
                    {vm.champion2WinRatePct}%
                  </Progress.Label>
                </Progress.Section>
              </Progress.Root>
            </Stack>
          </Paper>

          <Divider color="#e9ecef" size="sm" />

          {vm.games.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              매치 기록이 없습니다.
            </Text>
          ) : (
            <Stack gap="sm">
              {vm.games.map((game, index) => {
                const { champion1Team, champion2Team } = resolveMatchupTeams(
                  game,
                  champion1 ?? "",
                );
                const champion1Won = champion1Team.isWin;

                return (
                  <Paper
                    key={`game-${game.id}-${index}`}
                    p="sm"
                    withBorder
                    radius="sm"
                    style={{
                      backgroundColor: champion1Won
                        ? "rgba(83, 131, 232, 0.05)"
                        : "rgba(232, 64, 87, 0.05)",
                      borderColor: champion1Won
                        ? "rgba(83, 131, 232, 0.3)"
                        : "rgba(232, 64, 87, 0.3)",
                    }}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" align="center">
                        <Group gap="xs">
                          <Badge
                            color={champion1Won ? "blue" : "red"}
                            variant="filled"
                            size="sm"
                          >
                            {champion1Won ? "승리" : "패배"}
                          </Badge>
                          <Text size="sm" fw={500}>
                            Game {game.gameNumber}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {game.formattedGameLength}
                        </Text>
                      </Group>

                      <Divider size="xs" />

                      {isMobile ? (
                        <Stack gap="xs">
                          <Stack gap={4}>
                            <Group gap="xs">
                              <Text
                                size="sm"
                                fw={600}
                                c={champion1Team.isWin ? "#5383e8" : "#e84057"}
                              >
                                {champion1Team.teamName}
                              </Text>
                              <Badge size="xs" variant="light" color="blue">
                                {champion1}
                              </Badge>
                            </Group>
                            <Group gap={4}>
                              {sortByPosition(champion1Team.players).map(
                                (player, idx) => (
                                  <Avatar
                                    key={idx}
                                    src={player.championImageUrl}
                                    size={28}
                                    radius="sm"
                                    style={{
                                      border:
                                        player.championName === champion1
                                          ? "2px solid #5383e8"
                                          : "1px solid #e9ecef",
                                    }}
                                  />
                                ),
                              )}
                            </Group>
                          </Stack>

                          <Text size="xs" c="dimmed" ta="center">
                            vs
                          </Text>

                          <Stack gap={4}>
                            <Group gap="xs">
                              <Text
                                size="sm"
                                fw={600}
                                c={champion2Team.isWin ? "#5383e8" : "#e84057"}
                              >
                                {champion2Team.teamName}
                              </Text>
                              <Badge size="xs" variant="light" color="red">
                                {champion2}
                              </Badge>
                            </Group>
                            <Group gap={4}>
                              {sortByPosition(champion2Team.players).map(
                                (player, idx) => (
                                  <Avatar
                                    key={idx}
                                    src={player.championImageUrl}
                                    size={28}
                                    radius="sm"
                                    style={{
                                      border:
                                        player.championName === champion2
                                          ? "2px solid #e84057"
                                          : "1px solid #e9ecef",
                                    }}
                                  />
                                ),
                              )}
                            </Group>
                          </Stack>
                        </Stack>
                      ) : (
                        <Group
                          justify="space-between"
                          align="flex-start"
                          wrap="nowrap"
                        >
                          <Stack gap={4} style={{ flex: 1 }}>
                            <Group gap="xs">
                              <Text
                                size="sm"
                                fw={600}
                                c={champion1Team.isWin ? "#5383e8" : "#e84057"}
                              >
                                {champion1Team.teamName}
                              </Text>
                              <Badge size="xs" variant="light" color="blue">
                                {champion1}
                              </Badge>
                            </Group>
                            <Group gap={6}>
                              {sortByPosition(champion1Team.players).map(
                                (player, idx) => (
                                  <Group key={idx} gap={4} wrap="nowrap">
                                    <Avatar
                                      src={player.championImageUrl}
                                      size={32}
                                      radius="sm"
                                      style={{
                                        border:
                                          player.championName === champion1
                                            ? "2px solid #5383e8"
                                            : "1px solid #e9ecef",
                                      }}
                                    />
                                    <Text
                                      size="xs"
                                      c={
                                        player.championName === champion1
                                          ? "blue"
                                          : "dimmed"
                                      }
                                      fw={
                                        player.championName === champion1
                                          ? 600
                                          : 400
                                      }
                                    >
                                      {player.playerName}
                                    </Text>
                                  </Group>
                                ),
                              )}
                            </Group>
                          </Stack>

                          <Text
                            size="sm"
                            c="dimmed"
                            style={{ alignSelf: "center" }}
                          >
                            vs
                          </Text>

                          <Stack gap={4} style={{ flex: 1 }} align="flex-end">
                            <Group gap="xs">
                              <Badge size="xs" variant="light" color="red">
                                {champion2}
                              </Badge>
                              <Text
                                size="sm"
                                fw={600}
                                c={champion2Team.isWin ? "#5383e8" : "#e84057"}
                              >
                                {champion2Team.teamName}
                              </Text>
                            </Group>
                            <Group gap={6} justify="flex-end">
                              {sortByPosition(champion2Team.players).map(
                                (player, idx) => (
                                  <Group key={idx} gap={4} wrap="nowrap">
                                    <Text
                                      size="xs"
                                      c={
                                        player.championName === champion2
                                          ? "red"
                                          : "dimmed"
                                      }
                                      fw={
                                        player.championName === champion2
                                          ? 600
                                          : 400
                                      }
                                    >
                                      {player.playerName}
                                    </Text>
                                    <Avatar
                                      src={player.championImageUrl}
                                      size={32}
                                      radius="sm"
                                      style={{
                                        border:
                                          player.championName === champion2
                                            ? "2px solid #e84057"
                                            : "1px solid #e9ecef",
                                      }}
                                    />
                                  </Group>
                                ),
                              )}
                            </Group>
                          </Stack>
                        </Group>
                      )}
                    </Stack>
                  </Paper>
                );
              })}
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
      )}
    </Paper>
  );
}
