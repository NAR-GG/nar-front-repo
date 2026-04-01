"use client";

import type { CSSProperties, RefObject } from "react";

export interface CommonTabItem {
  id: string | number;
  label: string;
  value?: string | number;
  active?: boolean;
}

interface CommonTabsProps {
  items: CommonTabItem[];
  value?: string | number;
  onChange?: (value: string | number | undefined, item: CommonTabItem) => void;
  onTabClick?: (item: CommonTabItem) => void;
  variant?: "dropdown" | "set-nav";
  containerRef?: RefObject<HTMLDivElement | null>;
  containerStyle?: CSSProperties;
}

export function CommonTabs({
  items,
  value,
  onChange,
  onTabClick,
  variant = "set-nav",
  containerRef,
  containerStyle,
}: CommonTabsProps) {
  const isDropdown = variant === "dropdown";

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={
        isDropdown
          ? "min-w-[100px] bg-[var(--nar-button-2-bg)] rounded-lg py-1 shadow-lg"
          : "flex items-center gap-[3px]"
      }
    >
      {items.map((item) => {
        const itemValue = item.value ?? item.id;
        const isActive =
          value !== undefined ? value === itemValue : Boolean(item.active);

        return (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            onChange?.(itemValue, item);
            onTabClick?.(item);
          }}
          className={
            isDropdown
              ? "group px-4 h-[34px] w-full flex items-center justify-center cursor-pointer whitespace-nowrap"
              : `rounded-t-lg px-[14px] py-[7px] transition-colors ${
                  isActive
                    ? "bg-[var(--nar-bg-tertiary)] border border-b-0 border-[var(--nar-line)]"
                    : "bg-[var(--nar-navchip-bg-defualt)] border-none"
                }`
          }
        >
          <span
            className={
              isDropdown
                ? "text-[14px] font-normal text-(--nar-button-2-text) group-hover:text-(--nar-red-500) transition-colors"
                : `text-[16px] font-semibold ${
                    isActive
                      ? "text-[var(--nar-text-secondary)]"
                      : "text-[var(--nar-text-tertiary-sub)]"
                  }`
            }
          >
            {item.label}
          </span>
        </button>
        );
      })}
    </div>
  );
}
