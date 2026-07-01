import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PageHeading } from "@/components/ui";
import { sendChatMessage } from "@/services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Greetings. I am the Canis Archive veterinary scholar. Describe your companion's condition or ask any care question, and I shall consult the records.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), sender: "user", text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const history = next.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const data = await sendChatMessage(text, history);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: data.reply }]);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Connection error. Please try again.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout wide={false}>
      <PageHeading
        title="Veterinary Assistant"
        subtitle="An AI scholar trained on veterinary references. For emergencies, always consult a licensed veterinarian."
      />

      <div className="bg-surface-container-lowest border border-secondary/20 rounded-sm flex flex-col h-[clamp(28rem,68vh,42rem)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-secondary/20 flex items-center gap-3 bg-surface-container-low">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
          <div>
            <h3 className="font-label-md uppercase tracking-widest text-[12px] text-primary">
              Archive Veterinary Scholar
            </h3>
            <span className="font-body-sm text-secondary text-[12px]">
              Optimized on international veterinary standards
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-sm font-body-md leading-relaxed whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-surface-container border border-secondary/15 text-on-surface"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-sm bg-surface-container border border-secondary/15 text-secondary italic font-body-md">
                Consulting the archives…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className="p-4 border-t border-secondary/20 flex gap-3 bg-surface-container-lowest">
          <input
            type="text"
            className="flex-1 bg-surface-container-low border border-secondary/30 focus:border-primary px-4 py-3 font-body-md outline-none rounded-sm transition-colors"
            placeholder="e.g. What should a dog with an upset stomach eat?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-label-md uppercase tracking-[0.15em] px-6 rounded-sm hover:bg-[#0f2e0d] transition-colors border-none cursor-pointer disabled:opacity-40 shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </Layout>
  );
}
