import type { ReactNode } from "react";

export function MobileFrame({
  children,
  bg = "bg-background",
}: {
  children: ReactNode;
  bg?: string;
}) {
  return (
    <div className="min-h-screen bg-[oklch(0.95_0.02_120)] flex justify-center md:py-6">
      <div
        className={`relative w-full md:w-[420px] md:rounded-[40px] md:border-[10px] md:border-[oklch(0.25_0.04_150)] overflow-hidden ${bg} flex flex-col min-h-screen md:min-h-[860px] md:max-h-[920px]`}
      >
        {children}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="flex justify-between items-center px-6 pt-3 pb-1 text-xs font-bold text-foreground/80">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span>●●●●</span>
        <span>📶</span>
        <span>🔋</span>
      </span>
    </div>
  );
}
