
import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

function Welcome() {

  return (
    <MobileFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
        <Logo size={180} className="animate-float" />

        <div className="space-y-1">
        <h1 className="text-3xl">Meet MyPotli</h1>

          <p className="text-muted-foreground font-semibold">
            Your smart financial companion. Built for students. Trusted by parents.
          </p>
        </div>

        <ul className="grid grid-cols-3 gap-2 w-full pt-2">
          {[
            { e: "📊", l: "Track" },
            { e: "🎯", l: "Goals" },
            { e: "🧠", l: "Learn" },
          ].map((f) => (
            <li
              key={f.l}
              className="card-pop rounded-2xl bg-card p-3 text-center"
            >
              <div className="text-2xl">{f.e}</div>
              <div className="text-xs font-bold mt-1">{f.l}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-3">
        <PopLink to="/login">Get Started</PopLink>

        <p className="text-center text-xs text-muted-foreground font-semibold">
          By continuing you agree to our Terms & Privacy
        </p>
      </div>
    </MobileFrame>
  );
}