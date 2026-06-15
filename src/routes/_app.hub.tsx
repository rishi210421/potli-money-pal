import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Chip } from "@/components/ui-bits";
import { Potli } from "@/components/Potli";
import { BookOpen, Lightbulb, Play, Search, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/hub")({ component: Hub });

const CATEGORIES = [
  { slug: "budgeting", e: "📊", t: "Budgeting", d: "Master your monthly plan" },
  { slug: "saving", e: "🪙", t: "Saving Tips", d: "Hacks to save without pain" },
  { slug: "student-finance", e: "🎓", t: "Student Finance", d: "Scholarships, loans, IDs" },
  { slug: "investing", e: "📈", t: "Investing Basics", d: "Start small, think long" },
  { slug: "quizzes", e: "🧠", t: "Quizzes", d: "Test what you know · earn XP", to: "/quiz" },
  { slug: "awareness", e: "🛡️", t: "Financial Awareness", d: "Scams, fraud, safe money" },
];

const LESSONS = [
  { e: "🧠", t: "Budgeting 101", d: "5 min · Beginner", xp: 50 },
  { e: "📊", t: "The 50-30-20 Rule", d: "4 min · Beginner", xp: 40 },
  { e: "🪙", t: "Saving without pain", d: "6 min · Intermediate", xp: 60 },
];

const TIPS = [
  { e: "💸", t: "The ₹100 jar trick", d: "Drop ₹100 in a jar every Friday. ₹5,200 in a year." },
  { e: "🛒", t: "Cart, then wait 24h", d: "Beat impulse buys by sleeping on it." },
  { e: "📅", t: "Auto-save on payday", d: "Set 10% aside before you can blink." },
];

function Hub() {
  const [q, setQ] = useState("");
  const cats = CATEGORIES.filter((c) => c.t.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="pb-6">
      <div className="px-5 pt-3">
        <h1 className="text-2xl">Learn Hub</h1>
        <p className="text-sm text-muted-foreground font-semibold">Learn · Quiz · Earn XP</p>
      </div>

      <div className="px-5 pt-3">
        <div className="rounded-2xl bg-card card-pop px-3.5 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lessons, tips, quizzes…"
            className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
          />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-[var(--potli-green-soft)] card-pop p-5 flex items-center gap-4">
          <Potli size={72} mood="happy" />
          <div className="flex-1">
            <Chip tone="green">📚 TODAY'S LESSON</Chip>
            <div className="font-extrabold text-[var(--potli-green-dark)] mt-2">Why your future self will love SIPs</div>
            <button className="mt-2 inline-flex items-center gap-1.5 bg-[var(--potli-green-dark)] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold">
              <Play className="w-3 h-3" fill="currentColor" /> Start · +50 XP
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-base mb-2">Categories</h2>
        <div className="grid grid-cols-2 gap-2">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to={c.to ?? "/hub"}
              className="rounded-2xl bg-card card-pop p-3.5"
            >
              <div className="text-2xl">{c.e}</div>
              <div className="font-extrabold text-sm mt-1">{c.t}</div>
              <div className="text-[11px] font-bold text-muted-foreground mt-0.5">{c.d}</div>
              <div className="mt-2 text-xs font-extrabold text-secondary flex items-center gap-0.5">
                Open <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Section title="Lessons" icon={<BookOpen className="w-4 h-4" />}>
        {LESSONS.map((l) => (
          <div key={l.t} className="rounded-2xl bg-card card-pop p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/30 grid place-items-center text-2xl">{l.e}</div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">{l.t}</div>
              <div className="text-xs font-bold text-muted-foreground">{l.d}</div>
            </div>
            <span className="text-xs font-extrabold text-secondary">+{l.xp} XP</span>
          </div>
        ))}
      </Section>

      <Section title="Saving Hacks" icon={<Lightbulb className="w-4 h-4 text-[var(--xp)]" />}>
        {TIPS.map((t) => (
          <div key={t.t} className="rounded-2xl bg-card card-pop p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{t.e}</span>
              <span className="font-extrabold text-sm">{t.t}</span>
            </div>
            <div className="text-xs font-semibold text-muted-foreground mt-1">{t.d}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-base mb-2 flex items-center gap-2">{icon} {title}</h2>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}
