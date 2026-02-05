export function TimelineChartLegend() {
  return (
    <div className="flex items-center justify-end gap-6 mb-4">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-0"
          style={{ borderTop: "2px dashed var(--nar-blue-600)" }}
        />
        <span
          className="text-xs font-medium"
          style={{ color: "var(--nar-blue-600)" }}
        >
          BLUE SIDE
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-0"
          style={{ borderTop: "2px dashed var(--nar-red-600)" }}
        />
        <span
          className="text-xs font-medium"
          style={{ color: "var(--nar-red-600)" }}
        >
          RED SIDE
        </span>
      </div>
    </div>
  );
}
