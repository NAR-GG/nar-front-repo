import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import StoryCard from "../components/stories/StoryCard";
import { useMemo, useState } from "react";
import { useGetYoutubeList } from "../hooks/useGetYoutubeList";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

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

function YoutubeStories() {
  const [selectedItem, setSelectedItem] = useState(CATEGORY_ITEMS[0]); // 기본: all

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
  } = useGetYoutubeList({
    category: selectedItem.key,
    size: 20,
    sort: "publishedAt,desc",
  });

  // pages -> content 평탄화
  const stories = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.content ?? []);
  }, [data]);

  const handleChangeCategory = (item) => {
    setSelectedItem(item);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getTimeAgo = (publishedAt) =>
    publishedAt ? dayjs(publishedAt).fromNow() : "";

  const getTypeAndBadge = () => {
    if (selectedItem.key === "all") {
      return {
        type: null,
      };
    }

    return {
      type: selectedItem.type,
    };
  };

  const { type } = getTypeAndBadge();

  return (
    <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
      <Stack gap="lg" mt="md">
        <Stack gap={4}>
          <Group gap="xs">
            <img
              src="/icons/youtube.png"
              alt="유튜브 아이콘"
              width="53px"
              height="37px"
            />
            <Text fw={800} fz={26}>
              Youtube 스토리
            </Text>
          </Group>
          <Text size="sm" fw={600}>
            LOL 프로팀과 인기 쇼츠 채널의 소식을 실시간으로 확인해 보세요.
          </Text>
        </Stack>

        <Flex gap="lg" align="stretch">
          <Paper radius="md" p="0.85rem" withBorder w={200} h={160}>
            <Stack gap={10}>
              {CATEGORY_ITEMS.map((item) => {
                const selected = selectedItem.key === item.key;

                return (
                  <Flex
                    key={item.key}
                    align="center"
                    gap={8}
                    onClick={() => handleChangeCategory(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <Box
                      w={8}
                      h={8}
                      style={{
                        borderRadius: 8,
                        backgroundColor: selected ? "#000" : "transparent",
                      }}
                    />

                    <Text
                      fz={14}
                      fw={selected ? 700 : 500}
                      c={selected ? "#000" : "#868E96"}
                    >
                      {item.label}
                    </Text>
                  </Flex>
                );
              })}
            </Stack>
          </Paper>

          <Stack style={{ flex: 1 }} gap="md">
            <Paper radius="md" p="lg" withBorder>
              <Paper radius="md" p="lg" withBorder bg="#F7F7F9">
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
                    stories.length > 0 &&
                    stories.map((story) => (
                      <StoryCard
                        key={story.videoId}
                        type={type}
                        badgeLabel={story.channelType}
                        channelName={story.channelName}
                        timeAgo={getTimeAgo(story.publishedAt)}
                        title={story.title}
                        thumbnailUrl={story.thumbnailUrl}
                        videoUrl={story.videoUrl}
                        channelProfileUrl={story.channelProfileUrl}
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
              {!hasNextPage ? "마지막 페이지입니다" : "동영상 20개 추가 검색"}
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}

export default YoutubeStories;
