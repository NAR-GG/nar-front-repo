"use client";

import { useState, useEffect } from "react";
import DarkIcon from "@/shared/assets/icons/dark-icon.svg";
import DarkHoverIcon from "@/shared/assets/icons/dark-hover-icon.svg";
import LightIcon from "@/shared/assets/icons/light-icon.svg";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration 불일치 방지용
    setMounted(true);
  }, []);

  const isDark = computedColorScheme === "dark";

  const Icon = !mounted
    ? DarkIcon
    : isDark
      ? LightIcon
      : isHovered
        ? DarkHoverIcon
        : DarkIcon;

  const handleClick = () => {
    setIsAnimating(true);
    toggleColorScheme();
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer overflow-hidden"
    >
      <Icon className={isAnimating ? styles.slideUp : ""} />
    </div>
  );
}
