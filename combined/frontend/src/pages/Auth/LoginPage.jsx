import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 5.5rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #154212, #2d5a27)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-3)',
            boxShadow: '0 8px 24px rgba(21, 66, 18, 0.25)',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1.75rem' }}>pets</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 1.2rem + 2.5vw, 2.5rem)',
            fontWeight: 700,
            color: '#002b02',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>
            Welcome User
          </h1>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: 'var(--fs-400)',
            color: '#625e50',
          }}>
            Sign in to your Canis Archive account
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: '#fff',
          border: '1px solid rgba(30, 28, 16, 0.14)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          boxShadow: 'rgba(37, 34, 30, 0.07) 0px 14px 19px -9px',
        }}>
          {error && (
            <div style={{
              background: '#ffdad6',
              color: '#93000a',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-3)',
              fontSize: 'var(--fs-300)',
              fontWeight: 600,
              border: '1px solid rgba(147, 0, 10, 0.15)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#625e50',
                marginBottom: '0.5rem',
              }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#f3f4ed',
                  border: '1px solid rgba(98,94,80,0.2)',
                  borderRadius: '0.25rem',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '16px',
                  color: '#1e1c10',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#154212';
                  e.target.style.boxShadow = '0 0 0 3px rgba(21, 66, 18, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(98,94,80,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#625e50',
                marginBottom: '0.5rem',
              }}>
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#f3f4ed',
                  border: '1px solid rgba(98,94,80,0.2)',
                  borderRadius: '0.25rem',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '16px',
                  color: '#1e1c10',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#154212';
                  e.target.style.boxShadow = '0 0 0 3px rgba(21, 66, 18, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(98,94,80,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: loading ? '#625e50' : '#002b02',
                color: '#fff',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '9999px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(0,43,2,0.25)',
                transition: 'all 0.3s ease',
                marginTop: 'var(--space-1)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#3b6934'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#002b02'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: 'var(--fs-400)',
          color: '#625e50',
        }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#154212',
              fontWeight: 600,
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.borderBottomColor = '#154212'}
            onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
