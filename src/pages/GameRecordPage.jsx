// src/pages/GameRecordPage.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack, Tabs, ScrollArea, Loader, Center, Text } from '@mantine/core';
import { IconChartBar, IconUsers, IconTimeline, IconBan } from '@tabler/icons-react';

// ... (다른 컴포넌트 및 훅 import는 동일)
import GameHeader from '../components/game-record/GameHeader';
import OverviewTab from '../components/game-record/OverviewTab';
import PlayersTab from '../components/game-record/PlayersTab';
import ObjectivesTab from '../components/game-record/ObjectivesTab';
import TimelineAnalysisTab from '../components/game-record/TimelineAnalysisTab';
import { useGameRecord } from '../hooks/useGameRecord';
import { useGameDataProcessor } from '../hooks/useGameDataProcessor';


const GameRecordPage = () => {
    const { gameId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: gameData, loading, error } = useGameRecord(gameId);
    const { gameInfo, blueTeam, redTeam, getChampionImageUrl } = useGameDataProcessor(gameData);

    if (loading) {
        return <Container size="xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Loader /></Container>;
    }

    if (error || !gameInfo) {
        return <Container size="xl" pt="lg"><Center><Text c="red">데이터 조회 중 에러가 발생했거나 데이터가 없습니다: {error}</Text></Center></Container>;
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
                        {/* ✅ [수정] Tabs.List에 minWidth 스타일을 추가하여 스크롤을 활성화합니다. */}
                        <Tabs.List style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
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
                        <ObjectivesTab
                            blueTeam={blueTeam}
                            redTeam={redTeam}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="timeline" pt="md">
                        <TimelineAnalysisTab
                            gameData={gameData}
                            getChampionImageUrl={getChampionImageUrl}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    );
};

export default GameRecordPage;