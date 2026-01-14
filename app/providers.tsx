"use client";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DiscordFloatingButton } from "@/src/shared/ui/discord-floating-button";
import { Layout } from "@/src/shared/ui/layout";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    breakpoints: {
      xs: "30em",
      sm: "48em",
      md: "64em",
      lg: "74em",
      xl: "90em",
    },
    colors: {
      primary: [
        "#f0f4ff",
        "#dbe4ff",
        "#bac8ff",
        "#91a7ff",
        "#748ffc",
        "#5c7cfa",
        "#4c6ef5",
        "#4263eb",
        "#3b5bdb",
        "#364fc7",
      ],
    },
    components: {
      Anchor: {
        defaultProps: {
          c: "inherit",
          td: "none",
        },
      },
      Paper: {
        defaultProps: {
          bg: "var(--nar-bg-secondary)",
          style: {
            border: "1px solid var(--nar-line)",
          },
        },
      },
    },
  });

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <DiscordFloatingButton />
        <Layout>{children}</Layout>
      </MantineProvider>
    </QueryClientProvider>
  );
}
