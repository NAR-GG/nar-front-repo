"use client";

import { Group, Progress, Text, Badge, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface StatComparisonBarProps {
  label: string;
  blueValue: number;
  redValue: number;
  format?: (v: number) => string;
  firstObjectiveSide?: "blue" | "red" | null;
}

export function StatComparisonBar({
  label,
  blueValue,
  redValue,
  format,
  firstObjectiveSide,
}: StatComparisonBarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const total = (blueValue || 0) + (redValue || 0) || 1;
  const bluePercentage = ((blueValue || 0) / total) * 100;

  const formattedBlue = format ? format(blueValue) : blueValue ?? 0;
  const formattedRed = format ? format(redValue) : redValue ?? 0;

  return (
    <Group
      align="flex-start"
      justify="center"
      wrap="nowrap"
      gap={isMobile ? "xs" : "md"}
    >
      {/* --- 왼쪽(블루팀) 영역 --- */}
      <Stack gap={4} align="stretch" style={{ flex: 1 }}>
        <Group
          wrap="nowrap"
          gap={isMobile ? 4 : "xs"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Text
            fw={700}
            size={isMobile ? "sm" : "lg"}
            c={blueValue > redValue ? "dark" : "dimmed"}
          >
            {formattedBlue}
          </Text>
          <Progress
            value={bluePercentage}
            size="sm"
            radius="xs"
            color="blue"
            bg="gray.2"
            style={{ flex: 1, transform: "scaleX(-1)", minWidth: 30 }}
          />
        </Group>
        {/* 블루팀이 첫 오브젝트일 경우 배지 표시 */}
        {firstObjectiveSide === "blue" && (
          <Group justify="flex-end">
            <Badge size="xs" variant="light" color="gray" radius="sm">
              첫 {label}
            </Badge>
          </Group>
        )}
      </Stack>

      {/* --- 중앙 라벨 --- */}
      <Text fw={600} size="sm" w={isMobile ? 60 : 80} ta="center" pt={4}>
        {label}
      </Text>

      {/* --- 오른쪽(레드팀) 영역 --- */}
      <Stack gap={4} align="stretch" style={{ flex: 1 }}>
        <Group wrap="nowrap" gap={isMobile ? 4 : "xs"} style={{ flex: 1 }}>
          <Progress
            value={100 - bluePercentage}
            size="sm"
            radius="xs"
            color="red"
            bg="gray.2"
            style={{ flex: 1, minWidth: 30 }}
          />
          <Text
            fw={700}
            size={isMobile ? "sm" : "lg"}
            c={redValue > blueValue ? "dark" : "dimmed"}
          >
            {formattedRed}
          </Text>
        </Group>
        {/* 레드팀이 첫 오브젝트일 경우 배지 표시 */}
        {firstObjectiveSide === "red" && (
          <Group justify="flex-start">
            <Badge size="xs" variant="light" color="gray" radius="sm">
              첫 {label}
            </Badge>
          </Group>
        )}
      </Stack>
    </Group>
  );
}
