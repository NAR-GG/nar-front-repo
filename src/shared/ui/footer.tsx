"use client";

import {
  Paper,
  Container,
  Text,
  Anchor,
  Divider,
  Stack,
  Group,
} from "@mantine/core";

export function Footer() {
  return (
    <Paper
      component="footer"
      bg="transparent"
      shadow="sm"
      className="bg-(--nar-bg-tertiary)"
      p={{ base: "md", md: "lg" }}
    >
      <Container size="xl">
        <Divider
          className="border-(--nar-line)"
          mb={{ base: "md", md: "lg" }}
        />

        <Stack gap="sm" align="center">
          <Group gap="xs" justify="center">
            <Text
              size="sm"
              className="text-(--nar-text)"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              문의사항:
            </Text>

            <Anchor
              href="mailto:mentenseoul@gmail.com"
              td="none"
              className="text-(--nar-text)"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              mentenseoul@gmail.com
            </Anchor>

            <Text className="text-(--nar-text-2)">|</Text>

            <Anchor
              href="https://github.com/NAR-GG"
              target="_blank"
              rel="noopener noreferrer"
              td="none"
              className="text-(--nar-text)"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              GitHub
            </Anchor>
          </Group>

          <Text
            size="sm"
            ta="center"
            className="text-(--nar-text)"
            style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
          >
            © 2025 NAR.GG. All rights reserved.
          </Text>

          <Text
            size="xs"
            ta="center"
            className="text-(--nar-text-2)"
            style={{
              fontSize: "clamp(0.7rem, 1.5vw, 0.75rem)",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            NAR.GG isn't endorsed by Riot Games and doesn't reflect the views or
            opinions of Riot Games or anyone officially involved in producing or
            managing Riot Games properties. Riot Games, and all associated
            properties are trademarks or registered trademarks of Riot Games,
            Inc.
          </Text>
        </Stack>
      </Container>
    </Paper>
  );
}
