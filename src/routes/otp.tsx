import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Potli } from "@/components/Potli";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/otp")({ component: Otp });

function Otp() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const set = (i: number, v: string) => {
    const c = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = c;
    setDigits(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  const filled = digits.every(Boolean);

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-6 pt-2">
        <Link to="/login" className="inline-flex items-center text-foreground font-bold">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
      </div>
      <div className="px-8 pt-4 text-center flex flex-col items-center gap-3">
        <Potli size={120} mood="think" className="animate-wiggle" />
        <h1 className="text-2xl">Verify your number</h1>
        <p className="text-muted-foreground font-semibold text-sm">
          We sent a 6-digit code to <span className="text-foreground">+91 98••• ••432</span>
        </p>
      </div>
      <div className="px-6 pt-8 flex-1">
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
              }}
              className="w-12 h-14 rounded-2xl bg-card border-2 border-border text-center text-2xl font-extrabold focus:outline-none focus:border-secondary card-pop"
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground font-semibold mt-6">
          Didn't get it? <button className="text-secondary">Resend in 24s</button>
        </p>
      </div>
      <div className="px-6 pb-8">
        <PopLink
          to="/profile-setup"
          className={!filled ? "opacity-50 pointer-events-none" : ""}
        >
          Verify & Continue
        </PopLink>
      </div>
    </MobileFrame>
  );
}
