import {
  Center,
  Divider,
  Flex,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { CommentCard } from "./comment-card";
import Comment from "@/shared/assets/icons/comment.svg";

interface Comment {
  id: number;
  profileUrl?: string;
  nickname: string;
  timeAgo: string;
  content: string;
  likeCount: number;
}

interface CommentListBoxProps {
  comments: Comment[];
  onClose: () => void;
  isLoading?: boolean;
  isMobile?: boolean;
  selectedVideoTitle?: string | null;
  hideCloseButton?: boolean;
}

export function CommentListBox({
  comments,
  onClose,
  isLoading = false,
  isMobile = false,
  selectedVideoTitle = null,
  hideCloseButton = false,
}: CommentListBoxProps) {
  const hasSelectedVideo = Boolean(selectedVideoTitle);
  const visibleComments = hasSelectedVideo ? comments : [];
  const commentCount = hasSelectedVideo ? comments.length : 0;

  return (
    <Paper
      radius="md"
      p={isMobile ? "sm" : "lg"}
      withBorder
      w={isMobile ? "100%" : 350}
      style={{
        height: isMobile ? "100%" : 640,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex gap={8} align="center" mb="sm">
        <Comment />
        <Text fw={400} fz={20} c="var(--nar-text-secondary)">
          댓글 {commentCount}
        </Text>
        {!hideCloseButton && (
          <IconX
            size={20}
            style={{ cursor: "pointer" }}
            color="var(--mantine-color-gray-6)"
            onClick={onClose}
          />
        )}
      </Flex>
      <Text
        c={
          hasSelectedVideo
            ? "var(--nar-text-tertiary)"
            : "var(--nar-text-tertiary-sub)"
        }
        fz={16}
        fw={500}
        mb="sm"
      >
        {hasSelectedVideo
          ? `“${selectedVideoTitle}”`
          : "해당 스토리의 댓글을 클릭하여 확인해보세요."}
      </Text>
      <ScrollArea style={{ flex: 1 }} type="auto" offsetScrollbars>
        {isLoading ? (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        ) : !hasSelectedVideo ? (
          <Center py="xl"></Center>
        ) : visibleComments.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed" fz={14}>
              댓글이 없습니다.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {visibleComments.map((comment) => (
              <CommentCard
                key={comment.id}
                profileUrl={comment.profileUrl}
                nickname={comment.nickname}
                timeAgo={comment.timeAgo}
                content={comment.content}
                likeCount={comment.likeCount}
              />
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Paper>
  );
}

export default CommentListBox;
