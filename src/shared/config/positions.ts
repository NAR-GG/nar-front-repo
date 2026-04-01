export const POSITION_ORDER: Record<string, number> = {
  top: 1,
  jungle: 2,
  jng: 2,
  mid: 3,
  middle: 3,
  bottom: 4,
  bot: 4,
  adc: 4,
  support: 5,
  sup: 5,
  utility: 5,
};

export const POSITION_LABELS: Record<string, string> = {
  top: "탑",
  jng: "정글",
  jungle: "정글",
  mid: "미드",
  middle: "미드",
  bot: "원딜",
  bottom: "원딜",
  adc: "원딜",
  sup: "서폿",
  support: "서폿",
  utility: "서폿",
};

export const POSITION_FILTER_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "top", label: "탑" },
  { value: "jng", label: "정글" },
  { value: "mid", label: "미드" },
  { value: "bot", label: "원딜" },
  { value: "sup", label: "서폿" },
];
