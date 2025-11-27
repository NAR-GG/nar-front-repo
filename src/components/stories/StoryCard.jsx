/** @jsxImportSource @emotion/react */
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
function StoryCard({ type, badgeLabel, channelName, timeAgo }) {
  const badgeColor = type === "pro" ? "#8775FB" : "#EE6787";

  return (
    <Flex gap="xs">
      <Avatar radius="xl" size={48} />
      <Stack gap={3}>
        <Group gap={5}>
          <Badge size="xs" radius="sm" color={badgeColor} fw={700}>
            {badgeLabel}
          </Badge>
          <Text size="sm" c="hsl(0, 0%, 51%)">
            {channelName}
          </Text>
        </Group>
        <Group gap={6} justify="flex-end" align="flex-end">
          <Paper
            radius="md"
            p={8}
            withBorder
            css={{
              border: "1px solid #D9D9D9",
              borderRadius: 8,
              transition: "border-color 0.15s ease",
              "&:hover": {
                borderColor: "#5383E8",
              },
            }}
          >
            <Stack gap={6}>
              <Stack gap={2}>
                <Text fz={11} c="hsl(0, 0%, 51%)">
                  새로운 동영상이 업로드 되었습니다.
                </Text>
                <Flex gap={5}>
                  <Text fz={11} fw={600} c="hsl(0, 0%, 51%)">
                    제목
                  </Text>
                  <Divider orientation="vertical" />
                  <Text fz={11} fw={600}>
                    끝이 아닌 도란이란 드라마의 시작점이 되길
                  </Text>
                </Flex>
              </Stack>
              <Box mt="xs" h={125} w={221} bg="#D9D9D9" />
            </Stack>
          </Paper>
          <Text size="xs" c="hsl(0, 0%, 51%)">
            ({timeAgo})
          </Text>
        </Group>
      </Stack>
    </Flex>
  );
}

export default StoryCard;
