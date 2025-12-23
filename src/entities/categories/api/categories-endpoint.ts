const CATEGORIES_PREFIX = {
  categories: "/categories",
};

export const categoriesApiEndPoint = {
  getTeams: () => `${CATEGORIES_PREFIX.categories}/teams`,
  getTree: () => `${CATEGORIES_PREFIX.categories}/tree`,
};
