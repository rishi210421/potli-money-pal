import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopButton, Chip } from "@/components/ui-bits";
import { ChevronLeft, UserPlus, Check } from "lucide-react";

export const Route = createFileRoute("/split")({ component: Split });

const FRIENDS = [
  { n: "Aman (You)", i: "A", on: true },
  { n: "@priya_99", i: "P", on: true },
  { n: "@vicky_p", i: "V", on: true },
  { n: "@sara.k", i: "S", on: false },
  { n: "@rahul_d", i: "R", on: false },
];

function Split() {
  const nav = useNavigate();
  const [people, setPeople] = useState(FRIENDS);
  const [mode, setMode] = useState<"equal" | "custom">("equal");
  const [done, setDone] = useState(false);
  const [newU, setNewU] = useState("");
  const [tripName, setTripName] = useState("Goa with the gang 🏖️");
  const [total, setTotal] = useState(12400);

  const active = people.filter((p) => p.on);
  const each = active.length ? total / active.length : 0;

  const addFriend = () => {
    if (!newU.trim()) return;
    setPeople([...people, { n: newU.startsWith("@") ? newU : "@" + newU, i: newU[0]?.toUpperCase() ?? "?", on: true }]);
    setNewU("");
  };

  if (done) {
    return (
      <MobileFrame>
        <StatusBar />
        <div className="px-5 pt-2 flex items-center justify-between">
          <Link to="/home" className="font-extrabold flex items-center gap-1"><ChevronLeft className="w-5 h-5" /> Home</Link>
          <span className="font-extrabold">Settlement</span>
          <span className="w-9" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-3">
          <div className="rounded-3xl bg-primary card-pop p-5 text-center">
            <Chip tone="green"><Check className="w-3 h-3" /> SPLIT COMPLETE</Chip>
            <div className="text-3xl font-extrabold mt-2 text-[var(--potli-green-dark)]">{tripName}</div>
            <div className="text-sm font-bold text-[var(--potli-green-dark)]/70 mt-1">Total ₹{total.toLocaleString()} · {active.length} people</div>
          </div>
          <div className="rounded-2xl bg-card card-pop p-4">
            <div className="text-xs font-extrabold text-muted-foreground mb-2">SETTLEMENT SUMMARY</div>
            <div className="divide-y divide-border">
              {active.map((p) => (
                <div key={p.n} className="flex justify-between items-center py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[var(--potli-green-soft)] grid place-items-center font-extrabold text-xs">{p.i}</span>
                    <span className="font-extrabold text-sm">{p.n}</span>
                  </span>
                  <span className="font-extrabold text-sm">₹{each.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--potli-green-soft)] card-pop p-4 text-xs font-extrabold text-[var(--potli-green-dark)]">
            💸 We've nudged everyone on UPI. You'll get notified as they pay up.
          </div>
        </div>
        <div className="px-5 pb-6 grid grid-cols-2 gap-2">
          <PopButton variant="ghost" onClick={() => setDone(false)}>Edit</PopButton>
          <PopButton onClick={() => nav({ to: "/home" })}>Done ✓</PopButton>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
        <span className="font-extrabold">Split Trip</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <div className="rounded-3xl bg-primary card-pop p-4">
          <div className="text-[10px] font-extrabold text-[var(--potli-green-dark)]/70">TRIP NAME</div>
          <input
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="w-full bg-transparent font-extrabold text-[var(--potli-green-dark)] text-lg focus:outline-none"
          />
          <div className="text-[10px] font-extrabold text-[var(--potli-green-dark)]/70 mt-2">TOTAL</div>
          <div className="flex items-center gap-1 text-[var(--potli-green-dark)]">
            <span className="text-2xl font-extrabold">₹</span>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value) || 0)}
              className="w-full bg-transparent text-3xl font-extrabold focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base">Friends in trip</h2>
            <Chip tone="green">{active.length} selected</Chip>
          </div>

          <div className="rounded-2xl bg-card card-pop p-2.5 flex items-center gap-2 mb-2">
            <UserPlus className="w-4 h-4 text-muted-foreground ml-1" />
            <input
              value={newU}
              onChange={(e) => setNewU(e.target.value)}
              placeholder="Add friend by @username"
              className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
            />
            <button onClick={addFriend} className="bg-secondary text-white text-xs font-extrabold px-3 py-1.5 rounded-xl">Add</button>
          </div>

          <div className="space-y-2">
            {people.map((p, i) => (
              <button
                key={p.n + i}
                onClick={() => setPeople(people.map((x, j) => j === i ? { ...x, on: !x.on } : x))}
                className="w-full flex items-center gap-3 rounded-2xl bg-card border-2 border-border p-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--potli-green-soft)] grid place-items-center font-extrabold text-sm">
                  {p.i}
                </div>
                <div className="flex-1 text-left font-extrabold text-sm">{p.n}</div>
                <div className={`w-10 h-5 rounded-full ${p.on ? "bg-secondary" : "bg-muted"} relative transition shrink-0`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${p.on ? "left-[22px]" : "left-0.5"}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-base mb-2">Each pays</h2>
          <div className="rounded-2xl bg-[var(--potli-green-soft)] card-pop p-4">
            <div className="text-3xl font-extrabold text-[var(--potli-green-dark)]">
              ₹{each.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs font-bold text-[var(--potli-green-dark)]/70 mt-1">
              ✨ Potli AI: "Vicky paid extra last week. Want to give them a smaller share?"
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setMode("equal")}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${mode === "equal" ? "bg-[var(--potli-green-dark)] text-white border-[var(--potli-green-dark)]" : "bg-card border-[var(--potli-green-dark)]/15"}`}
              >Equal Split</button>
              <button
                onClick={() => setMode("custom")}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${mode === "custom" ? "bg-[var(--potli-green-dark)] text-white border-[var(--potli-green-dark)]" : "bg-card border-[var(--potli-green-dark)]/15"}`}
              >Custom Split</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <PopButton onClick={() => setDone(true)} className="w-full" disabled={active.length < 2}>
          SPLIT IT! 🤝
        </PopButton>
      </div>
    </MobileFrame>
  );
}
