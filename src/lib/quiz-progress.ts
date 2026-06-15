import { useEffect, useState } from "react";

export type QuizProgress = {
  xp: number;
  coins: number;
  streak: number;
  lastPlayedDate: string | null;
  completed: Record<string, { best: number; total: number; plays: number }>;
  history: Array<{ date: string; category: string; score: number; total: number; xp: number }>;
  badges: string[];
};

const KEY = "mypotli.quiz.progress.v1";

const DEFAULT: QuizProgress = {
  xp: 120,
  coins: 24,
  streak: 1,
  lastPlayedDate: null,
  completed: {},
  history: [],
  badges: [],
};

export const BADGES = [
  { id: "first-quiz", emoji: "🥉", name: "Budget Beginner", desc: "Complete your first quiz" },
  { id: "perfect", emoji: "🎯", name: "Sharp Shooter", desc: "Score 100% on any quiz" },
  { id: "streak-3", emoji: "🔥", name: "On a Roll", desc: "3-day quiz streak" },
  { id: "streak-7", emoji: "⚡", name: "Saving Explorer", desc: "7-day quiz streak" },
  { id: "xp-500", emoji: "🥇", name: "Finance Master", desc: "Earn 500 XP" },
  { id: "all-categories", emoji: "🏆", name: "Money Guru", desc: "Finish every category" },
];

function read(): QuizProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function write(p: QuizProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("quiz-progress-update"));
}

export function useQuizProgress() {
  const [p, setP] = useState<QuizProgress>(DEFAULT);
  useEffect(() => {
    setP(read());
    const h = () => setP(read());
    window.addEventListener("quiz-progress-update", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("quiz-progress-update", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return p;
}

export function levelFromXP(xp: number) {
  // 100 XP per level
  const level = Math.floor(xp / 100) + 1;
  const into = xp % 100;
  return { level, into, pct: into };
}

export function recordQuizResult(args: {
  category: string;
  score: number;
  total: number;
}) {
  const cur = read();
  const xpFromAnswers = args.score * 10;
  const completionBonus = 50;
  const perfectBonus = args.score === args.total ? 100 : 0;
  const xpEarned = xpFromAnswers + completionBonus + perfectBonus;
  const coinsEarned = Math.floor(xpEarned / 10);

  const today = new Date().toISOString().slice(0, 10);
  let streak = cur.streak;
  if (cur.lastPlayedDate !== today) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const ystr = y.toISOString().slice(0, 10);
    streak = cur.lastPlayedDate === ystr ? cur.streak + 1 : 1;
  }

  const prev = cur.completed[args.category];
  const best = prev ? Math.max(prev.best, args.score) : args.score;
  const plays = (prev?.plays ?? 0) + 1;

  const next: QuizProgress = {
    ...cur,
    xp: cur.xp + xpEarned,
    coins: cur.coins + coinsEarned,
    streak,
    lastPlayedDate: today,
    completed: { ...cur.completed, [args.category]: { best, total: args.total, plays } },
    history: [
      { date: today, category: args.category, score: args.score, total: args.total, xp: xpEarned },
      ...cur.history,
    ].slice(0, 30),
  };

  // Badge unlocks
  const earned = new Set(next.badges);
  if (next.history.length >= 1) earned.add("first-quiz");
  if (args.score === args.total) earned.add("perfect");
  if (streak >= 3) earned.add("streak-3");
  if (streak >= 7) earned.add("streak-7");
  if (next.xp >= 500) earned.add("xp-500");
  if (Object.keys(next.completed).length >= 4) earned.add("all-categories");
  next.badges = Array.from(earned);

  write(next);
  return { xpEarned, coinsEarned, perfect: args.score === args.total };
}

export function xpEarnedToday() {
  const p = read();
  const today = new Date().toISOString().slice(0, 10);
  return p.history.filter((h) => h.date === today).reduce((s, h) => s + h.xp, 0);
}
