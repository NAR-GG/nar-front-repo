const SCHEDULE_PREFIX = {
  schedule: "/schedule",
};

export const scheduleApiEndPoint = {
  getDateSchedule: () => `${SCHEDULE_PREFIX.schedule}`,
  getMatchDetail: ({ matchId }: { matchId: string }) =>
    `${SCHEDULE_PREFIX.schedule}/matches/${matchId}/record`,
};
