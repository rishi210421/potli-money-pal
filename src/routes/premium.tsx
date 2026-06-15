import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { Chip, PopLink } from "@/components/ui-bits";
import { ChevronLeft, Crown, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/premium")({ component: Premium });

const FEATURES = [
  { e: "🔮", t: "Advanced AI Forecasting", d: "Multi-category predictions with 90%+ confidence." },
  { e: "📄", t: "Unlimited Reports", d: "Monthly, weekly, custom date-range reports." },
  { e: "📊", t: "Detailed Financial Insights", d: "Deep dives into every category & trend." },
  { e: "💡", t: "Smart Saving Recommendations", d: "Personalised tips powered by your data." },
  { e: "👑", t: "Premium Potli Badge", d: "Stand out with a golden potli on your profile." },
  { e: "🚫", t: "Ad-Free Experience", d: "Pure focus, zero distractions." },
];

function Premium() {
  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/profile" className="font-extrabold flex items-center gap-1">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
        <span className="font-extrabold">Potli Premium</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 space-y-4">
        <div className="rounded-3xl bg-[var(--potli-green-dark)] text-white card-pop p-5 text-center">
          <div className="flex justify-center"><Potli size={96} mood="cheer" /></div>
          <Chip tone="yellow">
            <Crown className="w-3 h-3" /> POTLI PREMIUM
          </Chip>
          <h1 className="text-3xl mt-2 text-white">Unlock the Golden Potli</h1>
          <p className="text-sm text-white/80 font-semibold mt-1">
            Smarter forecasts. Deeper insights. Zero ads.
          </p>
          <div className="mt-4 inline-flex items-baseline gap-1 bg-white/10 rounded-2xl px-4 py-2">
            <span className="text-3xl font-extrabold">₹99</span>
            <span className="text-xs font-bold text-white/70">/month</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-2xl bg-card card-pop p-3.5 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary grid place-items-center text-2xl shrink-0">{f.e}</div>
              <div className="flex-1">
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  {f.t}
                  <Check className="w-3.5 h-3.5 text-secondary" strokeWidth={3} />
                </div>
                <div className="text-xs font-semibold text-muted-foreground">{f.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-primary card-pop p-4 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[var(--potli-green-dark)] mt-0.5" />
          <div className="text-xs font-extrabold text-[var(--potli-green-dark)]">
            Most students save ₹500+/month with Premium insights — pays for itself.
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 grid grid-cols-1 gap-2">
        <PopLink to="/home" variant="dark">
          <Crown className="w-4 h-4 inline mr-1.5" /> Get Premium · ₹99/mo
        </PopLink>
        <Link to="/home" className="text-center text-xs font-extrabold text-muted-foreground py-2">
          Maybe later
        </Link>
      </div>
    </MobileFrame>
  );
}
