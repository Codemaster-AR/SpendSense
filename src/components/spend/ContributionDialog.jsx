import { useEffect, useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import FormSheet from "@/components/spend/FormSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatAED, monthKeyOf, todayISO, toNumber } from "@/lib/spend/format";

export default function ContributionDialog({ open, onOpenChange, goal, onSaved }) {
  const [form, setForm] = useState({ amount: "", date: todayISO(), note: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm({ amount: "", date: todayISO(), note: "" });
  }, [open, goal?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = toNumber(form.amount);
    if (!form.amount || amount <= 0) {
      setError("Enter an amount above AED 0.");
      return;
    }
    if (!form.date) {
      setError("Choose the date you saved this money.");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.SavingsContribution.create({
        goal_id: goal.id,
        amount: Math.round(amount * 100) / 100,
        date: form.date,
        month: monthKeyOf(form.date),
        note: form.note.trim(),
      });
      const reached = goal.saved + amount >= goal.target;
      toast.success(
        reached ? `Goal reached — ${formatAED(goal.target)} saved. Well done!` : "Savings added",
      );
      onOpenChange(false);
      await onSaved?.();
    } catch (err) {
      toast.error("Could not add this contribution. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add to savings"
      description={goal ? `Adding money to “${goal.name}”` : undefined}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="contribution-amount">Amount (AED)</Label>
          <Input
            id="contribution-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            className="ss-num"
          />
          {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contribution-date">Date</Label>
          <Input
            id="contribution-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contribution-note">Note (optional)</Label>
          <Textarea
            id="contribution-note"
            rows={2}
            value={form.note}
            onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
            placeholder="From this month's allowance"
          />
        </div>

        <p className="rounded-md bg-secondary p-3 text-[12px] leading-relaxed text-foreground">
          Savings contributions are tracked separately from expenses, so they are never counted
          twice.
        </p>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add to savings"}
          </Button>
        </div>
      </form>
    </FormSheet>
  );
}
