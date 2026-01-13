const HOME_PREFIX = {
  home: "/home",
};

export const homeApiEndPoint = {
  getChampionTop5: () => `${HOME_PREFIX.home}/champion/top5`,
  getCommunity: ({ sort }: { sort: "latest" | "popular" }) =>
    `${HOME_PREFIX.home}/community?sort=${sort}`,
  getNews: () => `${HOME_PREFIX.home}/news`,
  getPlayerTop5: () => `${HOME_PREFIX.home}/player/top5`,
  getDateSchedule: ({
    date,
    league,
  }: {
    date: string;
    league: "ALL" | "LCK" | "LPL";
  }) => `${HOME_PREFIX.home}/schedule?date=${date}&league=${league}`,
};
