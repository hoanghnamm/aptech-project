import React, { useState, useEffect, useCallback } from 'react';
import { getNearbyClinics } from '../../api/vet.api';

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
          Find veterinary clinics near you, sorted by distance. For emergencies, call ahead before you go.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => locateAndFetch(open24h)} disabled={loading}>
          {loading ? 'Locating…' : '📍 Find clinics near me'}
        </button>
        <button
          className={open24h ? 'btn-primary' : 'btn-secondary'}
          onClick={toggle24h}
          disabled={loading}
          style={open24h ? { backgroundColor: '#438952' } : undefined}
        >
          {open24h ? '✓ 24/7 only' : 'Show 24/7 only'}
        </button>
      </div>

      {usedFallback && (
        <div style={{ fontSize: 'var(--fs-300)', color: '#999999' }}>
          Location unavailable — showing clinics near central Hanoi. Allow location access for accurate distances.
        </div>
      )}

      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}
      {!loading && !error && clinics.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999999' }}>No clinics found.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: 'var(--space-3)' }}>
        {clinics.map((c) => (
          <div key={c.id} className="card-standard" style={{ borderLeft: c.open24h ? '5px solid #438952' : '5px solid #E34432' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 'var(--fs-600)' }}>{c.name}</h3>
              <span style={{ fontWeight: '700', color: '#154212' }}>{c.distanceKm} km</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--fs-400)', marginTop: 'var(--space-1)' }}>
              <div>📍 {c.address}</div>
              <div>⭐ {c.rating} / 5</div>
              <div style={{ color: c.open24h ? '#438952' : '#E34432', fontWeight: '600' }}>
                {c.open24h ? '🟢 Open 24/7' : '🔴 Limited hours'}
              </div>
            </div>
            <a href={`tel:${c.phone.replace(/\s/g, '')}`} style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)', backgroundColor: '#E34432' }}>
                📞 Call {c.phone}
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
