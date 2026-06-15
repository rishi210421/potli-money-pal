import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";
import { Progress } from "./profile-setup";
import { ChevronLeft, Check } from "lucide-react";

export const Route = createFileRoute("/goals-setup")({ component: GoalsSetup });

const GOALS = [
  { id: "laptop", emoji: "💻", title: "New Laptop", hint: "₹60,000 goal" },
  { id: "goa", emoji: "🏖️", title: "Goa Trip", hint: "₹15,000 goal" },
  { id: "fund", emoji: "🛟", title: "Emergency Fund", hint: "₹20,000 goal" },
  { id: "save", emoji: "💰", title: "Just Save More", hint: "Build the habit" },
  { id: "fees", emoji: "🎓", title: "College Fees", hint: "Semester fees" },
  { id: "phone", emoji: "📱", title: "New Phone", hint: "₹40,000 goal" },
];

function GoalsSetup() {
  const [picked, setPicked] = useState<string[]>(["goa"]);
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-6 pt-2 flex items-center justify-between">
        <Link to="/profile-setup" className="inline-flex items-center font-bold">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
        <span className="text-xs font-bold text-muted-foreground">Step 2 of 4</span>
      </div>
      <div className="px-6 pt-2"><Progress step={2} /></div>
      <div className="px-6 pt-5">
        <h1 className="text-2xl">What are you saving for?</h1>
        <p className="text-sm text-muted-foreground font-semibold">Pick one or more. Potli will help you crush them.</p>
      </div>
      <div className="px-6 pt-5 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {GOALS.map((g) => {
            const on = picked.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={`relative rounded-2xl p-4 text-left border-2 transition ${
                  on
                    ? "bg-[var(--potli-green-soft)] border-[var(--potli-green-dark)] card-pop"
                    : "bg-card border-border"
                }`}
              >
                <div className="text-3xl">{g.emoji}</div>
                <div className="font-extrabold mt-2 text-sm">{g.title}</div>
                <div className="text-xs text-muted-foreground font-semibold">{g.hint}</div>
                {on && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary text-white grid place-items-center">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-6 pb-8">
        <PopLink to="/income-setup" className={picked.length === 0 ? "opacity-50 pointer-events-none" : ""}>
          Continue ({picked.length} picked)
        </PopLink>
      </div>
    </MobileFrame>
  );
}
