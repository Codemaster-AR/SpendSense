import { formatAED } from "@/lib/spend/format";

export default function CategoryBars({ rows = [] }) {
  const active = rows.filter((row) => row.value > 0).sort((a, b) => b.value - a.value);
  const max = active[0]?.value || 0;
  const total = active.reduce((sum, row) => sum + row.value, 0);

  if (!active.length) {
    return (
      <div className="flex h-[180px] flex-col items-center justify-center rounded-md border border-dashed border-[rgba(18,107,88,0.18)] bg-secondary/40 px-6 text-center">
        <p className="text-sm font-semibold text-foreground">Nothing to compare yet</p>
        <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
          Add expenses for this month to see which categories use the most money.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {active.map((row) => (
        <li key={row.id}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-medium text-foreground">{row.label}</span>
            <span className="ss-num text-[12px] font-semibold text-foreground">
              {formatAED(row.value)}
              <span className="ml-1.5 font-normal text-muted-foreground">
                {total > 0 ? `${Math.round((row.value / total) * 100)}%` : ""}
              </span>
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${max > 0 ? Math.max(3, (row.value / max) * 100) : 0}%`,
                backgroundColor: row.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
