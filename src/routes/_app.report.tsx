import { createFileRoute, Link } from "@tanstack/react-router";
import { Chip, ProgressBar, PopLink } from "@/components/ui-bits";
import { Potli } from "@/components/Potli";
import { Download, Share2, Sparkles, Send } from "lucide-react";

export const Route = createFileRoute("/_app/report")({ component: Report });

const CATS = [
  { e: "🍔", l: "Food", v: 3200, c: "bg-[var(--streak)]" },
  { e: "🚌", l: "Transport", v: 1300, c: "bg-secondary" },
  { e: "🎬", l: "Fun", v: 2400, c: "bg-primary" },
  { e: "📚", l: "Study", v: 400, c: "bg-[var(--potli-green-dark)]" },
  { e: "👕", l: "Shopping", v: 1500, c: "bg-[oklch(0.7_0.18_300)]" },
  { e: "📱", l: "Bills", v: 999, c: "bg-[oklch(0.6_0.15_220)]" },
];
const TOTAL = CATS.reduce((s, c) => s + c.v, 0);

function Report() {
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl leading-tight">June Report</h1>
          <p className="text-sm text-muted-foreground font-semibold">Your money month, summed up</p>
        </div>
        <div className="flex gap-1.5">
          <Link to="/share-report" className="w-9 h-9 rounded-full bg-card border-2 border-border grid place-items-center"><Share2 className="w-4 h-4" /></Link>
          <Link to="/share-report" className="w-9 h-9 rounded-full bg-primary border-2 border-[var(--potli-green-dark)] grid place-items-center"><Download className="w-4 h-4 text-primary-foreground" /></Link>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-[var(--potli-green-dark)] card-pop p-5 text-white">
          <Chip tone="yellow">🏆 SAVED ₹4,200 THIS MONTH</Chip>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { l: "Income", v: "₹15,000" },
              { l: "Spent", v: "₹9,800" },
              { l: "Saved", v: "₹4,200" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-2xl py-2.5 text-center">
                <div className="text-[10px] font-bold text-white/70">{s.l.toUpperCase()}</div>
                <div className="font-extrabold text-sm mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-card card-pop p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">BUDGET ADHERENCE</span>
            <Chip tone="green">86% on track</Chip>
          </div>
          <div className="mt-2"><ProgressBar value={86} tone="green" /></div>
          <div className="text-xs font-semibold text-muted-foreground mt-2">
            You stayed in budget on 26 of 30 days.
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-card card-pop p-4">
          <div className="text-xs font-bold text-muted-foreground mb-2">WHERE YOUR MONEY WENT</div>
          {/* stacked bar */}
          <div className="flex h-4 rounded-full overflow-hidden border border-border">
            {CATS.map((c) => (
              <div key={c.l} className={c.c} style={{ width: `${(c.v / TOTAL) * 100}%` }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {CATS.map((c) => (
              <div key={c.l} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${c.c}`} /><span className="font-bold">{c.e} {c.l}</span></span>
                <span className="font-extrabold">₹{c.v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-primary card-pop p-4">
          <div className="flex items-center gap-2 mb-1.5"><Sparkles className="w-4 h-4 text-[var(--potli-green-dark)]" /><span className="text-xs font-extrabold text-[var(--potli-green-dark)]">POTLI'S INSIGHTS</span></div>
          <ul className="text-sm font-semibold text-[var(--potli-green-dark)] space-y-1.5">
            <li>🍔 Food was your #1 spend — 33% of total.</li>
            <li>📈 You saved 12% more than May. Big win!</li>
            <li>🎬 Fun went over by ₹400 — set a tighter cap?</li>
          </ul>
        </div>
      </div>

      <div className="px-5 pt-5 flex items-center gap-3">
        <Potli size={56} mood="cheer" />
        <div className="flex-1 text-sm font-extrabold">
          You leveled up from <span className="text-secondary">Smart Spender</span> → <span className="text-secondary">Budget Builder</span> ✨
        </div>
      </div>

      <div className="px-5 pt-5 grid grid-cols-2 gap-3">
        <PopLink to="/share-report" variant="dark">
          <Send className="w-4 h-4 inline mr-2" /> Send to Parent
        </PopLink>
        <PopLink to="/share-report" variant="ghost">
          <Download className="w-4 h-4 inline mr-2" /> Download
        </PopLink>
      </div>
    </div>
  );
}
