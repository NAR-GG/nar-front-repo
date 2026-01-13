"use client";

import { useSyncExternalStore } from "react";
import DarkIcon from "@/shared/assets/icons/dark-icon.svg";
import DarkHoverIcon from "@/shared/assets/icons/dark-hover-icon.svg";
import LightIcon from "@/shared/assets/icons/light-icon.svg";
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
      onClick={toggleColorScheme}
      className="group"
      style={{
        cursor: "pointer",
        position: "relative",
        width: 44,
        height: 44,
      }}
    >
      {/* 🌞 Light Icon (dark 모드일 때 표시) */}
      <Transition mounted={isDark} transition="rotate-left" duration={200}>
        {(styles) => (
          <LightIcon
            width={44}
            height={44}
            style={{ ...styles, position: "absolute" }}
          />
        )}
      </Transition>

      {/* 🌙 Dark Icon + Hover Icon */}
      <Transition mounted={!isDark} transition="rotate-right" duration={200}>
        {(styles) => (
          <>
            {/* 기본 Dark 아이콘 */}
            <DarkIcon
              width={44}
              height={44}
              className="absolute transition-opacity duration-200 group-hover:opacity-0"
              style={{
                ...styles,
                inset: 0,
              }}
            />

            {/* Hover 시 그라데이션 아이콘 */}
            <DarkHoverIcon
              width={44}
              height={44}
              className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                ...styles,
                inset: 0,
              }}
            />
          </>
        )}
      </Transition>
    </Box>
  );
}
