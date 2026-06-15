import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Potli } from "@/components/Potli";
import { Logo } from "@/components/Logo";
import { Chip, ProgressBar, PopLink } from "@/components/ui-bits";

import {
  Settings,
  ChevronRight,
  Bell,
  Lock,
  LogOut,
  Edit3,
  Users,
  Shield,
  HelpCircle,
  Crown,
  Database,
  MessageSquare,
  Camera,
  MapPin,
  Folder,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/_app/profile")({ component: Profile });

function Profile() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setUserData(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/welcome";
  };

  if (!userData) {
    return (
      <div className="p-6 text-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="px-5 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <h1 className="text-2xl">Profile</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-card border-2 border-border grid place-items-center">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-3xl bg-card card-pop p-5 text-center">
          <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-primary border-4 border-[var(--potli-green-dark)] grid place-items-center font-extrabold text-3xl mx-auto">
           {userData.full_name?.charAt(0)}
          </div>
            <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-extrabold rounded-full px-2 py-0.5 border-2 border-card">SMART POTLI</span>
          </div>
          <div className="font-extrabold text-lg mt-3">
           {userData.full_name}
          </div>
          <div className="text-xs font-bold text-muted-foreground">
           {userData.institution} · {userData.occupation}
          </div>
          <div className="mt-2"><Chip tone="yellow">🧠 Smart Potli · Stage 3</Chip></div>
          <div className="mt-3 text-xs font-bold">
           {userData.xp} / 500 XP to Wealthy Potli
          </div>
          <div className="mt-1.5 max-w-xs mx-auto"><ProgressBar value={64} /></div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <Link to="/premium" className="block rounded-2xl bg-[var(--potli-green-dark)] card-pop p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--xp)] text-[var(--potli-green-dark)] grid place-items-center">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold">Upgrade to Premium</div>
                <div className="text-xs font-bold text-white/70">Unlock advanced AI features</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70" />
          </div>
        </Link>
      </div>

      <div className="px-5 pt-4 grid grid-cols-3 gap-2">
        {[{ l: "Saved", v: "₹41k" }, { l: "Streak", v: `${userData.streak_days} 🔥` }, { l: "Wins", v: "12 🏆" }].map((s) => (
          <div key={s.l} className="rounded-2xl bg-card card-pop p-3 text-center">
            <div className="text-xs font-bold text-muted-foreground">{s.l}</div>
            <div className="text-lg font-extrabold">{s.v}</div>
          </div>
        ))}
      </div>

      <Section title="Account">
      <Row k="Email" v={userData.email || "-"} />
        <Row k="Phone Number" v="+91 98XXXXXX12" />
        <Row k="Linked Accounts" v="Google · UPI" />
      </Section>

      <Section title="Financial Information">
      <Row
        k="Monthly Income"
        v={`₹${userData.monthly_income || 0}`}
      />
        <Row k="Savings Goal" v="₹4,000 / month" />
        <Row
         k="College"
          v={userData.institution || "-"}/>
      </Section>

      <Section title="Parent Information" icon={Users}>
        <Row k="Parent Name" v="Rajeev Sharma" />
        <Row k="Parent Email" v="rajeev.sharma@email.com" />
        <Row k="Parent Phone" v="+91 98XXXXXX21" />
        <div className="px-1 pt-2">
          <PopLink to="/share-report" variant="ghost" className="w-full">📤 Send June Report to Parent</PopLink>
        </div>
      </Section>

      <Section title="Privacy & Permissions" icon={Shield}>
        <PermRow icon={MessageSquare} label="SMS Access" on />
        <PermRow icon={Camera} label="Camera" on />
        <PermRow icon={Folder} label="Storage" on />
        <PermRow icon={MapPin} label="Location" on={false} />
        <PermRow icon={Layers} label="Display Over Other Apps" on={false} />
        <PermRow icon={Bell} label="Notifications" on />
      </Section>

      <Section title="Other">
        <LinkRow to="/premium" icon={Crown} label="Premium Membership" />
        <LinkRow to="/sms-permission" icon={Database} label="Data & Privacy" />
        <LinkRow to="/notifications" icon={Lock} label="Security" />
        <LinkRow to="/coach" icon={HelpCircle} label="Help & Support" />
      </Section>

      <Section title="More">
        <LinkRow to="/achievements" icon="🏆" label="Achievements" />
        <LinkRow to="/quiz" icon="🧠" label="Money Quiz" />
        <LinkRow to="/report" icon="📄" label="Monthly Report" />
      </Section>

      <div className="px-5 pt-5 grid grid-cols-2 gap-3">
        <PopLink to="/profile-setup" variant="ghost"><Edit3 className="w-4 h-4 inline mr-1" /> Edit Profile</PopLink>
        <button
             onClick={handleLogout}
              className="rounded-2xl bg-[var(--potli-green-dark)] text-white font-extrabold py-3"
        >
  <LogOut className="w-4 h-4 inline mr-1" />
  Log out
</button>
      </div>

      <div className="px-5 pt-5 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
        <Potli size={28} /> Potli v1.0 · Made for students
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-5">
      <div className="text-xs font-extrabold text-muted-foreground mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {title.toUpperCase()}
      </div>
      <div className="rounded-2xl bg-card card-pop p-1.5 divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-xs font-bold text-muted-foreground">{k}</span>
      <span className="text-sm font-extrabold">{v}</span>
    </div>
  );
}

function LinkRow({ to, icon, label }: { to: string; icon: any; label: string }) {
  const isStr = typeof icon === "string";
  return (
    <Link to={to} className="flex items-center justify-between px-3 py-3 font-extrabold">
      <span className="flex items-center gap-2.5">
        {isStr ? <span className="text-lg">{icon}</span> : <span className="w-7 h-7 rounded-lg bg-[var(--potli-green-soft)] grid place-items-center">{(() => { const I = icon; return <I className="w-3.5 h-3.5 text-[var(--potli-green-dark)]" />; })()}</span>}
        <span className="text-sm">{label}</span>
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
}

function PermRow({ icon: I, label, on }: { icon: any; label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="flex items-center gap-2.5 font-extrabold text-sm">
        <span className="w-7 h-7 rounded-lg bg-[var(--potli-green-soft)] grid place-items-center">
          <I className="w-3.5 h-3.5 text-[var(--potli-green-dark)]" />
        </span>
        {label}
      </span>
      <div className={`w-10 h-5 rounded-full ${on ? "bg-secondary" : "bg-muted"} relative shrink-0`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </div>
    </div>
  );
}
