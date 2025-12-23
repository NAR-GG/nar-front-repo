"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Group,
  Paper,
  Text,
  Title,
  HoverCard,
  Stack,
  Box,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";
import { IconChevronDown } from "@tabler/icons-react";

type SubNavItem = {
  key: string;
  label: string;
  href: string;
  description?: string;
  match?: (pathname: string) => boolean;
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  match?: (pathname: string) => boolean;
  children?: SubNavItem[];
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "pro-matches",
    label: "프로경기",
    href: "/pro-matches",
    match: (p) => p.startsWith("/pro-matches"),
    children: [
      {
        key: "pro-schedule",
        label: "경기 일정",
        description: "LCK 프로 경기 일정 확인",
        href: "/pro-matches/schedule",
        match: (p) => p.startsWith("/pro-matches/schedule"),
      },
      {
        key: "pro-list",
        label: "경기 리스트",
        description: "프로 경기 목록 및 상세 분석",
        href: "/pro-matches/list",
        match: (p) => p === "/pro-matches/list",
      },
    ],
  },
  {
    key: "team-players",
    label: "팀·경기",
    href: "/team-players",
    match: (p) => p.startsWith("/team-players"),
  },
  {
    key: "champions-meta",
    label: "챔피언·메타",
    href: "/champions-meta",
    match: (p) => p.startsWith("/champions-meta"),
  },
  {
    key: "analysis-lab",
    label: "분석 랩",
    href: "/analysis-lab",
    match: (p) => p.startsWith("/analysis-lab"),
  },
  {
    key: "youtube-stories",
    label: "YOUTUBE 스토리",
    href: "/youtube-stories",
    match: (p) => p.startsWith("/youtube-stories"),
  },
];

const styles = {
  mainItem: (active: boolean): React.CSSProperties => ({
    color: active ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
    cursor: "pointer",
    padding: "8px 0",
    borderBottom: active ? "2px solid white" : "2px solid transparent",
    transition: "all 0.2s ease",
    fontSize: "15px",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }),
  dropdown: {
    background: "#ffffff",
    border: "none",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    padding: 0,
    overflow: "hidden",
  },
  subMenuItem: (active: boolean): React.CSSProperties => ({
    padding: "12px 16px",
    cursor: "pointer",
    backgroundColor: active ? "#f0f4ff" : "transparent",
    borderLeft: active ? "3px solid #5383e8" : "3px solid transparent",
    transition: "all 0.15s ease",
  }),
} as const;

const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface SubMenuItemProps {
  item: SubNavItem;
  isActive: boolean;
  onClick: () => void;
}

function SubMenuItem({ item, isActive, onClick }: SubMenuItemProps) {
  return (
    <Box
      style={styles.subMenuItem(isActive)}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <Text
        size="sm"
        fw={isActive ? 700 : 500}
        c={isActive ? "#5383e8" : "#333"}
      >
        {item.label}
      </Text>
      {item.description && (
        <Text size="xs" c="dimmed" mt={2}>
          {item.description}
        </Text>
      )}
    </Box>
  );
}

interface SubMenuDropdownProps {
  items: SubNavItem[];
  pathname: string;
  onNavigate: (href: string) => void;
}

function SubMenuDropdown({
  items,
  pathname,
  onNavigate,
}: SubMenuDropdownProps) {
  return (
    <Stack gap={0}>
      {items.map((child) => {
        const childActive = child.match
          ? child.match(pathname)
          : pathname.startsWith(child.href);

        return (
          <SubMenuItem
            key={child.key}
            item={child}
            isActive={childActive}
            onClick={() => onNavigate(child.href)}
          />
        );
      })}
    </Stack>
  );
}

interface NavItemWithDropdownProps {
  item: NavItem;
  isActive: boolean;
  pathname: string;
  onNavigate: (href: string) => void;
}

function NavItemWithDropdown({
  item,
  isActive,
  pathname,
  onNavigate,
}: NavItemWithDropdownProps) {
  return (
    <HoverCard
      width={240}
      position="bottom-start"
      offset={4}
      withinPortal
      openDelay={50}
      closeDelay={150}
      shadow="lg"
      radius="md"
    >
      <HoverCard.Target>
        <Text
          size="sm"
          fw={isActive ? 700 : 400}
          style={styles.mainItem(isActive)}
          onClick={() => onNavigate(item.href)}
        >
          {item.label}
          <IconChevronDown size={14} style={{ opacity: 0.7 }} />
        </Text>
      </HoverCard.Target>

      <HoverCard.Dropdown style={styles.dropdown}>
        <SubMenuDropdown
          items={item.children!}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

// ============ Main Component ============
export function Header() {
  const {
    data: updateInfo,
    isLoading,
    error,
  } = useQuery(combinationsQueries.lastUpdate());

  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const activeMainKey = useMemo(() => {
    const found = NAV_ITEMS.find((item) =>
      item.match ? item.match(pathname) : pathname.startsWith(item.href)
    );
    return found?.key ?? NAV_ITEMS[0]?.key;
  }, [pathname]);

  const updateText = useMemo(() => {
    if (isLoading) return "로딩 중...";
    if (error) return "최근 업데이트: -";
    return `최근 업데이트: ${formatDate(updateInfo?.data?.lastUpdateTime)}`;
  }, [isLoading, error, updateInfo]);

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Paper
      p={0}
      radius={0}
      style={{
        background: "#5383e8",
        color: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        position: "relative",
      }}
    >
      <Container
        size="xl"
        px={{ base: 16, sm: 24, md: 32 }}
        style={{ maxWidth: "1200px" }}
      >
        <Group justify="space-between" align="center" wrap="nowrap" py="sm">
          <Group gap="xs" align="center" wrap="nowrap">
            <Image
              src="/images/nar-icon.png"
              alt="NAR.GG 아이콘"
              width={42}
              height={42}
              style={{ objectFit: "contain" }}
            />
            <Title
              order={1}
              fw={700}
              style={{
                fontSize: "1.75rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              NAR.GG
            </Title>
          </Group>

          <Text size="xs" c="white" ta="right" style={{ whiteSpace: "nowrap" }}>
            {updateText}
          </Text>
        </Group>

        <div
          style={{
            paddingBottom: "12px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Group gap="xl" align="center" wrap="nowrap">
            {NAV_ITEMS.map((item) => {
              const isActive = item.key === activeMainKey;

              if (item.children?.length) {
                return (
                  <NavItemWithDropdown
                    key={item.key}
                    item={item}
                    isActive={isActive}
                    pathname={pathname}
                    onNavigate={handleNavigate}
                  />
                );
              }

              return (
                <Text
                  key={item.key}
                  size="sm"
                  fw={isActive ? 700 : 400}
                  style={styles.mainItem(isActive)}
                  onClick={() => handleNavigate(item.href)}
                >
                  {item.label}
                </Text>
              );
            })}
          </Group>
        </div>
      </Container>
    </Paper>
  );
}
