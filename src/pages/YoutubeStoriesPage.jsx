import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  List,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import StoryCard from "../components/stories/StoryCard";
import { useState } from "react";

function YoutubeStories() {
  const [active, setActive] = useState("all");
  const items = [
    { key: "all", label: "전체" },
    { key: "pro", label: "프로팀 Youtube" },
    { key: "shorts", label: "롤 쇼츠 Youtube" },
  ];
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
          <Paper radius="md" p="lg" withBorder w={200}>
            <Stack gap={10}>
              {items.map((item) => {
                const selected = active === item.key;

                return (
                  <Flex
                    key={item.key}
                    align="center"
                    gap={8}
                    onClick={() => setActive(item.key)}
                    style={{
                      cursor: "pointer",
                    }}
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
                  <StoryCard
                    type="pro"
                    badgeLabel="PRO"
                    channelName="T1"
                    timeAgo="25분 전"
                  />
                  <StoryCard
                    type="shorts"
                    badgeLabel="Shorts"
                    channelName="롤뻔뻔"
                    timeAgo="2시간 전"
                  />
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
            >
              20게임 추가 검색
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}

export default YoutubeStories;
