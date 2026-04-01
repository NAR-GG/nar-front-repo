import dayjs from "dayjs";

export const getDaysAgo = (scheduledAt: string, isToday: boolean) => {
  const days = dayjs().diff(dayjs(scheduledAt), "day");
  if (isToday) {
    return (
      <span className="badge-live">
        <span className="w-1.5 h-1.5 shrink-0 bg-[var(--mantine-color-red-8)] rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }
  if (!isToday) {
    if (days < 0) return `${Math.abs(days)}일 후`;
    if (days === 0) return "오늘";
    return `${days}일 전`;
  }
};
