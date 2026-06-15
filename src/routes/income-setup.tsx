import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";
import { Field, Progress } from "./profile-setup";
import { ChevronLeft } from "lucide-react";
import { Potli } from "@/components/Potli";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/income-setup")({
  component: IncomeSetup,
});

const CATEGORIES = [
  { e: "🍔", l: "Food", v: "₹3,200" },
  { e: "🚌", l: "Transport", v: "₹1,500" },
  { e: "🎬", l: "Fun", v: "₹2,000" },
  { e: "📚", l: "Study", v: "₹800" },
  { e: "👕", l: "Shopping", v: "₹1,500" },
  { e: "📱", l: "Bills", v: "₹999" },
];

function IncomeSetup() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("monthly_income")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        console.error("Income fetch error:", error);
        return;
      }

      setMonthlyIncome(data?.monthly_income || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileFrame>
      <StatusBar />

      <div className="px-6 pt-2 flex items-center justify-between">
        <Link to="/goals-setup" className="inline-flex items-center font-bold">
          <ChevronLeft className="w-5 h-5" />
          Back
        </Link>

        <span className="text-xs font-bold text-muted-foreground">
          Step 3 of 4
        </span>
      </div>

      <div className="px-6 pt-2">
        <Progress step={3} />
      </div>

      <div className="px-6 pt-5 flex items-center gap-3">
        <Potli size={64} mood="cheer" />

        <div>
          <h1 className="text-2xl leading-tight">Money in & out</h1>

          <p className="text-sm text-muted-foreground font-semibold">
            A rough budget is enough to start
          </p>
        </div>
      </div>

      <div className="px-6 pt-5 flex-1 overflow-y-auto space-y-5 pb-4">
        <div className="rounded-3xl bg-primary p-5 card-pop">
          <div className="text-sm font-bold text-primary-foreground/70">
            Monthly income
          </div>

          <div className="text-4xl font-extrabold text-primary-foreground mt-1">
            {loading
              ? "Loading..."
              : `₹${Number(monthlyIncome).toLocaleString("en-IN")}`}
          </div>

          <div className="text-xs font-bold text-primary-foreground/70 mt-1">
            Tap to edit
          </div>
        </div>

        <Field label="Typical monthly spending">
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <div
                key={c.l}
                className="rounded-2xl bg-card border-2 border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.e}</span>

                  <span className="font-bold text-sm">{c.l}</span>
                </div>

                <div className="text-foreground font-extrabold mt-1">
                  {c.v}
                </div>
              </div>
            ))}
          </div>
        </Field>

        <div className="rounded-2xl bg-[var(--potli-green-soft)] p-4 text-sm font-semibold text-[var(--potli-green-dark)]">
          ✨ Potli will auto-categorize using your SMS transactions in the next
          step.
        </div>
      </div>

      <div className="px-6 pb-8">
        <PopLink to="/sms-permission">
          Looks good, continue
        </PopLink>
      </div>
    </MobileFrame>
  );
}