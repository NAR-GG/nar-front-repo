import React, { useState } from 'react';
import {
    Stack, Paper, Title, Group, Text, Card, SimpleGrid, Table,
    ScrollArea, Select, Badge, Avatar, Box, SegmentedControl
} from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

const TIME_SELECTOR_DATA = [
    { label: '10분', value: '10' },
    { label: '15분', value: '15' },
    { label: '20분', value: '20' },
    { label: '25분', value: '25' },
];


const TimelineAnalysisTab = ({ gameData }) => {
    const [selectedPosition, setSelectedPosition] = useState('전체');
    const [selectedMetric, setSelectedMetric] = useState('gold');
    const [selectedTime, setSelectedTime] = useState('25');

    const positions = ['전체', 'top', 'jungle', 'mid', 'bot', 'support'];
    const metrics = [
        { value: 'gold', label: '골드' },
        { value: 'xp', label: '경험치' },
        { value: 'cs', label: 'CS' },
        { value: 'kills', label: '킬' }
    ];

    const timePoints = [10, 15, 20, 25];

    // gameData가 없는 경우 기본값 제공
    if (!gameData) {
        return (
            <Stack gap="lg" mt="lg">
                <Paper p="lg" withBorder>
                    <Text ta="center" c="dimmed">
                        게임 데이터를 불러오는 중입니다...
                    </Text>
                </Paper>
            </Stack>
        );
    }

    // 팀별 데이터 분리
    const blueTeamPlayers = gameData.players?.filter(p => p.side === 'blue') || [];
    const redTeamPlayers = gameData.players?.filter(p => p.side === 'red') || [];

    const blueTeamName = blueTeamPlayers[0]?.teamname || gameData.blueTeam?.name || 'Blue Team';
    const redTeamName = redTeamPlayers[0]?.teamname || gameData.redTeam?.name || 'Red Team';

    // selectedPosition null 체크 추가
    const safeSelectedPosition = selectedPosition || '전체';

    // 포지션별 데이터 필터링
    const getFilteredData = (position) => {
        if (position === '전체') {
            return { blue: blueTeamPlayers, red: redTeamPlayers };
        }
        return {
            blue: blueTeamPlayers.filter(p => p.position === position),
            red: redTeamPlayers.filter(p => p.position === position)
        };
    };

    const filteredData = getFilteredData(safeSelectedPosition);

    // 시간대별 지표 계산
    const calculateTimelineData = (players, metric, timePoint) => {
        if (!players || players.length === 0) return 0;

        if (safeSelectedPosition === '전체') {
            // 팀 전체 합계
            return players.reduce((sum, player) => {
                const key = `${metric}at${timePoint}`;
                return sum + (player[key] || 0);
            }, 0);
        } else {
            // 개별 선수
            const player = players[0];
            if (!player) return 0;
            return player[`${metric}at${timePoint}`] || 0;
        }
    };

    // 차트 데이터 생성 (짧은 팀 이름 사용)
    const generateChartData = () => {
        return timePoints.map(time => {
            const blueValue = calculateTimelineData(filteredData.blue, selectedMetric, time);
            const redValue = calculateTimelineData(filteredData.red, selectedMetric, time);

            return {
                time: `${time}분`,
                [blueTeamName]: blueValue,
                [redTeamName]: redValue
            };
        });
    };

    // 차이 계산
    const calculateDifference = (timePoint) => {
        const blueValue = calculateTimelineData(filteredData.blue, selectedMetric, timePoint);
        const redValue = calculateTimelineData(filteredData.red, selectedMetric, timePoint);
        return blueValue - redValue;
    };

    const chartData = generateChartData();

    // 포지션 표시 텍스트 안전하게 처리
    const getPositionDisplayText = (position) => {
        if (!position) return '전체';
        return position === '전체' ? '팀 전체' : position.toUpperCase();
    };

    // 커스텀 툴팁 렌더러
    const CustomTooltip = ({ label, payload, active }) => {
        if (active && payload && payload.length) {
            return (
                <Paper p="xs" withBorder bg="white" shadow="md" style={{ fontSize: '12px' }}>
                    <Text size="xs" fw={600} mb={4}>{label}</Text>
                    {payload.map((entry, index) => (
                        <Group key={index} gap="xs" justify="space-between">
                            <Group gap="xs">
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        backgroundColor: entry.color,
                                    }}
                                />
                                <Text size="xs">{entry.dataKey}</Text>
                            </Group>
                            <Text size="xs" fw={600}>
                                {entry.value?.toLocaleString()}
                            </Text>
                        </Group>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Stack gap="lg" mt="lg">
            {/* 필터 컨트롤 */}
            <Paper p="md" withBorder>
                <Group gap="md" wrap="wrap">
                    <Select
                        label="포지션"
                        value={safeSelectedPosition}
                        onChange={(value) => setSelectedPosition(value || '전체')}
                        data={positions}
                        style={{ minWidth: 120 }}
                    />
                    <Select
                        label="지표"
                        value={selectedMetric}
                        onChange={(value) => setSelectedMetric(value || 'gold')}
                        data={metrics}
                        style={{ minWidth: 120 }}
                    />
                </Group>
            </Paper>

            {/* 시간대별 차트 */}
            <Paper p="lg" withBorder>
                {/* 헤더를 반응형으로 수정 */}
                <Stack gap="sm" mb="md">
                    <Title order={3} size={{ base: 'h4', sm: 'h3' }}>
                        {getPositionDisplayText(safeSelectedPosition)}
                    </Title>
                    <Text size={{ base: 'sm', sm: 'md' }} c="dimmed">
                        {metrics.find(m => m.value === selectedMetric)?.label} 추이
                    </Text>
                </Stack>

                <Box style={{ position: 'relative', overflow: 'visible' }}>
                    <LineChart
                        h={300}
                        data={chartData}
                        dataKey="time"
                        series={[
                            { name: blueTeamName, color: 'blue.6' },
                            { name: redTeamName, color: 'red.6' }
                        ]}
                        curveType="linear"
                        strokeWidth={3}
                        gridAxis="xy"
                        tooltipProps={{
                            content: CustomTooltip,
                            wrapperStyle: {
                                zIndex: 1000,
                                pointerEvents: 'none'
                            },
                            position: { x: 0, y: 0 },
                            allowEscapeViewBox: { x: true, y: true }
                        }}
                        withTooltip={true}
                        withLegend={false}
                    />
                </Box>

                {/* 범례를 차트 하단에 별도로 추가 */}
                <Group justify="center" mt="md" gap="lg">
                    <Group gap="xs">
                        <div
                            style={{
                                width: 12,
                                height: 3,
                                backgroundColor: 'var(--mantine-color-blue-6)',
                                borderRadius: 1
                            }}
                        />
                        <Text size="sm" fw={500}>{blueTeamName}</Text>
                    </Group>
                    <Group gap="xs">
                        <div
                            style={{
                                width: 12,
                                height: 3,
                                backgroundColor: 'var(--mantine-color-red-6)',
                                borderRadius: 1
                            }}
                        />
                        <Text size="sm" fw={500}>{redTeamName}</Text>
                    </Group>
                </Group>
            </Paper>

            {/* 차이 분석 */}
            <Paper p="lg" withBorder>
                <Title order={3} mb="md" size={{ base: 'h4', sm: 'h3' }}>시간대별 격차 분석</Title>
                <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
                    {timePoints.map(time => {
                        const diff = calculateDifference(time);
                        const isPositive = diff > 0;

                        return (
                            <Card key={time} p="md" bg={isPositive ? "blue.0" : "red.0"}>
                                <Stack align="center" gap="xs">
                                    <Group gap="xs">
                                        {isPositive ?
                                            <IconTrendingUp size={20} color="var(--mantine-color-blue-6)" /> :
                                            <IconTrendingDown size={20} color="var(--mantine-color-red-6)" />
                                        }
                                        <Text size="sm" fw={600}>{time}분</Text>
                                    </Group>
                                    <Text size="lg" fw={700} c={isPositive ? "blue" : "red"}>
                                        {isPositive ? '+' : ''}{diff.toLocaleString()}
                                    </Text>
                                    <Text size="xs" c="dimmed" ta="center">
                                        {metrics.find(m => m.value === selectedMetric)?.label} 차이
                                    </Text>
                                </Stack>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            </Paper>

            {/* 상세 테이블 */}
            <Paper p="lg" withBorder>
                <Title order={3} mb="md" size={{ base: 'h4', sm: 'h3' }}>상세 지표 테이블</Title>
                <ScrollArea>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                {/* ✨ whiteSpace 스타일 추가 */}
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>시간</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>팀</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>골드</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>경험치</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>CS</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>킬</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>데스</Table.Th>
                                <Table.Th style={{ whiteSpace: 'nowrap' }}>어시스트</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {timePoints.map(time => (
                                <React.Fragment key={time}>
                                    <Table.Tr>
                                        <Table.Td rowSpan={2} style={{ verticalAlign: 'middle' }}><Text fw={600}>{time}분</Text></Table.Td>
                                        <Table.Td><Badge color="blue" size="sm">{blueTeamName}</Badge></Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.blue, 'gold', time).toLocaleString()}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.blue, 'xp', time).toLocaleString()}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.blue, 'cs', time)}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.blue, 'kills', time)}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.blue, 'deaths', time)}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.blue, 'assists', time)}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td><Badge color="red" size="sm">{redTeamName}</Badge></Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.red, 'gold', time).toLocaleString()}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.red, 'xp', time).toLocaleString()}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.red, 'cs', time)}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.red, 'kills', time)}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.red, 'deaths', time)}</Table.Td>
                                        <Table.Td>{calculateTimelineData(filteredData.red, 'assists', time)}</Table.Td>
                                    </Table.Tr>
                                </React.Fragment>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>


            {safeSelectedPosition === '전체' && (
                <Paper p="lg" withBorder>
                    <Stack gap="md">
                        <Title order={3} size={{ base: 'h4', sm: 'h3' }}>포지션별 지표 비교</Title>
                        <SegmentedControl value={selectedTime} onChange={setSelectedTime} data={TIME_SELECTOR_DATA} color="blue" fullWidth />
                    </Stack>
                    <ScrollArea mt="md">
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>포지션</Table.Th>
                                    {/* ✅ '선수' 컬럼 헤더에 최소 너비를 지정합니다. */}
                                    <Table.Th style={{ minWidth: 130 }}>선수</Table.Th>
                                    <Table.Th>골드</Table.Th>
                                    <Table.Th>CS</Table.Th>
                                    <Table.Th>K/D/A</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {['top', 'jungle', 'mid', 'bot', 'support'].map(pos => {
                                    const bluePlayer = blueTeamPlayers.find(p => p.position === pos);
                                    const redPlayer = redTeamPlayers.find(p => p.position === pos);
                                    if (!bluePlayer || !redPlayer) return null;

                                    // ... (데이터 키 생성 로직) ...
                                    const goldKey = `goldat${selectedTime}`;
                                    const goldDiffKey = `golddiffat${selectedTime}`;
                                    const csKey = `csat${selectedTime}`;
                                    const csDiffKey = `csdiffat${selectedTime}`;
                                    const killsKey = `killsat${selectedTime}`;
                                    const deathsKey = `deathsat${selectedTime}`;
                                    const assistsKey = `assistsat${selectedTime}`;
                                    const blueGoldDiff = bluePlayer[goldDiffKey] || 0;
                                    const blueCsDiff = bluePlayer[csDiffKey] || 0;

                                    return (
                                        <React.Fragment key={pos}>
                                            <Table.Tr>
                                                <Table.Td rowSpan={2} style={{ verticalAlign: 'middle' }}><Text fw={600} tt="uppercase">{pos}</Text></Table.Td>

                                                {/* ✅ white-space 스타일을 유지하여 확실하게 처리합니다. */}
                                                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                                    <Group gap="xs" wrap="nowrap">
                                                        <Avatar src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${bluePlayer.champion}.png`} size={24} />
                                                        <Text size="sm">{bluePlayer.playername}</Text>
                                                    </Group>
                                                </Table.Td>

                                                <Table.Td>{(bluePlayer[goldKey] || 0).toLocaleString()}<Text c={blueGoldDiff >= 0 ? "blue" : "red"} size="xs">({blueGoldDiff >= 0 ? '+' : ''}{blueGoldDiff})</Text></Table.Td>
                                                <Table.Td>{bluePlayer[csKey] || 0}<Text c={blueCsDiff >= 0 ? "blue" : "red"} size="xs">({blueCsDiff >= 0 ? '+' : ''}{blueCsDiff})</Text></Table.Td>
                                                <Table.Td>{bluePlayer[killsKey] || 0}/{bluePlayer[deathsKey] || 0}/{bluePlayer[assistsKey] || 0}</Table.Td>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                                    <Group gap="xs" wrap="nowrap">
                                                        <Avatar src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${redPlayer.champion}.png`} size={24} />
                                                        <Text size="sm">{redPlayer.playername}</Text>
                                                    </Group>
                                                </Table.Td>

                                                <Table.Td>{(redPlayer[goldKey] || 0).toLocaleString()}</Table.Td>
                                                <Table.Td>{redPlayer[csKey] || 0}</Table.Td>
                                                <Table.Td>{redPlayer[killsKey] || 0}/{redPlayer[deathsKey] || 0}/{redPlayer[assistsKey] || 0}</Table.Td>
                                            </Table.Tr>
                                        </React.Fragment>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            )}
        </Stack>
    );
};

export default TimelineAnalysisTab;
