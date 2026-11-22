import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAED, toNumber } from "@/lib/spend/format";

const TOTAL = 1000;

export default function AllocationChallenge({ challenge, completed, onComplete }) {
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);

  const amountOf = (id) => toNumber(values[id]);
  const total = challenge.fields.reduce((sum, field) => sum + amountOf(field.id), 0);
  const left = TOTAL - total;

  const submit = () => {
    const essentials = amountOf("essentials");
    const savings = amountOf("savings");

    if (total === 0) {
      setResult({ ok: false, message: "Enter an amount for each area to build your plan." });
      return;
    }
    if (total > TOTAL) {
      setResult({
        ok: false,
        message: `Your plan adds up to ${formatAED(total)}, which is ${formatAED(total - TOTAL)} more than the AED 1,000 you have. Bring the total down to AED 1,000 or less.`,
      });
      return;
    }
    if (essentials < challenge.essentialsMinimum) {
      setResult({
        ok: false,
        message: `Essentials need at least ${formatAED(challenge.essentialsMinimum)}. You only set aside ${formatAED(essentials)}, which leaves your needs uncovered.`,
      });
      return;
    }

    setResult({
      ok: true,
      message: `Good plan. Essentials are covered with ${formatAED(essentials)}, you kept ${formatAED(total - essentials - savings)} for fun, and ${formatAED(savings)} went to savings${
        left > 0 ? `, with ${formatAED(left)} still unassigned` : ""
      }.${savings === 0 ? " Next time try setting something aside for savings — even AED 50 builds the habit." : ""}`,
    });
    onComplete(
      `Essentials ${Math.round(essentials)}, fun ${Math.round(total - essentials - savings)}, savings ${Math.round(savings)}`,
    );
  };

  return (
    <div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {challenge.fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={`alloc-${field.id}`}
              className="flex items-center justify-between text-[12px] font-medium text-foreground"
            >
              {field.label}
              <span className="text-[10px] font-normal text-muted-foreground">{field.hint}</span>
            </label>
            <Input
              id={`alloc-${field.id}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="1"
              disabled={Boolean(result?.ok) || completed}
              value={values[field.id] ?? ""}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [field.id]: event.target.value }))
              }
              placeholder="0"
              className="ss-num mt-1 h-10"
            />
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">
          Total {formatAED(total)} of {formatAED(TOTAL)}
        </span>
        <span className={`font-semibold ${left < 0 ? "text-destructive" : "text-primary"}`}>
          {left < 0 ? `${formatAED(Math.abs(left))} over` : `${formatAED(left)} left`}
        </span>
      </div>

      {!(result?.ok || completed) ? (
        <Button size="sm" className="mt-2.5" onClick={submit}>
          Check my plan
        </Button>
      ) : null}

      {result ? (
        <div
          className={`mt-2.5 rounded-md p-3 text-[12px] leading-relaxed ${
            result.ok ? "bg-secondary text-primary" : "bg-warning/10 text-warning-foreground"
          }`}
        >
          <p className="font-semibold">{result.ok ? "That works" : "Adjust your plan"}</p>
          <p className="mt-1">{result.message}</p>
        </div>
      ) : null}
    </div>
  );
}
