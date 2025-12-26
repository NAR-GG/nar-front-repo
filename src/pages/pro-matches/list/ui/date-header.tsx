import { Group, Text } from "@mantine/core";

export function Dateheader({ date }: { date: string }) {
  return (
    <Group gap="xs" my="md">
      <Text size="md" fw={700} c="dark.2">
        {date}
      </Text>
    </Group>
  );
}
