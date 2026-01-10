import { Button } from "@/src/shared/ui/button";
import { Badge } from "@/src/shared/ui/badge";
import { Text } from "@mantine/core";

type MatchCardProps = {
  badgeTheme: "live" | "default";
  badgeText: string;
  tournamentTitle: string;

  leftTeamName: string;
  rightTeamName: string;

  leftScore?: number;
  rightScore?: number;

  isLive?: boolean;
  setText?: string;
  setTextColor?: string;

  buttonLabel: string;
  buttonTheme: "gray" | "line";
  buttonDisabled?: boolean;

  borderColorVar: string;
};

export function MatchCard({
  badgeTheme,
  badgeText,
  tournamentTitle,
  leftTeamName,
  rightTeamName,
  leftScore,
  rightScore,
  isLive,
  setText,
  setTextColor = "var(--mantine-color-red-5)",
  buttonLabel,
  buttonTheme,
  buttonDisabled,
  borderColorVar,
}: MatchCardProps) {
  return (
    <div
      className="bg-[var(--match-card-bg)] border-l-[3px] min-h-[115px] p-4 relative flex flex-col gap-3"
      style={{ borderColor: borderColorVar }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <Badge theme={badgeTheme}>{badgeText}</Badge>
          <Text fz={12} fw={600} c="var(--nar-text-con-text2)">
            {tournamentTitle}
          </Text>
        </div>

        <div className="hidden sm:block">
          <Button size="sm" theme={buttonTheme} disabled={buttonDisabled}>
            {buttonLabel}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-between w-full max-w-[500px] gap-2">
          <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-end min-w-0">
            <Text
              fz={20}
              fw={500}
              c="var(--mantine-color-text)"
              className="truncate"
            >
              {leftTeamName}
            </Text>
            <div className="w-12.5 h-12.5 bg-[var(--mantine-color-gray-2)] rounded-lg flex-shrink-0" />
          </div>

          <div className="flex flex-col items-center min-w-[100px] sm:min-w-[140px]">
            <div className="flex items-center gap-[14px] sm:gap-3.5">
              <Text
                fz={{ base: 28, sm: 36 }}
                fw={700}
                c={
                  isLive
                    ? "var(--match-live-color)"
                    : "var(--mantine-color-dimmed)"
                }
              >
                {typeof leftScore === "number" ? leftScore : "-"}
              </Text>
              <Text
                fz={{ base: 28, sm: 36 }}
                fw={700}
                c="var(--mantine-color-dimmed)"
              >
                :
              </Text>
              <Text
                fz={{ base: 28, sm: 36 }}
                fw={700}
                c={
                  isLive
                    ? "var(--mantine-color-text)"
                    : "var(--mantine-color-dimmed)"
                }
              >
                {typeof rightScore === "number" ? rightScore : "-"}
              </Text>
            </div>

            {setText ? (
              <Text
                fz={14}
                fw={400}
                c={setTextColor}
                style={{ whiteSpace: "nowrap" }}
              >
                {setText}
              </Text>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-start min-w-0">
            <div className="w-12.5 h-12.5 bg-[var(--mantine-color-gray-2)] rounded-lg flex-shrink-0" />
            <Text
              fz={20}
              fw={500}
              c="var(--mantine-color-text)"
              className="truncate order-1 sm:order-none"
            >
              {rightTeamName}
            </Text>
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        <Button
          size="sm"
          theme={buttonTheme}
          disabled={buttonDisabled}
          className="w-full"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
