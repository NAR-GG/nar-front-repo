"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Stack,
  Paper,
  Text,
  ActionIcon,
  Center,
  Loader,
  Popover,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/ko";
import { IconChevronDown, IconReload } from "@tabler/icons-react";
import CaretLeft from "@/shared/assets/icons/caret-left.svg";
import CaretRight from "@/shared/assets/icons/caret-right.svg";
import NarCalendar from "@/shared/assets/icons/nar_calendar.svg";
import Lck from "@/shared/assets/images/lck-home.svg";
import Lpl from "@/shared/assets/images/lpl-home.svg";
import Lec from "@/shared/assets/images/lec-home.svg";
import Ljl from "@/shared/assets/images/lgl-home.svg";
import Lcs from "@/shared/assets/images/lcs-home.svg";
import Msi from "@/shared/assets/images/msi-home.svg";
import Worlds from "@/shared/assets/images/worlds-home.svg";
import { useQuery, useQueries } from "@tanstack/react-query";
import { scheduleQueries } from "@/entities/schedule/model/schedule.queries";
import clsx from "clsx";
import dayjs from "dayjs";
import { MatchCard } from "./match-card";
import { useMediaQuery } from "@mantine/hooks";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthDates = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  return dates;
};

const getWeekDates = (date: Date): Date[] => {
  const week: Date[] = [];
  const tmp = new Date(date);
  const day = tmp.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  tmp.setDate(tmp.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    week.push(new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + i));
  }
  return week;
};

