import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { formatAED, formatPercent } from "@/lib/spend/format";

export default function BudgetProgressCard({ plannedTotal, spent }) {
  const hasPlan = plannedTotal > 0;
  const percent = hasPlan ? Math.round((spent / plannedTotal) * 100) : 0;
  const over = hasPlan && spent > plannedTotal;
  const width = Math.min(100, Math.max(0, percent));

  return (
    <div className="ss-card flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[17px] font-semibold text-foreground">Budget progress</h2>
        {over ? (
          <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 text-[11px] font-semibold text-warning">
            <AlertTriangle className="h-3 w-3" /> Over
          </span>
        ) : null}
      </div>

      {hasPlan ? (
        <>
          <p className="ss-num mt-2 text-[26px] font-bold leading-none text-foreground">
            {formatPercent(percent)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">of your plan used this month</p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${over ? "bg-warning" : "bg-primary"}`}
              style={{ width: `${width}%` }}
            />
          </div>
          <p className="ss-num mt-2 text-xs text-muted-foreground">
            {formatAED(spent)} of {formatAED(plannedTotal)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {over
              ? `${formatAED(spent - plannedTotal)} above plan — adjust next month.`
              : `${formatAED(plannedTotal - spent)} still inside your plan.`}
          </p>
        </>
      ) : (
        <div className="mt-3 flex flex-1 flex-col justify-center rounded-md border border-dashed border-[rgba(18,107,88,0.18)] bg-secondary/40 p-4 text-center">
          <p className="text-sm font-semibold text-foreground">No budget yet</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Split your income into categories to see how much of your plan you have used.
          </p>
        </div>
      )}

      <Link
        to="/budget"
        className="ss-focus mt-3 inline-flex items-center text-[13px] font-semibold text-primary hover:underline"
      >
        {hasPlan ? "Edit budget" : "Create a budget"} →
      </Link>
    </div>
  );
}
