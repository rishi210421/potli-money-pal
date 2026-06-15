import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Potli } from "@/components/Potli";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { ChevronLeft } from "lucide-react";
import { Chip } from "@/components/ui-bits";

export const Route = createFileRoute("/notifications")({ component: Notifications });

type N = { id: number; cat: "budget" | "over" | "goal" | "tip" | "report"; title: string; body: string; time: string; unread: boolean; emoji: string };

const ALL: N[] = [
  { id: 1, cat: "over", title: "Overspending alert", body: "You're 20% over on Fun this week.", time: "2h", unread: true, emoji: "⚠️" },
  { id: 2, cat: "goal", title: "Goa Trip · 60% done!", body: "₹6,000 more to go. Keep saving!", time: "5h", unread: true, emoji: "🏖️" },
  { id: 3, cat: "budget", title: "Budget Alert · Food", body: "Only ₹800 left in your food budget.", time: "1d", unread: true, emoji: "🍔" },
  { id: 4, cat: "tip", title: "Tip from Potli", body: "Skip one chai today and save ₹40.", time: "1d", unread: false, emoji: "💡" },
  { id: 5, cat: "report", title: "June report is ready", body: "Tap to share with your parents.", time: "2d", unread: false, emoji: "📄" },
];

const TABS = ["All", "Unread", "Read"] as const;

function Notifications() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const list = ALL.filter((n) => tab === "All" || (tab === "Unread" ? n.unread : !n.unread));
  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="inline-flex items-center font-bold"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <h1 className="text-lg">Notifications</h1>
        <button className="text-xs font-extrabold text-secondary">Mark all read</button>
      </div>

      <div className="px-5 pt-4 flex gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 ${tab === t ? "bg-primary text-primary-foreground border-[var(--potli-green-dark)]" : "bg-card border-border text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4 space-y-2 flex-1 overflow-y-auto pb-6">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <Potli size={120} mood="sleep" className="mx-auto" />
            <div className="font-extrabold mt-3">All caught up!</div>
            <div className="text-xs text-muted-foreground font-semibold">No notifications here.</div>
          </div>
        ) : (
          list.map((n) => (
            <div key={n.id} className={`rounded-2xl card-pop p-3.5 flex gap-3 ${n.unread ? "bg-card" : "bg-card/60"}`}>
              <div className="w-10 h-10 rounded-xl bg-[var(--potli-green-soft)] grid place-items-center text-xl shrink-0">{n.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-extrabold text-sm">{n.title}</div>
                  <span className="text-[10px] font-bold text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <div className="text-xs font-semibold text-muted-foreground">{n.body}</div>
                {n.unread && <div className="mt-1.5"><Chip tone="green">NEW</Chip></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </MobileFrame>
  );
}
