"use client";

import { useMantineColorScheme } from "@mantine/core";

export function TitleLogo({
  width = 183,
  height = 44,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const { colorScheme } = useMantineColorScheme();

  // Light mode: #e26212 → #950371 → #250657
  // Dark mode: #ff6c11 → #d2019f → #4b0ab4
  const gradientColors =
    colorScheme === "dark"
      ? { start: "#ff6c11", mid: "#d2019f", end: "#4b0ab4" }
      : { start: "#e26212", mid: "#950371", end: "#250657" };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 183 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.0447 43.2174V27.8608L0 0.782715H10.3239L18.7199 18.3477L27.1159 0.782715H37.4398L23.5252 27.8608V43.2174H14.0447Z"
        fill="url(#titleLogoGradient)"
      />
      <path
        d="M60.3566 43.2174L57.1864 35.082H42.2314L39.0612 43.2174H28.9974L45.0114 0.782715H54.4068L70.4208 43.2174H60.3566ZM45.2714 27.4708H54.1468L49.7091 15.9557L45.2714 27.4708Z"
        fill="url(#titleLogoGradient)"
      />
      <path
        d="M73.3301 43.2174V0.782715H95.8147C99.3148 0.782715 102.29 1.43232 104.74 2.7315C107.19 4.03071 109.055 5.84931 110.335 8.18728C111.634 10.5253 112.283 13.2432 112.283 16.3413C112.283 19.4006 111.634 22.0993 110.335 24.4373C109.055 26.7753 107.19 28.5939 104.74 29.8931C102.29 31.1923 99.3148 31.8419 95.8147 31.8419H82.8106V43.2174H73.3301ZM82.8106 24.1773H94.5758C96.5993 24.1773 98.1029 23.6771 99.0866 22.6768C100.09 21.6571 100.591 20.2086 100.591 18.3313V14.3513C100.591 12.474 100.09 11.0352 99.0866 10.0349C98.1029 9.01521 96.5993 8.50533 94.5758 8.50533H82.8106V24.1773Z"
        fill="url(#titleLogoGradient)"
      />
      <path
        d="M115.453 43.2174V0.782715H137.937C141.438 0.782715 144.413 1.43232 146.863 2.7315C149.313 4.03071 151.178 5.84931 152.458 8.18728C153.757 10.5253 154.406 13.2432 154.406 16.3413C154.406 19.4006 153.757 22.0993 152.458 24.4373C151.178 26.7753 149.313 28.5939 146.863 29.8931C144.413 31.1923 141.438 31.8419 137.937 31.8419H124.933V43.2174H115.453ZM124.933 24.1773H136.699C138.722 24.1773 140.226 23.6771 141.209 22.6768C142.213 21.6571 142.714 20.2086 142.714 18.3313V14.3513C142.714 12.474 142.213 11.0352 141.209 10.0349C140.226 9.01521 138.722 8.50533 136.699 8.50533H124.933V24.1773Z"
        fill="url(#titleLogoGradient)"
      />
      <path
        d="M157.576 35.082V28.1208H164.927V8.44527H157.576V0.782715H182.402V8.44527H175.051V28.1208H182.402V35.082H175.051V43.2174H164.927V35.082H157.576Z"
        fill="url(#titleLogoGradient)"
      />
      <defs>
        <linearGradient
          id="titleLogoGradient"
          x1="-17.7328"
          y1="-21.8261"
          x2="223.09"
          y2="-15.7948"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={gradientColors.start} />
          <stop offset="0.4014" stopColor={gradientColors.mid} />
          <stop offset="1" stopColor={gradientColors.end} />
        </linearGradient>
      </defs>
    </svg>
  );
}
