import { Avatar, Flex, Group, Stack, Text } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

interface CommentCardProps {
  profileUrl?: string;
  nickname: string;
  timeAgo: string;
  content: string;
  likeCount: number;
}

export function CommentCard({
  profileUrl,
  nickname,
  timeAgo,
  content,
  likeCount,
}: CommentCardProps) {
  return (
    <Flex gap="sm" py="sm">
      <Avatar
        src={profileUrl}
        alt={nickname}
        radius="xl"
        size={40}
        color="dark.3"
        style={{ flexShrink: 0 }}
      />
      <Stack gap={4} style={{ flex: 1 }}>
        <Group gap={8}>
          <Text fw={600} fz={14} c="dark.9">
            {nickname}
          </Text>
          <Text fz={12} c="gray.5">
            {timeAgo}
          </Text>
        </Group>
        <Text
          fz={14}
          c="dark.7"
          style={{ lineHeight: 1.5, whiteSpace: "pre-wrap" }}
        >
          {content.replace(/<br\s*\/?>/gi, "\n")}
        </Text>
        <Group gap={16} mt={4}>
          {/* <Text fz={12} c="gray.5" style={{ cursor: "pointer" }}>
            답글
          </Text> */}
          <Flex gap={4} align="center">
            <IconHeart size={14} color="var(--mantine-color-gray-5)" />
            <Text fz={12} c="gray.5">
              {likeCount}
            </Text>
          </Flex>
        </Group>
      </Stack>
    </Flex>
  );
}

export default CommentCard;
