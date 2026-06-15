import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";
import { ChevronLeft } from "lucide-react";
import { Potli } from "@/components/Potli";

export const Route = createFileRoute("/profile-setup")({ component: ProfileSetup });

function ProfileSetup() {
  const navigate = useNavigate();

  const [type, setType] = useState<"student" | "pro">("student");

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      if (!name.trim()) {
        alert("Please enter your name");
        return;
      }

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not found. Please login again.");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({
          full_name: name,
          occupation: type === "student" ? "Student" : "Working Professional",
          institution: institution,
          monthly_income: monthlyIncome
            ? Number(monthlyIncome.replace(/,/g, ""))
            : null,
        })
        .eq("auth_user_id", user.id);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      navigate({
        to: "/goals-setup",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <StatusBar />

      <div className="px-6 pt-2 flex items-center justify-between">
        <Link to="/otp" className="inline-flex items-center font-bold">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>

        <span className="text-xs font-bold text-muted-foreground">
          Step 1 of 4
        </span>
      </div>

      <div className="px-6 pt-2">
        <Progress step={1} />
      </div>

      <div className="px-6 pt-6 flex items-center gap-3">
        <Potli size={70} mood="happy" />

        <div>
          <h1 className="text-2xl leading-tight">
            Tell Potli about you
          </h1>

          <p className="text-sm text-muted-foreground font-semibold">
            So I can coach you better
          </p>
        </div>
      </div>

      <div className="px-6 pt-6 flex-1 space-y-5">
        <Field label="Your name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aman Sharma"
            className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-secondary"
          />
        </Field>

        <Field label="You are a…">
          <div className="grid grid-cols-2 gap-3">
            <Toggle
              active={type === "student"}
              onClick={() => setType("student")}
            >
              🎓 Student
            </Toggle>

            <Toggle
              active={type === "pro"}
              onClick={() => setType("pro")}
            >
              💼 Working Pro
            </Toggle>
          </div>
        </Field>

        <Field
          label={
            type === "student"
              ? "College / University"
              : "Workplace"
          }
        >
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder={
              type === "student"
                ? "Delhi University"
                : "Google India"
            }
            className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-secondary"
          />
        </Field>

        <Field label="Monthly income / allowance (₹)">
          <input
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            inputMode="numeric"
            placeholder="15000"
            className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-secondary"
          />
        </Field>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full rounded-2xl bg-secondary py-4 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </MobileFrame>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground/80 ml-1">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl py-3 font-bold border-2 transition ${
        active ? "bg-primary border-[var(--potli-green-dark)] text-primary-foreground card-pop" : "bg-card border-border text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function Progress({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-secondary" : "bg-muted"}`} />
      ))}
    </div>
  );
}
