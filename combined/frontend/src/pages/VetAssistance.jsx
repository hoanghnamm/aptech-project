import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { PageHeading, Spinner, ErrorNote, GhostButton } from "@/components/ui";
import { getNearbyClinics } from "@/services/api";

export default function VetAssistance() {
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
      setError(err?.response?.data?.message || err?.message || "Failed to load clinics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const locateAndFetch = useCallback(
    (only24h) => {
      if (!navigator.geolocation) {
        fetchClinics(null, null, only24h);
        return;
      }
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchClinics(pos.coords.latitude, pos.coords.longitude, only24h),
        () => fetchClinics(null, null, only24h),
        { timeout: 8000 }
      );
    },
    [fetchClinics]
  );

  useEffect(() => {
    locateAndFetch(false);
  }, [locateAndFetch]);

  const toggle24h = () => {
    const next = !open24h;
    setOpen24h(next);
    locateAndFetch(next);
  };

  return (
    <Layout>
      <PageHeading
        title="Clinical Directory"
        subtitle="Locate veterinary clinics near you, ranked by distance. For emergencies, telephone ahead before travelling."
      />

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <GhostButton onClick={() => locateAndFetch(open24h)} disabled={loading} active>
          {loading ? "Locating…" : "📍 Find clinics near me"}
        </GhostButton>
        <GhostButton onClick={toggle24h} disabled={loading} active={open24h}>
          {open24h ? "✓ 24/7 only" : "Show 24/7 only"}
        </GhostButton>
      </div>

      {usedFallback && (
        <p className="text-center font-body-sm text-secondary italic mb-6">
          Location unavailable — showing clinics near central Hanoi. Allow location access for accurate distances.
        </p>
      )}

      {loading && <Spinner label="Triangulating nearby clinics…" />}
      {error && <ErrorNote>{error}</ErrorNote>}
      {!loading && !error && clinics.length === 0 && (
        <div className="text-center font-body-md text-on-surface-variant italic py-12">No clinics found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {clinics.map((c) => (
          <article
            key={c.id}
            className="bg-surface-container-lowest border border-secondary/20 rounded-sm p-6 flex flex-col gap-3"
            style={{ borderLeft: `5px solid ${c.open24h ? "#154212" : "#582d21"}` }}
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-headline-lg text-[22px] text-primary">{c.name}</h3>
              <span className="font-label-md text-tertiary whitespace-nowrap">{c.distanceKm} km</span>
            </div>
            <div className="flex flex-col gap-1.5 font-body-sm text-on-surface-variant">
              <div>📍 {c.address}</div>
              <div>⭐ {c.rating} / 5</div>
              <div className={`font-semibold ${c.open24h ? "text-primary" : "text-tertiary"}`}>
                {c.open24h ? "🟢 Open 24/7" : "🔴 Limited hours"}
              </div>
            </div>
            <a href={`tel:${(c.phone || "").replace(/\s/g, "")}`} className="mt-auto">
              <button className="w-full bg-primary text-white font-label-md uppercase tracking-[0.15em] py-3 rounded-sm hover:bg-[#0f2e0d] transition-colors border-none cursor-pointer">
                📞 Call {c.phone}
              </button>
            </a>
          </article>
        ))}
      </div>
    </Layout>
  );
}
