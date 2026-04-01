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
}

export function PositionFilter<T extends string = PositionFilterId>({
  items,
  selectedId,
  onSelect,
}: PositionFilterProps<T>) {
  const positionItems = (items ?? defaultPositionItems) as PositionFilterItem<T>[];

  return (
    <div className="flex w-full sm:w-auto">
      {positionItems.map(
        ({ id, name, inactiveIcon: InactiveIcon, activeIcon: ActiveIcon }) => (
          <div
            key={id}
            className="position-filter-btn first:border-l first:rounded-l-md last:rounded-r-md"
            onClick={() => onSelect(id)}
            title={name}
          >
            {selectedId === id && ActiveIcon ? (
              <ActiveIcon className="size-5 sm:size-6" />
            ) : InactiveIcon ? (
              <InactiveIcon className="size-5 sm:size-6" />
            ) : null}
          </div>
        ),
      )}
    </div>
  );
}