export const SchedulePageComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();

  const initializeDate = (): Date => {
    const dateParam = searchParams?.get("date");
    if (dateParam && !isNaN(new Date(dateParam).getTime())) {
      return new Date(dateParam);
    }
    return new Date();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(initializeDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(initializeDate);

  const dateString = formatDateString(selectedDate);
  const weekDates = getWeekDates(selectedDate);

  const monthDates = useMemo(() => {
    return getMonthDates(calendarMonth.getFullYear(), calendarMonth.getMonth());
  }, [calendarMonth]);

  // URL 동기화
  useEffect(() => {
    if (searchParams?.get("date") !== dateString) {
      router.push(`/pro-matches/schedule?date=${dateString}`);
    }
  }, [dateString, searchParams, router]);

  // 스케줄 데이터 조회
  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    isError: scheduleError,
  } = useQuery(scheduleQueries.date(dateString));

  // 주간 경기 유무 조회
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

  // 월별 경기 유무 조회 (DatePicker용)
  const monthScheduleQueries = useQueries({
    queries: monthDates.map((date) => ({
      ...scheduleQueries.date(formatDateString(date)),
      staleTime: 1000 * 60 * 10,
    })),
  });

  // 경기 있는 날짜 Set
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

  // DatePicker renderDay 함수
  const renderDay = useCallback(
    (date: string) => {
      const dateObj = new Date(date);
      const dateStr = formatDateString(dateObj);
      const hasMatch = matchDatesSet.has(dateStr);
      const day = dateObj.getDate();

      return (
        <div
          className="nar-day-cell"
          data-has-match={hasMatch ? "true" : undefined}
        >
          {day}
        </div>
      );
    },
    [matchDatesSet],
  );

  // DatePicker excludeDate 함수 (경기 없는 날짜 비활성화)
  const excludeDate = useCallback(
    (date: string) => {
      const dateObj = new Date(date);
      const dateStr = formatDateString(dateObj);
      return !matchDatesSet.has(dateStr);
    },
    [matchDatesSet],
  );

  const allQueriesLoaded = weekScheduleQueries.every((q) => !q.isLoading);
  const selectedDateStr = selectedDate.toDateString();

  // 선택된 날짜에 경기가 없으면 경기 있는 날짜로 자동 이동
  useEffect(() => {
    if (!allQueriesLoaded) return;

    const currentDayIndex = weekDates.findIndex(
      (d) => d.toDateString() === selectedDateStr,
    );

    if (currentDayIndex === -1) return;

    const currentHasMatches = weekHasMatches[currentDayIndex];

    if (!currentHasMatches) {
      const firstMatchIndex = weekHasMatches.findIndex(
        (hasMatch) => hasMatch === true,
      );
      if (firstMatchIndex !== -1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 경기 없는 날짜 선택 방지
        setSelectedDate(weekDates[firstMatchIndex]);
      }
    }
  }, [allQueriesLoaded, selectedDateStr, weekDates, weekHasMatches]);

  // 매치 상세 조회

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  return (
    <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
      <Stack gap="lg" mt="md">
        <Paper withBorder radius={24}>
          <div className="flex relative items-center justify-center pt-5 sm:pt-10 pb-5.75 gap-5">
            {!isMobile && (
              <button
                onClick={handlePrevMonth}
                className="flex items-center justify-center w-6 h-6"
                style={{
                  background: "var(--nar_gradients)",
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 6l-6 6l6 6'/%3E%3C/svg%3E")`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 6l-6 6l6 6'/%3E%3C/svg%3E")`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            )}

            <div className="flex items-center gap-1.5 w-40 justify-center">
              <Text fz={26} fw={700} c="var(--nar-text-GNB-default)">
                {selectedDate.getFullYear()}.
                {String(selectedDate.getMonth() + 1).padStart(2, "0")}
              </Text>
              <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <NarCalendar
                      size={22}
                      color="var(--nar-text-tertiary-sub)"
                    />
                    <IconChevronDown
                      size={16}
                      color="var(--nar-text-tertiary-sub)"
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => {
                      if (date) {
                        const newDate = new Date(date);
                        setSelectedDate(newDate);
                        setCalendarMonth(newDate);
                      }
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
              <button
                onClick={handleNextMonth}
                className="flex items-center justify-center w-6 h-6"
                style={{
                  background: "var(--nar_gradients)",
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 6l6 6l-6 6'/%3E%3C/svg%3E")`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 6l6 6l-6 6'/%3E%3C/svg%3E")`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            )}

            <button
              onClick={() => setSelectedDate(new Date())}
              className="flex gap-1 items-center absolute right-5 justify-center px-2.5 py-1.5 w-[32px] h-[32px] sm:w-auto sm:h-auto rounded-lg bg-(--nar-bg-tertiary) border border-(--nar-line-2) text-(--nar-text-tertiary-sub) text-xs"
            >
              <IconReload
                width={12}
                height={12}
                color="var(--nar-text-tertiary-sub)"
              />
              {!isMobile && "오늘 일자"}
            </button>
          </div>

          <div className="flex items-center px-4 gap-0 sm:gap-6.5">
            <ActionIcon
              variant="transparent"
              onClick={handlePrevWeek}
              c="var(--nar-text-tertiary-sub)"
            >
              <CaretLeft size={20} />
            </ActionIcon>

            <div className="flex justify-around flex-1 overflow-x-auto pb-1">
              {weekDates.map((date, idx) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const dayIndex = date.getDay();
                const hasMatches = weekHasMatches[idx];
                const isLoading = weekScheduleQueries[idx].isLoading;
                const isDisabled = isLoading || !hasMatches;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedDate(date);
                      }
                    }}
                    className={clsx(
                      "flex flex-col items-center justify-center pt-5 pb-1.75 px-2.5 gap-2.5 flex-1 border-b-4 border-transparent",
                      isSelected && "[border-image:var(--nar_gradients)_1]",
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                    )}
                    style={{
                      boxShadow: `0 2px 0 ${isDisabled ? "var(--nar-searchbar-text-con)" : "var(--nar-text-tertiary-sub)"}`,
                    }}
                  >
                    <span
                      className={clsx(
                        "text-sm sm:text-base",
                        isSelected ? "font-bold" : "font-normal",
                      )}
                      style={
                        isSelected
                          ? {
                              background: "var(--nar_gradients)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : {
                              color: isDisabled
                                ? "var(--nar-searchbar-text-con)"
                                : "var(--nar-text-tertiary-sub)",
                            }
                      }
                    >
                      {isToday ? "오늘" : DAY_NAMES[dayIndex]}
                    </span>
                    <span
                      className={clsx(
                        "text-base sm:text-lg",
                        isSelected ? "font-bold" : "font-medium",
                      )}
                      style={
                        isSelected
                          ? {
                              background: "var(--nar_gradients)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : {
                              color: isDisabled
                                ? "var(--nar-searchbar-text-con)"
                                : "var(--nar-text-tertiary-sub)",
                            }
                      }
                    >
                      {dayjs(date).format("M.D")}
                    </span>
                  </div>
                );
              })}
            </div>

            <ActionIcon
              variant="transparent"
              onClick={handleNextWeek}
              c="var(--nar-text-tertiary-sub)"
            >
              <CaretRight size={20} />
            </ActionIcon>
          </div>

          <div className="py-5 px-3.5 flex flex-col w-full gap-4 bg-(--nar-fill-secondary) rounded-b-3xl">
            {scheduleLoading ? (
              <Center p="xl">
                <Loader />
              </Center>
            ) : scheduleError ? (
              <Center p="xl">
                <Text c="red">데이터를 불러오는 중 오류가 발생했습니다.</Text>
              </Center>
            ) : !scheduleData?.matches || scheduleData.matches.length === 0 ? (
              <div className="py-10 text-center text-(--nar-text-tertiary)">
                해당 날짜에 경기 일정이 없습니다.
              </div>
            ) : (
              (() => {
                const leagueOrder = [
                  "LCK",
                  "LPL",
                  "LEC",
                  "LJL",
                  "LCS",
                  "MSI",
                  "WORLDS",
                ];
                const uniqueLeagues = [
                  ...new Set(scheduleData.matches.map((m) => m.leagueInfo)),
                ].sort((a, b) => {
                  const aIndex = leagueOrder.findIndex((l) => a.includes(l));
                  const bIndex = leagueOrder.findIndex((l) => b.includes(l));
                  return (
                    (aIndex === -1 ? 999 : aIndex) -
                    (bIndex === -1 ? 999 : bIndex)
                  );
                });

                const leagueIconMap: Record<string, typeof Lck> = {
                  LCK: Lck,
                  LEC: Lec,
                  LPL: Lpl,
                  LJL: Ljl,
                  LCS: Lcs,
                  MSI: Msi,
                  WORLDS: Worlds,
                };

                return uniqueLeagues.map((leagueName) => {
                  const leagueMatches = scheduleData.matches.filter(
                    (m) => m.leagueInfo === leagueName,
                  );

                  if (leagueMatches.length === 0) return null;

                  const leagueKey = Object.keys(leagueIconMap).find((key) =>
                    leagueName.includes(key),
                  );
                  const LeagueIcon = leagueKey ? leagueIconMap[leagueKey] : Lpl;

                  return (
                    <div key={leagueName} className="flex flex-col gap-4">
                      <div className="w-full flex gap-2.5 items-center">
                        <LeagueIcon />
                        <Text fz={28} fw={590} c="var(--nar-text-secondary)">
                          {leagueName}
                        </Text>
                      </div>
                      <div className="w-full flex flex-col [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-(--nar-line-2)">
                        {leagueMatches.map((match) => (
                          <div key={match.matchId}>
                            <MatchCard match={match} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </Paper>
      </Stack>
    </Container>
  );
};
