const POSITION_ORDER = ["top", "jng", "mid", "bot", "sup"];

export const sortByPosition = <T extends { position?: string }>(
  players: T[]
): T[] => {
  return [...players].sort((a, b) => {
    const aIndex = POSITION_ORDER.indexOf(a.position ?? "");
    const bIndex = POSITION_ORDER.indexOf(b.position ?? "");
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};
