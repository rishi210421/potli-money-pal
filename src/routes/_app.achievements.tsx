import { createFileRoute, Link } from "@tanstack/react-router";
import { Chip, ProgressBar } from "@/components/ui-bits";
import { Potli } from "@/components/Potli";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/_app/achievements")({ component: Achievements });

const BADGES = [
  { e: "📝", t: "First Expense", d: "Logged your first ₹", got: true },
  { e: "🛡️", t: "Budget Builder", d: "Stayed under budget", got: true },
  { e: "🪙", t: "Smart Saver", d: "Saved 7 days in a row", got: true },
  { e: "🧠", t: "Quiz Champion", d: "Aced 3 quizzes", got: true },
  { e: "🎯", t: "Goal Achiever", d: "Hit your first goal", got: false },
  { e: "🔥", t: "Streak Legend", d: "30-day streak", got: false },
];

const STAGES = [
  { l: "Tiny Potli", e: "🌱", min: 0 },
  { l: "Growing Potli", e: "🪴", min: 100 },
  { l: "Smart Potli", e: "🧠", min: 250 },
  { l: "Wealthy Potli", e: "💰", min: 500 },
  { l: "Legendary Potli", e: "👑", min: 1000 },
];

function Achievements() {
  const xp = 320;
  const cur = [...STAGES].reverse().find((s) => xp >= s.min)!;
  const next = STAGES[STAGES.findIndex((s) => s.l === cur.l) + 1];
  const pct = next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100;

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 flex items-center justify-between">
        <h1 className="text-2xl">Achievements</h1>
        <Link to="/profile" className="text-xs font-extrabold text-secondary">My profile →</Link>
      </div>

      {/* Potli Evolution */}
      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-[var(--potli-green-dark)] card-pop p-5 text-white">
          <Chip tone="yellow">🌟 POTLI EVOLUTION</Chip>
          <div className="mt-3 flex items-center gap-4">
            <Potli size={84} mood="cheer" />
            <div className="flex-1">
              <div className="font-extrabold text-lg">{cur.e} {cur.l}</div>
              <div className="text-xs font-bold text-white/70">{xp} XP · Stage {STAGES.findIndex((s) => s.l === cur.l) + 1} of {STAGES.length}</div>
              {next && (
                <>
                  <div className="text-xs font-bold text-white/80 mt-2">{next.min - xp} XP to {next.l}</div>
                  <div className="mt-1.5"><ProgressBar value={pct} /></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution path */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-card card-pop p-4">
          <div className="text-xs font-extrabold text-muted-foreground mb-3">YOUR JOURNEY</div>
          <div className="flex justify-between items-end">
            {STAGES.map((s) => {
              const reached = xp >= s.min;
              const isCur = s.l === cur.l;
              return (
                <div key={s.l} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-11 h-11 rounded-2xl grid place-items-center text-xl border-2 ${isCur ? "bg-primary border-[var(--potli-green-dark)] scale-110" : reached ? "bg-[var(--potli-green-soft)] border-secondary" : "bg-muted border-border opacity-50"}`}>{s.e}</div>
                  <div className={`text-[9px] font-extrabold text-center leading-tight ${reached ? "text-foreground" : "text-muted-foreground"}`}>{s.l}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-base mb-2 flex items-center gap-2"><Trophy className="w-4 h-4" /> Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.t}
              className={`rounded-2xl card-pop p-3 text-center ${
                b.got ? "bg-card" : "bg-muted/50 opacity-50 grayscale"
              }`}
            >
              <div className="text-3xl">{b.e}</div>
              <div className="font-extrabold text-xs mt-1">{b.t}</div>
              <div className="text-[10px] font-semibold text-muted-foreground leading-tight mt-0.5">
                {b.d}
              </div>
              <div className="text-[10px] font-extrabold mt-1.5">
                {b.got ? <span className="text-secondary">COMPLETED</span> : <span className="text-muted-foreground">LOCKED</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-base mb-2">XP Rewards</h2>
        <div className="rounded-2xl bg-card card-pop p-3 space-y-1.5">
          {[
            { l: "Add Expense", v: "+10 XP" },
            { l: "Stay Under Budget", v: "+50 XP" },
            { l: "Goal Completed", v: "+100 XP" },
            { l: "Quiz Completed", v: "+30 XP" },
          ].map((r) => (
            <div key={r.l} className="flex items-center justify-between px-2 py-1.5 text-sm">
              <span className="font-bold">{r.l}</span>
              <span className="font-extrabold text-secondary">{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-base mb-2">This Week's Leaderboard</h2>
        <div className="rounded-2xl bg-card card-pop p-3 space-y-2">
          {[
            { r: 1, n: "Aman (You)", xp: 320, me: true },
            { r: 2, n: "Vicky", xp: 280 },
            { r: 3, n: "Rahul", xp: 210 },
          ].map((u) => (
            <div
              key={u.r}
              className={`flex items-center gap-3 p-2.5 rounded-xl ${
                u.me ? "bg-[var(--potli-green-soft)]" : ""
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-primary grid place-items-center font-extrabold text-sm">
                {u.r}
              </div>
              <div className="flex-1 font-extrabold text-sm">{u.n}</div>
              <div className="text-sm font-extrabold text-secondary">{u.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
