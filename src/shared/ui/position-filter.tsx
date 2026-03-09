import type { SVGProps } from "react";
import NarGrayTop from "@/shared/assets/icons/nar_gray_top.svg";
import NarGrayAll from "@/shared/assets/icons/nar_gray_all.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_gray_jungle.svg";
import NarGrayMid from "@/shared/assets/icons/nar_gray_mid.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_gray_bottom.svg";
import NarGraySupport from "@/shared/assets/icons/nar_gray_support.svg";
import NarAll from "@/shared/assets/icons/nar_all.svg";
import NarTop from "@/shared/assets/icons/nar_top.svg";
import NarJungle from "@/shared/assets/icons/nar_jungle.svg";
import NarMid from "@/shared/assets/icons/nar_mid.svg";
import NarBottom from "@/shared/assets/icons/nar_bottom.svg";
import NarSupport from "@/shared/assets/icons/nar_support.svg";

export type PositionFilterId = "*" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";

export interface PositionFilterItem<T extends string = PositionFilterId> {
  id: T;
  name: string;
  inactiveIcon?: React.FC<SVGProps<SVGSVGElement>>;
  activeIcon?: React.FC<SVGProps<SVGSVGElement>>;
}

const defaultPositionItems: PositionFilterItem<PositionFilterId>[] = [
  { id: "*", name: "전체", inactiveIcon: NarGrayAll, activeIcon: NarAll },
  { id: "TOP", name: "탑", inactiveIcon: NarGrayTop, activeIcon: NarTop },
  {
    id: "JUG",
    name: "정글",
    inactiveIcon: NarGrayJungle,
    activeIcon: NarJungle,
  },
  { id: "MID", name: "미드", inactiveIcon: NarGrayMid, activeIcon: NarMid },
  {
    id: "ADC",
    name: "원딜",
    inactiveIcon: NarGrayBottom,
    activeIcon: NarBottom,
  },
  {
    id: "SUP",
    name: "서포터",
    inactiveIcon: NarGraySupport,
    activeIcon: NarSupport,
  },
];

interface PositionFilterProps<T extends string = PositionFilterId> {
  items?: PositionFilterItem<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  isMobile?: boolean;
}

export function PositionFilter<T extends string = PositionFilterId>({
  items,
  selectedId,
  onSelect,
  isMobile = false,
}: PositionFilterProps<T>) {
  const positionItems = (items ?? defaultPositionItems) as PositionFilterItem<T>[];

  return (
    <div
      style={{
        display: "flex",
        width: isMobile ? "100%" : "auto",
        maxWidth: isMobile ? "100%" : "auto",
      }}
    >
      {positionItems.map(
        (
          { id, name, inactiveIcon: InactiveIcon, activeIcon: ActiveIcon },
          index,
        ) => (
          <div
            key={id}
            style={{
              padding: isMobile ? "8px 4px" : "12px 14px",
              cursor: "pointer",
              backgroundColor: "var(--nar-bg-tertiary)",
              border: "1px solid var(--nar-line-2)",
              borderLeft:
                index === 0 ? "1px solid var(--nar-line-2)" : "none",
              borderRight: "1px solid var(--nar-line-2)",
              borderRadius:
                index === 0
                  ? "6px 0 0 6px"
                  : index === positionItems.length - 1
                    ? "0 6px 6px 0"
                    : "0",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "44px",
              flex: isMobile ? "1" : "unset",
              minWidth: isMobile ? 0 : "50px",
              overflow: "hidden",
            }}
            onClick={() => onSelect(id)}
            title={name}
          >
            {selectedId === id && ActiveIcon ? (
              <ActiveIcon
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            ) : InactiveIcon ? (
              <InactiveIcon
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            ) : null}
          </div>
        ),
      )}
    </div>
  );
}
