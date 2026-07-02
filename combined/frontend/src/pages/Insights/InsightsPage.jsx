import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonalized, getTrending } from '../../api/analytics.api';

const RecordCard = ({ breed }) => (
  <div className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-6 shadow-none flex flex-col gap-2">
    <h4 className="font-headline-lg text-[20px] text-[#25221E]">{breed.breedName}</h4>
    <div className="font-body-md text-[14px] text-[#5C3A21]/85 flex flex-col gap-1">
      <div className="capitalize">📏 {breed.size} · ⚡ {breed.energyLevel} energy</div>
      {breed.origin && <div>🌐 {breed.origin}</div>}
      {breed.temperament?.length > 0 && <div>🐾 {breed.temperament.slice(0, 3).join(', ')}</div>}
    </div>
  </div>
);

const StatPlate = ({ label, value }) => (
  <div className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-6 text-center shadow-none">
    <div className="font-headline-lg text-[clamp(1.6rem,2.5vw,2rem)] text-[#25221E]">{value}</div>
    <div className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold mt-1">{label}</div>
  </div>
);

export default function InsightsPage() {
  const navigate = useNavigate();
  const [personalized, setPersonalized] = useState(null);
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [p, t] = await Promise.all([getPersonalized(), getTrending()]);
        setPersonalized(p);
        setTrending(t);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load insights.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-12 bg-[#FEFDFC] text-[#25221E] min-h-screen">
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
          Reader’s Record
        </span>
        <h1 className="font-headline-xl text-[clamp(2rem,4vw,2.75rem)] text-[#25221E] leading-tight">
          Curator’s Desk
        </h1>
        <p className="font-serif italic text-[15px] text-[#5C3A21]/85 leading-relaxed">
          Records suggested from your reading history, and the plates most consulted across the archive.
        </p>
      </header>

      {loading && <div className="text-center font-serif italic text-[#5C3A21]/60">Retrieving the record…</div>}
      {error && <div className="border-l-2 border-error bg-[#FEFDFC] p-6 font-serif italic text-error">{error}</div>}

      {/* Site stats */}
      {trending?.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatPlate label="Unique Visitors" value={trending.stats.uniqueVisitors} />
          <StatPlate label="Page Views" value={trending.stats.pageViews} />
          <StatPlate label="Breed Views" value={trending.stats.breedViews} />
          <StatPlate label="Total Events" value={trending.stats.totalEvents} />
        </div>
      )}

      {/* Personalized */}
      {personalized && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-[#25221E]/10 pb-3">
            <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
              {personalized.personalized ? 'Suggested from your reading' : 'Popular to get you started'}
            </span>
            {personalized.personalized && personalized.basedOn?.length > 0 && (
              <p className="font-serif italic text-[13px] text-[#5C3A21]/70">
                Based on your interest in: {personalized.basedOn.join(', ')}
              </p>
            )}
          </div>
          {personalized.recommendations?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalized.recommendations.map((b) => <RecordCard key={b._id} breed={b} />)}
            </div>
          ) : (
            <p className="font-serif italic text-[15px] text-[#5C3A21]/85">
              Consult the{' '}
              <button onClick={() => navigate('/encyclopedia')} className="text-[#EE6449] underline underline-offset-2 bg-transparent border-none cursor-pointer p-0 font-serif italic">
                Encyclopedia
              </button>{' '}
              to personalise this record.
            </p>
          )}
        </section>
      )}

      {/* Trending */}
      {trending?.trending?.length > 0 && (
        <section className="flex flex-col gap-5">
          <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold border-b border-[#25221E]/10 pb-3">
            Most Consulted
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.trending.map((t) => (
              <div key={t.breedName} className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm px-5 py-4 flex justify-between items-center gap-3 shadow-none">
                <span className="font-body-md font-medium text-[15px] text-[#25221E]">{t.breedName}</span>
                <span className="font-label-md text-[10px] uppercase tracking-[0.15em] text-[#5C3A21]/70">{t.views} views</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
