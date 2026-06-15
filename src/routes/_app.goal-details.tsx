import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_app/goal-details")({
    validateSearch: (search: Record<string, unknown>) => ({
    id: String(search.id || ""),
  }),
  component: GoalDetails,
});


function GoalDetails() {
  const { id } = Route.useSearch();

  const [goal, setGoal] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalContributions: 0,
    averageContribution: 0,
    largestContribution: 0,
  }); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: goalData } = await supabase
      .from("goals")
      .select("*")
      .eq("id", id)
      .single();

    setGoal(goalData);

    const { data: contributionData } = await supabase
      .from("goal_contributions")
      .select("*")
      .eq("goal_id", id)
      .order("created_at", { ascending: false });

    setContributions(contributionData || []);

    const totalContributions =
  contributionData?.length || 0;

const largestContribution =
  Math.max(
    ...(contributionData?.map(
      (c) => Number(c.amount)
    ) || [0])
  );

  const averageContribution =
  totalContributions > 0
    ? Math.round(
        (contributionData || []).reduce(
          (sum, c) =>
            sum + Number(c.amount),
          0
        ) / totalContributions
      )
    : 0;

setAnalytics({
  totalContributions,
  averageContribution,
  largestContribution,
});

    if (contributionData?.length) {
      const totalContributions =
        contributionData.length;
    
      const totalAmount =
        contributionData.reduce(
          (sum, item) =>
            sum + Number(item.amount),
          0
        );
    
      const averageContribution =
        Math.round(
          totalAmount /
          totalContributions
        );
    
      const largestContribution =
        Math.max(
          ...contributionData.map(
            (item) => Number(item.amount)
          )
        );
    
      setAnalytics({
        totalContributions,
        averageContribution,
        largestContribution,
      });
    }

  };

  if (!goal) {
    return (
      <div className="p-5">
        Loading...
      </div>
    );
  }

  const percent = Math.round(
    ((goal.current_amount || 0) /
      goal.target_amount) *
      100
  );

  const remaining =
    goal.target_amount -
    (goal.current_amount || 0);

  return (
    <div className="pb-10">
      <div className="px-5 pt-4 flex items-center gap-3">
        <Link
          to="/goals"
          className="font-bold flex items-center"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-card card-pop p-5">

          <div className="text-5xl text-center">
            {goal.icon || "🎯"}
          </div>

          <h1 className="text-center text-2xl mt-3">
            {goal.title}
          </h1>

          <div className="text-center mt-2 text-sm text-muted-foreground">
            ₹{goal.current_amount?.toLocaleString()}
            {" / "}
            ₹{goal.target_amount?.toLocaleString()}
          </div>

          <div className="mt-4">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${percent}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">

            <div className="rounded-xl bg-muted p-2">
              <div className="text-xs">
                Saved
              </div>
              <div className="font-bold">
                ₹{goal.current_amount}
              </div>
            </div>

            <div className="rounded-xl bg-muted p-2">
              <div className="text-xs">
                Left
              </div>
              <div className="font-bold">
                ₹{remaining}
              </div>
            </div>

            <div className="rounded-xl bg-muted p-2">
              <div className="text-xs">
                Progress
              </div>
              <div className="font-bold">
                {percent}%
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="px-5 pt-6">

      <div className="mb-6">

<h2 className="text-lg font-bold mb-3">
  Analytics
</h2>

<div className="grid grid-cols-3 gap-2">

  <div className="rounded-2xl bg-card card-pop p-3 text-center">
    <div className="text-xs">
      Entries
    </div>

    <div className="font-bold">
      {analytics.totalContributions}
    </div>
  </div>

  <div className="rounded-2xl bg-card card-pop p-3 text-center">
    <div className="text-xs">
      Avg
    </div>

    <div className="font-bold">
      ₹{analytics.averageContribution}
    </div>
  </div>

  <div className="rounded-2xl bg-card card-pop p-3 text-center">
    <div className="text-xs">
      Best
    </div>

    <div className="font-bold">
      ₹{analytics.largestContribution}
    </div>
  </div>

</div>

</div>

        <h2 className="text-lg font-bold mb-3">
          Contribution History
        </h2>

        <div className="rounded-3xl bg-card card-pop p-4 mb-4">

<h3 className="font-bold mb-3">
  📊 Analytics
</h3>

<div className="grid grid-cols-3 gap-2">

  <div className="rounded-xl bg-muted p-3 text-center">
    <div className="text-xs">
      Total Saves
    </div>

    <div className="font-bold">
      {analytics.totalContributions}
    </div>
  </div>

  <div className="rounded-xl bg-muted p-3 text-center">
    <div className="text-xs">
      Avg Save
    </div>

    <div className="font-bold">
      ₹{analytics.averageContribution}
    </div>
  </div>

  <div className="rounded-xl bg-muted p-3 text-center">
    <div className="text-xs">
      Best Save
    </div>

    <div className="font-bold">
      ₹{analytics.largestContribution}
    </div>
  </div>

</div>
</div>

        <div className="space-y-3">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-card card-pop p-4 flex justify-between"
            >
              <div>
                {new Date(
                  c.created_at
                ).toLocaleDateString()}
              </div>

              <div className="font-bold text-green-600">
                +₹{c.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}