// src/components/detail/MatchHistory.jsx
import React from 'react';
import { Stack, Group, Text, Badge, Paper, Avatar } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';

const MatchHistory = ({ champions, gameDetails }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const queryClient = useQueryClient();

    if (!gameDetails || gameDetails.length === 0) {
        return (
            <Text size="sm" c="dimmed" ta="center" py="sm">
                매치 기록이 없습니다.
            </Text>
        );
    }

    // 캐시된 챔피언 데이터 가져오기
    const championData = queryClient.getQueryData(['champions']) || [];

    // 챔피언 이름으로 빠른 검색을 위한 Map 생성
    const championMap = new Map();
    championData.forEach(champion => {
        championMap.set(champion.championNameEn, champion);
    });

    // 챔피언 이미지 URL 가져오기 함수
    const getChampionImageUrl = (championName) => {
        const championInfo = championMap.get(championName);
        if (championInfo?.imageUrl) {
            return championInfo.imageUrl;
        }

        const imageNameMap = {
            'Drmundo': 'DrMundo',
            'Jarvaniv': 'JarvanIV',
            'Kogmaw': 'KogMaw',
            'Leesin': 'LeeSin',
            'Masteryi': 'MasterYi',
            'Missfortune': 'MissFortune',
            'Monkeyking': 'MonkeyKing',
            'Twistedfate': 'TwistedFate',
            'Velkoz': 'Velkoz',
            'Xinzhao': 'XinZhao'
        };

        const imageName = imageNameMap[championName] || championName;
        return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${imageName}.png`;
    };

    // 게임 시간 포맷팅 함수
    const formatGameTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Stack gap="xs" mt="sm">
            <Text size="sm" fw={600} c="dimmed" mb="xs">
                플레이 기록 ({gameDetails.length}게임)
            </Text>

            <Stack gap="sm">
                {gameDetails.map((game, index) => {
                    // ✅ 방어코드: 게임 데이터 검증
                    if (!game || !game.ourTeam || !game.opponentTeam) {
                        console.warn(`Invalid game data at index ${index}:`, game);
                        return (
                            <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                                <Text size="sm" c="red" ta="center">
                                    게임 데이터가 불완전합니다.
                                </Text>
                            </Paper>
                        );
                    }

                    const { ourTeam, opponentTeam } = game;
                    const weWon = ourTeam?.isWin ?? false;

                    // ✅ 방어코드: 팀 사이드 정보 검증
                    const ourTeamSide = ourTeam?.side;
                    const opponentTeamSide = opponentTeam?.side;

                    if (!ourTeamSide || !opponentTeamSide) {
                        console.warn(`Missing team side data for game ${index}:`, { ourTeamSide, opponentTeamSide });
                        return (
                            <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                                <Text size="sm" c="red" ta="center">
                                    팀 사이드 정보가 없습니다.
                                </Text>
                            </Paper>
                        );
                    }

                    // ✅ 방어코드: 블루/레드 팀 할당
                    const blueTeam = ourTeamSide === 'Blue' ? ourTeam : opponentTeam;
                    const redTeam = ourTeamSide === 'Red' ? ourTeam : opponentTeam;
                    const ourTeamIsBlue = ourTeamSide === 'Blue';

                    // ✅ 방어코드: 팀 이름 검증
                    const blueTeamName = blueTeam?.teamName || '알 수 없는 팀';
                    const redTeamName = redTeam?.teamName || '알 수 없는 팀';

                    return (
                        <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                            <Stack gap="xs">
                                {/* 첫 번째 행: 경기 헤더 */}
                                <Group justify="space-between" align="center">
                                    <Group gap="sm">
                                        <Text size="sm" fw={600}>
                                            {ourTeamIsBlue ? (
                                                <>
                                                    <Text
                                                        component="span"
                                                        fw={700}
                                                        style={{
                                                            backgroundColor: weWon ? '#2196f3' : '#f44336',
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        {blueTeamName}
                                                    </Text>
                                                    {' vs '}
                                                    <Text component="span" c="black" fw={600}>
                                                        {redTeamName}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text component="span" c="black" fw={600}>
                                                        {blueTeamName}
                                                    </Text>
                                                    {' vs '}
                                                    <Text
                                                        component="span"
                                                        fw={700}
                                                        style={{
                                                            backgroundColor: weWon ? '#2196f3' : '#f44336',
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        {redTeamName}
                                                    </Text>
                                                </>
                                            )}
                                        </Text>
                                        <Badge
                                            size="sm"
                                            color={weWon ? 'blue' : 'red'}
                                            variant="filled"
                                        >
                                            {weWon ? '승리' : '패배'}
                                        </Badge>
                                        <Text size="xs" c="dimmed">
                                            {game.league || '알 수 없음'} • {game.patch || '알 수 없음'}
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Text size="xs" c="dimmed">
                                            {game.gameLengthSeconds ? formatGameTime(game.gameLengthSeconds) : '00:00'}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {game.gameDate || '날짜 없음'}
                                        </Text>
                                    </Group>
                                </Group>

                                {/* 두 번째 행: 블루사이드(왼쪽) vs 레드사이드(오른쪽) */}
                                <Group justify="center" align="flex-start" gap="md">
                                    {/* 블루사이드 (왼쪽) */}
                                    <Stack gap="xs" align="center">
                                        <Text size="xs" fw={600}>
                                            {blueTeamName}
                                        </Text>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* ✅ 방어코드: 플레이어 배열 검증 */}
                                            {(blueTeam?.players || []).length > 0 ? (
                                                blueTeam.players.map((player, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        width: '50px'
                                                    }}>
                                                        <Avatar
                                                            src={getChampionImageUrl(player?.championName || '')}
                                                            size={40}
                                                            radius="md"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            mt={4}
                                                            style={{
                                                                textAlign: 'center',
                                                                width: '100%',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {player?.playerName || '알 수 없음'}
                                                        </Text>
                                                    </div>
                                                ))
                                            ) : (
                                                <Text size="xs" c="dimmed">플레이어 정보 없음</Text>
                                            )}
                                        </div>
                                    </Stack>

                                    {/* VS */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '40px',
                                        paddingTop: '20px'
                                    }}>
                                        <Text size="sm" fw={600} c="dimmed">
                                            vs
                                        </Text>
                                    </div>

                                    {/* 레드사이드 (오른쪽) */}
                                    <Stack gap="xs" align="center">
                                        <Text size="xs" fw={600}>
                                            {redTeamName}
                                        </Text>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* ✅ 방어코드: 플레이어 배열 검증 */}
                                            {(redTeam?.players || []).length > 0 ? (
                                                redTeam.players.map((player, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        width: '50px'
                                                    }}>
                                                        <Avatar
                                                            src={getChampionImageUrl(player?.championName || '')}
                                                            size={40}
                                                            radius="md"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            mt={4}
                                                            style={{
                                                                textAlign: 'center',
                                                                width: '100%',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {player?.playerName || '알 수 없음'}
                                                        </Text>
                                                    </div>
                                                ))
                                            ) : (
                                                <Text size="xs" c="dimmed">플레이어 정보 없음</Text>
                                            )}
                                        </div>
                                    </Stack>
                                </Group>
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>
        </Stack>
    );
};

export default MatchHistory;
