const GAMES_PREFIX = {
  games: "/games",
};

export const gamesApiEndPoint = {
  getGameList: () => `${GAMES_PREFIX.games}`,
  getGameDetail: ({ gameId }: { gameId: string }) =>
    `${GAMES_PREFIX.games}/${gameId}/record`,
};
