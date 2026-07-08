import React, { useState, useEffect } from 'react';
import { getBreeds } from '../../services/api';

const BreedCard = ({ breed }) => (
  <div className="card-standard" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
    <h4 style={{ fontSize: 'var(--fs-600)', marginBottom: 'var(--space-1)', fontFamily: 'var(--font-display)', color: 'var(--primary-coral)' }}>{breed.breedName}</h4>
    <div style={{ fontSize: 'var(--fs-400)', color: 'var(--sepia)', display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      <div style={{ textTransform: 'capitalize', display: 'flex', gap: '0.5em', flexWrap: 'wrap' }}>
        <span className="feature-tag" style={{ background: 'var(--bg-pale-beige)', color: 'var(--primary-dark)', border: '1px solid var(--border-color)' }}>{breed.size}</span>
        <span className="feature-tag" style={{ background: 'var(--bg-pale-beige)', color: 'var(--primary-dark)', border: '1px solid var(--border-color)' }}>{breed.energyLevel} Energy</span>
      </div>
      {breed.origin && <div><strong style={{ color: 'var(--wood-teak)' }}>Origin:</strong> {breed.origin}</div>}
      {breed.temperament?.length > 0 && <div><strong style={{ color: 'var(--wood-teak)' }}>Traits:</strong> {breed.temperament.slice(0, 3).join(', ')}</div>}
    </div>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="card-standard" style={{ textAlign: 'center', background: 'var(--bg-pale-beige)', border: '1px solid var(--border-color)' }}>
    <div style={{ fontSize: 'var(--fs-metric)', fontWeight: '700', color: 'var(--primary-coral)', fontFamily: 'var(--font-display)' }}>{value}</div>
    <div style={{ fontSize: 'var(--fs-300)', color: 'var(--sepia)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.25em' }}>{label}</div>
  </div>
);

export default function InsightsPage({ onNavigate }) {
  const [stats, setStats] = useState({ uniqueVisitors: 1, pageViews: 0, breedViews: 0, totalEvents: 0 });
  const [personalized, setPersonalized] = useState(null);
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Get stats from local storage
        const localPageViews = Number(localStorage.getItem("pawintel_local_page_views") || "0");
        const localViewCounts = JSON.parse(localStorage.getItem("pawintel_local_view_counts") || "{}");
        const localHistory = JSON.parse(localStorage.getItem("pawintel_local_history") || "[]");

        const pageViews = Math.max(1, localPageViews);
        const breedViews = Object.values(localViewCounts).reduce((a, b) => a + b, 0);
        const totalEvents = pageViews + breedViews;

        setStats({
          uniqueVisitors: 1,
          pageViews,
          breedViews,
          totalEvents
        });

        // 2. Highly Researched Subjects (Trending)
        let localTrending = Object.entries(localViewCounts)
          .map(([breedName, views]) => ({ breedName, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 6);

        // If client has no views yet, query all breeds and use first 4 as default trending fallbacks
        const breedData = await getBreeds({ limit: 100 });
        const allBreeds = breedData.items || [];

        if (localTrending.length === 0) {
          localTrending = allBreeds.slice(0, 4).map(b => ({
            breedName: b.breedName || b.name,
            views: 0
          }));
        }
        setTrendingList(localTrending);

        // 3. Personalized recommendations
        if (localHistory.length === 0) {
          setPersonalized({
            personalized: false,
            basedOn: [],
            recommendations: allBreeds.slice(4, 10).map(b => ({
              ...b,
              breedName: b.breedName || b.name,
              size: b.lifestyleFilters?.size || b.size || "medium",
              energyLevel: b.energyLevel || (b.comparisonMetrics?.energyLevel === 5 ? "high" : b.comparisonMetrics?.energyLevel === 3 ? "medium" : "low"),
              temperament: b.coreTraits || b.temperament || []
            }))
          });
        } else {
          const sizes = [...new Set(localHistory.map(h => h.size).filter(Boolean))];
          const energies = [...new Set(localHistory.map(h => h.energyLevel).filter(Boolean))];

          const recommendations = allBreeds
            .map(b => {
              const bSize = b.lifestyleFilters?.size || b.size || "medium";
              const bEnergyText = b.energyLevel || (b.comparisonMetrics?.energyLevel === 5 ? "high" : b.comparisonMetrics?.energyLevel === 3 ? "medium" : "low");
              return {
                ...b,
                breedName: b.breedName || b.name,
                size: bSize,
                energyLevel: bEnergyText,
                temperament: b.coreTraits || b.temperament || []
              };
            })
            .filter(b => {
              const isAlreadyViewed = localHistory.some(h => h.breedName === b.breedName);
              if (isAlreadyViewed) return false;

              const sizeMatch = sizes.includes(b.size);
              const energyMatch = energies.includes(b.energyLevel) || energies.includes(b.comparisonMetrics?.energyLevel);

              return sizeMatch || energyMatch;
            })
            .slice(0, 6);

          setPersonalized({
            personalized: true,
            basedOn: localHistory.map(h => h.breedName),
            recommendations
          });
        }
      } catch (err) {
        setError(err?.message || 'Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocalData();
  }, []);

  return (
    <div className="page page-wide" style={{ position: 'relative' }}>
      <div className="nutrition-bg-pattern" style={{ position: 'absolute', zIndex: -1 }}></div>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <h1 className="page__title" style={{ color: 'var(--primary-coral)' }}>Personal Insights</h1>
        <p className="page__subtitle" style={{ color: 'var(--sepia)' }}>
          Curated botanical and biological recommendations based on your archival explorations.
        </p>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--sepia)', fontStyle: 'italic' }}>Consulting archives...</div>}
      {error && <div style={{ color: 'var(--error-state)', textAlign: 'center', fontWeight: '600', background: 'var(--bg-pale-beige)', padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>⚠️ {error}</div>}

      {/* Site stats */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 9rem), 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <StatBox label="Unique Visitors" value={stats.uniqueVisitors} />
          <StatBox label="Page Views" value={stats.pageViews} />
          <StatBox label="Records Viewed" value={stats.breedViews} />
          <StatBox label="Total Interactions" value={stats.totalEvents} />
        </div>
      )}

      {/* Personalized recommendations */}
      {personalized && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
             <h3 style={{ fontSize: 'var(--fs-600)', fontFamily: 'var(--font-display)', color: 'var(--primary-coral)', margin: 0 }}>
               {personalized.personalized ? 'Curated For You' : 'Popular Expeditions'}
             </h3>
          </div>
          
          {personalized.personalized && personalized.basedOn?.length > 0 && (
            <p style={{ fontSize: 'var(--fs-300)', color: 'var(--sepia)', marginBottom: 'var(--space-3)', fontStyle: 'italic' }}>
              Influenced by your studies in: {personalized.basedOn.join(', ')}
            </p>
          )}
          {personalized.recommendations?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))', gap: 'var(--space-3)' }}>
              {personalized.recommendations.map((b) => <BreedCard key={b.breedId || b._id} breed={b} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--bg-white)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--sepia)', marginBottom: 'var(--space-2)' }}>
                Your research dossier is currently empty.
              </p>
              <button className="btn-secondary" onClick={() => onNavigate?.('encyclopedia')}>
                Explore the Encyclopedia
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trending */}
      {trendingList.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
             <h3 style={{ fontSize: 'var(--fs-600)', fontFamily: 'var(--font-display)', color: 'var(--primary-coral)', margin: 0 }}>
               Highly Researched Subjects
             </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))', gap: 'var(--space-3)' }}>
            {trendingList.map((t) => (
              <div key={t.breedName} className="card-standard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', border: '1px solid var(--border-color)', background: 'var(--bg-white)' }}>
                <span style={{ fontWeight: '600', color: 'var(--primary-dark)', fontFamily: 'var(--font-ui)' }}>{t.breedName}</span>
                <span className="feature-tag" style={{ background: 'var(--bg-pale-beige)', color: 'var(--sepia)', border: '1px solid var(--border-color)' }}>{t.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
