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
    <div className="page page-wide">
      <div>
        <h1 className="page__title">Emergency Vet Assistance</h1>
        <p className="page__subtitle">
          Find veterinary clinics near you, sorted by distance. In an emergency, call ahead before you travel.
        </p>
      </div>

      {/* First-aid triage — native <details>, no JS, no deps */}
      <details className="card-standard" style={{ borderLeft: `5px solid ${DANGER}` }}>
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

      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => locateAndFetch(open24h)} disabled={loading}>
          {loading ? 'Locating…' : '📍 Find clinics near me'}
        </button>
        <button
          className={open24h ? 'btn-primary' : 'btn-secondary'}
          onClick={toggle24h}
          disabled={loading}
          style={open24h ? { backgroundColor: SUCCESS } : undefined}
        >
          {open24h ? '✓ 24/7 only' : 'Show 24/7 only'}
        </button>
      </div>

      {usedFallback && (
        <div style={{ fontSize: 'var(--fs-300)', color: 'var(--primary-dark)', opacity: 0.65 }}>
          Location unavailable — showing clinics near central Hanoi. Allow location access for accurate distances.
        </div>
      )}

      {error && <div style={{ color: DANGER, textAlign: 'center', fontWeight: 600 }}>⚠️ {error}</div>}
      {!loading && !error && clinics.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.6 }}>No clinics found.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: 'var(--space-3)' }}>
        {loading && clinics.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-standard" aria-hidden style={{ opacity: 0.5 }}>
                <div style={{ height: '1.4rem', width: '70%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ height: '0.9rem', width: '90%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-2)' }} />
                <div style={{ height: '0.9rem', width: '50%', background: 'var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-1)' }} />
              </div>
            ))
          : clinics.map((c, i) => {
              const isNearest = i === 0;
              const phoneHref = `tel:${c.phone.replace(/\s/g, '')}`;
              const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
              return (
                <div
                  key={c.id}
                  className="card-standard"
                  style={{ borderLeft: `5px solid ${c.open24h ? SUCCESS : DANGER}`, display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 'var(--fs-600)' }}>{c.name}</h3>
                    <span style={{ fontWeight: 700, color: 'var(--primary-coral)', whiteSpace: 'nowrap' }}>{c.distanceKm} km</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'var(--space-1)' }}>
                    {isNearest && <Chip bg="var(--primary-coral)" fg="#fff">Nearest</Chip>}
                    <Chip bg={c.open24h ? SUCCESS : DANGER} fg="#fff">
                      {c.open24h ? 'Open 24/7' : 'Limited hours'}
                    </Chip>
                    <Chip bg="var(--warning-state)" fg="var(--primary-dark)">★ {c.rating}</Chip>
                  </div>

                  <div style={{ fontSize: 'var(--fs-400)', marginTop: 'var(--space-2)', opacity: 0.85 }}>📍 {c.address}</div>

                  <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
                    <a href={phoneHref} style={{ flex: 1, textDecoration: 'none' }}>
                      <button className="btn-primary" style={{ width: '100%', backgroundColor: DANGER }}>📞 Call</button>
                    </a>
                    <a href={mapsHref} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ width: '100%' }}>🧭 Directions</button>
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
