const SEARCH_PREFIX = {
  search: "/v1/search",
};

export const searchApiEndPoint = {
  getAutoComplete: ({ q, limit }: { q: string; limit: number }) =>
    `${SEARCH_PREFIX.search}/autocomplete?q=${q}&limit=${limit}`,
};
