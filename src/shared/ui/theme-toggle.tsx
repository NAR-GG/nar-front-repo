"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import {
  Box,
  Transition,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const isMounted = useIsMounted();

  const isDark = computedColorScheme === "dark";

  if (!isMounted) {
    return <Box style={{ width: 44, height: 44 }} />;
  }

  return (
    <Box
      onClick={() => toggleColorScheme()}
      style={{
        cursor: "pointer",
        position: "relative",
        width: 44,
        height: 44,
      }}
    >
      <Transition mounted={isDark} transition="rotate-left" duration={200}>
        {(styles) => (
          <Image
            src="/images/light-icon.svg"
            alt="라이트모드로 전환"
            width={44}
            height={44}
            style={{ ...styles, position: "absolute" }}
          />
        )}
      </Transition>
      <Transition mounted={!isDark} transition="rotate-right" duration={200}>
        {(styles) => (
          <Image
            src="/images/dark-icon.svg"
            alt="다크모드로 전환"
            width={44}
            height={44}
            style={{ ...styles, position: "absolute" }}
          />
        )}
      </Transition>
    </Box>
  );
}
