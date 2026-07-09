import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { sendChatMessage, getChatHistory, getChatSessionDetails } from '../../api/chatbot.api';
import { useAuth } from '../../context/AuthContext';

// Custom renderers for markdown elements to style them inside the AI message bubble
const markdownComponents = {
  p: ({ node, ...props }) => <p style={{ margin: '0 0 var(--space-2) 0', lineHeight: '1.6' }} {...props} />,
  ul: ({ node, ...props }) => <ul style={{ margin: '0 0 var(--space-2) 0', paddingLeft: '1.25rem', listStyleType: 'disc' }} {...props} />,
  ol: ({ node, ...props }) => <ol style={{ margin: '0 0 var(--space-2) 0', paddingLeft: '1.25rem', listStyleType: 'decimal' }} {...props} />,
  li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem', lineHeight: '1.5' }} {...props} />,
  table: ({ node, ...props }) => (
    <div style={{ overflowX: 'auto', margin: 'var(--space-2) 0', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-300)' }} {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead style={{ backgroundColor: 'var(--bg-pale-beige)', borderBottom: '2px solid var(--border-color)' }} {...props} />,
  tbody: ({ node, ...props }) => <tbody {...props} />,
  tr: ({ node, ...props }) => <tr style={{ borderBottom: '1px solid var(--border-color)' }} {...props} />,
  th: ({ node, ...props }) => <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: '600' }} {...props} />,
  td: ({ node, ...props }) => <td style={{ padding: '0.6rem 0.8rem', textAlign: 'left', verticalAlign: 'top' }} {...props} />,
  h1: ({ node, ...props }) => <h1 style={{ fontSize: 'var(--fs-600)', margin: 'var(--space-3) 0 var(--space-1) 0', fontWeight: 'bold' }} {...props} />,
  h2: ({ node, ...props }) => <h2 style={{ fontSize: 'var(--fs-500)', margin: 'var(--space-2) 0 var(--space-1) 0', fontWeight: 'bold' }} {...props} />,
  h3: ({ node, ...props }) => <h3 style={{ fontSize: 'var(--fs-400)', margin: 'var(--space-2) 0 var(--space-1) 0', fontWeight: 'bold' }} {...props} />,
  strong: ({ node, ...props }) => <strong style={{ fontWeight: '700', color: 'var(--primary-dark)' }} {...props} />,
  em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
};

