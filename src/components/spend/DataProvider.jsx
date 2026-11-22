import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { currentMonthKey } from "@/lib/spend/format";

const DataContext = createContext(null);

export function useSpendData() {
  return useContext(DataContext);
}

const EMPTY = {
  expenses: [],
  allocations: [],
  goals: [],
  contributions: [],
  challenges: [],
  talks: [],
};

export function DataProvider({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => currentMonthKey());

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    const owner = { created_by_id: user.id };
    const [expenses, allocations, goals, contributions, challenges, talks] = await Promise.all([
      base44.entities.Expense.filter(owner, { sort: "-date", limit: 1000 }),
      base44.entities.BudgetAllocation.filter(owner, { limit: 500 }),
      base44.entities.SavingsGoal.filter(owner, { sort: "-created_date", limit: 200 }),
      base44.entities.SavingsContribution.filter(owner, { sort: "-date", limit: 500 }),
      base44.entities.ChallengeCompletion.filter(owner, { limit: 100 }),
      base44.entities.MoneyTalkCompletion.filter(owner, { limit: 100 }),
    ]);
    setData({
      expenses: expenses?.items || [],
      allocations: allocations?.items || [],
      goals: goals?.items || [],
      contributions: contributions?.items || [],
      challenges: challenges?.items || [],
      talks: talks?.items || [],
    });
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (isLoadingAuth) return;
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        await refresh();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isLoadingAuth, user?.id, refresh]);

  return (
    <DataContext.Provider value={{ ...data, loading, month, setMonth, refresh }}>
      {children}
    </DataContext.Provider>
  );
}
