import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { Chip, PopButton, PopLink, ProgressBar } from "@/components/ui-bits";
import { ChevronLeft, Check, X, ArrowLeft, ArrowRight, Coins, Sparkles, Flame } from "lucide-react";
import { getCategory } from "@/lib/quiz-data";
import { recordQuizResult } from "@/lib/quiz-progress";

export const Route = createFileRoute("/quiz/category/$id")({ component: QuizPlay });

function QuizPlay() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const cat = useMemo(() => getCategory(id), [id]);
  const total = cat.questions.length;

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [reveal, setReveal] = useState(false);
  const [done, setDone] = useState<null | { score: number; xp: number; coins: number; perfect: boolean }>(null);

  const q = cat.questions[idx];
  const picked = picks[idx];

  const pick = (i: number) => {
    if (reveal) return;
    const next = [...picks]; next[idx] = i; setPicks(next);
  };

  const handleNext = () => {
    if (picked === null) return;
    if (!reveal) { setReveal(true); return; }
    if (idx === total - 1) {
      const score = picks.reduce<number>((s, p, i) => s + (p === cat.questions[i].ans ? 1 : 0), 0);
      const res = recordQuizResult({ category: cat.slug, score, total });
      setDone({ score, xp: res.xpEarned, coins: res.coinsEarned, perfect: res.perfect });
      return;
    }
    setReveal(false); setIdx(idx + 1);
  };

  const handleBack = () => {
    if (idx === 0) { navigate({ to: "/quiz" }); return; }
    setReveal(picks[idx - 1] !== null);
    setIdx(idx - 1);
  };

  if (done) {
    const wrong = total - done.score;
    const pctScore = Math.round((done.score / total) * 100);
    const feedback =
      done.perfect ? "Perfect! Potli is doing a victory dance 🕺" :
      pctScore >= 70 ? "Excellent! Potli is proud of you 🎉" :
      pctScore >= 40 ? "Nice try! One more round and you'll nail it 💪" :
      "Don't worry — every master was once a beginner 🌱";

    return (
      <MobileFrame>
        <StatusBar />
        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 flex flex-col items-center text-center gap-3">
          <Potli size={160} mood={done.perfect ? "cheer" : "happy"} className="animate-float" />
          <Chip tone="yellow">🏆 QUIZ COMPLETE</Chip>
          <h1 className="text-3xl">{cat.title}</h1>
          <p className="font-extrabold text-lg -mt-1">{done.score} / {total} correct</p>
          <p className="text-sm text-muted-foreground font-semibold -mt-1 max-w-[280px]">{feedback}</p>

          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            <StatTile icon={<Check className="w-4 h-4" />} label="Correct" value={`${done.score}`} tone="green" />
            <StatTile icon={<X className="w-4 h-4" />} label="Wrong" value={`${wrong}`} tone="red" />
            <StatTile icon={<Sparkles className="w-4 h-4" />} label="XP earned" value={`+${done.xp}`} tone="yellow" />
            <StatTile icon={<Coins className="w-4 h-4" />} label="Coins" value={`+${done.coins}`} tone="dark" />
          </div>

          {done.perfect && (
            <div className="w-full rounded-2xl bg-[var(--potli-green-soft)] card-pop p-3 flex items-center gap-2 mt-1">
              <Flame className="w-4 h-4 text-[var(--streak)]" />
              <span className="text-xs font-extrabold text-[var(--potli-green-dark)]">+100 perfect-score bonus already added!</span>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 flex flex-col gap-2.5">
          <PopButton
            onClick={() => { setDone(null); setIdx(0); setReveal(false); setPicks(Array(total).fill(null)); }}
            className="w-full"
          >Retry Quiz</PopButton>
          <PopLink to="/quiz" variant="dark">Back to Quiz Home</PopLink>
        </div>
      </MobileFrame>
    );
  }

  const correct = reveal && picked === q.ans;
  const wrongPick = reveal && picked !== null && picked !== q.ans;

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <button onClick={handleBack} className="inline-flex items-center font-bold">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="font-extrabold text-sm">{cat.emoji} {cat.title}</div>
        <Link to="/quiz" className="text-xs font-extrabold text-muted-foreground">Exit</Link>
      </div>

      <div className="px-5 pt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-extrabold text-muted-foreground">QUESTION {idx + 1} OF {total}</span>
          <span className="text-xs font-extrabold text-[var(--potli-green-dark)]">+10 XP each</span>
        </div>
        <ProgressBar value={((idx + (reveal ? 1 : 0)) / total) * 100} tone="green" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3">
        <div className="rounded-3xl bg-card card-pop p-5">
          <h2 className="text-xl leading-snug">{q.q}</h2>
        </div>
        <div className="mt-4 space-y-2.5">
          {q.opts.map((o, i) => {
            const isPicked = picked === i;
            const isCorrect = reveal && i === q.ans;
            const isWrong = reveal && isPicked && i !== q.ans;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={reveal}
                className={`w-full text-left rounded-2xl card-pop p-3.5 flex items-center gap-3 font-extrabold border-2 transition ${
                  isCorrect ? "bg-[var(--potli-green-soft)] border-secondary" :
                  isWrong ? "bg-[oklch(0.95_0.08_40)] border-[var(--streak)]" :
                  isPicked ? "bg-primary border-[var(--potli-green-dark)]" : "bg-card border-border"
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-muted grid place-items-center text-xs">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{o}</span>
                {isCorrect && <Check className="w-5 h-5 text-secondary" />}
                {isWrong && <X className="w-5 h-5 text-[var(--streak)]" />}
              </button>
            );
          })}
        </div>

        {reveal && (
          <div className={`mt-4 rounded-2xl card-pop p-3 flex gap-2 items-start ${correct ? "bg-[var(--potli-green-soft)]" : "bg-[oklch(0.97_0.05_40)]"}`}>
            <Potli size={36} mood={correct ? "cheer" : "think"} />
            <div className="flex-1">
              <div className={`text-xs font-extrabold ${correct ? "text-[var(--potli-green-dark)]" : "text-[var(--streak)]"}`}>
                {correct ? "Correct! +10 XP" : `Oops! Answer: ${q.opts[q.ans]}`}
              </div>
              <div className="text-[11px] font-bold text-muted-foreground mt-0.5">{q.tip}</div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 flex gap-2">
        <button
          onClick={handleBack}
          className="btn-pop rounded-2xl px-4 py-3.5 bg-card border-2 border-border font-extrabold"
        ><ArrowLeft className="w-4 h-4" /></button>
        <PopButton onClick={handleNext} disabled={picked === null} className="flex-1 flex items-center justify-center gap-1.5">
          {!reveal ? "Check" : idx === total - 1 ? "Finish Quiz" : <>Next <ArrowRight className="w-4 h-4" /></>}
        </PopButton>
      </div>
    </MobileFrame>
  );
}

function StatTile({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "green" | "red" | "yellow" | "dark" }) {
  const tones = {
    green: "bg-[var(--potli-green-soft)] text-[var(--potli-green-dark)]",
    red: "bg-[oklch(0.95_0.08_40)] text-[var(--streak)]",
    yellow: "bg-primary text-[var(--potli-green-dark)]",
    dark: "bg-[var(--potli-green-dark)] text-white",
  } as const;
  return (
    <div className={`rounded-2xl card-pop p-3 text-left ${tones[tone]}`}>
      <div className="flex items-center gap-1 text-[10px] font-extrabold opacity-80">{icon}{label}</div>
      <div className="text-xl font-extrabold mt-0.5">{value}</div>
    </div>
  );
}
