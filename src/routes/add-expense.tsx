import { supabase } from "@/lib/supabase";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopButton } from "@/components/ui-bits";
import { X } from "lucide-react";
import { Potli } from "@/components/Potli";

export const Route = createFileRoute("/add-expense")({ component: AddExpense });

const CATS = [
  { e: "🍔", l: "Food" },
  { e: "🚌", l: "Transport" },
  { e: "🎬", l: "Fun" },
  { e: "📚", l: "Study" },
  { e: "👕", l: "Shop" },
  { e: "📱", l: "Bills" },
];

function AddExpense() {
  const nav = useNavigate();
  const [amt, setAmt] = useState("");
  const [cat, setCat] = useState("Food");
  const [saving, setSaving] = useState(false);

  const press = (k: string) => {
    if (k === "←") setAmt(amt.slice(0, -1));
    else if (k === "." && amt.includes(".")) return;
    else if (amt.length < 7) setAmt(amt + k);
  };

  const saveExpense = async () => {
    try {
      setSaving(true);
  
      // Logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        alert("Please login first");
        return;
      }
  
      // Find user record
      const { data: appUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
  
      if (userError || !appUser) {
        console.error(userError);
        alert("User record not found");
        return;
      }
  
      // Map UI category -> DB category
      const categoryMap: Record<string, string> = {
        Food: "Food",
        Transport: "Travel",
        Fun: "Entertainment",
        Study: "Education",
        Shop: "Shopping",
        Bills: "Bills",
      };
  
      const dbCategoryName = categoryMap[cat];
  
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", dbCategoryName)
        .single();
  
      if (categoryError || !categoryData) {
        console.error(categoryError);
        alert("Category not found");
        return;
      }
  
      // Insert expense
      const { error: insertError } = await supabase
        .from("transactions")
        .insert({
          user_id: appUser.id,
          category_id: categoryData.id,
          amount: Number(amt),
          type: "expense",
          transaction_date: new Date().toISOString(),
        });
  
      if (insertError) {
        console.error(insertError);
        alert(insertError.message);
        return;
      }
  
      alert("Expense saved successfully ✅");
  
      nav({ to: "/home" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1">
          <X className="w-5 h-5" /> Cancel
        </Link>
        <span className="font-extrabold">Add Expense</span>
        <span className="w-12" />
      </div>


      <div className="px-5 pt-6 text-center">
        <div className="text-xs font-bold text-muted-foreground">HOW MUCH</div>
        <div className="text-6xl font-extrabold mt-1 text-foreground">
          ₹{amt || "0"}
        </div>
        <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Potli size={28} mood="think" /> Potli will sort this into {cat}
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="text-xs font-bold text-muted-foreground mb-2">CATEGORY</div>
        <div className="grid grid-cols-3 gap-2">
          {CATS.map((c) => (
            <button
              key={c.l}
              onClick={() => setCat(c.l)}
              className={`rounded-2xl py-3 font-extrabold text-sm border-2 ${
                cat === c.l
                  ? "bg-[var(--potli-green-soft)] border-[var(--potli-green-dark)]/40 card-pop"
                  : "bg-card border-border"
              }`}
            >
              <div className="text-xl">{c.e}</div>
              <div className="text-xs mt-0.5">{c.l}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="px-3 pb-3">
        <div className="grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9",".","0","←"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="bg-card border-2 border-border rounded-2xl py-3.5 text-2xl font-extrabold active:bg-muted"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        <PopButton
          className="w-full"
          disabled={!amt || saving}
          onClick={saveExpense}
         >
          {saving ? "Saving..." : "Save Expense ✓"}
        </PopButton>
      </div>
    </MobileFrame>
  );
}
