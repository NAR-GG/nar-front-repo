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
import Comment from "@/shared/assets/icons/comment.svg";
import ThumbUp from "@/shared/assets/icons/thumb-up.svg";

function CommentIcon({
  isSelected,
  gradientId,
}: {
  isSelected: boolean;
  gradientId: string;
}) {
  if (!isSelected) {
    return <Comment />;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 14H18V12H6V14ZM6 11H18V9H6V11ZM6 8H18V6H6V8ZM22 22L18 18H4C3.45 18 2.97917 17.8042 2.5875 17.4125C2.19583 17.0208 2 16.55 2 16V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V22ZM4 16H18.85L20 17.125V4H4V16Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="0.53125"
          y1="-3.65217"
          x2="26.3024"
          y2="-3.45889"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-gradient-start)" />
          <stop offset="0.372489" stopColor="var(--logo-gradient-mid)" />
          <stop offset="1" stopColor="var(--logo-gradient-end)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface StoryCardProps {
  badgeLabel: string;
  channelName: string;
  timeAgo: string;
  title: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelProfileUrl: string;
  isMobile: boolean;
  likeCount: number;
  commentCount: number;
  onMessage: () => void;
  isCommentSelected: boolean;
}

export function StoryCard({
  badgeLabel,
  channelName,
  timeAgo,
  title,
  youtubeVideoId,
  thumbnailUrl,
  videoUrl,
  channelProfileUrl,
  isMobile,
  likeCount,
  commentCount,
  onMessage,
  isCommentSelected,
}: StoryCardProps) {
  const badgeClassName =
    badgeLabel === "PRO_TEAMS" ? "badge-mini-hub" : "badge-mini-hub-line";
  const commentGradientId = `comment-selected-gradient-${youtubeVideoId}`;

  return (
    <Paper
      radius={24}
      p={isMobile ? "sm" : undefined}
      style={{
        minWidth: isMobile ? 0 : undefined,
        overflow: "hidden",
        borderRadius: 24,
        paddingTop: isMobile ? undefined : 24,
        paddingLeft: isMobile ? undefined : 24,
        paddingRight: isMobile ? undefined : 32,
        paddingBottom: isMobile ? undefined : 30,
        transition: "border-color 0.15s ease",
        cursor: "pointer",
      }}
      bg={"var(--nar-bg-tertiary)"}
      withBorder
      styles={{
        root: {
          "&:hover": {
            borderColor: "var(--nar-line-2, #DEE2E6)",
          },
        },
      }}
    >
      <Flex
        gap="xs"
        style={isMobile ? { minWidth: 0, overflow: "hidden" } : undefined}
      >
        <Avatar
          radius="xl"
          size={isMobile ? 31 : 51}
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
            <Text size="sm" c="var(--nar-text-secondary)" fz={16}>
              {channelName}
            </Text>
            <Badge className={badgeClassName}>{badgeLabel}</Badge>
          </Group>
          <Group
            gap={6}
            justify="flex-start"
            align="flex-start"
            style={isMobile ? { minWidth: 0 } : undefined}
          >
            <Anchor
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="never"
              style={{
                textDecoration: "none",
                display: "block",
                width: isMobile ? "100%" : 357,
                flexShrink: 0,
              }}
            >
              <Stack gap={6}>
                <Stack gap={2}>
                  <Flex align="center">
                    <Text fz={12} c="var(--nar-text-tertiary-sub)">
                      {isMobile ? timeAgo : `${timeAgo}`}
                    </Text>
                    <div className="bg-[var(--nar-text-tertiary-sub)] w-1 h-1 rounded-full mx-2"></div>
                    <Text fz={12} c="var(--nar-text-tertiary-sub)">
                      새로운 동영상이 업로드 되었습니다.
                    </Text>
                  </Flex>

                  <Flex gap={5}>
                    <Text
                      fz={16}
                      fw={600}
                      truncate="end"
                      w="100%"
                      c="var(--nar-text-tertiary)"
                    >
                      {`"${title}"`}
                    </Text>
                  </Flex>
                </Stack>
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  radius={6}
                  h={isMobile ? "auto" : 201}
                  w={isMobile ? "100%" : 357}
                  fit="cover"
                  style={{ aspectRatio: "16/9" }}
                />
              </Stack>
              <Flex gap={24} mt={8} align="center">
                <Flex gap={4} align="center">
                  <ThumbUp />
                  <Text fz={14} c="var(--nar-text-2)">
                    {likeCount}
                  </Text>
                </Flex>
                <Flex
                  gap={4}
                  align="center"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMessage();
                  }}
                >
                  <CommentIcon
                    isSelected={isCommentSelected}
                    gradientId={commentGradientId}
                  />
                  <Text
                    fz={14}
                    c={isCommentSelected ? undefined : "var(--nar-text-2)"}
                    style={
                      isCommentSelected
                        ? {
                            background: "var(--nar_gradients)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                        : undefined
                    }
                  >
                    {commentCount}
                  </Text>
                </Flex>
              </Flex>
            </Anchor>
          </Group>
        </Stack>
      </Flex>
    </Paper>
  );
}

export default StoryCard;
