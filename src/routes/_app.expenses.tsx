import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_app/expenses")({
  component: Expenses,
});

function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: appUser } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!appUser) return;

    const { data } = await supabase
      .from("transactions")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq("user_id", appUser.id)
      .eq("type", "expense")
      .order("transaction_date", {
        ascending: false,
      });

    setExpenses(data || []);

    const total =
      data?.reduce(
        (sum, tx) =>
          sum + Number(tx.amount),
        0
      ) || 0;

    setTotalSpent(total);
  };

  const getEmoji = (
    category: string
  ) => {
    switch (category) {
      case "Food":
        return "🍔";
      case "Travel":
        return "🚌";
      case "Entertainment":
        return "🎬";
      case "Education":
        return "📚";
      case "Shopping":
        return "🛍️";
      case "Bills":
        return "📱";
      default:
        return "💸";
    }
  };

  return (
    <div className="pb-10">

      <div className="px-5 pt-4">
        <h1 className="text-2xl">
          Expenses
        </h1>

        <div className="mt-4 rounded-3xl bg-primary p-5">
          <div className="text-xs text-primary-foreground/70">
            TOTAL SPENT
          </div>

          <div className="text-4xl font-bold text-primary-foreground">
            ₹{totalSpent.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">

        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="rounded-2xl bg-card card-pop p-4 flex justify-between"
          >
            <div>
              <div className="font-bold">
                {getEmoji(
                  expense.categories?.name
                )}{" "}
                {expense.categories?.name}
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(
                  expense.transaction_date
                ).toLocaleDateString()}
              </div>
            </div>

            <div className="font-bold text-red-500">
              ₹{expense.amount}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}