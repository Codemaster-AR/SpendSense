import { formatAED } from "@/lib/spend/format";

export default function BudgetCompare({ rows = [] }) {
  const active = rows.filter((row) => row.planned > 0 || row.spent > 0);

  if (!active.length) {
    return (
      <div className="flex h-[180px] flex-col items-center justify-center rounded-md border border-dashed border-[rgba(18,107,88,0.18)] bg-secondary/40 px-6 text-center">
        <p className="text-sm font-semibold text-foreground">No plan to compare</p>
        <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-muted-foreground">
          Set category amounts in the budget planner and this section will show planned versus
          actual spending.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-full bg-primary" /> Spent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-full bg-primary/25" /> Planned
        </span>
      </div>

      <ul className="space-y-3">
        {active.map((row) => {
          const max = Math.max(row.planned, row.spent, 1);
          const plannedWidth = (row.planned / max) * 100;
          const spentWidth = (row.spent / max) * 100;
          return (
            <li key={row.id}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-medium text-foreground">{row.label}</span>
                <span
                  className={`ss-num text-[12px] font-semibold ${row.over ? "text-destructive" : "text-foreground"}`}
                >
                  {formatAED(row.spent)}
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / {row.planned > 0 ? formatAED(row.planned) : "no plan"}
                  </span>
                </span>
              </div>
              <div className="relative mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/25"
                  style={{ width: `${plannedWidth}%` }}
                />
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${row.over ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${spentWidth}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
