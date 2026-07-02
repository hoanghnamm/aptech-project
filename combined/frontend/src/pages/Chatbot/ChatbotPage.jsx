import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../api/chatbot.api';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Welcome to the archive. Describe your companion’s symptoms, care routine or training questions, and I shall consult the veterinary records on your behalf.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const history = nextMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const data = await sendChatMessage(text, history);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.reply }]);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Connection error. Please try again.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-12 bg-[#FEFDFC] text-[#25221E] min-h-screen">
      {/* Chat panel */}
      <div className="max-w-3xl mx-auto w-full bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm shadow-none overflow-hidden flex flex-col h-[650px]">
        {/* Header */}
        <div className="bg-[#FEFDFC] border-b border-[#25221E]/10 px-8 py-5 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
              Archival Intelligence
            </span>
            <h3 className="font-headline-lg text-[20px] text-[#25221E] leading-none">
              Veterinary Consultation
            </h3>
          </div>
          <span className="flex items-center gap-2 font-label-md text-[10px] uppercase tracking-[0.15em] text-[#5C3A21]/70">
            <span className="w-2 h-2 rounded-full bg-[#4c8a54]" /> On record
          </span>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-6 bg-[#FEFDFC] custom-scrollbar">
          {messages.map(msg => (
            msg.sender === 'ai' ? (
              <div key={msg.id} className="self-start max-w-[80%] bg-[#F5EFE3] border border-[#E3D7BF] text-[#25221E] px-5 py-4 rounded-sm font-body-md text-[14px] leading-relaxed shadow-sm">
                <span className="font-label-md text-[9px] uppercase tracking-wider text-[#5C3A21]/60 mb-1 block">
                  Archival Intelligence
                </span>
                {msg.text}
              </div>
            ) : (
              <div key={msg.id} className="self-end max-w-[80%] bg-[#25221E] text-white px-5 py-4 rounded-sm font-body-md text-[14px] leading-relaxed">
                {msg.text}
              </div>
            )
          ))}
          {loading && (
            <div className="self-start max-w-[80%] bg-[#F5EFE3] border border-[#E3D7BF] text-[#5C3A21] px-5 py-4 rounded-sm font-serif italic text-[14px] shadow-sm">
              Consulting the archive…
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Composer */}
        <form onSubmit={sendMessage} className="border-t border-[#25221E]/10 p-5 bg-[#FEFDFC] flex gap-3">
          <input
            type="text"
            className="flex-grow bg-white border border-[#25221E]/20 rounded-sm px-4 py-3 outline-none focus:border-[#EE6449] text-[14px]"
            placeholder="Describe the case… (e.g. What should a dog with diarrhea eat?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#EE6449] hover:bg-[#F07459] disabled:opacity-60 text-white px-6 rounded-sm font-label-md uppercase tracking-wider text-[11px] font-bold transition-colors cursor-pointer border-none"
          >
            {loading ? '…' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
