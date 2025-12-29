"use client";

import { useState } from "react";
import {
  Container,
  Stack,
  Tabs,
  ScrollArea,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { gamesQueries } from "@/entities/games/model/games.queries";
import { useGameDataProcessor } from "../model/use-game-data-processor";
import { GameHeader } from "./game-header";
import { OverviewTab } from "./overview-tab";
import { PlayersTab } from "./players-tab";
import { ObjectivesTab } from "./objectives-tab";
import { TimelineAnalysisTab } from "./timeline-analysis-tab";

interface GameRecordPageProps {
  gameId: string;
}

export function GameRecordPage({ gameId }: GameRecordPageProps) {
  const [activeTab, setActiveTab] = useState<string | null>("overview");

  const {
    data: gameData,
    isLoading,
    isError,
    error,
  } = useQuery(gamesQueries.detail(gameId));

  const { gameInfo, blueTeam, redTeam, getChampionImageUrl } =
    useGameDataProcessor(gameData);

  if (isLoading) {
    return (
      <Container
        size="xl"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Loader />
      </Container>
    );
  }

  if (isError || !gameInfo || !blueTeam || !redTeam) {
    return (
      <Container size="xl" pt="lg">
        <Center>
          <Text c="red">
            데이터 조회 중 에러가 발생했거나 데이터가 없습니다:{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </Text>
        </Center>
      </Container>
    );
  }

  const gameLengthInMin = gameInfo.gamelength / 60;

  return (
    <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
      <Stack gap="lg" mt="md">
        <GameHeader
          gameInfo={gameInfo}
          blueTeam={blueTeam}
          redTeam={redTeam}
          getChampionImageUrl={getChampionImageUrl}
        />

        <Tabs value={activeTab} onChange={setActiveTab} mt="md">
          <ScrollArea pb="xs" scrollbarSize={4} type="auto">
            <Tabs.List style={{ flexWrap: "nowrap", minWidth: "max-content" }}>
              <Tabs.Tab value="overview">경기 개요</Tabs.Tab>
              <Tabs.Tab value="players">선수 기록</Tabs.Tab>
              <Tabs.Tab value="objectives">오브젝트</Tabs.Tab>
              <Tabs.Tab value="timeline">타임라인 분석</Tabs.Tab>
            </Tabs.List>
          </ScrollArea>

          <Tabs.Panel value="overview" pt="md">
            <OverviewTab blueTeam={blueTeam} redTeam={redTeam} />
          </Tabs.Panel>
          <Tabs.Panel value="players" pt="md">
            <PlayersTab
              blueTeam={blueTeam}
              redTeam={redTeam}
              gameLengthInMin={gameLengthInMin}
              getChampionImageUrl={getChampionImageUrl}
            />
          </Tabs.Panel>
          <Tabs.Panel value="objectives" pt="md">
            <ObjectivesTab blueTeam={blueTeam} redTeam={redTeam} />
          </Tabs.Panel>
          <Tabs.Panel value="timeline" pt="md">
            {gameData && (
              <TimelineAnalysisTab
                gameData={gameData}
                getChampionImageUrl={getChampionImageUrl}
              />
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
