import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";
import { Progress } from "./profile-setup";
import { ChevronLeft, MessageSquare, Sparkles, Shield } from "lucide-react";
import { Potli } from "@/components/Potli";

export const Route = createFileRoute("/sms-permission")({ component: SmsPermission });

function SmsPermission() {
  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-6 pt-2 flex items-center justify-between">
        <Link to="/income-setup" className="inline-flex items-center font-bold">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
        <span className="text-xs font-bold text-muted-foreground">Step 4 of 4</span>
      </div>
      <div className="px-6 pt-2"><Progress step={4} /></div>

      <div className="px-6 pt-6 text-center flex flex-col items-center gap-2">
        <Potli size={140} mood="happy" className="animate-float" />
        <h1 className="text-2xl">Let Potli read your SMS</h1>
        <p className="text-sm text-muted-foreground font-semibold max-w-xs">
          So your expenses get tracked automatically — no manual logging needed.
        </p>
      </div>

      <div className="px-6 pt-6 flex-1 space-y-3">
        {[
          { i: MessageSquare, t: "Auto-detect transactions", d: "From bank & UPI SMS in real-time." },
          { i: Sparkles, t: "AI categorisation", d: "Food, travel, fun — sorted on its own." },
          { i: Shield, t: "Private & on-device", d: "SMS never leaves your phone. We only read amounts & merchants." },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="rounded-2xl bg-card border-2 border-border p-4 flex gap-3 items-start">
            <div className="w-10 h-10 rounded-xl bg-[var(--potli-green-soft)] grid place-items-center text-[var(--potli-green-dark)] shrink-0">
              <I className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-extrabold">{t}</div>
              <div className="text-xs text-muted-foreground font-semibold">{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-8 flex flex-col gap-2">
        <PopLink to="/ai-loading">Allow SMS Access</PopLink>
        <Link to="/ai-loading" className="text-center font-bold text-muted-foreground py-2 text-sm">
          Skip for now
        </Link>
      </div>
    </MobileFrame>
  );
}
