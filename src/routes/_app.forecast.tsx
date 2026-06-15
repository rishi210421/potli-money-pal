import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";import { Chip } from "@/components/ui-bits";
import { Potli } from "@/components/Potli";
import { TrendingUp, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/forecast")({ component: Forecast });

type Series = { key: string; label: string; emoji: string; color: string; data: number[]; conf: number; ai: string };

const WEEK: Series[] = [
  {
    key: "food",
    label: "Food",
    emoji: "🍔",
    color: "#E85D3A",
    conf: 0,
    data: [],
    ai: "Food spending prediction"
  },

  {
    key: "travel",
    label: "Travel",
    emoji: "🚌",
    color: "#7CA946",
    conf: 0,
    data: [],
    ai: "Travel spending prediction"
  },

  {
    key: "entertainment",
    label: "Entertainment",
    emoji: "🎬",
    color: "#FFD400",
    conf: 0,
    data: [],
    ai: "Entertainment spending prediction"
  },

  {
    key: "shopping",
    label: "Shopping",
    emoji: "🛍️",
    color: "#1F3D2C",
    conf: 0,
    data: [],
    ai: "Shopping spending prediction"
  }
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHLY_TREND = "Spending trends 12% higher in week 4 historically — set a soft cap.";

function Forecast() {
  
  const [tab, setTab] = useState<"week" | "month">("week");
const [active, setActive] = useState<string>("food");

const [forecastData, setForecastData] = useState<number[]>([]);
const [confidence, setConfidence] = useState(0);
const [riskScore, setRiskScore] = useState(0);
const [totalSpending, setTotalSpending] = useState(0);
const [loading, setLoading] = useState(true);
const [average, setAverage] = useState(0);

const [aiMessage, setAiMessage] = useState("");
const series = WEEK.find(
  (s) => s.key === active
)!;

const chartData =
  forecastData.length > 0
    ? forecastData
    : series.data;

    const max =
    chartData.length > 0
      ? Math.max(...chartData)
      : 1;

  // build SVG polyline points
  const W = 320, H = 130, pad = 12;
  const pts = chartData.map((v, i) => {
    const x = pad + (i * (W - pad * 2)) / Math.max(chartData.length - 1, 1);
    const y = H - pad - ((v / max) * (H - pad * 2));
    return `${x},${y}`;
  }).join(" ");


  useEffect(() => {
    loadForecast(active);
  }, [active]);
  
  const loadForecast = async (
    category: string
  ) => {
  
    setLoading(true);
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/forecast/${category}`
      );
  
      const data = await response.json();

      setAverage(data.average || 0);
      setForecastData(data.forecast || []);
      setConfidence(data.confidence || 0);
      setRiskScore(data.risk_score || 0);
      setTotalSpending(data.total_spending || 0);
      setAiMessage(
        data.ai_message || ""
      );

      console.log(
        category,
        data
      );


    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading Forecast...
      </div>
    );
  }


  return (
    <div className="pb-6">
      <div className="px-5 pt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl leading-tight">Spending Forecast</h1>
          <p className="text-sm text-muted-foreground font-semibold">AI prediction · Interactive</p>
        </div>
        <Link to="/budget" className="text-xs font-extrabold text-secondary">Budget →</Link>
      </div>

      {/* tab toggle week/month */}
      <div className="px-5 pt-3">
        <div className="inline-flex rounded-full bg-card border-2 border-border p-1">
          {(["week", "month"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {t === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* series picker */}
      <div className="px-5 pt-3 flex gap-2 overflow-x-auto pb-1">
        {WEEK.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-extrabold border-2 flex items-center gap-1 ${active === s.key ? "bg-primary border-[var(--potli-green-dark)]" : "bg-card border-border text-muted-foreground"}`}
          >
            <span>{s.emoji}</span> {s.label}
          </button>
        ))}
      </div>

      {/* chart */}
      <div className="px-5 pt-3">
        <div className="rounded-3xl bg-card card-pop p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> {series.label.toUpperCase()} · {tab === "week" ? "NEXT 7 DAYS" : "NEXT 4 WEEKS"}
              </div>
              <div className="text-3xl font-extrabold mt-1">
  ₹{totalSpending.toLocaleString()}
</div>

<div className="text-xs text-muted-foreground">
  Avg Expense: ₹{average}
