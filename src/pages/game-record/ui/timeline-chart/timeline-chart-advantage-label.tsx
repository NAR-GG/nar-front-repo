import { formatDiffValue } from "./timeline-chart.utils";

interface AdvantageLabelProps {
  viewBox?: { x: number; y: number };
  diff: number;
  leadingSide: "blue" | "red" | "even";
  teamName: string;
}

export function AdvantageLabel({
  viewBox,
  diff,
  leadingSide,
  teamName,
}: AdvantageLabelProps) {
  if (!viewBox || leadingSide === "even") return null;

  const isBlue = leadingSide === "blue";
  const dotColor = isBlue ? "var(--nar-blue-600)" : "var(--nar-red-600)";
  const textColor = isBlue ? "var(--nar-blue-600)" : "var(--nar-red-600)";
  const bgColor = "var(--nar-tagchip-bg)";

  return (
    <g>
      <foreignObject
        x={viewBox.x - 67}
        y={viewBox.y - 46}
        width={100}
        height={48}
      >
        <div
          style={{
            background: bgColor,
            borderRadius: "4px 4px 0px 4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
            padding: "2px 8px",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: dotColor,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.3,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: textColor,
              }}
            >
              {teamName}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: textColor,
              }}
            >
              {formatDiffValue(Math.abs(diff))}
            </span>
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
