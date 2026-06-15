import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { PopButton, Chip } from "@/components/ui-bits";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/goal-create")({ component: GoalCreate });

const PRESETS = [
  { e: "🏖️", l: "Goa Trip", amt: 15000 },
  { e: "📱", l: "New Phone", amt: 25000 },
  { e: "🎧", l: "Earphones", amt: 3000 },
  { e: "🛟", l: "Emergency Fund", amt: 20000 },
  { e: "🎁", l: "Birthday Gift", amt: 2000 },
  { e: "💻", l: "New Laptop", amt: 60000 },
];

function GoalCreate() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [amt, setAmt] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [cat, setCat] = useState("Travel");

  const pick = (p: typeof PRESETS[number]) => {
    setName(p.l); setAmt(String(p.amt)); setEmoji(p.e);
  };
  const createGoal = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        alert("Please login again");
        return;
      }
  
      const { data: appUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
  
      if (!appUser) {
        alert("User profile not found");
        return;
      }
  
      const { error } = await supabase
        .from("goals")
        .insert({
          user_id: appUser.id,
          title: name,
          target_amount: Number(amt),
          current_amount: 0,
          target_date: date || null,
          status: "active",
          icon: emoji,
        });
  
      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }
  
      alert("Goal created successfully 🚀");
  
      nav({
        to: "/goals",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/goals" className="inline-flex items-center font-bold"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <h1 className="text-lg">New Goal</h1>
        <span className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6 space-y-4">
        <div className="rounded-3xl bg-primary card-pop p-4 flex items-center gap-3">
          <Potli size={64} mood="cheer" />
          <div className="text-sm font-extrabold text-[var(--potli-green-dark)]">
            Let's set up your next potli win 🎯
          </div>
        </div>

        <div>
          <div className="text-xs font-extrabold text-muted-foreground mb-2">QUICK PICK</div>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button key={p.l} onClick={() => pick(p)} className={`rounded-2xl card-pop p-3 text-center ${name === p.l ? "bg-primary border-2 border-[var(--potli-green-dark)]" : "bg-card"}`}>
                <div className="text-2xl">{p.e}</div>
                <div className="text-[11px] font-extrabold mt-0.5">{p.l}</div>
              </button>
            ))}
          </div>
        </div>

        <Field label="Goal Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Goa Trip" className="w-full bg-transparent text-base font-extrabold focus:outline-none" />
        </Field>
        <Field label="Target Amount (₹)">
          <input value={amt} onChange={(e) => setAmt(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="15000" className="w-full bg-transparent text-base font-extrabold focus:outline-none" />
        </Field>
        <Field label="Target Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent text-base font-extrabold focus:outline-none" />
        </Field>
        <div>
          <div className="text-xs font-extrabold text-muted-foreground mb-2">CATEGORY</div>
          <div className="flex flex-wrap gap-2">
            {["Travel", "Gadget", "Emergency", "Gift", "Education", "Other"].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border-2 ${cat === c ? "bg-secondary text-white border-[var(--potli-green-dark)]" : "bg-card border-border text-muted-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>

        {amt && (
          <div className="rounded-2xl bg-[var(--potli-green-soft)] p-3 text-xs font-extrabold text-[var(--potli-green-dark)] flex items-center gap-2">
            <Chip tone="green">AI</Chip>
            Save ₹{Math.ceil(Number(amt) / 60)}/day to hit this in 2 months ✨
          </div>
        )}
      </div>

      <div className="px-5 pb-6">
        <PopButton
         onClick={createGoal}
         className="w-full"
         disabled={!name || !amt}
        >
          Create Goal {emoji}
        </PopButton>
      </div>
    </MobileFrame>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card card-pop p-3.5">
      <div className="text-[10px] font-extrabold text-muted-foreground mb-1">{label.toUpperCase()}</div>
      {children}
    </div>
  );
}
