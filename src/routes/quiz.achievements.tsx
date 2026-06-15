import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { Chip, ProgressBar } from "@/components/ui-bits";
import { BADGES, levelFromXP, useQuizProgress } from "@/lib/quiz-progress";
import { CATEGORIES } from "@/lib/quiz-data";
import { ChevronLeft, Flame, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/quiz/achievements")({ component: Achievements });

function Achievements() {
  const p = useQuizProgress();
  const { level, pct } = levelFromXP(p.xp);
  const completedCats = Object.keys(p.completed).length;

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/quiz" className="inline-flex items-center font-bold"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <h1 className="text-lg">Achievements</h1>
        <span className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6">
        <div className="rounded-3xl bg-[var(--potli-green-soft)] card-pop p-4 flex items-center gap-3">
          <Potli size={80} mood="cheer" />
          <div className="flex-1">
            <Chip tone="green">LEVEL {level}</Chip>
            <div className="font-extrabold text-[var(--potli-green-dark)] mt-1">{p.xp} XP total</div>
            <div className="mt-2"><ProgressBar value={pct} tone="yellow" /></div>
            <div className="text-[10px] font-bold text-[var(--potli-green-dark)]/70 mt-1">{100 - pct} XP to level {level + 1}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <Mini icon={<Sparkles className="w-3.5 h-3.5" />} label="XP" value={`${p.xp}`} />
          <Mini icon={<Flame className="w-3.5 h-3.5" />} label="Streak" value={`${p.streak}d`} />
          <Mini icon={<Trophy className="w-3.5 h-3.5" />} label="Badges" value={`${p.badges.length}/${BADGES.length}`} />
        </div>

        <h2 className="text-base mt-5 mb-2">Badges</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {BADGES.map((b) => {
            const unlocked = p.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl card-pop p-3 text-center ${unlocked ? "bg-card" : "bg-muted opacity-60"}`}
              >
                <div className="text-3xl">{unlocked ? b.emoji : "🔒"}</div>
                <div className="font-extrabold text-xs mt-1">{b.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-0.5">{b.desc}</div>
              </div>
            );
          })}
        </div>

        <h2 className="text-base mt-5 mb-2">Category mastery</h2>
        <div className="space-y-2">
          {CATEGORIES.map((c) => {
            const done = p.completed[c.slug];
            const pctDone = done ? Math.round((done.best / done.total) * 100) : 0;
            return (
              <div key={c.slug} className="rounded-2xl bg-card card-pop p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ background: c.color }}>{c.emoji}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm">{c.title}</span>
                    <span className="text-[11px] font-extrabold text-muted-foreground">{done?.best ?? 0}/{c.questions.length}</span>
                  </div>
                  <div className="mt-1.5"><ProgressBar value={pctDone} tone="green" /></div>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-base mt-5 mb-2">Recent activity</h2>
        {p.history.length === 0 ? (
          <div className="rounded-2xl bg-card card-pop p-4 text-center text-xs font-bold text-muted-foreground">
            No quizzes yet. Play one to start your streak! 🔥
          </div>
        ) : (
          <div className="space-y-2">
            {p.history.slice(0, 5).map((h, i) => {
              const cat = CATEGORIES.find((c) => c.slug === h.category);
              return (
                <div key={i} className="rounded-2xl bg-card card-pop p-3 flex items-center gap-3">
                  <div className="text-2xl">{cat?.emoji ?? "🧠"}</div>
                  <div className="flex-1">
                    <div className="font-extrabold text-sm">{cat?.title ?? h.category}</div>
                    <div className="text-[11px] font-bold text-muted-foreground">{h.score}/{h.total} · {h.date}</div>
                  </div>
                  <Chip tone="yellow">+{h.xp} XP</Chip>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card card-pop p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-muted-foreground">{icon}{label}</div>
      <div className="text-base font-extrabold mt-0.5">{value}</div>
    </div>
  );
}
