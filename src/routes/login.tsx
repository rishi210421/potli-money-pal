import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { PopLink } from "@/components/ui-bits";
import { ChevronLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile-setup`,
      },
    });

    if (error) {
      console.error("Google Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <MobileFrame>
      <StatusBar />

      <div className="px-6 pt-2">
        <Link
          to="/welcome"
          className="inline-flex items-center text-foreground font-bold"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
        <Logo size={140} />

        <h1 className="text-3xl">Welcome to Potli</h1>

        <p className="text-muted-foreground font-semibold -mt-1">
          Sign in to start your savings streak
        </p>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-3">
        {/* Google Login Button */}
        <button
          onClick={signInWithGoogle}
          className="card-pop rounded-2xl bg-card border-2 border-border py-4 px-4 flex items-center gap-3 font-bold"
        >
          <span className="text-xl">🇬</span>
          <span className="flex-1 text-left">
            Continue with Google
          </span>
        </button>

        {/* Phone Login (Coming Later) */}
        <PopLink to="/otp">
          📱 Continue with Phone Number
        </PopLink>

        <p className="text-center text-xs text-muted-foreground font-semibold pt-1">
          We'll never post or share without you
        </p>
      </div>
    </MobileFrame>
  );
}