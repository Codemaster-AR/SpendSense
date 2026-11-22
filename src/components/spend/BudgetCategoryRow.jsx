import { Input } from "@/components/ui/input";
import { formatAED } from "@/lib/spend/format";

export default function BudgetCategoryRow({ category, amount, spent, share, onChange }) {
  const Icon = category.icon;
  const planned = Number(amount) || 0;
  const percent = planned > 0 ? Math.min(100, (spent / planned) * 100) : 0;
  const over = planned > 0 && spent > planned;

  return (
    <div className="py-3">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${category.color}1a`, color: category.color }}
        >
          <Icon className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-foreground">{category.label}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {share}% of income · spent {formatAED(spent)}
          </p>
        </div>

        <div className="relative w-[124px] shrink-0">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">
            AED
          </span>
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => onChange(event.target.value)}
            placeholder="0"
            aria-label={`Amount for ${category.label}`}
            className="ss-num h-10 pl-10 text-right"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              backgroundColor: over ? "#DC2626" : category.color,
            }}
          />
        </div>
        <span
          className={`ss-num w-[72px] shrink-0 text-right text-[11px] font-medium ${
            over ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {planned > 0 ? `${Math.round((spent / planned) * 100)}% used` : "No plan"}
        </span>
      </div>
    </div>
  );
}
