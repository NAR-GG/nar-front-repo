"use client";

import { memo, useCallback } from "react";
import { ActionIcon, Text } from "@mantine/core";
import clsx from "clsx";
import dayjs from "dayjs";
import CaretLeft from "@/shared/assets/icons/caret-left.svg";
import CaretRight from "@/shared/assets/icons/caret-right.svg";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

interface WeekDateBarProps {
  weekDates: Date[];
  selectedDate: Date;
  weekHasMatches: (boolean | undefined)[];
  weekIsLoading: boolean[];
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

interface WeekDayItemProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const WeekDayItem = memo(function WeekDayItem({
  date,
  isSelected,
  isToday,
  isDisabled,
  onSelect,
}: WeekDayItemProps) {
  const dayIndex = date.getDay();

  const activeStyle = {
    background: "var(--nar_gradients)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const inactiveStyle = {
    color: isDisabled
      ? "var(--nar-searchbar-text-con)"
      : "var(--nar-text-tertiary-sub)",
  };

  return (
    <div
      onClick={() => { if (!isDisabled) onSelect(); }}
      className={clsx(
        "flex flex-col items-center justify-center pt-5 pb-1.75 px-2.5 gap-2.5 flex-1 border-b-4 border-transparent",
        isSelected && "[border-image:var(--nar_gradients)_1]",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
      style={{
        boxShadow: `0 2px 0 ${isDisabled ? "var(--nar-searchbar-text-con)" : "var(--nar-text-tertiary-sub)"}`,
      }}
    >
      <Text
        lineClamp={1}
        className={clsx("text-sm sm:text-base", isSelected ? "font-bold" : "font-normal")}
        style={isSelected ? activeStyle : inactiveStyle}
      >
        {isToday ? "오늘" : DAY_NAMES[dayIndex]}
      </Text>
      <span
        className={clsx("text-base sm:text-lg", isSelected ? "font-bold" : "font-medium")}
        style={isSelected ? activeStyle : inactiveStyle}
      >
        {dayjs(date).format("M.D")}
      </span>
    </div>
  );
});

export const WeekDateBar = memo(function WeekDateBar({
  weekDates,
  selectedDate,
  weekHasMatches,
  weekIsLoading,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}: WeekDateBarProps) {
  const today = new Date().toDateString();

  return (
    <div className="flex items-center px-4 gap-0 sm:gap-6.5">
      <ActionIcon variant="transparent" onClick={onPrevWeek} c="var(--nar-text-tertiary-sub)">
        <CaretLeft size={20} />
      </ActionIcon>

      <div className="flex justify-around flex-1 overflow-x-auto pb-1">
        {weekDates.map((date, idx) => {
          const isLoading = weekIsLoading[idx];
          const hasMatches = weekHasMatches[idx];

          return (
            <WeekDayItem
              key={date.toDateString()}
              date={date}
              isSelected={date.toDateString() === selectedDate.toDateString()}
              isToday={date.toDateString() === today}
              isDisabled={isLoading || !hasMatches}
              onSelect={() => onSelectDate(date)}
            />
          );
        })}
      </div>

      <ActionIcon variant="transparent" onClick={onNextWeek} c="var(--nar-text-tertiary-sub)">
        <CaretRight size={20} />
      </ActionIcon>
    </div>
  );
});
