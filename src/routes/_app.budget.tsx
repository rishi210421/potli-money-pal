import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Chip, ProgressBar, PopLink } from "@/components/ui-bits";
import { Potli } from "@/components/Potli";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/budget")({ component: Budget });

const ALLOC = [
  { e: "🍔", l: "Food", spent: 3200, cap: 4000, tone: "ok" },
  { e: "🚌", l: "Transport", spent: 1300, cap: 1500, tone: "ok" },
  { e: "🎬", l: "Fun", spent: 2400, cap: 2000, tone: "over" },
  { e: "📚", l: "Study", spent: 400, cap: 1000, tone: "ok" },
  { e: "👕", l: "Shopping", spent: 1500, cap: 1500, tone: "warn" },
  { e: "📱", l: "Bills", spent: 999, cap: 1000, tone: "ok" },
] as const;

function Budget() {

  const [loading, setLoading] = useState(true);

const [budgetData, setBudgetData] =
  useState({
    income: 0,
    expenses: 0,
    savings: 0,
    health: 0,
  });

const [categories, setCategories] =
  useState<any[]>([]);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      setLoading(true);
  
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) return;
  
      const { data: appUser } =
        await supabase
          .from("users")
          .select("*")
          .eq(
            "auth_user_id",
            user.id
          )
          .single();
  
      if (!appUser) return;
  
      const { data: transactions } =
        await supabase
          .from("transactions")
          .select(`
            *,
            categories(name)
          `)
          .eq(
            "user_id",
            appUser.id
          )
          .eq(
            "type",
            "expense"
          );
  
      const income =
        Number(
          appUser.monthly_income
        ) || 0;
  
      const expenses =
        (transactions || []).reduce(
          (sum, t) =>
            sum +
            Number(t.amount),
          0
        );
  
      const { data: goals } =
        await supabase
          .from("goals")
          .select(
            "current_amount"
          )
          .eq(
            "user_id",
            appUser.id
          );
  
      const savings =
        (goals || []).reduce(
          (sum, g) =>
            sum +
            Number(
              g.current_amount
            ),
          0
        );
  
      const savingsPercent =
        income > 0
          ? Math.round(
              (savings /
                income) *
                100
            )
          : 0;
  
      const health =
        savingsPercent >= 50
          ? 95
          : savingsPercent >= 30
          ? 80
          : savingsPercent >= 20
          ? 70
          : 50;
  
      setBudgetData({
        income,
        expenses,
        savings,
        health,
      });
  
      const grouped: Record<
        string,
        number
      > = {};
  
      (transactions || []).forEach(
        (t: any) => {
          const cat =
            t.categories?.name ||
            "Other";
  
          grouped[cat] =
            (grouped[cat] || 0) +
            Number(t.amount);
        }
      );
  
      const buckets =
        Object.entries(grouped).map(
          ([name, spent]) => ({
            name,
            spent,
            cap:
              Math.max(
                spent * 2,
                1000
              ),
          })
        );
  
      setCategories(
        buckets
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl leading-tight">Budget Planner</h1>
          <p className="text-sm text-muted-foreground font-semibold">AI-allocated for June</p>
        </div>
        <Link to="/forecast" className="text-xs font-extrabold text-secondary">Forecast →</Link>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-[var(--potli-green-dark)] card-pop p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-white/70 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> BUDGET HEALTH</div>
              <div className="text-5xl font-extrabold mt-1">{budgetData.health}<span className="text-2xl text-white/60">/100</span></div>
              <Chip tone="yellow">{budgetData.health >= 80
  ? "Healthy 💪"
  : "Needs Work ⚠️"}</Chip>
            </div>
            <Potli size={80} mood="cheer" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
  {
    l: "Income",
    v: `₹${budgetData.income.toLocaleString()}`,
  },
  {
    l: "Allocated",
    v: `₹${budgetData.expenses.toLocaleString()}`,
  },
  {
    l: "Saving",
    v: `₹${budgetData.savings.toLocaleString()}`,
  },
].map((s) => (
  <div
    key={s.l}
    className="bg-white/10 rounded-2xl py-2"
  >
    <div className="text-[10px] font-bold text-white/70">
      {s.l.toUpperCase()}
    </div>

    <div className="font-extrabold text-sm">
      {s.v}
    </div>
  </div>
))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-base mb-2">This Month's Buckets</h2>
        <div className="space-y-2.5">
        {categories.map((a) => {
  const pct =
    Math.min(
      100,
      Math.round(
        (a.spent /
          a.cap) *
          100
      )
    );

  return (
    <div
      key={a.name}
      className="rounded-2xl bg-card card-pop p-3.5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-extrabold text-sm">
            {a.name}
          </div>

          <div className="text-xs text-muted-foreground">
            ₹{a.spent.toLocaleString()}
            {" / "}
            ₹{a.cap.toLocaleString()}
          </div>
        </div>

        <div className="font-bold text-xs">
          {pct}%
        </div>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden mt-2">
        <div
          className="h-full bg-secondary"
          style={{
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
})}

{categories.length === 0 && (
  <div className="rounded-2xl bg-card p-4 text-center">
    No expenses yet 💸
  </div>
)}

        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-primary card-pop p-4">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[var(--potli-green-dark)]" /><span className="text-xs font-extrabold text-[var(--potli-green-dark)]">POTLI RECOMMENDS</span></div>
          <div className="font-extrabold mt-1.5 text-[var(--potli-green-dark)]">
            Trim ₹400 from Fun → push into Goa Trip 🏖️
          </div>
          <div className="mt-3 flex gap-2">
            <button className="bg-[var(--potli-green-dark)] text-white px-4 py-2 rounded-xl font-extrabold text-sm">Apply</button>
            <button className="bg-white/40 text-[var(--potli-green-dark)] px-4 py-2 rounded-xl font-extrabold text-sm">Dismiss</button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <PopLink to="/coach" variant="dark">Ask Potli to rebuild my budget</PopLink>
      </div>
    </div>
  );
}
