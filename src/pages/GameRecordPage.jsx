// src/pages/GameRecordPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {Container, Stack, Paper, Tabs, ScrollArea} from '@mantine/core';

// Mock 데이터 (실제로는 API 호출로 대체)
import { gameData as mockGameData } from '../mock/gameData';

// ✨ 역할과 책임에 따라 분리된 컴포넌트 import
import GameHeader from '../components/game-record/GameHeader';
import OverviewTab from '../components/game-record/OverviewTab';
import PlayersTab from '../components/game-record/PlayersTab';
import ObjectivesTab from '../components/game-record/ObjectivesTab';
import TimelineAnalysisTab from '../components/game-record/TimelineAnalysisTab';
import { useGameDataProcessor } from '../hooks/useGameDataProcessor';

const GameRecordPage = () => {
    const { gameId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    const { gameInfo, blueTeam, redTeam } = useGameDataProcessor(mockGameData);

    const gameLengthInMin = gameInfo.gamelength / 60;

    return (
        <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
            <Stack gap="lg" mt="md">
                {/* 헤더 */}
                <GameHeader
                    gameInfo={gameInfo}
                    blueTeam={blueTeam}
                    redTeam={redTeam}
                />

                {/* 탭 메뉴 */}
                <Tabs value={activeTab} onChange={setActiveTab}>
                    {/* ✅ Tabs.List를 ScrollArea로 감쌉니다. */}
                    <ScrollArea
                        pb="xs"
                        scrollbarSize={4}
                        scrollHideDelay={300}
                    >
                        {/* ✅ whiteSpace 스타일을 추가하여 탭이 한 줄로 유지되도록 합니다. */}
                        <Tabs.List style={{ flexWrap: 'nowrap' }}>
                            <Tabs.Tab value="overview">경기 개요</Tabs.Tab>
                            <Tabs.Tab value="players">선수 기록</Tabs.Tab>
                            <Tabs.Tab value="objectives">오브젝트</Tabs.Tab>
                            <Tabs.Tab value="timeline">타임라인 분석</Tabs.Tab>
                        </Tabs.List>
                    </ScrollArea>

                    {/* Tabs.Panel 부분은 그대로 둡니다. */}
                    <Tabs.Panel value="overview">
                        <OverviewTab blueTeam={blueTeam} redTeam={redTeam} />
                    </Tabs.Panel>
                    <Tabs.Panel value="players">
                        <PlayersTab
                            blueTeam={blueTeam}
                            redTeam={redTeam}
                            gameLengthInMin={gameLengthInMin}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="objectives">
                        <ObjectivesTab
                            blueTeam={blueTeam}
                            redTeam={redTeam}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="timeline">
                        <TimelineAnalysisTab gameData={mockGameData} />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    );
};

export default GameRecordPage;