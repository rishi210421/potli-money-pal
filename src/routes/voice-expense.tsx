import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { PopButton, Chip } from "@/components/ui-bits";
import { ChevronLeft, Mic } from "lucide-react";

export const Route = createFileRoute("/voice-expense")({ component: VoiceExpense });

function VoiceExpense() {
  const nav = useNavigate();
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);

  const start = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setHeard("Paid ₹220 for chai and samosa at Sharma cafe");
    }, 1600);
  };

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <span className="font-extrabold">Voice Entry</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 px-5 pt-6 flex flex-col items-center text-center">
        <Potli size={120} mood={listening ? "think" : "happy"} className="animate-float" />
        <h1 className="text-2xl mt-3">Just say it 🎙️</h1>
        <p className="text-sm text-muted-foreground font-semibold max-w-xs">
          Try: <span className="text-foreground">"Paid 200 for lunch"</span>
        </p>

        <button
          onClick={start}
          className={`mt-8 w-32 h-32 rounded-full grid place-items-center border-[6px] border-[var(--potli-green-dark)] card-pop transition ${
            listening ? "bg-[var(--streak)] scale-110" : "bg-primary"
          }`}
        >
          <Mic className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
        </button>
        <div className="text-xs font-extrabold text-muted-foreground mt-4">
          {listening ? "Listening…" : "Tap to talk"}
        </div>

        {heard && (
          <div className="mt-6 w-full rounded-2xl bg-card card-pop p-4 text-left">
            <Chip tone="green">✨ Parsed by Potli AI</Chip>
            <div className="mt-2 font-extrabold">"{heard}"</div>
            <div className="mt-3 text-sm font-bold flex justify-between">
              <span>Category</span><span>🍔 Food</span>
            </div>
            <div className="mt-1 text-sm font-bold flex justify-between">
              <span>Amount</span><span>₹220</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6">
        <PopButton onClick={() => nav({ to: "/home" })} className="w-full" disabled={!heard}>
          Save Expense ✓
        </PopButton>
      </div>
    </MobileFrame>
  );
}
