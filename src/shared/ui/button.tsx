export type ButtonTheme = "gray" | "line";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;
  theme?: ButtonTheme;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const BASE_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-[8px] border-2 font-[14px] transition-colors duration-150 focus:outline-none";

const BUTTON_THEME_CLASS: Record<ButtonTheme, string> = {
  gray: "border-[var(--mantine-color-dark-3)] bg-[var(--mantine-color-dark-3)] text-white",

  line: "border-[var(--mantine-color-dark-3)] text-[var(--mantine-color-dark-3)] bg-[var(--mantine-color-gray-1)]",
};

const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "px-[15.5px] py-1 text-[14px]",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const DISABLED_CLASS = "opacity-50 cursor-not-allowed";

export function Button({
  children,
  theme = "gray",
  size = "md",
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        BASE_BUTTON_CLASS,
        BUTTON_THEME_CLASS[theme],
        BUTTON_SIZE_CLASS[size],
        disabled && DISABLED_CLASS,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
