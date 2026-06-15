import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { ProgressBar } from "@/components/ui-bits";

export const Route = createFileRoute("/ai-loading")({ component: AiLoading });

const STEPS = [
  "Scanning recent SMS…",
  "Categorising expenses with AI…",
  "Spotting your money habits…",
  "Setting up your Potli home…",
];

function AiLoading() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [pct, setPct] = useState(8);

  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => Math.min(100, p + 6));
    }, 180);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (pct >= 25 && i === 0) setI(1);
    else if (pct >= 55 && i === 1) setI(2);
    else if (pct >= 80 && i === 2) setI(3);
    else if (pct >= 100) {
      const t = setTimeout(() => nav({ to: "/home" }), 400);
      return () => clearTimeout(t);
    }
  }, [pct, i, nav]);

  return (
    <MobileFrame bg="bg-[var(--potli-green-soft)]">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <Potli size={180} mood="cheer" className="animate-wiggle" />
        <h1 className="text-2xl">Potli is getting ready ✨</h1>
        <div className="w-full max-w-xs space-y-3">
          <ProgressBar value={pct} tone="green" />
          <div className="text-sm font-bold text-[var(--potli-green-dark)]">{STEPS[i]}</div>
        </div>
        <p className="text-xs text-muted-foreground font-semibold max-w-xs pt-4">
          Pro tip: log expenses daily to keep your 🔥 streak alive.
        </p>
      </div>
    </MobileFrame>
  );
}
