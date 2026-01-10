"use client";

import {
  Box,
  Button,
  Container,
  Drawer,
  Flex,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Transition,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useInfiniteQuery } from "@tanstack/react-query";
import { storyQueries } from "@/entities/story/model/story.queries";
import { useGetStoryVideoComments } from "@/entities/story/model/story.mutations";
import StoryCard from "./story-card";
import CommentListBox from "./comment-list-box";
import Image from "next/image";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const CATEGORY_ITEMS = [
  { key: "all", label: "전체", type: null, badgeLabel: "Youtube" },
  { key: "pro", label: "프로팀 Youtube", type: "pro", badgeLabel: "PRO" },
  {
    key: "shorts",
    label: "롤 쇼츠 Youtube",
    type: "shorts",
    badgeLabel: "Shorts",
  },
];

function YoutubeStoriesComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedItem, setSelectedItem] = useState(CATEGORY_ITEMS[0]);
  const [period, setPeriod] = useState("all"); // all | week | month
  const [sort, setSort] = useState("latest"); // latest | views | likes
  const [showComments, setShowComments] = useState(false);

  const commentsMutation = useGetStoryVideoComments();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
  } = useInfiniteQuery(
    storyQueries.videoList({
      category: selectedItem.key,
      period,
      sort,
      size: 20,
    })
  );

  const stories = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.content ?? []);
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getTimeAgo = (publishedAt: string) =>
    publishedAt ? dayjs(publishedAt).fromNow() : "";

  const handleOpenComments = (youtubeVideoId: string) => {
    commentsMutation.mutate({ youtubeVideoId });
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  const comments = useMemo(() => {
    if (!commentsMutation.data?.content) return [];
    return commentsMutation.data.content.map((comment, index) => ({
      id: index,
      profileUrl: comment.authorProfileImageUrl,
      nickname: comment.authorDisplayName,
      timeAgo: getTimeAgo(comment.publishedAt),
      content: comment.textDisplay,
      likeCount: comment.likeCount,
    }));
  }, [commentsMutation.data]);

  return (
    <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
      <Stack gap="lg" mt="md">
        <Stack gap={4}>
          <Group gap="xs">
            <Image
              src="/images/youtube.svg"
              alt="유튜브 아이콘"
              width="53"
              height="37"
            />
            <Text fw={800} fz={26} c="var(--mantine-color-text)">
              Youtube 스토리
            </Text>
          </Group>
          {!isMobile && (
            <Text fw={600} c="var(--mantine-color-text)">
              LOL 프로팀과 인기 쇼츠 채널의 소식을 실시간으로 확인해 보세요.
            </Text>
          )}
        </Stack>

        {isMobile && (
          <SegmentedControl
            value={selectedItem.key}
            onChange={(value) => {
              const found = CATEGORY_ITEMS.find((item) => item.key === value);
              if (found) setSelectedItem(found);
            }}
            size="xs"
            fullWidth
            data={CATEGORY_ITEMS.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
          />
        )}
        <Flex gap="lg" align="flex-start">
          <Flex
            gap="lg"
            align="flex-start"
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth:
                showComments && !isMobile ? "calc(100% - 366px)" : "100%",
              transition: "max-width 0.2s ease",
            }}
          >
            <Stack style={{ flex: 1, minWidth: 0 }} gap="md">
              <Flex gap="sm" wrap="wrap" align="center" justify="flex-end">
                <SegmentedControl
                  value={period}
                  onChange={setPeriod}
                  size={isMobile ? "xs" : "sm"}
                  data={[
                    { label: "전체", value: "all" },
                    { label: "최근 1주", value: "week" },
                    { label: "최근 1달", value: "month" },
                  ]}
                />
                <SegmentedControl
                  value={sort}
                  onChange={setSort}
                  size={isMobile ? "xs" : "sm"}
                  data={[
                    { label: "최신순", value: "latest" },
                    { label: "조회수순", value: "views" },
                    { label: "좋아요순", value: "likes" },
                  ]}
                />
              </Flex>

              <Flex gap="lg">
                {!isMobile && (
                  <Paper
                    radius="md"
                    p="lg"
                    withBorder
                    w={200}
                    style={{ flexShrink: 0, alignSelf: "flex-start" }}
                  >
                    <Stack gap={14}>
                      {CATEGORY_ITEMS.map((item) => {
                        const selected = selectedItem.key === item.key;
                        return (
                          <Flex
                            key={item.key}
                            align="center"
                            gap={8}
                            onClick={() => setSelectedItem(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <Box
                              w={8}
                              h={8}
                              style={{
                                borderRadius: 8,
                                backgroundColor: selected
                                  ? "var(--mantine-color-text)"
                                  : "transparent",
                              }}
                            />
                            <Text
                              fz={14}
                              fw={selected ? 700 : 500}
                              c={
                                selected
                                  ? "var(--mantine-color-text)"
                                  : "gray.6"
                              }
                            >
                              {item.label}
                            </Text>
                          </Flex>
                        );
                      })}
                    </Stack>
                  </Paper>
                )}
                <Stack style={{ flex: 1, minWidth: 0 }}>
                  <Paper radius="md" p={isMobile ? "sm" : "lg"} withBorder>
                    <Paper
                      radius="md"
                      p={isMobile ? "sm" : "lg"}
                      withBorder
                      bg="var(--mantine-color-default)"
                      style={{
                        height: isMobile ? 450 : 600,
                        overflowY: "auto",
                      }}
                    >
                      <Stack gap="md">
                        {(isLoading || isRefetching) &&
                          stories.length === 0 && (
                            <Text size="sm" c="dimmed">
                              불러오는 중입니다...
                            </Text>
                          )}

                        {isError && (
                          <Text size="sm" c="red">
                            유튜브 스토리를 불러오는 데 실패했습니다.
                          </Text>
                        )}

                        {!isLoading && !isError && stories.length === 0 && (
                          <Text size="sm" c="dimmed">
                            아직 등록된 스토리가 없습니다.
                          </Text>
                        )}

                        {!isError &&
                          stories.map((story) => (
                            <StoryCard
                              key={story.videoId}
                              youtubeVideoId={story.youtubeVideoId}
                              badgeLabel={story.channelType}
                              channelName={story.channelName}
                              timeAgo={getTimeAgo(story.publishedAt)}
                              title={story.title}
                              thumbnailUrl={story.thumbnailUrl}
                              videoUrl={story.videoUrl}
                              channelProfileUrl={story.channelProfileUrl}
                              isMobile={isMobile ?? false}
                              likeCount={story.likeCount}
                              commentCount={story.commentCount}
                              onMessage={handleOpenComments}
                            />
                          ))}

                        {isFetchingNextPage && (
                          <Text size="xs" c="dimmed">
                            더 불러오는 중...
                          </Text>
                        )}
                      </Stack>
                    </Paper>
                  </Paper>
                  <Button
                    fw={500}
                    fz={16}
                    radius="md"
                    variant="default"
                    size="md"
                    fullWidth
                    onClick={handleLoadMore}
                    loading={isFetchingNextPage}
                    disabled={!hasNextPage || isError}
                  >
                    {!hasNextPage
                      ? "마지막 페이지입니다"
                      : "동영상 20개 추가 검색"}
                  </Button>
                </Stack>
              </Flex>
            </Stack>
          </Flex>

          {!isMobile && (
            <Transition
              mounted={showComments}
              transition="fade-left"
              timingFunction="ease"
            >
              {(styles) => (
                <div
                  style={{
                    ...styles,
                    marginTop: 52,
                    height: "calc(100% - 52px)",
                  }}
                >
                  <CommentListBox
                    comments={comments}
                    onClose={handleCloseComments}
                    isLoading={commentsMutation.isPending}
                  />
                </div>
              )}
            </Transition>
          )}
        </Flex>

        {isMobile && (
          <Drawer
            opened={showComments}
            onClose={handleCloseComments}
            position="bottom"
            size="70%"
            radius="md"
            withCloseButton={false}
            styles={{
              body: { padding: 0, height: "100%" },
              content: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
            }}
          >
            <CommentListBox
              comments={comments}
              onClose={handleCloseComments}
              isLoading={commentsMutation.isPending}
              isMobile
            />
          </Drawer>
        )}
      </Stack>
    </Container>
  );
}

export default YoutubeStoriesComponent;
