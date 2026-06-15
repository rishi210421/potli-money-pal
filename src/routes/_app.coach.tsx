import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Potli } from "@/components/Potli";
import { PopButton, Chip } from "@/components/ui-bits";
import { Send, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
export const Route = createFileRoute("/_app/coach")({ component: Coach });

type Msg = { from: "potli" | "me"; text: string; chips?: string[] };

const SUGGESTED = [
  "Can I afford a Goa Trip?",
  "How can I save ₹1000 this month?",
  "Why am I overspending?",
  "Create a budget plan for me",
];


function Coach() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("Friend");
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    loadChatHistory();
  }, []);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [msgs, loading]);

  const loadChatHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) return;
      const profile = await supabase
  .from("users")
  .select("full_name")
  .eq("auth_user_id", user.id)
  .single();

if (profile.data?.full_name) {
  setUserName(profile.data.full_name);
}

      const response = await fetch(
        `http://127.0.0.1:8000/chat-history/${user.id}`
      );
  
      const data = await response.json();
  
      if (data.length === 0) {
        setMsgs([
          {
            from: "potli",
            text: `Hey ${profile.data?.full_name || "Friend"}! 👋 I'm Potli, your AI money coach. Ask me anything — try one of these:`,
            chips: SUGGESTED,
          },
        ]);
        return;
      }
  
      const mappedMessages = data.map((msg: any) => ({
        from:
          msg.role === "assistant"
            ? "potli"
            : "me",
        text: msg.message,
      }));
  
      setMsgs(mappedMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const send = async (t: string) => {
    if (!t.trim()) return;
  
    setMsgs((m) => [
      ...m,
      {
        from: "me",
        text: t,
      },
    ]);
  
    setText("");
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        alert("User not logged in");
        return;
      }
  
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            message: t,
          }),
        }
      );
  
      const data = await response.json();
      setLoading(false);

      setMsgs((m) => [
        ...m,
        {
          from: "potli",
          text: data.reply,
        },
      ]);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMsgs((m) => [
        ...m,
        {
          from: "potli",
          text: "Something went wrong.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-3 pb-4 bg-card border-b-2 border-border">
        <div className="flex items-center gap-3">
          <Potli size={48} mood="happy" />
          <div className="flex-1">
            <div className="font-extrabold flex items-center gap-1.5">
              Potli Coach <Sparkles className="w-4 h-4 text-[var(--xp)]" />
            </div>
            <div className="text-xs font-bold text-secondary">● Online — AI powered</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} gap-2`}>
            {m.from === "potli" && <Potli size={32} mood="happy" className="shrink-0 self-end" />}
            <div className="max-w-[78%]">
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm font-semibold whitespace-pre-line ${
                  m.from === "me"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border-2 border-border rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
              {m.chips && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-[var(--potli-green-soft)] text-[var(--potli-green-dark)] border border-[var(--potli-green-dark)]/15"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
  <div className="flex justify-start gap-2">
    <Potli
      size={32}
      mood="happy"
      className="shrink-0 self-end"
    />

    <div className="bg-card border-2 border-border rounded-2xl px-4 py-2.5">
      Potli is thinking...
    </div>
  </div>
)}

<div className="flex justify-center pt-2">
  <Chip tone="yellow">
    💡 Tip: ask anything about your money
  </Chip>
</div>
<div ref={bottomRef}></div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(text); }}
        className="p-3 border-t-2 border-border bg-card flex gap-2 items-center"
      >
        <input
          disabled={loading}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask Potli anything…"
          className="flex-1 bg-muted rounded-2xl px-4 py-3 font-semibold focus:outline-none border-2 border-transparent focus:border-secondary"
        />
        <PopButton
  type="submit"
  disabled={loading}
  className="!px-4 !py-3"
>
          <Send className="w-4 h-4" strokeWidth={3} />
        </PopButton>
      </form>
    </div>
  );
}
