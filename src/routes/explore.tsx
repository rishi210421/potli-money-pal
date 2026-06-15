import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Chip, PopButton } from "@/components/ui-bits";
import { ChevronLeft, MapPin, Star, List, Map as MapIcon } from "lucide-react";

export const Route = createFileRoute("/explore")({ component: Explore });

type Place = { name: string; type: string; price: number; dist: string; rating: number; emoji: string; x: number; y: number };
const PLACES: Place[] = [
  { name: "Sharma Tea Stall", type: "Cafe · Chai", price: 40, dist: "0.2 km", rating: 4.6, emoji: "☕", x: 30, y: 35 },
  { name: "Hostel Mess", type: "Indian", price: 80, dist: "0.4 km", rating: 4.2, emoji: "🍛", x: 55, y: 50 },
  { name: "Roll Hub", type: "Wraps", price: 120, dist: "0.6 km", rating: 4.4, emoji: "🌯", x: 70, y: 30 },
  { name: "Burger Den", type: "Fast food", price: 220, dist: "0.9 km", rating: 4.1, emoji: "🍔", x: 40, y: 65 },
  { name: "Pasta Point", type: "Italian", price: 280, dist: "1.1 km", rating: 4.3, emoji: "🍝", x: 75, y: 70 },
  { name: "Bao House", type: "Asian", price: 350, dist: "1.4 km", rating: 4.7, emoji: "🥟", x: 22, y: 75 },
];

const FILTERS = [
  { l: "All", v: 9999 },
  { l: "Under ₹100", v: 100 },
  { l: "Under ₹250", v: 250 },
  { l: "Under ₹500", v: 500 },
];

function Explore() {
  const [view, setView] = useState<"map" | "list">("map");
  const [cap, setCap] = useState(9999);
  const [sel, setSel] = useState<Place | null>(null);
  const list = PLACES.filter((p) => p.price <= cap);

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="inline-flex items-center font-bold"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <h1 className="text-lg">Explore</h1>
        <div className="flex gap-1 bg-muted rounded-full p-0.5">
          <button onClick={() => setView("map")} className={`w-8 h-8 rounded-full grid place-items-center ${view === "map" ? "bg-primary" : ""}`}><MapIcon className="w-3.5 h-3.5" /></button>
          <button onClick={() => setView("list")} className={`w-8 h-8 rounded-full grid place-items-center ${view === "list" ? "bg-primary" : ""}`}><List className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <p className="px-5 text-xs text-muted-foreground font-semibold">Affordable cafes & restaurants near you</p>

      <div className="px-5 pt-3 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button key={f.l} onClick={() => setCap(f.v)} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-extrabold border-2 ${cap === f.v ? "bg-primary text-primary-foreground border-[var(--potli-green-dark)]" : "bg-card border-border text-muted-foreground"}`}>
            {f.l}
          </button>
        ))}
      </div>

      {view === "map" ? (
        <div className="flex-1 overflow-hidden px-5 pt-3 pb-5 flex flex-col">
          <div className="relative flex-1 rounded-3xl card-pop overflow-hidden bg-[var(--potli-green-soft)] border-2 border-border min-h-[280px]">
            {/* fake map grid */}
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(31,61,44,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(31,61,44,0.08) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="absolute top-1/3 left-0 right-0 h-2 bg-[#A6C98A]/60" />
            <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-[#A6C98A]/60" />
            {/* You marker */}
            <div className="absolute z-10" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <div className="w-4 h-4 rounded-full bg-[var(--potli-green-dark)] border-2 border-white shadow ring-4 ring-[var(--potli-green-dark)]/20" />
            </div>
            {/* place pins */}
            {list.map((p) => (
              <button key={p.name} onClick={() => setSel(p)} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <div className="bg-white border-2 border-[var(--potli-green-dark)] rounded-full px-2 py-1 shadow-pop-sm flex items-center gap-1">
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-[10px] font-extrabold">₹{p.price}</span>
                </div>
              </button>
            ))}
          </div>

          {sel && (
            <div className="mt-3 rounded-2xl bg-card card-pop p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-3xl">{sel.emoji}</div>
                  <div>
                    <div className="font-extrabold">{sel.name}</div>
                    <div className="text-xs font-bold text-muted-foreground">{sel.type}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs font-extrabold">
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[var(--xp)] text-[var(--xp)]" /> {sel.rating}</span>
                      <span className="text-muted-foreground">· {sel.dist}</span>
                    </div>
                  </div>
                </div>
                <Chip tone="yellow">avg ₹{sel.price}</Chip>
              </div>
              <PopButton className="w-full mt-3" variant="dark">Get Directions</PopButton>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6 space-y-2.5">
          {list.map((p) => (
            <button key={p.name} onClick={() => setSel(p)} className="w-full text-left rounded-2xl bg-card card-pop p-3.5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--potli-green-soft)] grid place-items-center text-2xl">{p.emoji}</div>
              <div className="flex-1">
                <div className="font-extrabold text-sm">{p.name}</div>
                <div className="text-xs font-bold text-muted-foreground">{p.type} · {p.dist}</div>
                <div className="text-xs font-extrabold mt-0.5 flex items-center gap-1"><Star className="w-3 h-3 fill-[var(--xp)] text-[var(--xp)]" /> {p.rating}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-secondary">₹{p.price}</div>
                <div className="text-[10px] font-bold text-muted-foreground">avg/person</div>
              </div>
            </button>
          ))}
          {list.length === 0 && (
            <div className="text-center py-12 text-sm font-bold text-muted-foreground">
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              No places match this budget. Try a higher cap.
            </div>
          )}
        </div>
      )}
    </MobileFrame>
  );
}
