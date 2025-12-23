const COMBINATIONS_PREFIX = {
  combinations: "/combinations",
};

export const combinationsApiEndPoint = {
  getCombinations: () => `${COMBINATIONS_PREFIX.combinations}/`,
  getCombinationDetail: ({ combinationId }: { combinationId: number }) =>
    `${COMBINATIONS_PREFIX.combinations}/${combinationId}/detail`,
  get1v1MatchUp: () => `${COMBINATIONS_PREFIX.combinations}/matchups/1v1`,
  getLastUpdate: () => `${COMBINATIONS_PREFIX.combinations}/stat`,
};
