import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../api/chatbot.api';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am PawIntel\'s AI Veterinarian. Is your pet showing any unusual symptoms?' }
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

    // Build history for the API from the conversation so far (exclude the greeting id:1 optionally kept)
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
    <div className="card-standard" style={{ width: '100%', maxWidth: '56rem', margin: '0 auto', height: 'clamp(28rem, 70vh, 40rem)', display: 'flex', flexDirection: 'column', padding: '0' }}>
      {/* Top Header info */}
      <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid rgba(37, 34, 30, 0.08)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#438952', flexShrink: 0 }} />
        <div>
          <h3 style={{ fontSize: 'var(--fs-400)' }}>PawIntel Veterinary Assistant AI</h3>
          <span style={{ fontSize: 'var(--fs-300)', color: '#999999' }}>Model optimized according to international standard veterinary documents</span>
        </div>
      </div>

      {/* Messages Frame */}
      <div style={{ flex: 1, padding: 'var(--space-3)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', backgroundColor: '#FAFAFA' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%', padding: '0.75em 1em', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-400)', lineHeight: '1.5',
              backgroundColor: msg.sender === 'user' ? '#154212' : '#FFFFFF',
              color: msg.sender === 'user' ? '#FFFFFF' : '#1e1c10',
              boxShadow: msg.sender === 'ai' ? 'var(--shadow-sm)' : 'none',
              border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.75em 1em', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-400)', backgroundColor: '#FFFFFF', color: '#999999', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', fontStyle: 'italic' }}>
              PawIntel is typing…
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={sendMessage} style={{ padding: 'var(--space-2)', borderTop: '1px solid rgba(37, 34, 30, 0.08)', display: 'flex', gap: 'var(--space-1)', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}>
        <input
          type="text"
          className="input-text"
          placeholder="Enter question here (e.g., What should a dog with diarrhea eat?)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-primary" style={{ padding: '0.7em 1.8em', flexShrink: 0 }} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
