import React, { useEffect, useRef, useState } from "react";

export default function DoctorMascot({ onSendToAI, onNavigate, currentPage, frames = [] }) {
  const [open, setOpen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! 👋 I'm your PawIntel assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const requestRef = useRef();
  const lastUpdateTimeRef = useRef(0);
  const bubbleTimerRef = useRef(null);

  const pageMessages = {
    home: "Welcome! 👋 Click me to explore PawIntel's AI-powered pet care tools!",
    nutrition: "Ready to optimize your pet's health? Fill in the details for a personalized nutrition plan! 🦴",
    identification: "Wondering about a dog's breed? Snap a photo and let's find out together! 📸",
    recommendation: "Not sure which breed suits you? Answer a few questions and I'll match you! 🧭",
    search: "Just describe what you want in plain words and I'll find the perfect breeds! 🔎",
    chatbot: "I'm here to help with any health worries. Describe the symptoms, and I'll assist you! 💬",
    encyclopedia: "Explore the fascinating world of breeds! Discover histories, traits, and care tips here. 📚",
    vet: "Emergency? I'll help you find the nearest vet clinics right away. 🚑",
    gallery: "Upload your favorite dog photos and watch me tag them automatically! 🖼️",
    insights: "Here's what I've learned about your taste — plus what's trending! ✨"
  };

  const quickNavItems = [
    { id: 'home', label: '🏠 Home Overview' },
    { id: 'identification', label: '📸 AI Breed Recognition' },
    { id: 'recommendation', label: '🧭 AI Breed Match' },
    { id: 'search', label: '🔎 Smart Search' },
    { id: 'chatbot', label: '💬 AI Health Assistant' },
    { id: 'nutrition', label: '🦴 AI Nutrition Plan' },
    { id: 'encyclopedia', label: '📚 Dog Encyclopedia' },
    { id: 'gallery', label: '🖼️ AI Photo Gallery' },
    { id: 'insights', label: '✨ For You' },
    { id: 'vet', label: '🚑 Emergency Vets' }
  ];

  useEffect(() => {
    // Show bubble when changing pages
    setShowBubble(true);
    
    // Clear old timer if it exists
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    // Auto-hide after 5 seconds
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 5000);

    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [currentPage]);

  useEffect(() => {
    if (frames.length === 0) return;

    const animate = (time) => {
      // ADJUST SPEED HERE:
      // 100ms = 10 frames per second. Increase this number (e.g., 150, 200) to slow down the mascot.
      if (time - lastUpdateTimeRef.current > 120) {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
        lastUpdateTimeRef.current = time;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [frames]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    try {
      if (typeof onSendToAI === "function") {
        const res = await onSendToAI(text);
        const reply = typeof res === "string" ? res : res?.text ?? "OK";
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "AI not connected yet. Please provide onSendToAI prop.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `AI Error: ${err?.message || err}` },
      ]);
    }
  };

  const handleQuickNav = (id) => {
    if (typeof onNavigate === 'function') {
      onNavigate(id);
      setOpen(false); // Close mascot panel after navigating
    }
  };

  return (
    <div style={styles.widget}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open AI Assistant"
        style={styles.button}
      >
        {frames.length > 0 && frames[currentFrame] ? (
          <div style={styles.shell}>
            <img
              src={frames[currentFrame]}
              alt={`Mascot Frame ${currentFrame}`}
              style={styles.img}
            />
          </div>
        ) : (
          /* Fallback display when images are not found in src/asset folder */
          <div style={{ ...styles.shell, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124, 77, 255, 0.1)', borderRadius: '50%', fontSize: '40px' }}>
            🐶
          </div>
        )}
      </button>

      <div style={{ 
        ...styles.bubble, 
        opacity: open ? 0 : (showBubble || isHovered ? 1 : 0),
        transform: open ? "translateY(10px) scale(0.9)" : (showBubble || isHovered ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)"),
        pointerEvents: open || (!showBubble && !isHovered) ? "none" : "auto"
      }}>
        <strong style={{ display: 'block', color: '#1E8C86', marginBottom: '4px' }}>PawIntel Guide</strong>
        <span style={{ fontSize: '13px', color: '#2BA8A2', lineHeight: '1.4', fontWeight: '500' }}>
          {pageMessages[currentPage] || pageMessages.home}
        </span>
      </div>

      <div style={{ ...styles.panel, display: open ? "grid" : "none" }}>
        <div style={styles.head}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#1E8C86', letterSpacing: '1px' }}>PAWINTEL AI</div>
            <div style={{ color: "#2BA8A2", fontSize: 11, fontWeight: '700' }}>VETERINARY SUPPORT</div>
          </div>
          <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                ...(m.role === "user" ? styles.userMsg : styles.botMsg),
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Integrated Navigation Menu */}
        <div style={styles.navSection}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#2BA8A2', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Navigation</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {quickNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleQuickNav(item.id)}
                style={{ 
                  ...styles.navBtn, 
                  backgroundColor: currentPage === item.id ? '#2BA8A2' : '#FFF8E7',
                  color: currentPage === item.id ? '#FFFFFF' : '#1E8C86',
                  borderColor: currentPage === item.id ? '#2BA8A2' : '#3CC4BD'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.composer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            style={styles.input}
          />
          <button onClick={send} style={styles.sendBtn}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  widget: {
    position: "fixed",
    left: "1.25rem",
    bottom: "1.25rem",
    zIndex: 999999,
    display: "grid",
    gap: "0.75rem",
    justifyItems: "start",
    alignItems: "end",
    userSelect: "none",
  },
  button: {
    position: "relative",
    width: "clamp(5rem, 6rem + 4vw, 8.25rem)",
    height: "clamp(5rem, 6rem + 4vw, 8.25rem)",
    background: "transparent",
    border: 0,
    padding: 0,
    cursor: "pointer",
    filter: "drop-shadow(0 12px 18px rgba(0,0,0,.12))",
    animation: "floaty 3.8s ease-in-out infinite",
  },
  shell: {
    position: "relative",
    width: "100%",
    height: "100%",
    transformOrigin: "50% 82%",
    transition: "transform .22s ease",
  },
  img: { width: "100%", height: "100%", display: "block", objectFit: "contain" },
  eyeCover: {
    position: "absolute",
    left: "61.3%",
    top: "30.2%",
    width: "11.5%",
    height: "4.5%",
    borderRadius: 999,
    background: "#161616",
    transformOrigin: "center",
    boxShadow: "0 1px 0 rgba(255,255,255,.08) inset",
    transition: "opacity .02s linear, transform .18s ease",
  },
  waveHint: {
    position: "absolute",
    right: "10%",
    top: "20%",
    width: 34,
    height: 34,
    opacity: 0,
    transition: "opacity .12s ease, transform .12s ease",
    borderRadius: 999,
    border: "3px solid rgba(124, 77, 255, .55)",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    transform: "translate(0,6px) scale(.35)",
  },
  spark: {
    position: "absolute",
    right: "7%",
    top: "15%",
    width: 11,
    height: 11,
    borderRadius: "50%",
    background: "rgba(124,77,255,.85)",
    transition: "opacity .12s ease, transform .12s ease",
  },
  bubble: {
    position: "absolute",
    left: "calc(100% + 0.875rem)",
    bottom: "1.125rem",
    width: "min(15.5rem, calc(100vw - 9rem))",
    padding: "0.75rem 0.875rem",
    borderRadius: 18,
    background: "#FFF8E7",
    border: "2px solid #2BA8A2",
    boxShadow: "0 8px 32px rgba(43, 168, 162, 0.15)",
    backdropFilter: "blur(12px)",
    zIndex: 10,
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  panel: {
    width: "min(20rem, calc(100vw - 2.5rem))",
    height: "min(26.25rem, calc(100vh - 9rem))",
    background: "#FFFFFF",
    border: "3px solid #2BA8A2",
    borderRadius: "32px",
    boxShadow: "0 18px 40px rgba(43, 168, 162, 0.25)",
    backdropFilter: "blur(14px)",
    overflow: "hidden",
    gridTemplateRows: "auto 1fr auto auto",
    animation: "pop .18s ease-out",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "3px dashed #E8F6F5",
    background: "#F0F9F8",
  },
  closeBtn: {
    border: "2px solid #2BA8A2",
    background: "#FFF8E7",
    color: "#1E8C86",
    width: 34,
    height: 34,
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: "800",
  },
  messages: {
    padding: 14,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  msg: {
    maxWidth: "85%",
    padding: "10px 12px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  botMsg: {
    alignSelf: "flex-start",
    background: "#eef2ff",
    border: "1px solid rgba(124,77,255,.08)",
  },
  userMsg: {
    alignSelf: "flex-end",
    background: "#101521",
    color: "#fff",
  },
  navBtn: {
    border: '1px solid',
    padding: '6px 8px',
    borderRadius: '8px',
    fontSize: '11px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    display: 'block',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  navSection: {
    padding: '12px',
    borderTop: '1px solid rgba(90, 90, 120, .12)',
    background: '#fcfdff'
  },
  composer: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    padding: 12,
    borderTop: "1px solid rgba(90, 90, 120, .12)",
    background: "rgba(255,255,255,.78)",
  },
  input: {
    width: "100%",
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(90, 90, 120, .16)",
    padding: "0 14px",
    font: "inherit",
    outline: "none",
    background: "white",
  },
  sendBtn: {
    border: 0,
    height: 42,
    padding: "0 16px",
    borderRadius: "999px",
    background: "#FFD23F",
    color: "#1E8C86",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(255, 210, 63, 0.4)",
  },
};
