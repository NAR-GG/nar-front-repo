"use client";

import { useMemo, useState } from "react";
import { Paper, Text } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";
import type { DateScheduleData } from "@/entities/schedule/api/schedule.dto";
import { scheduleQueries } from "@/entities/schedule/model/schedule.queries";
import { LeagueSelect, type LeagueId } from "@/shared/ui/league-select";

interface MonthlyCalendarProps {
  calendarMonth: Date;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const MAX_CHIPS_PER_DAY = 2;

const formatDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const buildCalendarGrid = (calendarMonth: Date): (Date | null)[][] => {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstWeekday = firstDay.getDay();
  const startOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

export function MonthlyCalendar({
  calendarMonth,
  onSelectDate,
}: MonthlyCalendarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>("LCK");

  const weeks = useMemo(() => buildCalendarGrid(calendarMonth), [calendarMonth]);

  const visibleWeeks = useMemo(() => {
    if (!collapsed) return weeks;
    const today = new Date();
    const todayKey = formatDateKey(today);
    const matchIdx = weeks.findIndex((week) =>
      week.some((d) => d && formatDateKey(d) === todayKey),
    );
    return [weeks[matchIdx === -1 ? 0 : matchIdx]];
  }, [weeks, collapsed]);

  // 접힌 상태(기본값)에서는 화면에 보이는 한 주만, 펼쳤을 때만 한 달 전체를 조회한다.
  const visibleDates = useMemo(
    () => visibleWeeks.flat().filter((d): d is Date => d !== null),
    [visibleWeeks],
  );

  const visibleScheduleQueries = useQueries({
    queries: visibleDates.map((date) => scheduleQueries.date(formatDateKey(date))),
  });

  const matchesByDate = useMemo(() => {
    const map = new Map<string, DateScheduleData["matches"]>();
    const leagueKey = selectedLeague.toLowerCase();
    visibleDates.forEach((date, idx) => {
      const data = visibleScheduleQueries[idx]?.data;
      if (!data?.matches?.length) return;
      const filtered = data.matches.filter((m) =>
        (m.leagueInfo ?? "").toLowerCase().includes(leagueKey),
      );
      if (filtered.length > 0) map.set(formatDateKey(date), filtered);
    });
    return map;
  }, [visibleDates, visibleScheduleQueries, selectedLeague]);

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-start justify-between px-3 sm:px-8 pt-5 sm:pt-8 pb-4">
        <Text
          fz={80}
          fw={700}
          c="var(--nar-text-primary)"
          className="leading-[130%]"
        >
          {String(calendarMonth.getMonth() + 1).padStart(2, "0")}
        </Text>
        <div className="flex flex-col items-end">
          <LeagueSelect value={selectedLeague} onChange={setSelectedLeague} />
          <span
            className="mt-[17px] font-['SF_Pro_Display'] text-[34px] font-bold leading-[130%] text-[var(--nar-text-primary)]"
          >
            {calendarMonth.getFullYear()}
          </span>
          <span
            className="text-[20px] font-normal leading-[155%] text-[var(--nar-text-GNB-default)]"
          >
            월간 경기 일정 요약
          </span>
        </div>
      </div>

      <div className="px-1 sm:px-5">
          <div className="grid grid-cols-7 border-b-2 border-[var(--nar-text-con1-nav)]">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="flex-1 basis-0 flex flex-col justify-center items-center gap-[10px] pt-5 px-1 sm:px-[10px] pb-[10px] text-[var(--nar-text-tertiary-sub)] font-medium text-xs sm:text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            {visibleWeeks.map((week, weekIdx) => (
              <div
                key={weekIdx}
                className="flex flex-col items-center self-stretch py-4 border-b-[3px] border-[var(--nar-text-con1-nav)]"
              >
                <div className="grid grid-cols-7 w-full">
                {week.map((date, dayIdx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${weekIdx}-${dayIdx}`}
                        className="border-r border-(--nar-line) last:border-r-0 p-1 sm:p-2"
                      />
                    );
                  }
                  const matches = matchesByDate.get(formatDateKey(date)) ?? [];
                  const visible = matches.slice(0, MAX_CHIPS_PER_DAY);
                  const hasMore = matches.length > MAX_CHIPS_PER_DAY;

                  return (
                    <button
                      key={`day-${date.getTime()}`}
                      type="button"
                      onClick={() => onSelectDate(date)}
                      className="flex-1 basis-0 h-[109px] pt-0 px-0.5 sm:px-[10px] pb-[10px] flex flex-col items-start gap-[10px] border-r border-(--nar-line) last:border-r-0 hover:bg-(--nar-bg-cont-livebox) transition-colors min-w-0"
                    >
                      <span className="text-left text-base leading-none font-[590] text-[var(--nar-text-con1-nav)]">
                        {date.getDate()}
                      </span>
                      <div className="flex flex-col items-center gap-[2px] w-full min-w-0">
                        {visible.map((match) => (
                          <span
                            key={match.matchId}
                            className="nar-chip-md"
                          >
                            <span className="nar-chip-md-team-l">
                              {match.teamA.teamCode}
                            </span>
                            <span className="nar-chip-md-vs">VS</span>
                            <span className="nar-chip-md-team-r">
                              {match.teamB.teamCode}
                            </span>
                          </span>
                        ))}
                        {hasMore && (
                          <span className="flex items-center justify-center gap-[3px] py-1">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="block w-[2px] h-[2px] rounded-full border-2 border-[var(--nar-text-tertiary-sub)] bg-[var(--nar-text-tertiary-sub)]"
                              />
                            ))}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            ))}
          </div>
        </div>

      <div className="px-3 sm:px-5 py-3">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-full h-[34px] rounded-lg border-[1.5px] border-[var(--nar-button-more-line)] bg-[var(--nar-button-more-bg)] text-[var(--nar-button-more-text)] font-['Open_Sans'] text-[14px] font-normal leading-[34px]"
        >
          {collapsed ? "월간 일정 펼치기" : "월간 일정 접기"}
        </button>
      </div>
    </Paper>
  );
}
