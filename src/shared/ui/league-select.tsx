"use client";

import { useState, type SVGProps, type FC } from "react";
import { Popover } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Lck from "@/shared/assets/images/lck-home.svg";
import Lec from "@/shared/assets/images/lec-home.svg";
import Lpl from "@/shared/assets/images/lpl-home.svg";
import Lcs from "@/shared/assets/images/lcs-home.svg";
import Msi from "@/shared/assets/images/msi-home.svg";
import Worlds from "@/shared/assets/images/worlds-home.svg";

export type LeagueId = "LCK" | "LEC" | "LPL" | "LCS" | "MSI" | "WORLDS";

interface LeagueOption {
  id: LeagueId;
  Icon: FC<SVGProps<SVGSVGElement>>;
}

const DEFAULT_LEAGUE_OPTIONS: LeagueOption[] = [
  { id: "LCK", Icon: Lck },
  { id: "LEC", Icon: Lec },
  { id: "LPL", Icon: Lpl },
  { id: "LCS", Icon: Lcs },
  { id: "MSI", Icon: Msi },
  { id: "WORLDS", Icon: Worlds },
];

interface LeagueSelectProps {
  value: LeagueId;
  onChange: (league: LeagueId) => void;
  options?: LeagueOption[];
}

export function LeagueSelect({
  value,
  onChange,
  options = DEFAULT_LEAGUE_OPTIONS,
}: LeagueSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      opened={open}
      onChange={setOpen}
      position="bottom-end"
      shadow="md"
      radius="md"
    >
      <Popover.Target>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="league-select-trigger"
        >
          League: {value}
          {open ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )}
        </button>
      </Popover.Target>
      <Popover.Dropdown
        className="!p-3 !rounded-2xl !border !border-[var(--nar-line-2)] !bg-[var(--nar-bg-tertiary)] !shadow-[0_4px_9px_0_rgba(0,0,0,0.07)]"
      >
        <div className="flex items-center gap-3 sm:gap-5">
          {options.map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
              className={`flex flex-col items-center justify-center w-[70px] h-[70px] font-['SF_Pro'] text-[14px] font-normal leading-[155%] ${
                value === id
                  ? "text-[var(--nar-text-primary)]"
                  : "text-[var(--nar-text-3)]"
              }`}
            >
              <Icon className="w-7 h-7" />
              <span>{id}</span>
            </button>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
