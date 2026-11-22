import { Target, Receipt, PiggyBank, TrendingUp } from "lucide-react";
import HeroBalanceCard from "@/components/spend/HeroBalanceCard";
import BudgetProgressCard from "@/components/spend/BudgetProgressCard";
import TipActionsCard from "@/components/spend/TipActionsCard";
import StatCard from "@/components/spend/StatCard";
import SectionCard from "@/components/spend/SectionCard";
import SpendingChart from "@/components/spend/SpendingChart";
import InsightList from "@/components/spend/InsightList";
import { formatAED, formatPercent } from "@/lib/spend/format";

export default function DashboardView({
  profileName,
  goal,
  monthLabel,
  income,
  spent,
  saved,
  remaining,
  goalsProgress,
  goalsHint,
  plannedTotal,
  spendingData,
  tip,
  insights,
  onAddExpense,
  monthSelector,
}) {
  const ringValue = income > 0 ? (remaining / income) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {monthLabel}
          </p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-foreground">
            Hello, {profileName}!
          </h1>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {goal ? (
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
              <Target className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{goal}</span>
            </span>
          ) : null}
          {monthSelector ? <div className="ml-auto shrink-0 sm:ml-0">{monthSelector}</div> : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <HeroBalanceCard
            income={income}
            spent={spent}
            saved={saved}
            remaining={remaining}
            ringValue={ringValue}
          />
        </div>
        <div className="lg:col-span-3">
          <BudgetProgressCard plannedTotal={plannedTotal} spent={spent} />
        </div>
        <div className="lg:col-span-3">
          <TipActionsCard tip={tip} onAddExpense={onAddExpense} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total spending"
          value={formatAED(spent)}
          hint="Recorded expenses this month"
          icon={Receipt}
        />
        <StatCard
          label="Savings contributions"
          value={formatAED(saved)}
          hint="Moved into your goals this month"
          icon={PiggyBank}
        />
        <StatCard
          label="Savings goals"
          value={formatPercent(goalsProgress)}
          hint={goalsHint}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard
            title="Spending breakdown"
            description="Where your money went this month"
          >
            <SpendingChart data={spendingData} total={spent} />
          </SectionCard>
        </div>
        <div className="lg:col-span-1">
          <SectionCard title="Your insights" description="Based on your recorded spending">
            <InsightList insights={insights} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
