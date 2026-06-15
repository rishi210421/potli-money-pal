import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { MobileFrame } from "@/components/MobileFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyPotli — Your Smart Financial Companion" },
      { name: "description", content: "AI-powered personal finance companion for students. Track, save, plan, and learn — with Potli by your side." },
      { property: "og:title", content: "MyPotli — Your Smart Financial Companion" },
      { property: "og:description", content: "Duolingo for money. Track, save, and grow with your Potli." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/welcome" }), 1800);
    return () => clearTimeout(t);
  }, [nav]);
  return (
    <MobileFrame bg="bg-[#FFD400]">
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
        <div className="animate-float">
          <Logo size={200} />
        </div>
        <h1 className="text-5xl font-extrabold text-[#1F3D2C] tracking-tight -mt-2">POTLI</h1>
        <p className="text-[#1F3D2C]/80 font-bold text-center">
          Your Smart Financial Companion
        </p>
      </div>
      <div className="pb-10 flex justify-center">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1F3D2C] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[#1F3D2C]/50 animate-pulse" style={{ animationDelay: "0.15s" }} />
          <span className="w-2 h-2 rounded-full bg-[#1F3D2C]/30 animate-pulse" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </MobileFrame>
  );
}
