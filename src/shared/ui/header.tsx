"use client";

import { useMemo, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Group } from "@mantine/core";

import { NAV_ITEMS } from "@/shared/config/navigation";
import type { NavItem, SubNavItem } from "@/shared/types/navigation";
import { ThemeToggle } from "./theme-toggle";
import TitleLogo from "@/shared/assets/images/title-logo.svg";
import Menu from "@/shared/assets/icons/menu.svg";
import Close from "@/shared/assets/icons/close.svg";
import { cn } from "@/shared/lib/cn";

const isMatch = (
  pathname: string,
  href: string,
  match?: (p: string) => boolean
) => (match ? match(pathname) : pathname.startsWith(href));

function useHeaderNav(pathname: string, hoverParentKey: string | null) {
  const routeParent = useMemo<NavItem | undefined>(() => {
    return NAV_ITEMS.find((item) => {
      if (!item.children?.length) return false;
      return item.children.some((c) => isMatch(pathname, c.href, c.match));
    });
  }, [pathname]);

  const activeSubParent = useMemo<NavItem | undefined>(() => {
    if (routeParent) return routeParent;
    if (!hoverParentKey) return undefined;
    return NAV_ITEMS.find((i) => i.key === hoverParentKey);
  }, [routeParent, hoverParentKey]);

  const subMenuList: SubNavItem[] = activeSubParent?.children ?? [];

  const isVisibleSubHeader =
    subMenuList.length > 0 && (routeParent != null || hoverParentKey != null);

  return { routeParent, subMenuList, isVisibleSubHeader };
}

