const SCHEDULE_PREFIX = {
  schedule: "/schedule",
};

export const scheduleApiEndPoint = {
  getDateSchedule: (date: string) => `${SCHEDULE_PREFIX.schedule}?date=${date}`,
  getMatchDetail: (matchId: string) =>
    `${SCHEDULE_PREFIX.schedule}/matches/${matchId}/detail`,
};
