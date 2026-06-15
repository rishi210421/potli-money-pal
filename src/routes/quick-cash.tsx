import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { PopButton, Chip } from "@/components/ui-bits";
import { ChevronLeft, Banknote } from "lucide-react";

export const Route = createFileRoute("/quick-cash")({ component: QuickCash });

const PRESETS = [50, 100, 200, 500, 1000, 2000];

function QuickCash() {
  const nav = useNavigate();
  const [amt, setAmt] = useState<number | null>(null);
  const [note, setNote] = useState("");

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <span className="font-extrabold">Quick Cash</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6">
        <div className="rounded-3xl bg-primary card-pop p-5 flex items-center gap-3">
          <Potli size={64} mood="happy" />
          <div>
            <Chip tone="green"><Banknote className="w-3 h-3" /> CASH SPENT</Chip>
            <div className="text-xs font-extrabold text-[var(--potli-green-dark)] mt-1">
              Tap an amount, done in 2 seconds.
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="text-xs font-bold text-muted-foreground">AMOUNT</div>
          <div className="text-6xl font-extrabold mt-1">₹{amt ?? 0}</div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmt(p)}
              className={`rounded-2xl py-4 font-extrabold text-lg border-2 ${amt === p ? "bg-primary border-[var(--potli-green-dark)] card-pop" : "bg-card border-border"}`}
            >
              ₹{p}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-card card-pop p-3.5">
          <div className="text-[10px] font-extrabold text-muted-foreground mb-1">NOTE (OPTIONAL)</div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. auto, snacks, parking"
            className="w-full bg-transparent text-base font-extrabold focus:outline-none"
          />
        </div>
      </div>

      <div className="px-5 pb-6">
        <PopButton onClick={() => nav({ to: "/home" })} className="w-full" disabled={!amt}>
          Log Cash ✓
        </PopButton>
      </div>
    </MobileFrame>
  );
}
