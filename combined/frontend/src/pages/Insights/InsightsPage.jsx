import React, { useState, useEffect } from 'react';
import { getPersonalized, getTrending } from '../../api/analytics.api';

const BreedCard = ({ breed }) => (
  <div className="card-standard">
    <h4 style={{ fontSize: 'var(--fs-600)', marginBottom: 'var(--space-1)' }}>{breed.breedName}</h4>
    <div style={{ fontSize: 'var(--fs-400)', color: '#6b645c', display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
      <div style={{ textTransform: 'capitalize' }}>📏 {breed.size} • ⚡ {breed.energyLevel} energy</div>
      {breed.origin && <div>🌐 {breed.origin}</div>}
      {breed.temperament?.length > 0 && <div>🐾 {breed.temperament.slice(0, 3).join(', ')}</div>}
    </div>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="card-standard" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 'var(--fs-metric)', fontWeight: '700', color: '#EE6449' }}>{value}</div>
    <div style={{ fontSize: 'var(--fs-300)', color: '#999999', fontWeight: '600' }}>{label}</div>
  </div>
);

export default function InsightsPage({ onNavigate }) {
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
    <div className="page page-wide">
      <div>
        <h1 className="page__title">For You</h1>
        <p className="page__subtitle">
          Personalized breed suggestions based on what you've explored, plus what's trending across PawIntel.
        </p>
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#999999' }}>Loading your insights…</div>}
      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}

      {/* Site stats */}
      {trending?.stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 9rem), 1fr))', gap: 'var(--space-2)' }}>
          <StatBox label="UNIQUE VISITORS" value={trending.stats.uniqueVisitors} />
          <StatBox label="PAGE VIEWS" value={trending.stats.pageViews} />
          <StatBox label="BREED VIEWS" value={trending.stats.breedViews} />
          <StatBox label="TOTAL EVENTS" value={trending.stats.totalEvents} />
        </div>
      )}

      {/* Personalized recommendations */}
      {personalized && (
        <div>
          <h3 style={{ fontSize: 'var(--fs-600)', marginBottom: 'var(--space-2)' }}>
            {personalized.personalized ? 'Recommended for you' : 'Popular picks to get you started'}
          </h3>
          {personalized.personalized && personalized.basedOn?.length > 0 && (
            <p style={{ fontSize: 'var(--fs-300)', color: '#999999', marginBottom: 'var(--space-2)' }}>
              Based on your interest in: {personalized.basedOn.join(', ')}
            </p>
          )}
          {personalized.recommendations?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))', gap: 'var(--space-3)' }}>
              {personalized.recommendations.map((b) => <BreedCard key={b._id} breed={b} />)}
            </div>
          ) : (
            <p style={{ color: '#999999' }}>
              Browse the{' '}
              <button className="btn-secondary" style={{ padding: '0.3em 0.8em' }} onClick={() => onNavigate?.('encyclopedia')}>
                Encyclopedia
              </button>{' '}
              to personalize this page.
            </p>
          )}
        </div>
      )}

      {/* Trending */}
      {trending?.trending?.length > 0 && (
        <div>
          <h3 style={{ fontSize: 'var(--fs-600)', marginBottom: 'var(--space-2)' }}>🔥 Trending breeds</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))', gap: 'var(--space-2)' }}>
            {trending.trending.map((t) => (
              <div key={t.breedName} className="card-standard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-1)' }}>
                <span style={{ fontWeight: '600' }}>{t.breedName}</span>
                <span className="feature-tag">{t.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
