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
    if (!navigator.geolocation) { fetchClinics(null, null, only24h); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchClinics(pos.coords.latitude, pos.coords.longitude, only24h),
      () => fetchClinics(null, null, only24h),
      { timeout: 8000 }
    );
  }, [fetchClinics]);

  useEffect(() => { locateAndFetch(false); }, [locateAndFetch]);

  const toggle24h = () => {
    const next = !open24h;
    setOpen24h(next);
    locateAndFetch(next);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-12 bg-[#FEFDFC] text-[#25221E] min-h-screen">
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
          Emergency Directory
        </span>
        <h1 className="font-headline-xl text-[clamp(2rem,4vw,2.75rem)] text-[#25221E] leading-tight">
          Veterinary Registry
        </h1>
        <p className="font-serif italic text-[15px] text-[#5C3A21]/85 leading-relaxed">
          Clinics on record near your location, sorted by distance. For emergencies, telephone ahead
          before travelling.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={() => locateAndFetch(open24h)}
          disabled={loading}
          className="bg-[#EE6449] hover:bg-[#F07459] disabled:opacity-60 text-white font-label-md uppercase tracking-[0.15em] text-[11px] py-4 px-8 rounded-sm shadow-none transition-colors cursor-pointer border-none"
        >
          {loading ? 'Locating…' : 'Locate nearby clinics'}
        </button>
        <button
          onClick={toggle24h}
          disabled={loading}
          className={`font-label-md uppercase tracking-[0.15em] text-[11px] py-4 px-8 rounded-sm transition-colors cursor-pointer ${
            open24h
              ? 'bg-[#25221E] text-white border-none'
              : 'bg-transparent border border-[#25221E]/20 text-[#25221E] hover:bg-[#25221E]/5'
          }`}
        >
          {open24h ? '✓ 24/7 only' : 'Show 24/7 only'}
        </button>
      </div>

      {usedFallback && (
        <p className="font-serif italic text-[13px] text-[#5C3A21]/60 -mt-6">
          Location unavailable — showing clinics near central Hanoi. Allow location access for accurate distances.
        </p>
      )}
      {error && <div className="border-l-2 border-error bg-[#FEFDFC] p-6 font-serif italic text-error">{error}</div>}
      {!loading && !error && clinics.length === 0 && (
        <div className="border border-dashed border-[#25221E]/15 rounded-sm p-12 text-center font-serif italic text-[#5C3A21]/60">No clinics on record.</div>
      )}

      {/* Clinic ledger cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {clinics.map((c) => (
          <article
            key={c.id}
            className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none flex flex-col gap-4"
            style={{ borderLeft: `3px solid ${c.open24h ? '#4c8a54' : '#c0492e'}` }}
          >
            <div className="flex justify-between items-baseline gap-3 flex-wrap border-b border-[#25221E]/10 pb-4">
              <h3 className="font-headline-lg text-[22px] text-[#25221E]">{c.name}</h3>
              <span className="font-label-md text-[13px] uppercase tracking-[0.15em] text-[#EE6449] font-bold">{c.distanceKm} km</span>
            </div>
            <div className="flex flex-col gap-2 font-body-md text-[15px] text-[#25221E]/90">
              <div className="flex justify-between gap-4 border-b border-[#25221E]/5 py-1"><span className="text-[#25221E]/60">Address</span><span className="text-right">{c.address}</span></div>
              <div className="flex justify-between gap-4 border-b border-[#25221E]/5 py-1"><span className="text-[#25221E]/60">Rating</span><span>⭐ {c.rating} / 5</span></div>
              <div className="flex justify-between gap-4 py-1">
                <span className="text-[#25221E]/60">Status</span>
                <span className="font-medium" style={{ color: c.open24h ? '#4c8a54' : '#c0492e' }}>
                  {c.open24h ? 'Open 24/7' : 'Limited hours'}
                </span>
              </div>
            </div>
            <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="mt-1">
              <button className="w-full bg-[#25221E] hover:bg-[#4E3629] text-white font-label-md uppercase tracking-[0.15em] text-[11px] py-4 rounded-sm transition-colors cursor-pointer border-none">
                Telephone {c.phone}
              </button>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
