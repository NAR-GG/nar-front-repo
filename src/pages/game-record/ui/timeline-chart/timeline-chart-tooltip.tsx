import { formatDiffValue, formatValue } from "./timeline-chart.utils";

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  name?: string;
}

interface TimelineChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number;
  blueTeamName: string;
  redTeamName: string;
}

export function TimelineChartTooltip({
  active,
  payload,
  label,
  blueTeamName,
  redTeamName,
}: TimelineChartTooltipProps) {
  if (!active || !payload?.length || label == null) return null;

  const blueEntry = payload.find((p) => p.dataKey === "blueValue");
  const redEntry = payload.find((p) => p.dataKey === "redValue");

  if (!blueEntry || !redEntry) return null;

  const blueValue = blueEntry.value;
  const redValue = redEntry.value;
  const diff = blueValue - redValue;
  const isBlueAhead = diff >= 0;
  const leadTeamName = isBlueAhead ? blueTeamName : redTeamName;
  const leadColor = isBlueAhead ? "var(--nar-blue-600)" : "var(--nar-red-600)";
  const badgeBg = isBlueAhead
    ? "var(--nar-blue-opacity10)"
    : "var(--nar-red-opacity10)";

  return (
    <div
      style={{
        background: "var(--nar-BG-last)",
        border: "1px solid var(--nar-line)",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minWidth: 140,
      }}
    >
      <span
        style={{
          color: "var(--nar-text-tertiary-sub)",
          fontSize: 12,
        }}
      >
        {label}m
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            color: leadColor,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "150%",
          }}
        >
          {leadTeamName}
        </span>
        <span
          style={{
            background: badgeBg,
            color: leadColor,
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 4,
            padding: "2px 5px",
          }}
        >
          {formatDiffValue(Math.abs(diff))} ↑
        </span>
      </div>

      {/* 양팀 값 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--nar-blue-600)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "var(--nar-text-tertiary)",
              fontSize: 12,
              fontWeight: 400,
            }}
          >
            {blueTeamName}
          </span>
          <span
            style={{
              color: "var(--nar-text-tertiary)",
              fontSize: 12,
              fontWeight: 400,
              marginLeft: "auto",
            }}
          >
            {formatValue(blueValue)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--nar-red-600)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "var(--nar-text-tertiary)",
              fontSize: 12,
              fontWeight: 400,
            }}
          >
            {redTeamName}
          </span>
          <span
            style={{
              color: "var(--nar-text-tertiary)",
              fontSize: 12,
              fontWeight: 400,
              marginLeft: "auto",
            }}
          >
            {formatValue(redValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
