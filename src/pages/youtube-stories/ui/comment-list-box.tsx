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
}

export function CommentListBox({
  comments,
  onClose,
  isLoading = false,
  isMobile = false,
}: CommentListBoxProps) {
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
      <Flex justify="space-between" align="center" mb="sm">
        <Text fw={600} fz={16}>
          댓글 {comments.length}
        </Text>
        <IconX
          size={20}
          style={{ cursor: "pointer" }}
          color="var(--mantine-color-gray-6)"
          onClick={onClose}
        />
      </Flex>

      <Divider mb="sm" />

      <ScrollArea style={{ flex: 1 }} type="auto" offsetScrollbars>
        {isLoading ? (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        ) : comments.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed" fz={14}>
              댓글이 없습니다.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {comments.map((comment) => (
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
