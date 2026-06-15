import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Chip, ProgressBar } from "@/components/ui-bits";
import { ChevronLeft, TrendingDown, TrendingUp } from "lucide-react";
import { Potli } from "@/components/Potli";

export const Route = createFileRoute("/insights")({ component: Insights });


const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍔",
  Transport: "🚌",
  Entertainment: "🎬",
  Shopping: "👕",
  Education: "📚",
  Bills: "📱",
  Salary: "💰",
  Healthcare: "🏥",
  Travel: "✈️",
  Investment: "📈",
  Other: "📦",
};

function Insights() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [topCategory, setTopCategory] = useState<any>(null);
  const [totalSpent, setTotalSpent] =
  useState(0);

const [averageExpense, setAverageExpense] =
  useState(0);

  useEffect(() => {
    loadTransactions();
    loadCategoryStats();
  }, []);
  const loadTransactions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) return;
  
    const { data: appUser } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
  
    if (!appUser) return;
  
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        categories(name)
      `)
      .eq("user_id", appUser.id)
      .order("created_at", { ascending: false })
      .limit(10);
  
    if (error) {
      console.error(error);
      return;
    }
  
    setTransactions(data || []);
  };

  const loadCategoryStats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) return;
  
    const { data: appUser } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
  
    if (!appUser) return;
  
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        amount,
        categories(name)
      `)
      .eq("user_id", appUser.id)
      .eq("type", "expense");
  
    if (error) {
      console.error(error);
      return;
    }
  
    const totals: Record<string, number> = {};
  
    data?.forEach((tx: any) => {
      const category =
        tx.categories?.name || "Other";
  
      totals[category] =
        (totals[category] || 0) +
        Number(tx.amount);
    });
  
    const grandTotal = Object.values(totals)
      .reduce((a, b) => a + b, 0);
  
      setTotalSpent(grandTotal);

setAverageExpense(
  data?.length
    ? Math.round(
        grandTotal / data.length
      )
    : 0
);

    const result = Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        pct:
          grandTotal > 0
            ? Math.round(
                (Number(value) / grandTotal) * 100
              )
            : 0,
      }))
      .sort((a, b) => b.value - a.value);
  
      setCategoryStats(result);

      if (result.length > 0) {
        setTopCategory(result[0]);
      }
  };


  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
        <span className="font-extrabold">Weekly Report</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 space-y-4">
        <div className="rounded-3xl bg-[var(--potli-green-soft)] card-pop p-5 flex items-center gap-3">
          <Potli size={70} mood="cheer" />
          <div className="flex-1">
            <Chip tone="green">WEEKLY SAVINGS WRAP</Chip>
            <div className="font-extrabold mt-1.5 leading-tight">
              You crushed it! Let's see how much digital gold you've hoarded.
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card card-pop p-4">
          <div className="text-xs font-bold text-muted-foreground">SAVINGS PER DAY</div>
          <div className="mt-3 flex items-end justify-between gap-2 h-32">
            {[40, 65, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-lg bg-gradient-to-t from-secondary to-[var(--potli-green)]" style={{ height: `${h}%` }} />
                <span className="text-[10px] font-bold text-muted-foreground">{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">

  {/* TOP SPEND */}
  <div className="rounded-2xl bg-card card-pop p-4">
    <div className="text-xs font-bold text-muted-foreground">
      TOP SPEND
    </div>

    <div className="text-lg font-extrabold mt-1">
      {topCategory
        ? `${CATEGORY_ICONS[topCategory.name] || "📦"} ${topCategory.name}`
        : "No Data"}
    </div>

    <div className="text-sm font-bold text-[var(--streak)] flex items-center gap-1">
      <TrendingUp className="w-3 h-3" />
      ₹{topCategory?.value || 0}
    </div>
  </div>

  {/* AVG EXPENSE */}
  <div className="rounded-2xl bg-card card-pop p-4">
    <div className="text-xs font-bold text-muted-foreground">
      AVG EXPENSE
    </div>

    <div className="text-lg font-extrabold mt-1">
      ₹{averageExpense}
    </div>

    <div className="text-sm font-bold text-secondary">
      Per Transaction
    </div>
  </div>

</div>

{/* TOTAL SPENT */}
<div className="rounded-2xl bg-card card-pop p-4">
  <div className="text-xs font-bold text-muted-foreground">
    TOTAL SPENT
  </div>

  <div className="text-2xl font-extrabold mt-1">
    ₹{totalSpent.toLocaleString()}
  </div>

  <div className="text-sm font-bold text-secondary">
    This Month
  </div>
</div>
        <div>
          <h2 className="text-base mb-2">Where it went</h2>
          <div className="space-y-2">
          {categoryStats.map((c) => (
  <div
    key={c.name}
    className="rounded-2xl bg-card card-pop p-3"
   >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">
          {CATEGORY_ICONS[c.name] || "📦"}
        </span>

        <span className="font-extrabold text-sm">
          {c.name}
        </span>
      </div>

      <span className="font-extrabold text-sm">
        ₹{c.value.toLocaleString()}
      </span>
    </div>

    <div className="mt-2">
      <ProgressBar value={c.pct} />
    </div>
  </div>

  
))}
          </div>
        </div>
        <div>
  <h2 className="text-base mb-2">
    Recent Transactions
  </h2>

  <div className="space-y-2">
    {transactions.length === 0 ? (
      <div className="rounded-2xl bg-card card-pop p-4 text-center font-bold text-sm">
        No transactions yet
      </div>
    ) : (
      transactions.map((tx) => (
        <div
          key={tx.id}
          className="rounded-2xl bg-card card-pop p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-extrabold text-sm">
                {tx.categories?.name || "Other"}
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(tx.created_at).toLocaleDateString()}
              </div>
            </div>

            <div
              className={`font-extrabold text-sm ${
                tx.type === "expense"
                  ? "text-[var(--streak)]"
                  : "text-secondary"
              }`}
            >
              {tx.type === "expense" ? "-" : "+"}
              ₹{tx.amount}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>
      </div>
    </MobileFrame>
  );
}
