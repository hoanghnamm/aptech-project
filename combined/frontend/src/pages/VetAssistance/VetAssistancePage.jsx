import React, { useState, useEffect, useCallback } from 'react';
import { getNearbyClinics } from '../../api/vet.api';

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

      {/* First-aid triage — native <details>, no JS, no deps */}
      <details className="card-standard" style={{ borderLeft: `5px solid ${DANGER}`, marginBottom: 'var(--space-4)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 'var(--fs-500)', color: DANGER }}>
          🚨 While you get there — quick first aid
        </summary>
        <ul style={{ marginTop: 'var(--space-2)', display: 'grid', gap: 'var(--space-2)', paddingLeft: '1.1rem' }}>
          {FIRST_AID.map(([title, tip]) => (
            <li key={title}>
              <strong>{title}:</strong> {tip}
            </li>
          ))}
        </ul>
      </details>

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
              <div key={i} className="card-standard" aria-hidden style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-4)', border: '1px solid var(--border-color)', opacity: 0.5 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: 'var(--border-color)' }}></div>
                <div style={{ height: '1.4rem', width: '70%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
                <div style={{ height: '0.9rem', width: '90%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
                <div style={{ height: '0.9rem', width: '50%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
              </div>
            ))
          : clinics.map((c, i) => {
              const isNearest = i === 0;
              const phoneHref = `tel:${c.phone.replace(/\s/g, '')}`;
              const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
              return (
                <div key={c.id} className="card-standard" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-4)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  {/* Status indicator line */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: c.open24h ? SUCCESS : 'var(--tertiary-accent)' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontSize: 'var(--fs-600)', fontFamily: 'var(--font-display)', color: 'var(--primary-dark)', margin: 0, flex: 1 }}>{c.name}</h3>
                    <div style={{ background: 'var(--bg-pale-beige)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontWeight: '700', color: 'var(--primary-coral)', fontSize: 'var(--fs-400)', whiteSpace: 'nowrap' }}>
                      {c.distanceKm} km
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                    {isNearest && <Chip bg="var(--primary-coral)" fg="#fff">Nearest</Chip>}
                    <Chip bg={c.open24h ? SUCCESS : 'var(--tertiary-accent)'} fg={c.open24h ? '#fff' : 'var(--primary-dark)'}>
                      {c.open24h ? 'Open 24/7' : 'Limited Hours'}
                    </Chip>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--fs-400)', color: 'var(--sepia)', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.2em', marginTop: '0.1rem' }}>location_on</span>
                      <span>{c.address}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2em', color: 'var(--warning-state)' }}>star</span>
                        <span style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{c.rating}</span> / 5
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-color)' }}>
                    <a href={phoneHref} style={{ flex: 1, textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: DANGER, color: '#fff', border: 'none' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>call</span>
                        Call
                      </button>
                    </a>
                    <a href={mapsHref} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>explore</span>
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
