"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Stack, Paper, Text, Popover } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/ko";
import { IconChevronDown, IconReload } from "@tabler/icons-react";
import NarCalendar from "@/shared/assets/icons/nar_calendar.svg";
import { useQuery, useQueries } from "@tanstack/react-query";
import { scheduleQueries } from "@/entities/schedule/model/schedule.queries";
import { useMediaQuery } from "@mantine/hooks";
import { WeekDateBar } from "./week-date-bar";
import { LeagueMatchList } from "./league-match-list";
import { MonthlyCalendar } from "./monthly-calendar";

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthDates = (year: number, month: number): Date[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

const getWeekDates = (date: Date): Date[] => {
  const tmp = new Date(date);
  const day = tmp.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  tmp.setDate(tmp.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + i));
};

export const SchedulePageComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();

  const initializeDate = (): Date => {
    const dateParam = searchParams?.get("date");
    if (dateParam && !isNaN(new Date(dateParam).getTime())) return new Date(dateParam);
    return new Date();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(initializeDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(initializeDate);

  const dateString = formatDateString(selectedDate);
  const weekDates = getWeekDates(selectedDate);

  const monthDates = useMemo(
    () => getMonthDates(calendarMonth.getFullYear(), calendarMonth.getMonth()),
    [calendarMonth],
  );

  useEffect(() => {
    if (searchParams?.get("date") !== dateString) {
      router.push(`/pro-matches/schedule?date=${dateString}`);
    }
  }, [dateString, searchParams, router]);

  const { data: scheduleData, isLoading: scheduleLoading, isError: scheduleError } = useQuery(
    scheduleQueries.date(dateString),
  );

  const weekScheduleQueries = useQueries({
    queries: weekDates.map((date) => ({
      ...scheduleQueries.date(formatDateString(date)),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const weekHasMatches = weekDates.map((_, idx) => {
    const query = weekScheduleQueries[idx];
    return query.data?.matches && query.data.matches.length > 0;
  });

  const monthScheduleQueries = useQueries({
    queries: monthDates.map((date) => ({
      ...scheduleQueries.date(formatDateString(date)),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const matchDatesSet = useMemo(() => {
    const set = new Set<string>();
    monthDates.forEach((date, idx) => {
      const query = monthScheduleQueries[idx];
      if (query.data?.matches && query.data.matches.length > 0) {
        set.add(formatDateString(date));
      }
    });
    return set;
  }, [monthDates, monthScheduleQueries]);

  const renderDay = useCallback(
    (date: string) => {
      const dateObj = new Date(date);
      const hasMatch = matchDatesSet.has(formatDateString(dateObj));
      return (
        <div className="nar-day-cell" data-has-match={hasMatch ? "true" : undefined}>
          {dateObj.getDate()}
        </div>
      );
    },
    [matchDatesSet],
  );

  const excludeDate = useCallback(
    (date: string) => !matchDatesSet.has(formatDateString(new Date(date))),
    [matchDatesSet],
  );

  const allQueriesLoaded = weekScheduleQueries.every((q) => !q.isLoading);
  const selectedDateStr = selectedDate.toDateString();

  useEffect(() => {
    if (!allQueriesLoaded) return;
    const currentDayIndex = weekDates.findIndex((d) => d.toDateString() === selectedDateStr);
    if (currentDayIndex === -1) return;
    if (!weekHasMatches[currentDayIndex]) {
      const firstMatchIndex = weekHasMatches.findIndex((hasMatch) => hasMatch === true);
      if (firstMatchIndex !== -1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedDate(weekDates[firstMatchIndex]);
      }
    }
  }, [allQueriesLoaded, selectedDateStr, weekDates, weekHasMatches]);

  const handlePrevWeek = useCallback(() => {
    setSelectedDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  }, []);

  const handleNextWeek = useCallback(() => {
    setSelectedDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  }, []);

  const handlePrevMonth = useCallback(() => {
    setSelectedDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; });
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; });
  }, []);

  const gradientArrowStyle = (direction: "left" | "right"): React.CSSProperties => ({
    background: "var(--nar_gradients)",
    WebkitMaskImage: direction === "left"
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 6l-6 6l6 6'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 6l6 6l-6 6'/%3E%3C/svg%3E")`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskImage: direction === "left"
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 6l-6 6l6 6'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 6l6 6l-6 6'/%3E%3C/svg%3E")`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
  });

  return (
    <Container size="xl" px={{ base: 0, sm: 24, md: 32 }}>
      <Stack gap={40} mt="md">
        <MonthlyCalendar
          calendarMonth={calendarMonth}
          monthDates={monthDates}
          monthScheduleQueries={monthScheduleQueries}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setCalendarMonth(date);
          }}
        />
        <Paper withBorder radius={24}>
          <div className="flex relative items-center justify-center pt-5 sm:pt-10 pb-5.75 gap-5">
            {!isMobile && (
              <button onClick={handlePrevMonth} className="flex items-center justify-center w-6 h-6" style={gradientArrowStyle("left")} />
            )}

            <div className="flex items-center gap-1.5 w-40 justify-center">
              <Text fz={26} fw={700} c="var(--nar-text-GNB-default)">
                {selectedDate.getFullYear()}.{String(selectedDate.getMonth() + 1).padStart(2, "0")}
              </Text>
              <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <NarCalendar size={22} color="var(--nar-text-tertiary-sub)" />
                    <IconChevronDown size={16} color="var(--nar-text-tertiary-sub)" />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => {
                      if (date) { const d = new Date(date); setSelectedDate(d); setCalendarMonth(d); }
                    }}
                    date={calendarMonth}
                    onDateChange={(date) => setCalendarMonth(new Date(date))}
                    locale="ko"
                    renderDay={renderDay}
                    excludeDate={excludeDate}
                  />
                </Popover.Dropdown>
              </Popover>
            </div>

            {!isMobile && (
              <button onClick={handleNextMonth} className="flex items-center justify-center w-6 h-6" style={gradientArrowStyle("right")} />
            )}

            <button
              onClick={() => setSelectedDate(new Date())}
              className="flex gap-1 items-center absolute right-5 justify-center px-2.5 py-1.5 w-8 h-8 sm:w-auto sm:h-auto rounded-lg bg-(--nar-bg-tertiary) border border-(--nar-line-2) text-(--nar-text-tertiary-sub) text-xs"
            >
              <IconReload width={12} height={12} color="var(--nar-text-tertiary-sub)" />
              {!isMobile && "오늘 일자"}
            </button>
          </div>

          <WeekDateBar
            weekDates={weekDates}
            selectedDate={selectedDate}
            weekHasMatches={weekHasMatches}
            weekIsLoading={weekScheduleQueries.map((q) => q.isLoading)}
            onSelectDate={setSelectedDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />

          <div className="py-5 px-3.5 flex flex-col w-full gap-4 bg-(--nar-fill-secondary) rounded-b-3xl">
            <LeagueMatchList
              scheduleData={scheduleData}
              isLoading={scheduleLoading}
              isError={scheduleError}
            />
          </div>
        </Paper>
      </Stack>
    </Container>
  );
};
