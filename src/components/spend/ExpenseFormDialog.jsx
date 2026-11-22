import { useEffect, useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import FormSheet from "@/components/spend/FormSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPEND_CATEGORIES } from "@/lib/spend/constants";
import { monthKeyOf, todayISO, toNumber } from "@/lib/spend/format";

const BLANK = { name: "", amount: "", category: "food", date: todayISO(), note: "" };

export default function ExpenseFormDialog({ open, onOpenChange, expense, onSaved }) {
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      expense
        ? {
            name: expense.name || "",
            amount: expense.amount != null ? String(expense.amount) : "",
            category: expense.category || "food",
            date: expense.date || todayISO(),
            note: expense.note || "",
          }
        : { ...BLANK, date: todayISO() },
    );
  }, [open, expense]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Give this expense a short name.";
    const amount = toNumber(form.amount);
    if (!form.amount || Number.isNaN(Number(form.amount))) next.amount = "Enter an amount in AED.";
    else if (amount <= 0) next.amount = "The amount must be more than AED 0.";
    else if (amount > 1000000) next.amount = "That amount looks too large.";
    if (!form.date) next.date = "Choose the date you spent this.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        amount: Math.round(toNumber(form.amount) * 100) / 100,
        category: form.category,
        date: form.date,
        month: monthKeyOf(form.date),
        note: form.note.trim(),
      };
      if (expense?.id) {
        await base44.entities.Expense.update(expense.id, payload);
        toast.success("Expense updated");
      } else {
        await base44.entities.Expense.create(payload);
        toast.success("Expense added");
      }
      onOpenChange(false);
      await onSaved?.();
    } catch (error) {
      toast.error("Could not save this expense. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={expense ? "Edit expense" : "Add expense"}
      description="Record what you spent so your budget stays accurate."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="expense-name">What did you spend on?</Label>
          <Input
            id="expense-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Lunch with friends"
            autoComplete="off"
          />
          {errors.name ? <p className="text-xs font-medium text-destructive">{errors.name}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="expense-amount">Amount (AED)</Label>
            <Input
              id="expense-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
              className="ss-num"
            />
            {errors.amount ? (
              <p className="text-xs font-medium text-destructive">{errors.amount}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-date">Date</Label>
            <Input
              id="expense-date"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              max="2100-12-31"
            />
            {errors.date ? <p className="text-xs font-medium text-destructive">{errors.date}</p> : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expense-category">Category</Label>
          <Select value={form.category} onValueChange={(value) => update("category", value)}>
            <SelectTrigger id="expense-category" className="h-10">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {SPEND_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expense-note">Note (optional)</Label>
          <Textarea
            id="expense-note"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Anything you want to remember about this purchase"
            rows={2}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : expense ? "Save changes" : "Add expense"}
          </Button>
        </div>
      </form>
    </FormSheet>
  );
}
