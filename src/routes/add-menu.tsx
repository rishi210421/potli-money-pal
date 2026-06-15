import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { X, Plus, Mic, Camera, Banknote } from "lucide-react";

export const Route = createFileRoute("/add-menu")({ component: AddMenu });

const OPTS = [
  { to: "/add-expense", icon: Plus, t: "Add Expense", d: "Type it in manually", tone: "bg-primary text-primary-foreground" },
  { to: "/voice-expense", icon: Mic, t: "Voice Entry", d: "Just say it out loud", tone: "bg-secondary text-white" },
  { to: "/receipt-scan", icon: Camera, t: "Scan Receipt", d: "Snap a photo, we'll parse it", tone: "bg-[var(--potli-green-dark)] text-white" },
  { to: "/quick-cash", icon: Banknote, t: "Quick Cash Entry", d: "Tap preset cash amounts", tone: "bg-[var(--xp)] text-[var(--potli-green-dark)]" },
] as const;

function AddMenu() {
  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1"><X className="w-5 h-5" /> Close</Link>
        <span className="font-extrabold">Add Money Move</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 px-5 pt-4 space-y-3">
        <div className="rounded-3xl bg-[var(--potli-green-soft)] card-pop p-4 flex items-center gap-3">
          <Potli size={64} mood="cheer" />
          <div className="text-sm font-extrabold text-[var(--potli-green-dark)]">
            How did you spend today? 💸
          </div>
        </div>

        {OPTS.map((o) => {
          const I = o.icon;
          return (
            <Link key={o.t} to={o.to} className="rounded-2xl bg-card card-pop p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl grid place-items-center ${o.tone}`}>
                <I className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="font-extrabold">{o.t}</div>
                <div className="text-xs font-semibold text-muted-foreground">{o.d}</div>
              </div>
              <span className="text-muted-foreground font-extrabold">›</span>
            </Link>
          );
        })}
      </div>
    </MobileFrame>
  );
}