function DesktopNav({
  pathname,
  onHoverItem,
  onGo,
}: {
  pathname: string;
  onHoverItem: (item: NavItem) => void;
  onGo: (href: string) => void;
}) {
  return (
    <div className="hidden min-[1201px]:flex items-center h-full gap-6 xl:gap-20">
      {NAV_ITEMS.map((item) => {
        const hasChildren = !!item.children?.length;

        const isActive =
          item.match?.(pathname) ||
          item.children?.some((c) => isMatch(pathname, c.href, c.match));

        return (
          <div
            key={item.key}
            className="h-full flex items-center"
            onMouseEnter={() => onHoverItem(item)}
          >
            <span
              className={cn(
                "flex items-center py-2 text-[15px] whitespace-nowrap cursor-pointer",
                "transition-colors duration-200",
                isActive
                  ? "text-(--nar-text-GNB-active) font-bold"
                  : "text-(--nar-text-GNB-default) font-bold hover:text-(--nar-text-GNB-hover)",
                hasChildren && "select-none"
              )}
              onClick={() => {
                if (hasChildren) return;
                onGo(item.href);
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MobileDrawer({
  pathname,
  isOpen,
  openParentKey,
  setOpenParentKey,
  onGo,
  onClose,
  headerHeightClass,
}: {
  pathname: string;
  isOpen: boolean;
  openParentKey: string | null;
  setOpenParentKey: (
    v: string | null | ((prev: string | null) => string | null)
  ) => void;
  onGo: (href: string) => void;
  onClose: () => void;
  headerHeightClass: string;
}) {
  if (!isOpen) return null;

  const toggleMobileParent = (item: NavItem) => {
    if (!item.children?.length) return;
    setOpenParentKey((prev) => (prev === item.key ? null : item.key));
  };

  return (
    <div
      className={cn(
        "fixed inset-0 top-[49.9px] lg:top-[98px] min-[1201px]:hidden z-40 overflow-auto"
      )}
      onClick={onClose}
    >
      <div
        className="ml-auto w-full max-w-[1200px] shadow-xl flex [background:var(--nar_gradients_LNB)] flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full px-4 py-1.5">
          {NAV_ITEMS.map((item) => {
            const isOpenParent = openParentKey === item.key;
            const hasChildren = !!item.children?.length;

            return (
              <div
                key={item.key}
                className="w-full border-b last:border-b-0 border-(--nar-line)"
              >
                <div
                  className="flex justify-between items-center cursor-pointer px-4 py-3.5 hover:bg-black/5"
                  onClick={() => {
                    if (!hasChildren) {
                      onGo(item.href);
                      onClose();
                      return;
                    }
                    toggleMobileParent(item);
                  }}
                >
                  <span className="font-bold text-[16px] text-white">
                    {item.label}
                  </span>

                  {hasChildren && (
                    <span
                      className={cn(
                        "text-white/80 text-[12px] select-none",
                        isOpenParent ? "rotate-180" : "rotate-0",
                        "transition-transform duration-200"
                      )}
                    >
                      ▼
                    </span>
                  )}
                </div>

                {hasChildren && (
                  <div
                    className={cn(
                      "w-full text-white py-1 border-t-[5px] [border-image:var(--nar_gradients_LNB)_1]",
                      isOpenParent ? "bg-white/20" : "bg-transparent",
                      isOpenParent ? "block" : "hidden"
                    )}
                  >
                    {item.children!.map((sub) => {
                      const isSubActive = isMatch(
                        pathname,
                        sub.href,
                        sub.match
                      );

                      return (
                        <div
                          key={sub.key}
                          className={cn(
                            "px-4 py-3.5 cursor-pointer font-medium transition-colors",
                            "hover:bg-white/10",
                            isSubActive
                              ? "border-b-[5px] border-[rgba(255,254,254,0.5)] bg-white/10"
                              : "border-b-[5px] border-transparent"
                          )}
                          onClick={() => {
                            onGo(sub.href);
                            onClose();
                          }}
                        >
                          {sub.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn("min-[1201px]:hidden", headerHeightClass)} />
    </div>
  );
}

function SubHeader({
  pathname,
  subMenuList,
  onGo,
  subHeaderHeightClass,
}: {
  pathname: string;
  subMenuList: SubNavItem[];
  onGo: (href: string) => void;
  subHeaderHeightClass: string;
}) {
  return (
    <div
      className={cn(
        "hidden min-[1201px]:flex w-full items-center justify-center gap-10 px-8",
        subHeaderHeightClass,
        "[background:var(--nar_gradients_LNB)]",
        "shadow-[var(--sub-header-shadow)]",
        "border-t border-(--nar-line)"
      )}
    >
      {subMenuList.map((sub) => {
        const isSubActive = isMatch(pathname, sub.href, sub.match);

        return (
          <button
            key={sub.key}
            type="button"
            onClick={() => onGo(sub.href)}
            className={cn(
              "h-full py-2.5 px-10 transition-colors",
              isSubActive
                ? "border-b-4 border-white"
                : "border-b-4 border-transparent"
            )}
          >
            <span
              className={cn(
                "text-[15px] transition-all duration-200",
                isSubActive
                  ? "font-extrabold text-white"
                  : "font-medium text-white/80 hover:text-white"
              )}
            >
              {sub.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const [hoverParentKey, setHoverParentKey] = useState<string | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openParentKey, setOpenParentKey] = useState<string | null>(null);

  const { routeParent, subMenuList, isVisibleSubHeader } = useHeaderNav(
    pathname,
    hoverParentKey
  );

  const headerHeightClass = "h-[49.9px] lg:h-[98px] xl:h-[92px]";
  const subHeaderHeightClass = "h-[27.9px] lg:h-[44px]";

  const go = useCallback((href: string) => router.push(href), [router]);

  const closeSubHeader = useCallback(() => {
    if (routeParent) return;
    setHoverParentKey(null);
  }, [routeParent]);

  const handleMainHover = useCallback(
    (item: NavItem) => {
      if (routeParent) return;
      if (item.children?.length) setHoverParentKey(item.key);
      else setHoverParentKey(null);
    },
    [routeParent]
  );

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full z-50"
        onMouseLeave={closeSubHeader}
      >
        <div
          className={cn(
            "w-full px-5 bg-(--nar-bg-GNB) shadow-[0_4px_20px_0_rgba(240,62,62,0.08)]",
            headerHeightClass,
            "flex items-center"
          )}
        >
          <Group
            justify="space-between"
            align="center"
            wrap="nowrap"
            className="w-full"
          >
            <div className="flex items-center gap-[53px] w-full">
              <TitleLogo className="w-[183px] h-[44px]" />

              <DesktopNav
                pathname={pathname}
                onHoverItem={handleMainHover}
                onGo={go}
              />
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <div
                className="min-[1201px]:hidden cursor-pointer w-[44px] h-[44px] flex items-center justify-center"
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                {isMenuOpen ? <Close /> : <Menu />}
              </div>
            </div>
          </Group>
        </div>

        <MobileDrawer
          pathname={pathname}
          isOpen={isMenuOpen}
          openParentKey={openParentKey}
          setOpenParentKey={setOpenParentKey}
          onGo={go}
          onClose={closeMobileMenu}
          headerHeightClass={headerHeightClass}
        />

        {isVisibleSubHeader && (
          <SubHeader
            pathname={pathname}
            subMenuList={subMenuList}
            onGo={go}
            subHeaderHeightClass={subHeaderHeightClass}
          />
        )}
      </div>

      <div
        className={cn(
          headerHeightClass,
          "hidden min-[1201px]:block",
          isVisibleSubHeader ? subHeaderHeightClass : "h-0"
        )}
      />
      <div className={cn("min-[1201px]:hidden", headerHeightClass)} />
    </>
  );
}
