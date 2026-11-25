import { useState } from "react";
import { Compass, Send, X, AlertCircle } from "lucide-react";
import { sendChatMessage } from "@/services/chatService";

const PROMPTS = ["Find stationery under ₹500", "Show my CSE Semester 3 kit", "Find trusted sellers", "Explain the handover process"];
type Msg = { role: "user" | "ai" | "error"; text: string };

export function GreenAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput(""); setLoading(true);
    try {
      const reply = await sendChatMessage(text);
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "error", text: (e as Error).message }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Open GREEN AI"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-deep px-4 py-3 text-sm font-medium text-deep-foreground shadow-lift lg:bottom-6 lg:right-6">
        {open ? <X className="size-5" /> : <Compass className="size-5 text-gold" />} GREEN AI
      </button>
      {open && (
        <div className="fixed inset-x-3 bottom-36 z-40 flex max-h-[60vh] flex-col overflow-hidden rounded-2xl border bg-card shadow-lift sm:left-auto sm:right-6 sm:w-96 lg:bottom-24">
          <div className="map-texture border-b p-4">
            <p className="font-display font-semibold">GREEN AI</p>
            <p className="text-xs text-muted-foreground">Your campus treasure guide</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {PROMPTS.map((p) => (
                  <button key={p} onClick={() => send(p)} className="rounded-full border px-3 py-1.5 text-xs hover:border-primary hover:text-primary">{p}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-primary p-3 text-sm text-primary-foreground"
                : m.role === "error" ? "mr-8 flex gap-2 rounded-2xl bg-accent p-3 text-sm text-accent-foreground" : "mr-8 rounded-2xl bg-secondary p-3 text-sm"}>
                {m.role === "error" && <AlertCircle className="size-4 shrink-0" />}{m.text}
              </div>
            ))}
            {loading && <div className="mr-8 w-16 animate-pulse rounded-2xl bg-secondary p-3 text-sm">…</div>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about campus finds…"
              className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:border-primary" />
            <button aria-label="Send" className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="size-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
