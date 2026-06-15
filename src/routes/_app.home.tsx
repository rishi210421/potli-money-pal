import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Potli } from "@/components/Potli";
import { Logo } from "@/components/Logo";
import { Chip, ProgressBar } from "@/components/ui-bits";
import { Bell, Flame, Star, Plus, Target, Sparkles, TrendingUp, AlertTriangle, User, Crown } from "lucide-react";

export const Route = createFileRoute("/_app/home")({ component: Home });

function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [dashboard, setDashboard] = useState({
    totalExpenses: 0,
    currentBalance: 0,
    transactionCount: 0,
  });

  const [goals, setGoals] = useState<any[]>([]);

  const [budgetHealth, setBudgetHealth] =
  useState(0);

  useEffect(() => {
    loadUser();
    loadDashboard();
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) return;
  
    const { data: appUser } =
      await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
  
    if (!appUser) return;
  
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", appUser.id)
      .eq("status", "active")
      .order("created_at", {
        ascending: false,
      });
  
    setGoals(data || []);
  };

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setUserData(data);
  };

  const loadDashboard = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) return;
  
    const { data: appUser } = await supabase
      .from("users")
      .select("id, monthly_income")
      .eq("auth_user_id", user.id)
      .single();
  
    if (!appUser) return;
  
    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", appUser.id);
  
    let totalExpenses = 0;
  
    transactions?.forEach((tx) => {
      if (tx.type === "expense") {
        totalExpenses += Number(tx.amount);
      }
    });
  
    const currentBalance =
      Number(appUser.monthly_income || 0) -
      totalExpenses;
  
      const income =
  Number(appUser.monthly_income || 0);

const health =
  income > 0
    ? Math.max(
        0,
        100 -
          Math.round(
            (totalExpenses /
              income) *
              100
          )
      )
    : 0;

setBudgetHealth(health);

    setDashboard({
      totalExpenses,
      currentBalance,
      transactionCount:
        transactions?.length || 0,
    });
  }; 
  if (!userData) {
    return (
      <div className="p-6 text-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={36} />
          <div>
            <div className="text-xs font-bold text-muted-foreground">Hey there 👋</div>
            <h1 className="text-xl leading-tight">
              {userData.full_name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/premium" className="h-10 px-2.5 rounded-full bg-[var(--xp)] border-2 border-[var(--potli-green-dark)] grid place-items-center font-extrabold text-[var(--potli-green-dark)] text-xs">
            <span className="flex items-center gap-1"><Crown className="w-3.5 h-3.5" /> Pro</span>
          </Link>
          <Link to="/notifications" className="relative w-10 h-10 rounded-full bg-card border-2 border-border grid place-items-center">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--streak)] text-white text-[10px] font-extrabold grid place-items-center border-2 border-card">3</span>
          </Link>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-primary border-2 border-[var(--potli-green-dark)] grid place-items-center font-extrabold text-primary-foreground">
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Streak + XP */}
      <div className="px-5 pt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card card-pop p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Flame className="w-3.5 h-3.5 text-[var(--streak)]" /> SAVING STREAK
          </div>
          <div className="mt-1 flex items-end gap-1.5">
          <span className="text-3xl font-extrabold text-foreground">
            {userData.streak_days}
          </span>
            <span className="text-sm font-bold text-muted-foreground pb-1">days 🔥</span>
          </div>
        </div>
        <Link to="/achievements" className="rounded-2xl bg-card card-pop p-3.5 block">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-[var(--xp)]" fill="currentColor" /> SMART POTLI
          </div>
          <div className="mt-1 text-sm font-extrabold">
           {userData.xp} / 500 XP
          </div>
          <div className="mt-1.5"><ProgressBar
  value={Math.min(
    (userData.xp / 500) * 100,
    100
  )}
