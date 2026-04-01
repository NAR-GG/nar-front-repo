"use client";

import {
  Button,
  Drawer,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Select,
  SegmentedControl,
  Stack,
  Text,
  Container,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { storyQueries } from "@/entities/story/model/story.queries";
import { useGetStoryVideoComments } from "@/entities/story/model/story.mutations";
import { StoryCard } from "./story-card";
import CommentListBox from "./comment-list-box";
import Image from "next/image";
import { CATEGORY_ITEMS } from "../model/type";
import { toStoryCardViewModel, toCommentViewModel } from "../model/youtube-stories.mapper";

function YoutubeStoriesComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const storiesViewportRef = useRef<HTMLDivElement>(null);
  const prevStoriesCountRef = useRef(0);
  const [selectedItem, setSelectedItem] = useState(CATEGORY_ITEMS[0]);
  const [period, setPeriod] = useState("all"); // all | week | month
  const [sort, setSort] = useState("latest"); // latest | views | likes
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(
    null,
  );

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
    }),
  );

  const stories = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.content ?? []).map(toStoryCardViewModel);
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const resetSelectedVideo = useCallback(() => {
    setSelectedVideoId(null);
    setSelectedVideoTitle(null);
    setShowComments(false);
  }, []);

  const handleOpenComments = useCallback((youtubeVideoId: string, title: string) => {
    commentsMutation.mutate({ youtubeVideoId });
    setSelectedVideoId(youtubeVideoId);
    setSelectedVideoTitle(title);
    setShowComments(true);
  }, [commentsMutation]);

  const handleCloseComments = useCallback(() => {
    setShowComments(false);
    setSelectedVideoId(null);
    setSelectedVideoTitle(null);
  }, []);

  const comments = useMemo(() => {
    if (!commentsMutation.data?.content) return [];
    return commentsMutation.data.content.map(toCommentViewModel);
  }, [commentsMutation.data]);

  useEffect(() => {
    if (
      stories.length > prevStoriesCountRef.current &&
      prevStoriesCountRef.current > 0
    ) {
      requestAnimationFrame(() => {
        storiesViewportRef.current?.scrollTo({
          top: storiesViewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
    prevStoriesCountRef.current = stories.length;
  }, [stories.length]);

  return (
    <Container size="md" px={{ base: 0, sm: 24, md: 32 }}>
      <Stack gap={4}>
        <Group gap="xs">
          <Image
            src="/images/youtube.svg"
            alt="유튜브 아이콘"
            width="53"
            height="37"
          />
          <Text fw={600} fz={22} c="var(--nar-text-primary)">
            Youtube 스토리
          </Text>
        </Group>
        {!isMobile && (
          <Text fw={400} fz={14} c="var(--nar-text-tertiary-sub)">
            LOL 프로팀과 인기 쇼츠 채널의 소식을 실시간으로 확인해 보세요.
          </Text>
        )}
      </Stack>

      <SegmentedControl
        mt={44}
        mb={12}
        value={selectedItem.key}
        onChange={(value) => {
          const found = CATEGORY_ITEMS.find((item) => item.key === value);
          if (found) {
            setSelectedItem(found);
            resetSelectedVideo();
          }
        }}
        size={isMobile ? "xs" : "sm"}
        fullWidth={isMobile}
        radius="md"
        data={CATEGORY_ITEMS.map((item) => ({
          label: item.label,
          value: item.key,
        }))}
      />
      <Flex gap="lg" align="flex-start">
        <Flex
          gap="lg"
          align="flex-start"
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: !isMobile ? "calc(100% - 366px)" : "100%",
            transition: "max-width 0.2s ease",
          }}
        >
          <Stack style={{ flex: 1, minWidth: 0 }} gap="md">
            <Stack style={{ flex: 1, minWidth: 0 }}>
              <Paper
                radius="lg"
                p={isMobile ? "sm" : "lg"}
                bg="var(--nar-bg-secondary)"
                withBorder
              >
                <Flex gap={isMobile ? "xs" : "md"} mb="md">
                  <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                    <Text fz={13} fw={600} c="var(--nar-text-primary)">
                      정렬
                    </Text>
                    <Select
                      value={sort}
                      onChange={(value) => {
                        setSort(value ?? "latest");
                        resetSelectedVideo();
                      }}
                      data={[
                        { label: "최신순", value: "latest" },
                        { label: "조회수순", value: "views" },
                        { label: "좋아요순", value: "likes" },
                      ]}
                      allowDeselect={false}
                      checkIconPosition="right"
                      styles={{
                        input: {
                          height: 38,
                          backgroundColor: "var(--mantine-color-body)",
                          borderColor: "var(--mantine-color-gray-3)",
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      }}
                    />
                  </Stack>
                  <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                    <Text fz={13} fw={600} c="var(--nar-text-primary)">
                      기간
                    </Text>
                    <Select
                      value={period}
                      onChange={(value) => {
                        setPeriod(value ?? "all");
                        resetSelectedVideo();
                      }}
                      data={[
                        { label: "전체", value: "all" },
                        { label: "최근 1주", value: "week" },
                        { label: "최근 1달", value: "month" },
                      ]}
                      allowDeselect={false}
                      checkIconPosition="right"
                      styles={{
                        input: {
                          height: 38,
                          backgroundColor: "var(--mantine-color-body)",
                          borderColor: "var(--mantine-color-gray-3)",
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      }}
                    />
                  </Stack>
                </Flex>

                <ScrollArea
                  h={isMobile ? 450 : 600}
                  viewportRef={storiesViewportRef}
                  type="auto"
                  offsetScrollbars
                >
                  <Stack gap="md">
                    {(isLoading || isRefetching) && stories.length === 0 && (
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
                          story={story}
                          isMobile={isMobile ?? false}
                          isCommentSelected={selectedVideoId === story.youtubeVideoId}
                          onMessage={() => handleOpenComments(story.youtubeVideoId, story.title)}
                        />
                      ))}

                    {isFetchingNextPage && (
                      <Text size="xs" c="dimmed">
                        더 불러오는 중...
                      </Text>
                    )}
                  </Stack>
                </ScrollArea>
              </Paper>
              <Button
                fw={400}
                fz={14}
                c={"var(--nar-button-more-text)"}
                radius="md"
                variant="default"
                size="md"
                fullWidth
                onClick={handleLoadMore}
                loading={isFetchingNextPage}
                disabled={!hasNextPage || isError}
              >
                {!hasNextPage ? "마지막 페이지입니다" : "스토리 20개 추가 검색"}
              </Button>
            </Stack>
          </Stack>
        </Flex>

        {!isMobile && (
          <CommentListBox
            comments={comments}
            onClose={() => {}}
            isLoading={commentsMutation.isPending}
            selectedVideoTitle={selectedVideoTitle}
            hideCloseButton
          />
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
            selectedVideoTitle={selectedVideoTitle}
            hideCloseButton
          />
        </Drawer>
      )}
    </Container>
  );
}

export default YoutubeStoriesComponent;
