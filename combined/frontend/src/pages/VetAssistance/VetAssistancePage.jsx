import React, { useState, useEffect, useCallback } from 'react';
import { getNearbyClinics } from '../../api/vet.api';
import { FunFactBanner } from '../../components/funfact/FunFactBanner';

// ponytail: single danger accent instead of 3 clashing hardcoded hexes; green reuses theme success token.
const DANGER = '#c0392b';
const SUCCESS = 'var(--success-accent)';

// Quick triage shown before the list — the whole point of an "emergency" page.
const FIRST_AID = [
  ['Poisoning / ate something toxic', 'Do NOT induce vomiting unless a vet says so. Bring the packaging/plant. Call ahead.'],
  ['Choking', 'Open the mouth, remove visible objects. For small dogs, 5 firm back blows between the shoulder blades.'],
  ['Heavy bleeding', 'Press a clean cloth firmly on the wound and keep pressure while you travel.'],
  ['Heatstroke', 'Move to shade, wet with cool (not ice-cold) water, offer small sips. Go now — this kills fast.'],
  ['Seizure', 'Clear the area, don’t restrain or touch the mouth, time it. Over 5 min = emergency.'],
];

export default function VetAssistancePage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [open24h, setOpen24h] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState(false);

  const fetchClinics = useCallback(async (lat, lng, only24h) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNearbyClinics(lat, lng, only24h);
      setClinics(data.clinics || []);
      setUsedFallback(Boolean(data.usedFallbackLocation));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load clinics.');
    } finally {
      setLoading(false);
    }
  }, []);

  const locateAndFetch = useCallback((only24h) => {
    if (!navigator.geolocation) {
      fetchClinics(null, null, only24h); // backend falls back to Hanoi center
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchClinics(pos.coords.latitude, pos.coords.longitude, only24h),
      () => fetchClinics(null, null, only24h), // permission denied -> fallback
      { timeout: 8000 }
    );
  }, [fetchClinics]);

  // Auto-locate on first load
  useEffect(() => { locateAndFetch(false); }, [locateAndFetch]);

  const toggle24h = () => {
    const next = !open24h;
    setOpen24h(next);
    locateAndFetch(next);
  };

  return (
    <div className="page page-wide" style={{ position: 'relative' }}>
      <div className="nutrition-bg-pattern" style={{ position: 'absolute', zIndex: -1 }}></div>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <h1 className="page__title" style={{ color: 'var(--primary-coral)' }}>Emergency Vet Assistance</h1>
        <p className="page__subtitle" style={{ color: 'var(--sepia)' }}>
          Locate certified veterinary archives and clinics near you. For emergencies, establish contact prior to arrival.
        </p>
      </div>

      {/* Fun Facts Section */}
      <div className="mb-8">
        <FunFactBanner />
      </div>

      {/* Refined Emergency First-Aid Panel */}
      <div 
        style={{
          background: 'var(--bg-white)',
          border: '1px solid rgba(116, 67, 54, 0.25)', // soft terracotta border
          borderLeft: '4px solid var(--tertiary-accent)', // elegant solid line
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-4)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(116, 67, 54, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <button
          onClick={() => setShowFirstAid(!showFirstAid)}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '1.25rem 1.5rem',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span 
              className="material-symbols-outlined" 
              style={{ 
                color: 'var(--tertiary-accent)', 
                fontSize: '24px',
                animation: 'pulse 2s infinite ease-in-out'
              }}
            >
              medical_services
            </span>
            <div>
              <h2 
                style={{ 
                  margin: 0, 
                  fontFamily: 'var(--font-display)', 
                  fontSize: 'var(--fs-500)', 
                  fontWeight: 600,
                  color: 'var(--primary-dark)',
                  letterSpacing: '-0.01em'
                }}
              >
                Triage & First Aid Protocols
              </h2>
              <p 
                style={{ 
                  margin: 0, 
                  fontFamily: 'var(--font-ui)', 
                  fontSize: 'var(--fs-300)', 
                  color: 'var(--sepia)',
                  opacity: 0.8
                }}
              >
                Critical instructions while en route to a veterinary surgeon
              </p>
            </div>
          </div>
          <span 
            className="material-symbols-outlined" 
            style={{ 
              color: 'var(--sepia)', 
              transform: showFirstAid ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            expand_more
          </span>
        </button>

        {showFirstAid && (
          <div 
            style={{ 
              padding: '0 1.5rem 1.5rem 1.5rem',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <div 
              style={{ 
                borderTop: '1px solid rgba(30, 28, 16, 0.08)', 
                paddingTop: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '1rem'
              }}
            >
              {FIRST_AID.map(([title, tip]) => (
                <div 
                  key={title}
                  style={{
                    background: 'var(--bg-off-white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(116, 67, 54, 0.3)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(116, 67, 54, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span 
                      style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: 'var(--tertiary-accent)' 
                      }} 
                    />
                    <h3 
                      style={{ 
                        margin: 0, 
                        fontFamily: 'var(--font-ui)', 
                        fontSize: 'var(--fs-400)', 
                        fontWeight: 600, 
                        color: 'var(--primary-dark)' 
                      }}
                    >
                      {title}
                    </h3>
                  </div>
                  <p 
                    style={{ 
                      margin: 0, 
                      fontFamily: 'var(--font-ui)', 
                      fontSize: 'var(--fs-300)', 
                      color: 'var(--sepia)',
                      lineHeight: 1.5 
                    }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <button className="btn-primary" onClick={() => locateAndFetch(open24h)} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>my_location</span>
          {loading ? 'Triangulating position…' : 'Locate Nearby Clinics'}
        </button>
        <button
          className={open24h ? 'btn-primary' : 'btn-secondary'}
          onClick={toggle24h}
          disabled={loading}
          style={open24h ? { backgroundColor: 'var(--primary-coral-hover)', display: 'flex', alignItems: 'center', gap: '0.5rem' } : { display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {open24h ? <><span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>check_circle</span> Showing 24/7 Only</> : <><span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>schedule</span> Filter 24/7 Only</>}
        </button>
      </div>

      {usedFallback && (
        <div style={{ fontSize: 'var(--fs-300)', color: 'var(--sepia)', background: 'var(--bg-pale-beige)', padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
          <strong>Location Status:</strong> Signals blocked or unavailable. Falling back to central archives (Hanoi). Grant location access for precise triangulation.
        </div>
      )}

      {error && <div style={{ color: 'var(--error-state)', textAlign: 'center', fontWeight: '600', background: 'var(--bg-pale-beige)', padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}
      
      {!loading && !error && clinics.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--sepia)', padding: 'var(--space-4)', background: 'var(--bg-white)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          No certified clinics located in this sector.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))', gap: 'var(--space-4)' }}>
        {loading && clinics.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} aria-hidden style={{ position: 'relative', background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ height: '12px', width: '30%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ height: '12px', width: '20%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)', marginLeft: 'auto' }} />
                </div>
                <div style={{ height: '1.5rem', width: '75%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)', margin: '0.25rem 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '10px', width: '90%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ height: '10px', width: '50%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
                </div>
              </div>
            ))
          : clinics.map((c, i) => {
              const isNearest = i === 0;
              const phoneHref = `tel:${c.phone.replace(/\s/g, '')}`;
              const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
              return (
                <div 
                  key={c.id} 
                  className="group relative bg-surface border border-secondary/20 p-6 flex flex-col gap-4 hover:bg-surface-container transition-colors shadow-none"
                >
                  {/* Inner decorative border for premium encyclopedia feel */}
                  <div className="absolute inset-1 border border-secondary/10 pointer-events-none" />

                  {/* Top Bar: Distance & Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {isNearest && (
                        <span style={{ 
                          fontSize: '9px', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.08em', 
                          background: 'var(--tertiary-accent)', 
                          color: '#fff', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '3px' 
                        }}>
                          Nearest
                        </span>
                      )}
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.08em', 
                        background: c.open24h ? 'rgba(21, 66, 18, 0.06)' : 'rgba(92, 58, 33, 0.06)', 
                        color: c.open24h ? 'var(--primary-dark)' : 'var(--sepia)', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '3px',
                        border: `1px solid ${c.open24h ? 'rgba(21, 66, 18, 0.2)' : 'rgba(92, 58, 33, 0.2)'}`
                      }}>
                        {c.open24h ? '24/7 Emergency' : 'Standard Hours'}
                      </span>
                    </div>
                    <div style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontStyle: 'italic', 
                      fontSize: 'var(--fs-300)', 
                      color: 'var(--sepia)',
                      fontWeight: 600
                    }}>
                      {c.distanceKm} km away
                    </div>
                  </div>
 
                  {/* Clinic Name */}
                  <h3 style={{ 
                    fontSize: 'var(--fs-500)', 
                    fontFamily: 'var(--font-display)', 
                    color: 'var(--primary-dark)', 
                    margin: 0,
                    lineHeight: 1.3,
                    borderBottom: '1px solid rgba(30, 28, 16, 0.06)',
                    paddingBottom: '0.75rem',
                    transition: 'color 0.2s ease'
                  }}
                  className="group-hover:text-primary"
                  >
                    {c.name}
                  </h3>
 
                  {/* Address & Rating */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: 'var(--fs-300)', color: 'var(--sepia)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.45 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--tertiary-accent)', marginTop: '2px' }}>location_on</span>
                      <span>{c.address}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#d4af37' }}>star</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary-dark)' }}>{c.rating}</span>
                      <span style={{ opacity: 0.65 }}>out of 5 stars</span>
                    </div>
                  </div>
 
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(30, 28, 16, 0.06)' }}>
                    <a href={phoneHref} style={{ flex: 1, textDecoration: 'none' }}>
                      <button 
                        style={{ 
                          width: '100%', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '0.4rem', 
                          backgroundColor: 'rgba(116, 67, 54, 0.04)', 
                          color: 'var(--tertiary-accent)', 
                          border: '1px solid rgba(116, 67, 54, 0.25)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.6rem 0.5rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 600,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--tertiary-accent)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(116, 67, 54, 0.04)';
                          e.currentTarget.style.color = 'var(--tertiary-accent)';
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                        Call
                      </button>
                    </a>
                    <a href={mapsHref} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                      <button 
                        style={{ 
                          width: '100%', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '0.4rem', 
                          backgroundColor: 'rgba(21, 66, 18, 0.03)', 
                          color: 'var(--primary-dark)', 
                          border: '1px solid rgba(21, 66, 18, 0.25)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.6rem 0.5rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 600,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(21, 66, 18, 0.03)';
                          e.currentTarget.style.color = 'var(--primary-dark)';
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>explore</span>
                        Directions
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

function Chip({ children, bg, fg }) {
  return (
    <span style={{ background: bg, color: fg, fontSize: 'var(--fs-300)', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px', lineHeight: 1.4 }}>
      {children}
    </span>
  );
}