const GREETING_TEXT = 'Hello! I am PawIntel\'s AI Veterinarian. Is your pet showing any unusual symptoms?';

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: GREETING_TEXT }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const chatContainerRef = useRef(null);

  // History sidebar state
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load chat history list
  const fetchHistoryList = useCallback(() => {
    if (!user) return;
    setHistoryLoading(true);
    getChatHistory(30)
      .then((data) => setHistoryItems(Array.isArray(data) ? data : []))
      .catch(() => setHistoryItems([]))
      .finally(() => setHistoryLoading(false));
  }, [user]);

  useEffect(() => {
    fetchHistoryList();
  }, [fetchHistoryList]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const timer = setTimeout(() => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // ChatGPT New Chat action
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      { id: Date.now(), sender: 'ai', text: GREETING_TEXT }
    ]);
    setShowHistory(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    // Context history for the AI: exclude greeting
    const history = nextMessages.slice(1).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const data = await sendChatMessage(text, history, currentSessionId);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMsg]);

      if (user) {
        // If it was a new chat session, record the returned sessionId and refresh list
        if (!currentSessionId && data.sessionId) {
          setCurrentSessionId(data.sessionId);
          fetchHistoryList();
        } else {
          // Just update local updatedAt listing visually or reload list
          fetchHistoryList();
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Connection error. Please try again.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full conversation history of a selected session
  const loadHistoryItem = async (item) => {
    if (historyLoading) return;
    setLoading(true);
    try {
      const session = await getChatSessionDetails(item._id);
      if (session && session.context && session.context.length > 0) {
        const loadedMsgs = session.context.map((c, idx) => ({
          id: idx + 2,
          sender: c.role === 'user' ? 'user' : 'ai',
          text: c.content
        }));
        setMessages([
          { id: 1, sender: 'ai', text: GREETING_TEXT },
          ...loadedMsgs
        ]);
        setCurrentSessionId(session._id);
      } else {
        // Fallback if no context array populated yet
        setMessages([
          { id: 1, sender: 'ai', text: GREETING_TEXT },
          { id: 2, sender: 'user', text: item.userMessage },
          { id: 3, sender: 'ai', text: item.assistantReply },
        ]);
        setCurrentSessionId(item._id);
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
    } finally {
      setLoading(false);
      setShowHistory(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 5.5rem - 240px)',
      padding: 'var(--space-4) var(--space-3)',
      boxSizing: 'border-box',
      width: '100%',
    }}>
      <div style={{ width: '100%', maxWidth: '64rem', display: 'flex', gap: 'var(--space-3)', height: 'clamp(28rem, 70vh, 40rem)' }}>

        {/* History Sidebar (desktop) */}
        {user && (
          <div
            className="hidden md:flex"
            style={{
              width: '16rem',
              flexShrink: 0,
              flexDirection: 'column',
              background: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            {/* New Chat Button */}
            <div style={{ padding: '0.75rem' }}>
              <button
                onClick={handleNewChat}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #154212',
                  background: 'transparent',
                  color: '#154212',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: 'var(--fs-300)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#154212';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#154212';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                New Chat
              </button>
            </div>

            <div style={{
              padding: 'var(--space-1) var(--space-3)',
              borderBottom: '1px solid rgba(37, 34, 30, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#154212' }}>history</span>
              <h4 style={{ fontSize: 'var(--fs-300)', fontWeight: 600, color: '#1e1c10', textTransform: 'uppercase', letterSpacing: '0.05em' }}>History</h4>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
              {historyLoading && historyItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3)', color: '#999', fontSize: 'var(--fs-300)', fontStyle: 'italic' }}>
                  Loading...
                </div>
              ) : historyItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-3)', color: '#999', fontSize: 'var(--fs-300)' }}>
                  No past conversations yet.
                </div>
              ) : (
                historyItems.map((item) => {
                  const isActive = item._id === currentSessionId;
                  return (
                    <div
                      key={item._id}
                      onClick={() => loadHistoryItem(item)}
                      style={{
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        marginBottom: '0.25rem',
                        transition: 'all 0.15s ease',
                        borderLeft: '3px solid',
                        borderColor: isActive ? '#154212' : 'transparent',
                        background: isActive ? '#f3f4ed' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = '#f3f4ed';
                          e.currentTarget.style.borderColor = '#154212';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <div style={{
                        fontSize: 'var(--fs-300)',
                        fontWeight: 600,
                        color: '#1e1c10',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.userMessage}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                        {formatDate(item.updatedAt || item.createdAt)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="card-standard" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
          {/* Top Header info */}
          <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid rgba(37, 34, 30, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#438952', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: 'var(--fs-400)' }}>PawIntel Veterinary Assistant AI</h3>
                <span style={{ fontSize: 'var(--fs-300)', color: '#999999' }}>Model optimized according to international standard veterinary documents</span>
              </div>
            </div>

            {/* Mobile Actions (New chat + history toggle) */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {user && (
                <>
                  <button
                    onClick={handleNewChat}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.375rem',
                      padding: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="New Chat"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#154212' }}>add</span>
                  </button>
                  <button
                    className="md:hidden"
                    onClick={() => setShowHistory(!showHistory)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.375rem',
                      padding: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Chat History"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#154212' }}>history</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile History Panel */}
          {showHistory && user && (
            <div className="md:hidden" style={{
              maxHeight: '12rem',
              overflowY: 'auto',
              borderBottom: '1px solid rgba(37, 34, 30, 0.08)',
              background: '#faf3e0',
              padding: '0.5rem',
            }}>
              {historyItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#999', fontSize: 'var(--fs-300)' }}>No history</div>
              ) : (
                historyItems.slice(0, 10).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => loadHistoryItem(item)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      marginBottom: '0.25rem',
                      background: item._id === currentSessionId ? '#f3f4ed' : '#fff',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ fontSize: 'var(--fs-300)', fontWeight: 600, color: '#1e1c10', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.userMessage}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{formatDate(item.updatedAt || item.createdAt)}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sign-in prompt for guests */}
          {!user && (
            <div style={{
              padding: '0.5rem var(--space-3)',
              background: 'linear-gradient(135deg, #f3f4ed, #faf3e0)',
              borderBottom: '1px solid rgba(37, 34, 30, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: 'var(--fs-300)',
              color: '#625e50',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#154212' }}>info</span>
              <span>Sign in to save your conversation history</span>
            </div>
          )}

          {/* Messages Frame */}
          <div 
            ref={chatContainerRef}
            style={{ flex: 1, padding: 'var(--space-3)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', backgroundColor: '#FAFAFA' }}
          >
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: msg.sender === 'user' ? '75%' : '90%', padding: '0.75em 1em', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-400)', lineHeight: '1.5',
                  backgroundColor: msg.sender === 'user' ? '#EE6449' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#25221E',
                  boxShadow: msg.sender === 'ai' ? 'var(--shadow-sm)' : 'none',
                  border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
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
      </div>
    </div>
  );
}
