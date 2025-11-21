// src/components/results/MatchupResults.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Stack,
    Title,
    Paper,
    Group,
    Text,
    Button,
    Avatar,
    Badge,
    Divider,
    SimpleGrid,
    LoadingOverlay,
    Alert,
    ActionIcon
} from '@mantine/core';
import { IconSwords, IconArrowUp, IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useMatchupResults } from '../../hooks/useMatchupResults';
import { IconArrowLeft } from '@tabler/icons-react';

const MatchupResults = ({ champion1, champion2, filters, onBackToSelection }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const queryClient = useQueryClient();

    // 페이징 상태 관리
    const [currentPage, setCurrentPage] = useState(0);
    const [allMatches, setAllMatches] = useState([]);
    const [matchupStats, setMatchupStats] = useState(null);
    const pageSize = 10;

    // 현재 페이지 데이터 fetch
    const { data: matchupData, isLoading, error } = useMatchupResults(
        champion1,
        champion2,
        filters,
        currentPage,
        pageSize
    );

    const filterKey = useMemo(() => {
        return JSON.stringify({
            champion1,
            champion2,
            year: filters.year,
            splitNames: filters.splitNames?.sort() || [],
            leagueNames: filters.leagueNames?.sort() || [],
            teamNames: filters.teamNames?.sort() || [],
            patch: filters.patch
        });
    }, [champion1, champion2, filters]);

    const prevFilterKey = useRef(filterKey);

    useEffect(() => {
        if (prevFilterKey.current !== filterKey) {
            console.log('Filter changed, resetting state');
            setCurrentPage(0);
            setAllMatches([]);
            setMatchupStats(null);
            prevFilterKey.current = filterKey;
        }
    }, [filterKey]);

    // 데이터가 로드되면 누적
    useEffect(() => {
        if (matchupData) {
            if (currentPage === 0) {
                // 첫 페이지면 새로 시작
                setAllMatches(matchupData.content || []);
                setMatchupStats({
                    totalMatches: matchupData.totalMatches,
                    winRateForChampion1: matchupData.winRateForChampion1
                });
            } else {
                // 추가 페이지면 누적
                setAllMatches(prev => [...prev, ...(matchupData.content || [])]);
            }
        }
    }, [matchupData, currentPage]);

    // 더보기 함수
    const loadMore = () => {
        if (matchupData?.hasNext) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // 캐시된 챔피언 데이터 가져오기
    const championData = queryClient.getQueryData(['champions']) || [];
    const championMap = new Map();
    championData.forEach(champion => {
        championMap.set(champion.championNameEn, champion);
    });

    // 포지션 순서 정의
    const positionOrder = { top: 0, jng: 1, mid: 2, bot: 3, sup: 4 };

    // 포지션별로 플레이어 정렬
    const sortPlayersByPosition = (players) => {
        return [...players].sort((a, b) => {
            const posA = positionOrder[a.position] ?? 999;
            const posB = positionOrder[b.position] ?? 999;
            return posA - posB;
        });
    };

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

    // 챔피언 한글 이름 가져오기
    const getChampionKoreanName = (championName) => {
        const championInfo = championMap.get(championName);
        return championInfo?.championNameKr || championName;
    };

    // 게임 시간 포맷팅 함수
    const formatGameTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 최근 경기 날짜 가져오기 함수
    const getLatestGameDate = () => {
        if (allMatches.length === 0) return '-';
        return allMatches[0].gameDate || '-';
    };

    // 초기 로딩 (첫 페이지 로딩)
    if (isLoading && currentPage === 0 && !matchupStats) {
        return (
            <Paper p="md" withBorder radius="md" style={{ position: 'relative', minHeight: '400px' }}>
                <LoadingOverlay visible={true} />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper p="md" withBorder radius="md">
                <Stack gap="md">
                    <Text c="red" ta="center">
                        매치업 데이터를 불러오는데 실패했습니다: {error.message}
                    </Text>
                    <Button onClick={onBackToSelection} variant="light">
                        다시 시도하기
                    </Button>
                </Stack>
            </Paper>
        );
    }

    if (!isLoading && (!matchupStats || matchupStats.totalMatches === 0)) {
        return (
            <Paper p="md" withBorder radius="md">
                <Stack gap="md" align="center" py="xl">
                    <Text size="lg" fw={600} c="dimmed">
                        매치업 데이터가 없습니다
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                        선택한 조건에서 {getChampionKoreanName(champion1)} vs {getChampionKoreanName(champion2)}
                        매치업을 찾을 수 없습니다.
                    </Text>
                    <Button onClick={onBackToSelection} variant="light">
                        다른 조건으로 검색하기
                    </Button>
                </Stack>
            </Paper>
        );
    }

    if (!matchupStats) {
        return (
            <Paper p="md" withBorder radius="md" style={{ position: 'relative', minHeight: '400px' }}>
                <LoadingOverlay visible={true} />
            </Paper>
        );
    }

    const { totalMatches, winRateForChampion1 } = matchupStats;
    const champion2WinRate = (100 - winRateForChampion1).toFixed(1);
    const champion1Won = winRateForChampion1 > 50;

    return (
        <Paper p="md" withBorder radius="md" style={{ position: 'relative' }}>
            <Stack gap="lg">
                {/* 매치업 헤더 - VS 구도 (모바일에서도 좌우 배치) */}
                <Paper p="xl" withBorder radius="md">
                    <Stack gap="xl" align="center">
                        <Group
                            gap={isMobile ? "sm" : "xl"}
                            align="center"
                            justify="center"
                            style={{ width: '100%' }}
                        >
                            {/* Champion 1 - 챔피언 텍스트 색깔 제거, (승)(패) 제거 */}
                            <Stack align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
                                <Avatar
                                    src={getChampionImageUrl(champion1)}
                                    size={isMobile ? 48 : 96}
                                    radius="md"
                                />
                                <Text
                                    size={isMobile ? "sm" : "lg"}
                                    fw={700}
                                    ta="center"
                                    style={{ lineHeight: 1.2 }}
                                >
                                    {getChampionKoreanName(champion1)}
                                </Text>
                                <Badge
                                    size={isMobile ? "md" : "lg"}
                                    color={champion1Won ? "blue" : "red"}
                                    variant="light"
                                >
                                    {winRateForChampion1.toFixed(1)}% 승률
                                </Badge>
                                <Text size="xs" c="dimmed">
                                    {Math.round((totalMatches * winRateForChampion1) / 100)}승
                                </Text>
                            </Stack>

                            {/* VS - 모바일에서도 중앙에 위치 */}
                            <Stack align="center" gap="xs" style={{ flexShrink: 0 }}>
                                <Text size={isMobile ? "sm" : "lg"} fw={700} c="dimmed">
                                    VS
                                </Text>
                            </Stack>

                            {/* Champion 2 - 챔피언 텍스트 색깔 제거, (승)(패) 제거 */}
                            <Stack align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
                                <Avatar
                                    src={getChampionImageUrl(champion2)}
                                    size={isMobile ? 48 : 96}
                                    radius="md"
                                />
                                <Text
                                    size={isMobile ? "sm" : "lg"}
                                    fw={700}
                                    ta="center"
                                    style={{ lineHeight: 1.2 }}
                                >
                                    {getChampionKoreanName(champion2)}
                                </Text>
                                <Badge
                                    size={isMobile ? "md" : "lg"}
                                    color={!champion1Won ? "blue" : "red"}
                                    variant="light"
                                >
                                    {champion2WinRate}% 승률
                                </Badge>
                                <Text size="xs" c="dimmed">
                                    {totalMatches - Math.round((totalMatches * winRateForChampion1) / 100)}승
                                </Text>
                            </Stack>
                        </Group>

                        <Divider w="100%" />

                        {/* 통계 요약 - 최근 경기 텍스트 크기 조정 */}
                        <SimpleGrid cols={isMobile ? 2 : 4} w="100%">
                            <Stack align="center" gap="xs">
                                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                    총 게임수
                                </Text>
                                <Text size="xl" fw={700}>
                                    {totalMatches}
                                </Text>
                            </Stack>

                            <Stack align="center" gap="xs">
                                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                    평균 게임시간
                                </Text>
                                <Text size="xl" fw={700}>
                                    {allMatches.length > 0
                                        ? formatGameTime(Math.round(allMatches.reduce((acc, match) => acc + match.gameLengthSeconds, 0) / allMatches.length))
                                        : '00:00'
                                    }
                                </Text>
                            </Stack>

                            <Stack align="center" gap="xs">
                                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                    최근 경기
                                </Text>
                                <Text size={isMobile ? "md" : "xl"} fw={700}>
                                    {getLatestGameDate()}
                                </Text>
                            </Stack>

                            <Stack align="center" gap="xs">
                                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                    최근 패치
                                </Text>
                                <Text size="xl" fw={700}>
                                    {allMatches.length > 0 ? (allMatches[0]?.patch || '알 수 없음') : '-'}
                                </Text>
                            </Stack>
                        </SimpleGrid>
                    </Stack>
                </Paper>

                {/* 경기 기록 리스트 */}
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Title order={3}>경기 기록</Title>
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                최신순 • 총 {totalMatches}게임 중 {allMatches.length}게임 로드
                            </Text>
                            {/* 돌아가기 버튼 추가 */}
                            <Button
                                size="sm"
                                color="gray"
                                leftSection={<IconArrowLeft size={16} />}
                                onClick={onBackToSelection}
                            >
                                돌아가기
                            </Button>
                        </Group>
                    </Group>

                    <Divider color="#e9ecef" size="sm" />

                    <Stack gap="sm">
                        {allMatches.map((match, index) => {
                            // ✅ 방어코드: 게임 데이터 검증
                            if (!match || !match.ourTeam || !match.opponentTeam) {
                                console.warn(`Invalid game data at index ${index}:`, match);
                                return (
                                    <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                                        <Text size="sm" c="red" ta="center">
                                            게임 데이터가 불완전합니다.
                                        </Text>
                                    </Paper>
                                );
                            }

                            const { ourTeam, opponentTeam } = match;
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

                            // 포지션별로 정렬된 플레이어
                            const sortedBlueTeamPlayers = sortPlayersByPosition(blueTeam?.players || []);
                            const sortedRedTeamPlayers = sortPlayersByPosition(redTeam?.players || []);

                            // 각 팀의 승패 결정
                            const blueTeamWon = (ourTeamIsBlue && weWon) || (!ourTeamIsBlue && !weWon);
                            const redTeamWon = !blueTeamWon;

                            // 헤더 렌더링 함수: 승/패 표시 방식 변경
                            const renderHeader = () => {
                                // ✅ 모든 보조 정보 Text 컴포넌트의 size를 'xs'로 통일합니다.
                                const leaguePatch = (
                                    <Text size="xs" c="dimmed">
                                        {match.league || '알 수 없음'} • {match.patch || '알 수 없음'}
                                    </Text>
                                );

                                const gameTime = (
                                    <Text size="xs" c="dimmed">
                                        {match.gameLengthSeconds ? formatGameTime(match.gameLengthSeconds) : '00:00'}
                                    </Text>
                                );

                                const gameDate = (
                                    <Text size="xs" c="dimmed">
                                        {match.gameDate || '날짜 없음'}
                                    </Text>
                                );

                                if (isMobile) {
                                    // 모바일: 왼쪽 정렬로 변경
                                    return (
                                        <Stack gap="xs">
                                            <Group justify="flex-start" align="center">
                                                <Text size="sm" fw={600}>
                                                    {blueTeamName} vs {redTeamName}
                                                </Text>
                                            </Group>
                                            {/* 이 부분의 Group 구조가 통일성을 보장합니다. */}
                                            <Group justify="space-between" align="center">
                                                {leaguePatch}
                                                <Group gap="xs" align="center">
                                                    {gameTime}
                                                    {gameDate}
                                                </Group>
                                            </Group>
                                        </Stack>
                                    );
                                } else {
                                    // 데스크탑: 한 줄 배치, 승/패 제거
                                    return (
                                        <Group justify="space-between" align="center">
                                            <Group gap="sm">
                                                <Text size="sm" fw={600}>
                                                    {blueTeamName} vs {redTeamName}
                                                </Text>
                                                {leaguePatch}
                                            </Group>
                                            <Group gap="xs">
                                                {gameTime}
                                                {gameDate}
                                            </Group>
                                        </Group>
                                    );
                                }
                            };

                            return (
                                <Paper key={match.gameId} p="sm" bg="#f8f9fa" radius="md">
                                    <Stack gap="xs">
                                        {/* 첫 번째 행: 경기 헤더 (승/패 제거) */}
                                        {renderHeader()}

                                        {/* 두 번째 행: 블루사이드(왼쪽) vs 레드사이드(오른쪽) */}
                                        <Group justify="center" align="flex-start" gap="md">
                                            {/* 블루사이드 (왼쪽) - 포지션별 정렬 */}
                                            <Stack gap="xs" align="center">
                                                {/* 팀 이름에 승/패 표시 추가 - 모든 팀에 승/패 표시 */}
                                                <Text size="xs" fw={600}>
                                                    {blueTeamName}
                                                    <Text component="span" c={blueTeamWon ? "blue" : "gray"} fw={600} ml={4}>
                                                        {blueTeamWon ? "(승)" : "(패)"}
                                                    </Text>
                                                </Text>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {sortedBlueTeamPlayers.length > 0 ? (
                                                        sortedBlueTeamPlayers.map((player, idx) => {
                                                            // 매치업 대상 챔피언인지 확인
                                                            const isMatchupChampion = player.championName === champion1 || player.championName === champion2;

                                                            // 1vs1 매치업에서 이 선수가 이겼는지 확인
                                                            let playerTextColor = 'inherit';
                                                            let borderColor = 'none';

                                                            if (isMatchupChampion) {
                                                                // champion1이 이겼는지 확인
                                                                const champion1Won = match.champion1Won;

                                                                if (player.championName === champion1) {
                                                                    // 이 선수가 champion1을 플레이했을 때
                                                                    playerTextColor = champion1Won ? '#228be6' : '#fa5252'; // 이기면 파란색, 지면 빨간색
                                                                    borderColor = champion1Won ? '#228be6' : '#fa5252';
                                                                } else if (player.championName === champion2) {
                                                                    // 이 선수가 champion2를 플레이했을 때
                                                                    playerTextColor = !champion1Won ? '#228be6' : '#fa5252'; // champion1이 지면 이김(파란색), champion1이 이기면 짐(빨간색)
                                                                    borderColor = !champion1Won ? '#228be6' : '#fa5252';
                                                                }
                                                            }

                                                            return (
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
                                                                        style={{
                                                                            // 매치업 챔피언의 승부에 따라 테두리 색상 적용
                                                                            border: isMatchupChampion ? `2px solid ${borderColor}` : 'none'
                                                                        }}
                                                                    />
                                                                    <Text
                                                                        size="xs"
                                                                        mt={4}
                                                                        style={{
                                                                            textAlign: 'center',
                                                                            width: '100%',
                                                                            whiteSpace: 'nowrap',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            // 매치업 챔피언이면서 승부에 따라 색상 적용, 아니면 기본 스타일
                                                                            fontWeight: isMatchupChampion ? 700 : 400,
                                                                            color: playerTextColor
                                                                        }}
                                                                    >
                                                                        {/* 선수 이름은 영어로 표시 */}
                                                                        {player?.playerName || '알 수 없음'}
                                                                    </Text>
                                                                </div>
                                                            );
                                                        })
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

                                            {/* 레드사이드 (오른쪽) - 포지션별 정렬 */}
                                            <Stack gap="xs" align="center">
                                                {/* 팀 이름에 승/패 표시 추가 - 모든 팀에 승/패 표시 */}
                                                <Text size="xs" fw={600}>
                                                    {redTeamName}
                                                    <Text component="span" c={redTeamWon ? "blue" : "gray"} fw={600} ml={4}>
                                                        {redTeamWon ? "(승)" : "(패)"}
                                                    </Text>
                                                </Text>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {sortedRedTeamPlayers.length > 0 ? (
                                                        sortedRedTeamPlayers.map((player, idx) => {
                                                            // 매치업 대상 챔피언인지 확인
                                                            const isMatchupChampion = player.championName === champion1 || player.championName === champion2;

                                                            // 1vs1 매치업에서 이 선수가 이겼는지 확인
                                                            let playerTextColor = 'inherit';
                                                            let borderColor = 'none';

                                                            if (isMatchupChampion) {
                                                                // champion1이 이겼는지 확인
                                                                const champion1Won = match.champion1Won;

                                                                if (player.championName === champion1) {
                                                                    // 이 선수가 champion1을 플레이했을 때
                                                                    playerTextColor = champion1Won ? '#228be6' : '#fa5252'; // 이기면 파란색, 지면 빨간색
                                                                    borderColor = champion1Won ? '#228be6' : '#fa5252';
                                                                } else if (player.championName === champion2) {
                                                                    // 이 선수가 champion2를 플레이했을 때
                                                                    playerTextColor = !champion1Won ? '#228be6' : '#fa5252'; // champion1이 지면 이김(파란색), champion1이 이기면 짐(빨간색)
                                                                    borderColor = !champion1Won ? '#228be6' : '#fa5252';
                                                                }
                                                            }

                                                            return (
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
                                                                        style={{
                                                                            // 매치업 챔피언의 승부에 따라 테두리 색상 적용
                                                                            border: isMatchupChampion ? `2px solid ${borderColor}` : 'none'
                                                                        }}
                                                                    />
                                                                    <Text
                                                                        size="xs"
                                                                        mt={4}
                                                                        style={{
                                                                            textAlign: 'center',
                                                                            width: '100%',
                                                                            whiteSpace: 'nowrap',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            // 매치업 챔피언이면서 승부에 따라 색상 적용, 아니면 기본 스타일
                                                                            fontWeight: isMatchupChampion ? 700 : 400,
                                                                            color: playerTextColor
                                                                        }}
                                                                    >
                                                                        {/* 선수 이름은 영어로 표시 */}
                                                                        {player?.playerName || '알 수 없음'}
                                                                    </Text>
                                                                </div>
                                                            );
                                                        })
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

                    {/* 더보기 버튼 - CombinationResults와 동일한 스타일 */}
                    {matchupData?.hasNext && (
                        <Group justify="center" mt="md">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="xl"
                                radius="xl"
                                onClick={loadMore}
                                loading={isLoading}
                            >
                                <IconChevronDown size={24} />
                            </ActionIcon>
                        </Group>
                    )}

                    {/* 위로 돌아가기 버튼 */}
                    {allMatches.length > 10 && (
                        <Group justify="center" mt="md">
                            <Button
                                variant="light"
                                size="sm"
                                leftSection={<IconArrowUp size={16} />}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                위로 돌아가기
                            </Button>
                        </Group>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default MatchupResults;
