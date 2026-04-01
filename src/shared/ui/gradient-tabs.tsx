"use client";

import clsx from "clsx";

export interface GradientTabItem {
  label: string;
  value: string;
}

interface GradientTabsProps {
  items: GradientTabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function GradientTabs({ items, value, onChange }: GradientTabsProps) {
  return (
    <div className="flex px-4 border-b-2 border-(--nar-text-cont-nav)">
      {items.map((item) => {
        const isSelected = value === item.value;

        return (
          <div
            key={item.value}
            onClick={() => onChange(item.value)}
            className={clsx(
              "flex flex-col items-center justify-center cursor-pointer pt-5 pb-1.75 px-2.5 gap-2.5 border-b-4",
              isSelected
                ? "border-transparent [border-image:var(--nar_gradients)_1]"
                : "border-transparent",
            )}
          >
            <span
              className={clsx(
                "text-[16px] whitespace-nowrap",
                isSelected ? "font-bold" : "font-normal",
              )}
              style={
                isSelected
                  ? {
                      background: "var(--nar_gradients)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : { color: "var(--nar-text-cont-nav)" }
              }
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
