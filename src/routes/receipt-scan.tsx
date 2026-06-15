import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { Potli } from "@/components/Potli";
import { PopButton, Chip } from "@/components/ui-bits";
import { ChevronLeft, Camera, ScanLine } from "lucide-react";

export const Route = createFileRoute("/receipt-scan")({ component: ReceiptScan });

function ReceiptScan() {
  const nav = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const scan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setDone(true); }, 1800);
  };

  return (
    <MobileFrame>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center justify-between">
        <Link to="/home" className="font-extrabold flex items-center gap-1"><ChevronLeft className="w-5 h-5" /> Back</Link>
        <span className="font-extrabold">Scan Receipt</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 px-5 pt-4 flex flex-col">
        <div className="relative rounded-3xl bg-[var(--potli-green-dark)] aspect-[3/4] grid place-items-center overflow-hidden card-pop">
          <div className="absolute inset-6 border-[3px] border-dashed border-primary rounded-2xl" />
          {scanning && (
            <div className="absolute left-6 right-6 h-1 bg-primary rounded-full animate-[scan_1.8s_ease-in-out]" style={{ boxShadow: "0 0 12px var(--primary)" }} />
          )}
          {!done ? (
            <div className="text-white text-center">
              <Camera className="w-14 h-14 mx-auto opacity-70" strokeWidth={1.5} />
              <div className="text-xs font-bold mt-2 opacity-70">Align receipt within frame</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 w-3/4 text-xs font-bold space-y-1">
              <div className="text-center font-extrabold">SHARMA CAFE</div>
              <hr />
              <div className="flex justify-between"><span>Chai x2</span><span>₹40</span></div>
              <div className="flex justify-between"><span>Samosa</span><span>₹30</span></div>
              <div className="flex justify-between"><span>Maggi</span><span>₹80</span></div>
              <hr />
              <div className="flex justify-between font-extrabold"><span>Total</span><span>₹150</span></div>
            </div>
          )}
        </div>

        {done && (
          <div className="mt-4 rounded-2xl bg-card card-pop p-4">
            <Chip tone="green">✨ Detected by Potli AI</Chip>
            <div className="mt-2 text-sm font-bold flex justify-between"><span>Merchant</span><span>Sharma Cafe</span></div>
            <div className="text-sm font-bold flex justify-between"><span>Amount</span><span>₹150</span></div>
            <div className="text-sm font-bold flex justify-between"><span>Category</span><span>🍔 Food</span></div>
          </div>
        )}

        <div className="flex-1" />
        <div className="flex items-center gap-2 justify-center pb-3">
          <Potli size={40} mood="happy" />
          <div className="text-xs font-bold text-muted-foreground">Potli sorts it automatically.</div>
        </div>
      </div>

      <div className="px-5 pb-6">
        {!done ? (
          <PopButton onClick={scan} className="w-full" disabled={scanning}>
            <ScanLine className="w-4 h-4 inline mr-1.5" /> {scanning ? "Scanning…" : "Scan Now"}
          </PopButton>
        ) : (
          <PopButton onClick={() => nav({ to: "/home" })} className="w-full">Save Expense ✓</PopButton>
        )}
      </div>

      <style>{`@keyframes scan { 0%{top:8%} 50%{top:88%} 100%{top:8%} }`}</style>
    </MobileFrame>
  );
}
