import React, { useState, useEffect } from 'react';
import { getBreeds } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../api/user.api';

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
  const { user } = useAuth();
  const [stats, setStats] = useState({ uniqueVisitors: 1, pageViews: 0, breedViews: 0, totalEvents: 0 });
  const [personalized, setPersonalized] = useState(null);
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const breedData = await getBreeds({ limit: 100 });
        const allBreeds = breedData.items || [];

        if (user) {
          // ─── CLOUD MODE: Fetch from API ───
          const prefs = await userApi.getPreferences();
          const viewedBreeds = prefs.viewedBreeds || [];

          const breedViews = viewedBreeds.reduce((acc, b) => acc + (b.viewCount || 0), 0);
          const localPageViews = Number(localStorage.getItem("pawintel_local_page_views") || "0");
          const pageViews = Math.max(1, localPageViews);
          const totalEvents = pageViews + breedViews;

          setStats({ uniqueVisitors: 1, pageViews, breedViews, totalEvents });

          // Trending from cloud data
          let cloudTrending = viewedBreeds
            .map((b) => ({ breedName: b.breedName, views: b.viewCount || 0 }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 6);

          if (cloudTrending.length === 0) {
            cloudTrending = allBreeds.slice(0, 4).map(b => ({
              breedName: b.breedName || b.name,
              views: 0
            }));
          }
          setTrendingList(cloudTrending);

          // Personalized recommendations from cloud
          if (viewedBreeds.length === 0) {
            setPersonalized({
              personalized: false,
              basedOn: [],
              recommendations: allBreeds.slice(4, 10).map(b => ({
                ...b,
                breedName: b.breedName || b.name,
                size: b.lifestyleFilters?.size || b.size || "medium",
                energyLevel: b.energyLevel || "medium",
                temperament: b.coreTraits || b.temperament || []
              }))
            });
          } else {
            const sizes = [...new Set(viewedBreeds.map(h => h.size).filter(Boolean))];
            const energies = [...new Set(viewedBreeds.map(h => h.energyLevel).filter(Boolean))];
            const viewedNames = viewedBreeds.map(h => h.breedName.toLowerCase());

            const recommendations = allBreeds
              .map(b => {
                const bSize = b.lifestyleFilters?.size || b.size || "medium";
                const bEnergy = b.energyLevel || "medium";
                return {
                  ...b,
                  breedName: b.breedName || b.name,
                  size: bSize,
                  energyLevel: bEnergy,
                  temperament: b.coreTraits || b.temperament || []
                };
              })
              .filter(b => {
                if (viewedNames.includes(b.breedName.toLowerCase())) return false;
                return sizes.includes(b.size) || energies.includes(b.energyLevel);
              })
              .slice(0, 6);

            setPersonalized({
              personalized: true,
              basedOn: viewedBreeds.map(h => h.breedName),
              recommendations
            });
          }
        } else {
          // ─── LOCAL MODE: Fallback to localStorage ───
          const localPageViews = Number(localStorage.getItem("pawintel_local_page_views") || "0");
          const localViewCounts = JSON.parse(localStorage.getItem("pawintel_local_view_counts") || "{}");
          const localHistory = JSON.parse(localStorage.getItem("pawintel_local_history") || "[]");

          const pageViews = Math.max(1, localPageViews);
          const breedViews = Object.values(localViewCounts).reduce((a, b) => a + b, 0);
          const totalEvents = pageViews + breedViews;

          setStats({ uniqueVisitors: 1, pageViews, breedViews, totalEvents });

          let localTrending = Object.entries(localViewCounts)
            .map(([breedName, views]) => ({ breedName, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 6);

          if (localTrending.length === 0) {
            localTrending = allBreeds.slice(0, 4).map(b => ({
              breedName: b.breedName || b.name,
              views: 0
            }));
          }
          setTrendingList(localTrending);

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
        }
      } catch (err) {
        setError(err?.message || 'Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="page page-wide" style={{ position: 'relative' }}>
      <div className="nutrition-bg-pattern" style={{ position: 'absolute', zIndex: -1 }}></div>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <h1 className="page__title" style={{ color: 'var(--primary-coral)' }}>Personal Insights</h1>
        <p className="page__subtitle" style={{ color: 'var(--sepia)' }}>
          {user
            ? 'Your research profile is synced across all your devices. Recommendations improve as you explore more.'
            : 'Curated botanical and biological recommendations based on your archival explorations.'}
        </p>
        {user && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: 'var(--space-1)',
            padding: '0.375rem 0.75rem',
            background: 'linear-gradient(135deg, rgba(21,66,18,0.08), rgba(45,90,39,0.08))',
            borderRadius: '9999px',
            border: '1px solid rgba(21,66,18,0.15)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#154212' }}>cloud_done</span>
            <span style={{ fontSize: 'var(--fs-300)', color: '#154212', fontWeight: 600 }}>Cloud Synced</span>
          </div>
        )}
        {!user && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: 'var(--space-1)',
            padding: '0.375rem 0.75rem',
            background: 'linear-gradient(135deg, #faf3e0, #f4eedb)',
            borderRadius: '9999px',
            border: '1px solid var(--border-color)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#625e50' }}>info</span>
            <span style={{ fontSize: 'var(--fs-300)', color: '#625e50' }}>Sign in to sync your data across devices</span>
          </div>
        )}
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
              Influenced by your studies in: {personalized.basedOn.slice(0, 5).join(', ')}{personalized.basedOn.length > 5 ? ` and ${personalized.basedOn.length - 5} more` : ''}
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
