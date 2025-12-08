/** @jsxImportSource @emotion/react */
import {
  Avatar,
  Badge,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
function StoryCard({
  type,
  badgeLabel,
  channelName,
  timeAgo,
  title,
  thumbnailUrl,
  videoUrl,
  channelProfileUrl,
}) {
  const badgeColor = type === "pro" ? "#8775FB" : "#EE6787";

  return (
    <Flex gap="xs">
      <Avatar radius="xl" size={48} src={channelProfileUrl} alt={channelName} />
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
            w={267}
            withBorder
            component="a"
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
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
                  <Text
                    fz={12}
                    fw={600}
                    c="hsl(0, 0%, 51%)"
                    style={{ flexShrink: 0 }}
                  >
                    제목
                  </Text>
                  <Divider orientation="vertical" />
                  <Text fz={12} fw={600} truncate="end" w="100%" c="#000">
                    {title}
                  </Text>
                </Flex>
              </Stack>
              <Image
                src={thumbnailUrl}
                alt={title}
                radius={6}
                h={125}
                w="100%"
                fit="cover"
                withPlaceholder
              />
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
