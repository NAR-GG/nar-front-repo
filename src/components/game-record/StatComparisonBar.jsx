// src/components/game-record/StatComparisonBar.jsx
import { Box, Group, Progress, Text, Badge, Stack } from '@mantine/core';

const StatComparisonBar = ({ blueValue, redValue, label, format, firstObjectiveSide }) => {
    const total = blueValue + redValue || 1;
    const bluePercentage = (blueValue / total) * 100;
    const redPercentage = (redValue / total) * 100;

    const formattedBlue = format ? format(blueValue) : blueValue;
    const formattedRed = format ? format(redValue) : redValue;

    return (
        <Group align="flex-start" justify="center" wrap="nowrap">
            {/* 왼쪽 팀 영역 */}
            <Stack gap={4} align="stretch" style={{ flex: 1 }}>
                <Group wrap="nowrap" gap="xs">
                    <Text fw={700} size="lg" w={60} ta="right">{formattedBlue}</Text>
                    <Box style={{ flex: 1 }}>
                        <Progress
                            value={bluePercentage}
                            size="sm"
                            radius="xs"
                            color="blue"
                            bg="gray.2"
                            style={{ transform: 'scaleX(-1)' }}
                        />
                    </Box>
                </Group>
                {firstObjectiveSide === 'blue' && (
                    /* ✅ justify="flex-end"로 변경하여 배지를 오른쪽 끝으로 이동 */
                    <Group justify="flex-end">
                        <Badge size="xs" variant="light" color="gray" radius="sm">
                            첫 {label}
                        </Badge>
                    </Group>
                )}
            </Stack>

            {/* 가운데 제목 */}
            <Text fw={600} size="sm" w={80} ta="center" pt="xs">{label}</Text>

            {/* 오른쪽 팀 영역 */}
            <Stack gap={4} align="stretch" style={{ flex: 1 }}>
                <Group wrap="nowrap" gap="xs">
                    <Box style={{ flex: 1 }}>
                        <Progress
                            value={redPercentage}
                            size="sm"
                            radius="xs"
                            color="red"
                            bg="gray.2"
                        />
                    </Box>
                    <Text fw={700} size="lg" w={60} ta="left">{formattedRed}</Text>
                </Group>
                {firstObjectiveSide === 'red' && (
                    /* ✅ justify="flex-start"로 변경하여 배지를 왼쪽 끝으로 이동 */
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