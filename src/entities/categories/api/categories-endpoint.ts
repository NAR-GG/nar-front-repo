const CATEGORIES_PREFIX = {
  categories: "/categories",
};

export const categoriesApiEndPoint = {
  getTeams: () => `${CATEGORIES_PREFIX.categories}/teams`,
  getTree: (year?: number) =>
    year
      ? `${CATEGORIES_PREFIX.categories}/tree?year=${year}`
      : `${CATEGORIES_PREFIX.categories}/tree`,
};
