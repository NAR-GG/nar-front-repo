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
  Anchor,
} from "@mantine/core";

interface StoryCardProps {
  badgeLabel: string;
  channelName: string;
  timeAgo: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelProfileUrl: string;
  isMobile: boolean;
}

export function StoryCard({
  badgeLabel,
  channelName,
  timeAgo,
  title,
  thumbnailUrl,
  videoUrl,
  channelProfileUrl,
  isMobile,
}: StoryCardProps) {
  const badgeColor = badgeLabel === "SHORTS" ? "#EE6787" : "#8775FB";

  return (
    <Flex
      gap="xs"
      style={isMobile ? { minWidth: 0, overflow: "hidden" } : undefined}
    >
      <Avatar
        radius="xl"
        size={isMobile ? 36 : 48}
        src={channelProfileUrl}
        alt={channelName}
        style={{ flexShrink: 0 }}
      />
      <Stack
        gap={3}
        style={
          isMobile ? { flex: 1, minWidth: 0, overflow: "hidden" } : undefined
        }
      >
        <Group gap={5}>
          <Badge size="xs" radius="sm" color={badgeColor} fw={700}>
            {badgeLabel}
          </Badge>
          <Text size="sm" c="hsl(0, 0%, 51%)">
            {channelName}
          </Text>
        </Group>
        <Group
          gap={6}
          justify="flex-end"
          align="flex-end"
          style={isMobile ? { minWidth: 0 } : undefined}
        >
          <Anchor
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="never"
            style={{ textDecoration: "none" }}
          >
            <Paper
              radius="md"
              p={isMobile ? 6 : 8}
              w={isMobile ? "100%" : 267}
              withBorder
              style={{
                minWidth: isMobile ? 0 : undefined,
                overflow: isMobile ? "hidden" : undefined,
                border: "1px solid #D9D9D9",
                borderRadius: 8,
                transition: "border-color 0.15s ease",
                cursor: "pointer",
              }}
              styles={{
                root: {
                  "&:hover": {
                    borderColor: "#5383E8",
                  },
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
                  h={isMobile ? "auto" : 125}
                  w="100%"
                  fit="cover"
                  style={isMobile ? { aspectRatio: "16/9" } : undefined}
                />
              </Stack>
            </Paper>
          </Anchor>
          {!isMobile && (
            <Text size="xs" c="hsl(0, 0%, 51%)">
              ({timeAgo})
            </Text>
          )}
        </Group>
        {isMobile && (
          <Text size="xs" c="hsl(0, 0%, 51%)" ta="right">
            {timeAgo}
          </Text>
        )}
      </Stack>
    </Flex>
  );
}

export default StoryCard;
