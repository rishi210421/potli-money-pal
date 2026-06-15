import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PopButton } from "@/components/ui-bits";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_app/goal-saving")({
  component: AddGoalSaving,
});

function AddGoalSaving() {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<any[]>([]);
  const [goalId, setGoalId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
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

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", appUser.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setGoals(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addSaving = async () => {
    if (!goalId) {
      alert("Please select a goal");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const selectedGoal = goals.find(
        (goal) => goal.id === goalId
      );

      if (!selectedGoal) {
        alert("Goal not found");
        return;
      }

      const newCurrentAmount =
        (selectedGoal.current_amount || 0) +
        Number(amount);

      const isCompleted =
        newCurrentAmount >= selectedGoal.target_amount;

      const { error } = await supabase
        .from("goals")
        .update({
          current_amount: newCurrentAmount,
          status: isCompleted ? "completed" : "active",
        })
        .eq("id", goalId);

        const { error: contributionError } =
        await supabase
          .from("goal_contributions")
          .insert({
            goal_id: goalId,
            amount: Number(amount),
          });
      
      if (contributionError) {
        console.error(
          "Contribution insert failed:",
          contributionError
        );
      }



      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert(`₹${amount} added successfully! 🎉`);

      if (isCompleted) {
        navigate({
          to: "/goal-complete",
          search: {
            goalId: goalId,
          },
        });
      } else {
        navigate({
          to: "/goals",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link
          to="/goals"
          className="inline-flex items-center font-bold"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Link>

        <h1 className="text-lg">Add Saving</h1>

        <span className="w-12" />
      </div>

      <div className="px-5 pt-4 space-y-4">
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="w-full rounded-2xl bg-card card-pop p-4"
        >
          <option value="">
            Select Goal
          </option>

          {goals.map((goal) => (
            <option
              key={goal.id}
              value={goal.id}
            >
              {goal.title}
            </option>
          ))}
        </select>

        <input
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value.replace(/\D/g, "")
            )
          }
          inputMode="numeric"
          placeholder="Saving Amount"
          className="w-full rounded-2xl bg-card card-pop p-4"
        />

        <PopButton
          onClick={addSaving}
          className="w-full"
          disabled={
            loading ||
            !goalId ||
            !amount
          }
        >
          {loading
            ? "Adding..."
            : "Add Saving 💰"}
        </PopButton>
      </div>
    </>
  );
}