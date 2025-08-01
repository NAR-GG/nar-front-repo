// src/components/game-record/StatComparisonBar.jsx
import { Box, Group, Progress, Text, Badge, Stack } from '@mantine/core';

const StatComparisonBar = ({ blueValue, redValue, label, format, firstObjectiveSide }) => {
    const total = (blueValue || 0) + (redValue || 0) || 1;
    const bluePercentage = ((blueValue || 0) / total) * 100;

    const formattedBlue = format ? format(blueValue) : (blueValue ?? 0);
    const formattedRed = format ? format(redValue) : (redValue ?? 0);

    return (
        <Group align="flex-start" justify="center" wrap="nowrap" gap={{ base: 'xs', sm: 'md' }}>
            {/* --- 왼쪽(블루팀) 영역 --- */}
            <Stack gap={4} align="stretch" style={{ flex: 1 }}>
                <Group wrap="nowrap" gap={{ base: 4, sm: 'xs' }} style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Text fw={700} size={{ base: 'sm', sm: 'lg' }} c={blueValue > redValue ? 'dark' : 'dimmed'}>
                        {formattedBlue}
                    </Text>
                    <Progress
                        value={bluePercentage} size="sm" radius="xs" color="blue" bg="gray.2"
                        style={{ flex: 1, transform: 'scaleX(-1)', minWidth: 30 }}
                    />
                </Group>
                {/* ✅ [수정] 블루팀이 첫 오브젝트일 경우, 이 영역에 배지 표시 */}
                {firstObjectiveSide === 'blue' && (
                    <Group justify="flex-end">
                        <Badge size="xs" variant="light" color="gray" radius="sm">
                            첫 {label}
                        </Badge>
                    </Group>
                )}
            </Stack>

            {/* --- 중앙 라벨 --- */}
            <Text fw={600} size="sm" w={{ base: 60, sm: 80 }} ta="center" pt={4}>{label}</Text>

            {/* --- 오른쪽(레드팀) 영역 --- */}
            <Stack gap={4} align="stretch" style={{ flex: 1 }}>
                <Group wrap="nowrap" gap={{ base: 4, sm: 'xs' }} style={{ flex: 1 }}>
                    <Progress
                        value={100 - bluePercentage} size="sm" radius="xs" color="red" bg="gray.2"
                        style={{ flex: 1, minWidth: 30 }}
                    />
                    <Text fw={700} size={{ base: 'sm', sm: 'lg' }} c={redValue > blueValue ? 'dark' : 'dimmed'}>
                        {formattedRed}
                    </Text>
                </Group>
                {/* ✅ [수정] 레드팀이 첫 오브젝트일 경우, 이 영역에 배지 표시 */}
                {firstObjectiveSide === 'red' && (
                    <Group justify="flex-start">
                        <Badge size="xs" variant="light" color="gray" radius="sm">
                            첫 {label}
                        </Badge>
                    </Group>
                )}
            </Stack>
        </Group>
    );
};

export default StatComparisonBar;