export interface BadgeProps {
  children?: React.ReactNode;
  theme?: "live" | "new" | "default" | "mini";
}

const BASE_CLASS =
  "inline-flex w-fit items-center justify-center gap-1.5 text-[12px] font-medium border rounded-[8px] px-[11.5px] py-[4px]";

const THEME_CLASS = {
  live: "w-[59px] h-[24px] border-[#FFA8A8] bg-[#FFF5F5] text-[var(--mantine-color-red-8)]",

  new: "border-[#FFA8A8] bg-[rgba(255,255,255,0.8)] text-[var(--mantine-color-red-8)]",

  default:
    "border-[var(--gray-3,#DEE2E6)] bg-[var(--gray-0,#F8F9FA)] text-[var(--mantine-color-gray-7)]",

  mini: "border-none bg-[var(--mantine-color-gray-2)] text-[var(--mantine-color-gray-8)] px-2 py-[2px] text-[12px] font-semibold",
} as const;

export function Badge({ children, theme = "default" }: BadgeProps) {
  if (theme === "live") {
    return (
      <span className={`${BASE_CLASS} ${THEME_CLASS.live}`}>
        <span className="w-[6px] h-[6px] bg-[var(--mantine-color-red-8)] rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }

  return (
    <span className={`${BASE_CLASS} ${THEME_CLASS[theme]}`}>{children}</span>
  );
}
