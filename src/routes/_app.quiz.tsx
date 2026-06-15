import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Potli } from "@/components/Potli";
import { Chip, ProgressBar } from "@/components/ui-bits";
import { CATEGORIES } from "@/lib/quiz-data";
import { BADGES, levelFromXP, useQuizProgress, xpEarnedToday } from "@/lib/quiz-progress";
import { Brain, Flame, Sparkles, Trophy, ChevronRight, Zap, Coins, Target } from "lucide-react";

export const Route = createFileRoute("/_app/quiz")({ component: QuizHub });

function QuizHub() {
  const p = useQuizProgress();
  const [todayXP, setTodayXP] = useState(0);
  useEffect(() => { setTodayXP(xpEarnedToday()); }, [p]);
  const { level, pct } = levelFromXP(p.xp);
  const earnedBadges = BADGES.filter((b) => p.badges.includes(b.id));
  const daily = CATEGORIES[new Date().getDate() % CATEGORIES.length];

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl flex items-center gap-2"><Brain className="w-6 h-6 text-[var(--potli-green-dark)]" /> Money Quiz</h1>
          <p className="text-sm text-muted-foreground font-semibold">Learn · Earn XP · Level up</p>
        </div>
        <Link to="/quiz/achievements" className="rounded-2xl bg-card card-pop px-3 py-2 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[var(--xp)]" />
          <span className="text-xs font-extrabold">{earnedBadges.length}/{BADGES.length}</span>
        </Link>
      </div>

      {/* Stats row */}
      <div className="px-5 pt-3 grid grid-cols-3 gap-2">
        <StatCard icon={<Zap className="w-4 h-4" />} label="XP today" value={`+${todayXP}`} tone="yellow" />
        <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={`${p.streak}d`} tone="streak" />
        <StatCard icon={<Sparkles className="w-4 h-4" />} label="Level" value={`${level}`} tone="green" />
      </div>

      {/* Level progress */}
      <div className="px-5 pt-3">
        <div className="rounded-3xl bg-card card-pop p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-extrabold text-sm">Level {level} → {level + 1}</div>
            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[var(--xp)]" /> {p.coins} coins · {p.xp} XP
            </div>
          </div>
          <ProgressBar value={pct} tone="green" />
          <div className="text-[11px] font-bold text-muted-foreground mt-1.5">{100 - pct} XP to next level</div>
        </div>
      </div>

      {/* Potli encouragement */}
      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-[var(--potli-green-soft)] card-pop p-4 flex items-center gap-3">
          <Potli size={72} mood="cheer" />
          <div className="flex-1">
            <Chip tone="green">💚 POTLI SAYS</Chip>
            <div className="font-extrabold text-[var(--potli-green-dark)] mt-1.5 text-sm leading-snug">
              {p.streak >= 3
                ? `${p.streak}-day streak! You're unstoppable 🔥`
                : "One quiz a day keeps the broke away. Let's go!"}
            </div>
          </div>
        </div>
      </div>

      {/* Daily challenge */}
      <Section title="Daily Challenge" icon={<Target className="w-4 h-4 text-[var(--streak)]" />}>
        <Link
          to="/quiz/category/$id"
          params={{ id: daily.slug }}
          className="rounded-3xl card-pop p-4 flex items-center gap-3 bg-primary"
        >
          <div className="w-14 h-14 rounded-2xl bg-white grid place-items-center text-3xl">{daily.emoji}</div>
          <div className="flex-1">
            <div className="text-[10px] font-extrabold text-[var(--potli-green-dark)]/70">TODAY'S QUEST · +150 XP</div>
            <div className="font-extrabold text-[var(--potli-green-dark)]">{daily.title}</div>
            <div className="text-[11px] font-bold text-[var(--potli-green-dark)]/70">{daily.questions.length} quick questions</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--potli-green-dark)]" />
        </Link>
      </Section>

      {/* Categories */}
      <Section title="Categories" icon={<Brain className="w-4 h-4" />}>
        <div className="space-y-2.5">
          {CATEGORIES.map((c) => {
            const done = p.completed[c.slug];
            const pctDone = done ? Math.round((done.best / done.total) * 100) : 0;
            return (
              <Link
                key={c.slug}
                to="/quiz/category/$id"
                params={{ id: c.slug }}
                className="rounded-2xl bg-card card-pop p-3.5 flex items-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0"
                  style={{ background: c.color }}
                >{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold truncate">{c.title}</div>
                    {done && <Chip tone="green">{pctDone}%</Chip>}
                  </div>
                  <div className="text-[11px] font-bold text-muted-foreground">{c.blurb} · {c.questions.length} Qs</div>
                  <div className="mt-1.5"><ProgressBar value={pctDone} tone="yellow" /></div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Recent achievements */}
      <Section title="Recent Achievements" icon={<Trophy className="w-4 h-4 text-[var(--xp)]" />}>
        {earnedBadges.length === 0 ? (
          <div className="rounded-2xl bg-card card-pop p-4 text-center">
            <div className="text-3xl">🔒</div>
            <div className="font-extrabold mt-1 text-sm">No badges yet</div>
            <div className="text-[11px] font-bold text-muted-foreground">Finish a quiz to unlock your first badge</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {earnedBadges.slice(0, 6).map((b) => (
              <div key={b.id} className="rounded-2xl bg-card card-pop p-3 text-center">
                <div className="text-2xl">{b.emoji}</div>
                <div className="text-[10px] font-extrabold mt-1 leading-tight">{b.name}</div>
              </div>
            ))}
          </div>
        )}
        <Link to="/quiz/achievements" className="block text-center text-xs font-extrabold text-[var(--potli-green-dark)] mt-3">
          View all achievements →
        </Link>
      </Section>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "yellow" | "streak" | "green" }) {
  const tones = {
    yellow: "bg-primary text-[var(--potli-green-dark)]",
    streak: "bg-[oklch(0.95_0.08_40)] text-[var(--streak)]",
    green: "bg-[var(--potli-green-soft)] text-[var(--potli-green-dark)]",
  } as const;
  return (
    <div className={`rounded-2xl card-pop p-2.5 ${tones[tone]}`}>
      <div className="flex items-center gap-1 text-[10px] font-extrabold opacity-80">{icon}{label}</div>
      <div className="text-lg font-extrabold leading-tight mt-0.5">{value}</div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-base mb-2 flex items-center gap-2">{icon} {title}</h2>
      {children}
    </div>
  );
}
