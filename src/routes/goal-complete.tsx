import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { PopLink, Chip } from "@/components/ui-bits";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/goal-complete")({
  validateSearch: (search) => ({
    goalId: String(search.goalId || ""),
  }),
  component: GoalComplete,
});

function GoalComplete() {
  const { goalId } = Route.useSearch();

  const [goal, setGoal] = useState<any>(null);

  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: {
        y: 0.6,
      },
    });

    loadGoal();
  }, []);

  const loadGoal = async () => {
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("id", goalId)
      .single();

    setGoal(data);
  };

  if (!goal) {
    return (
      <MobileFrame>
        <StatusBar />
        <div className="p-5">
          Loading...
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame bg="bg-primary">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">

        <div className="text-5xl animate-bounce">
          🎉
        </div>

        <Potli
          size={180}
          mood="cheer"
          className="animate-float"
        />

        <Chip tone="green">
          +100 XP
        </Chip>

        <h1 className="text-4xl text-[var(--potli-green-dark)]">
          Goal Achieved!
        </h1>

        <p className="text-[var(--potli-green-dark)]/80 font-bold">
          You saved
          {" "}
          <b>
            ₹{goal.target_amount?.toLocaleString()}
          </b>
          {" "}
          for your
          {" "}
          <b>
            {goal.title}
          </b>
        </p>

        <div className="rounded-2xl bg-white/60 px-4 py-2 text-xs font-extrabold text-[var(--potli-green-dark)]">
          Potli evolved → Wealthy Potli unlocked!
        </div>

      </div>

      <div className="px-6 pb-8 flex flex-col gap-3">

        <PopLink
          to="/achievements"
          variant="dark"
        >
          Claim Reward
        </PopLink>

        <Link
          to="/goals"
          className="text-center text-xs font-extrabold text-[var(--potli-green-dark)]/80"
        >
          Back to Goals
        </Link>

      </div>
    </MobileFrame>
  );
}