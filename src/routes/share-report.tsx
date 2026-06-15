import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { Chip, PopButton } from "@/components/ui-bits";
import { ChevronLeft, Download, MessageCircle, Mail, Send, Check } from "lucide-react";

export const Route = createFileRoute("/share-report")({ component: ShareReport });

function ShareReport() {
  const nav = useNavigate();
  const [sent, setSent] = useState<string | null>(null);

  const send = (channel: string) => {
    setSent(channel);
  };

  if (sent) {
    return (
      <MobileFrame>
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div className="w-24 h-24 rounded-full bg-[var(--potli-green-soft)] grid place-items-center">
            <Check className="w-12 h-12 text-secondary" strokeWidth={3} />
          </div>
          <Potli size={120} mood="cheer" />
          <h1 className="text-3xl">Report Sent!</h1>
          <p className="text-muted-foreground font-semibold -mt-1">
            Your June report has been shared via <b className="text-foreground">{sent}</b>.
          </p>
          <div className="rounded-2xl bg-[var(--potli-green-soft)] px-4 py-2 text-xs font-extrabold text-[var(--potli-green-dark)]">
            Parents will love this 💚
          </div>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-3">
          <PopButton onClick={() => nav({ to: "/home" })}>Back to Home</PopButton>
          <button onClick={() => setSent(null)} className="text-xs font-extrabold text-secondary">Send another way</button>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/report" className="inline-flex items-center font-bold"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <h1 className="text-lg">Share Report</h1>
        <span className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6">
        <div className="rounded-3xl bg-[var(--potli-green-dark)] card-pop p-5 text-white">
          <Chip tone="yellow">📄 JUNE 2026 REPORT</Chip>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { l: "Saved", v: "₹4,200" },
              { l: "Spent", v: "₹9,800" },
              { l: "Score", v: "82/100" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-2xl py-2.5 text-center">
                <div className="text-[10px] font-bold text-white/70">{s.l.toUpperCase()}</div>
                <div className="font-extrabold text-sm mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-card card-pop p-4 flex gap-3 items-center">
          <Potli size={56} mood="happy" />
          <div className="text-sm font-bold">
            Your report is ready to send. Choose where to share it.
          </div>
        </div>

        <h2 className="text-base mt-5 mb-2">Send to Parent</h2>
        <div className="rounded-2xl bg-card card-pop p-3.5">
          <div className="text-xs font-bold text-muted-foreground">PARENT</div>
          <div className="font-extrabold">Rajeev Sharma</div>
          <div className="text-xs font-bold text-muted-foreground">rajeev.sharma@email.com · +91 98XXXXXX21</div>
          <PopButton onClick={() => send("Parent · Email + SMS")} className="w-full mt-3" variant="dark">
            <Send className="w-4 h-4 inline mr-2" /> Send to Parent
          </PopButton>
        </div>

        <h2 className="text-base mt-5 mb-2">Other Options</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <ShareTile icon={Download} label="Download PDF" onClick={() => send("Download")} />
          <ShareTile icon={MessageCircle} label="WhatsApp" onClick={() => send("WhatsApp")} />
          <ShareTile icon={Mail} label="Email" onClick={() => send("Email")} />
          <ShareTile icon={Send} label="More…" onClick={() => send("System Share")} />
        </div>
      </div>
    </MobileFrame>
  );
}

function ShareTile({ icon: I, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl bg-card card-pop p-4 text-left">
      <div className="w-10 h-10 rounded-xl bg-[var(--potli-green-soft)] grid place-items-center">
        <I className="w-4 h-4 text-[var(--potli-green-dark)]" />
      </div>
      <div className="mt-2 font-extrabold text-sm">{label}</div>
    </button>
  );
}
