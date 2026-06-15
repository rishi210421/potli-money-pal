import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProgressBar, PopLink, Chip } from "@/components/ui-bits";
import { Plus, Trophy } from "lucide-react";
import { Potli } from "@/components/Potli";

export const Route = createFileRoute("/_app/goals")({ component: Goals });


function Goals() {
  const [goals, setGoals] = useState<any[]>([]);

useEffect(() => {
  loadGoals();
}, []);

const loadGoals = async () => {
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
    .from("goals")
    .select("*")
    .eq("user_id", appUser.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

    console.log("GOALS:", data); 

  if (error) {
    console.error(error);
    return;
  }

  setGoals(data || []);
};

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Your Goals</h1>
          <p className="text-sm text-muted-foreground font-semibold">Save smarter. Watch your potli grow.</p>
        </div>
        <Link to="/achievements" className="w-10 h-10 rounded-full bg-card border-2 border-border grid place-items-center">
          <Trophy className="w-4 h-4 text-[var(--xp)]" />
        </Link>
      </div>

      {/* Active Goals — top of screen */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base">🎯 Active Goals</h2>
          <Link to="/goal-create" className="text-xs font-extrabold text-secondary inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Create
          </Link>
        </div>
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.round(
              ((g.current_amount || 0) / g.target_amount) * 100
            );
            
            const remain =
              g.target_amount - (g.current_amount || 0);
            
            const days =
              g.target_date
                ? Math.max(
                    0,
                    Math.ceil(
                      (new Date(g.target_date).getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )
                : 0;
            
            const daily =
              days > 0
                ? Math.ceil(remain / days)
                : remain;
            return (
              <Link
                  key={g.id}
                     to="/goal-details"
                     search={{
                     id: g.id,
                     }}
                     className="block rounded-2xl bg-card card-pop p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--potli-green-soft)] grid place-items-center text-2xl">
                    {g.icon || "🎯"}
                    </div>
                    <div>
                      <div className="font-extrabold">{g.title}</div>
                      <div className="text-xs font-bold text-muted-foreground">
                       ₹{(g.current_amount || 0).toLocaleString()} of ₹
                        {g.target_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Chip tone="yellow">{pct}%</Chip>
                </div>
                <div className="mt-3"><ProgressBar value={pct} /></div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Stat
  l="Saved"
  v={`₹${(g.current_amount || 0).toLocaleString()}`}
/>
                  <Stat l="Left" v={`₹${remain.toLocaleString()}`} />
                  <Stat l="Days" v={`${days}d`} />
                </div>
                <div className="mt-3 text-xs font-bold text-secondary text-center">
                  Save ₹{daily}/day to hit it on time
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="rounded-3xl bg-[var(--potli-green-soft)] card-pop p-5 flex items-center gap-4">
          <Potli size={72} mood="cheer" />
          <div className="flex-1">
            <Chip tone="green">🏆 Trophy Cabinet</Chip>
            <div className="text-sm font-extrabold mt-2">3 active · 5 completed</div>
            <div className="text-xs font-semibold text-muted-foreground">Total saved: ₹41,000</div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 grid grid-cols-2 gap-3">
        <PopLink to="/goal-create">+ New Goal</PopLink>
        <PopLink to="/goal-saving" variant="dark">Log saving</PopLink>
      </div>
    </div>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-xl bg-muted py-1.5">
      <div className="text-[10px] font-extrabold text-muted-foreground">{l.toUpperCase()}</div>
      <div className="text-xs font-extrabold">{v}</div>
    </div>
  );
}
