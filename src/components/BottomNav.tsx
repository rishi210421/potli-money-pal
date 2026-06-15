import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Target, MessageCircle, Brain, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/coach", label: "Coach", icon: MessageCircle },
  { to: "/quiz", label: "Money Quiz", icon: Brain },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card border-t-2 border-border px-2 pt-2 pb-3 z-20">
      <ul className="flex items-end justify-around">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to === "/quiz" && pathname.startsWith("/quiz"));
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-[10px] font-bold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