/></div>
        </Link>
      </div>

      {/* Current balance */}
      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-primary card-pop p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-primary-foreground/70">CURRENT BALANCE</div>
              <div className="text-4xl font-extrabold text-primary-foreground mt-1">₹{dashboard.currentBalance.toLocaleString()}</div>
              <div className="text-xs font-bold text-primary-foreground/70 mt-1">
                of ₹{userData.monthly_income} monthly budget
              </div>
            </div>
            <Potli size={70} mood="cheer" />
          </div>
          <div className="mt-4"><ProgressBar
                                   value={
                                   userData.monthly_income
                                   ? Math.min(
                                   100,
                                   (dashboard.totalExpenses /
                                   userData.monthly_income) *
                                   100
                                   )
                                   : 0
                                   }
                                   tone="green"
                                  /></div>
                                  <Link to="/expenses">
          <div className="mt-3 text-xs font-bold text-[var(--potli-green-dark)] bg-[var(--potli-green-soft)] rounded-xl px-3 py-2 inline-block">
          💸 Total spent: ₹{dashboard.totalExpenses.toLocaleString()}
          </div>
          </Link>
        </div>
      </div>

      {/* Daily tip */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-card card-pop p-4 flex gap-3">
          <Potli size={56} mood="think" />
          <div className="flex-1">
            <div className="text-xs font-bold text-muted-foreground">💡 DAILY TIP FROM POTLI</div>
            <p className="font-bold text-sm mt-0.5 leading-snug">
              "Cook one meal at home today and save ~₹250. Small wins, big potli ✨"
            </p>
            <Link to="/coach" className="text-xs font-extrabold text-secondary mt-2 inline-block">
              Ask Potli AI →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions — 5 items */}
      <div className="px-5 pt-5">
        <h2 className="text-base mb-2">Quick Actions</h2>
        <div className="grid grid-cols-5 gap-2">
          {[
            { to: "/add-menu", e: "➕", l: "Add" },
            { to: "/split", e: "🤝", l: "Split" },
            { to: "/budget", e: "📊", l: "Budget" },
            { to: "/forecast", e: "🔮", l: "Forecast" },
            { to: "/insights", e: "📈", l: "Insights" },
          ].map((a) => (
            <Link key={a.l} to={a.to} className="rounded-2xl bg-card card-pop p-2.5 text-center">
              <div className="text-2xl">{a.e}</div>
              <div className="text-[10px] font-bold mt-1">{a.l}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Budget health + Overspending */}
      <div className="px-5 pt-5 grid grid-cols-2 gap-3">
        <Link to="/budget" className="rounded-2xl bg-card card-pop p-4 block">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-secondary" /> BUDGET HEALTH
          </div>
          <div className="mt-1.5 flex items-end gap-1">
            <span className="text-2xl font-extrabold">82</span>
            <span className="text-xs font-bold text-muted-foreground pb-0.5">/100</span>
          </div>
          <Chip tone="green">Healthy 💪</Chip>
        </Link>
        <Link to="/forecast" className="rounded-2xl bg-card card-pop p-4 block">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--streak)]" /> OVERSPENDING
          </div>
          <div className="mt-2 relative h-3 rounded-full overflow-hidden border border-border" style={{ background: "linear-gradient(90deg, #4F7A3E 0%, #FFD400 55%, #E85D3A 100%)" }}>
            <div className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-[#1F3D2C] rounded-full" style={{ left: "68%" }} />
          </div>
          <div className="text-xs font-extrabold text-[var(--potli-green-dark)] mt-1.5">Warning · 68/100</div>
        </Link>
      </div>

      {/* Future prediction */}
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-card card-pop p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[var(--xp)]" /> LIKELY UPCOMING EXPENSES
            </div>
            <Link to="/forecast" className="text-xs font-extrabold text-secondary">See →</Link>
          </div>
          <div className="space-y-1.5">
            {[
              { e: "🍔", l: "Food", v: "₹1,200", w: "next week" },
              { e: "🚌", l: "Travel", v: "₹500", w: "next week" },
              { e: "🎬", l: "Entertainment", v: "₹700", w: "next week" },
            ].map((x) => (
              <div key={x.l} className="flex items-center justify-between text-sm">
                <span className="font-bold flex items-center gap-2"><span className="text-lg">{x.e}</span> {x.l}</span>
                <span className="font-extrabold">{x.v} <span className="text-xs text-muted-foreground font-bold">{x.w}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base flex items-center gap-2"><Target className="w-4 h-4" /> Active Goals</h2>
          <Link to="/goals" className="text-xs font-extrabold text-secondary">See all →</Link>
        </div>
        <div className="space-y-2.5">
          {goals.map((goal) => {
  const pct = Math.round(
    ((goal.current_amount || 0) /
      goal.target_amount) *
      100
  );

  return (
    <GoalRow
      key={goal.id}
      emoji={goal.icon || "🎯"}
      name={goal.title}
      pct={pct}
      cur={String(
        goal.current_amount || 0
      )}
      tot={String(
        goal.target_amount
      )}
    />
  );
})}

{goals.length === 0 && (
  <div className="rounded-2xl bg-card p-4 text-center">
    No active goals yet 🎯
  </div>
)}

        </div>
      </div>

      {/* Premium upsell */}
      <div className="px-5 pt-5">
        <Link to="/premium" className="block rounded-2xl bg-[var(--potli-green-dark)] card-pop p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Chip tone="yellow"><Crown className="w-3 h-3" /> POTLI PREMIUM</Chip>
              <div className="font-extrabold mt-2">Unlock advanced AI forecasts</div>
              <div className="text-xs font-semibold text-white/70">From ₹99/mo · Cancel anytime</div>
            </div>
            <Potli size={56} mood="cheer" />
          </div>
        </Link>
      </div>

      {/* Monthly Report CTA */}
      <div className="px-5 pt-5">
        <Link to="/report" className="block rounded-2xl bg-[var(--potli-green-soft)] card-pop p-4 border-2 border-[var(--potli-green-dark)]/15">
          <div className="flex items-center justify-between">
            <div>
              <Chip tone="green">📄 JUNE REPORT</Chip>
              <div className="font-extrabold text-[var(--potli-green-dark)] mt-2">Send report to parents</div>
              <div className="text-xs font-semibold text-[var(--potli-green-dark)]/70">Ready · 1 tap to share</div>
            </div>
            <Potli size={56} mood="cheer" />
          </div>
        </Link>
      </div>

      {/* FAB → opens add menu */}
      <Link
        to="/add-menu"
        className="fixed md:absolute bottom-20 right-5 w-14 h-14 rounded-full bg-primary border-[3px] border-[var(--potli-green-dark)] grid place-items-center card-pop z-10"
      >
        <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={3} />
      </Link>
    </div>
  );
}

function GoalRow({ emoji, name, pct, cur, tot }: { emoji: string; name: string; pct: number; cur: string; tot: string }) {
  return (
    <Link to="/goals" className="rounded-2xl bg-card card-pop p-3.5 block">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--potli-green-soft)] grid place-items-center text-xl">
            {emoji}
          </div>
          <div>
            <div className="font-extrabold text-sm">{name}</div>
            <div className="text-xs font-bold text-muted-foreground">₹{cur} / ₹{tot}</div>
          </div>
        </div>
        <span className="text-sm font-extrabold text-secondary">{pct}%</span>
      </div>
      <div className="mt-2"><ProgressBar value={pct} /></div>
    </Link>
  );
}
