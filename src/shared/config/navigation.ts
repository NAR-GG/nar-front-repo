import type { NavItem } from "@/shared/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "홈",
    href: "/",
    match: (p) => p === "/",
  },
  {
    key: "pro-matches",
    label: "프로경기",
    href: "/pro-matches",
    match: (p) => p.startsWith("/pro-matches"),
    children: [
      {
        key: "pro-schedule",
        label: "경기일정",
        href: "/pro-matches/schedule",
        match: (p) => p.startsWith("/pro-matches/schedule"),
      },
      {
        key: "pro-list",
        label: "경기리스트",
        href: "/pro-matches/list",
        match: (p) => p === "/pro-matches/list",
      },
    ],
  },
  {
    key: "champions-meta",
    label: "챔피언/메타",
    href: "/champions-meta",
    match: (p) => p.startsWith("/champions-meta"),
  },
  {
    key: "youtube-stories",
    label: "YOUTUBE 스토리",
    href: "/youtube-stories",
    match: (p) => p.startsWith("/youtube-stories"),
  },
];