</div>
              <div className="text-xs font-bold text-muted-foreground mt-0.5">
                Confidence: <span className="text-secondary">{confidence}%</span>
              </div>
            </div>
            <Potli size={64} mood="think" />
          </div>

          {chartData.length === 0 && (
  <div className="py-12 text-center text-muted-foreground">
    No spending data available
  </div>
)}

          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* grid */}
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={pad} x2={W - pad} y1={H * g} y2={H * g} stroke="currentColor" strokeOpacity="0.08" />
            ))}
            <polygon points={`${pad},${H - pad} ${pts} ${W - pad},${H - pad}`} fill="url(#fg)" />
            <polyline points={pts} fill="none" stroke={series.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {chartData.map((v, i) => {
              const x = pad + (i * (W - pad * 2)) / Math.max(chartData.length - 1, 1);
              const y = H - pad - ((v / max) * (H - pad * 2));
              return <circle key={i} cx={x} cy={y} r="3.5" fill={series.color} stroke="white" strokeWidth="1.5" />;
            })}
          </svg>
          <div className="flex justify-between text-[10px] font-extrabold text-muted-foreground px-3 mt-1">
            {(tab === "week" ? DAYS : ["W1", "W2", "W3", "W4"]).map((d, i) => <span key={i}>{d}</span>).slice(0, chartData.length)}
          </div>
        </div>
      </div>

      {/* AI explain */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-primary card-pop p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-[var(--potli-green-dark)]" />
            <span className="text-xs font-extrabold text-[var(--potli-green-dark)]">POTLI AI · WHY THIS PREDICTION</span>
          </div>
          <p className="text-sm font-extrabold text-[var(--potli-green-dark)]">{aiMessage}</p>
          {tab === "month" && (
            <p className="text-xs font-semibold text-[var(--potli-green-dark)]/80 mt-2">{MONTHLY_TREND}</p>
          )}
        </div>
      </div>

      {/* Overspending meter */}
      <div className="px-5 pt-5">
        <h2 className="text-base mb-2">Overspending Meter</h2>
        <div className="rounded-2xl bg-card card-pop p-4">
          <div className="flex items-center justify-between mb-2">
          <Chip
tone={
  riskScore < 40
    ? "green"
    : riskScore < 70
    ? "yellow"
    : "streak"
}
>
  {riskScore < 40
    ? "✅ SAFE"
    : riskScore < 70
    ? "⚠️ WARNING"
    : "🚨 HIGH RISK"}
</Chip>
            <span className="text-xs font-extrabold text-muted-foreground">{riskScore} / 100</span>
          </div>
          <div className="relative h-4 rounded-full overflow-hidden border border-border" style={{ background: "linear-gradient(90deg, #7CA946 0%, #FBE112 55%, #E85D3A 100%)" }}>
            <div className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--potli-green-dark)] rounded-full" style={{ left: `${riskScore}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-extrabold mt-1.5">
            <span className="text-secondary">SAFE</span>
            <span className="text-[var(--potli-green-dark)]">WARNING</span>
            <span className="text-[var(--streak)]">HIGH RISK</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-2.5">
        <Alert tone="safe" icon={ShieldCheck} title="Transport on track" text="You're 18% under your transport cap." />
        <Alert tone="warn" icon={AlertTriangle} title="Fun spend rising" text="₹2,400 of ₹2,000 cap. Slow down on weekend plans." />
        <Alert tone="risk" icon={AlertTriangle} title="Food likely to overflow" text="At this pace, ₹4,600 by month-end." />
      </div>
    </div>
  );
}

function Alert({ tone, icon: I, title, text }: { tone: "safe" | "warn" | "risk"; icon: any; title: string; text: string }) {
  const bg = tone === "safe" ? "bg-[var(--potli-green-soft)] text-[var(--potli-green-dark)]" : tone === "warn" ? "bg-primary/40 text-[var(--potli-green-dark)]" : "bg-[oklch(0.95_0.08_40)] text-[var(--streak)]";
  return (
    <div className={`rounded-2xl card-pop p-3.5 flex gap-3 items-start mx-5 first:ml-5 ${bg}`} style={{ marginLeft: 0, marginRight: 0 }}>
      <div className="w-9 h-9 rounded-xl bg-white/60 grid place-items-center shrink-0">
        <I className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <div>
        <div className="font-extrabold text-sm">{title}</div>
        <div className="text-xs font-semibold opacity-80">{text}</div>
      </div>
    </div>
  );
}
