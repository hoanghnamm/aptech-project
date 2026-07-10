import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBreeds } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../api/user.api';
import { FunFactBanner } from '../../components/funfact/FunFactBanner';

const BreedCard = ({ breed, onClick }) => (
  <article
    onClick={onClick}
    className="group cursor-pointer border border-secondary/20 p-4 flex flex-col gap-4 bg-surface hover:bg-surface-container transition-colors shadow-none relative"
  >
    <div className="absolute inset-1 border border-secondary/10 pointer-events-none" />

    <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border border-secondary/10 shadow-none z-10">
      <img
        alt={`${breed.breedName} profile`}
        className="w-full h-full object-cover filter grayscale-[15%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-700"
        src={breed.thumbnail || "https://placehold.co/600x450/efe8d5/154212?text=No+Image"}
        loading="lazy"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <span className="px-2.5 py-1 bg-terracotta-accent/25 text-ink-text font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-none backdrop-blur-md shadow-none">
          {breed.size} Size
        </span>
        <span className="px-2.5 py-1 bg-secondary/10 text-on-surface-variant font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-none backdrop-blur-md shadow-none">
          {breed.energyLevel} Energy
        </span>
      </div>
    </div>
    
    <div className="flex flex-col gap-1 relative z-10">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">
        {breed.breedName}
      </h2>
      
      {breed.origin && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="material-symbols-outlined text-[14px] text-primary">public</span>
          <span className="font-body-sm text-on-surface-variant italic">
            <span className="font-semibold not-italic mr-1">Origin:</span> {breed.origin}
          </span>
        </div>
      )}

      {breed.temperament?.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="font-label-md uppercase tracking-widest text-primary/50 text-[10px]">
            Key Traits
          </span>
          <div className="flex flex-wrap gap-1.5">
            {breed.temperament.slice(0, 3).map((trait, idx) => (
              <span key={idx} className="font-body-sm text-[11px] bg-surface-container border border-secondary/15 text-on-surface-variant px-2 py-0.5 rounded-none">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
    <div className="mt-auto border-t border-secondary/20 pt-3 flex justify-between items-center relative z-10">
      <span className="font-body-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
        View Record
      </span>
      <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary transition-colors">
        arrow_forward
      </span>
    </div>
  </article>
);

const StatBox = ({ label, value }) => (
  <div className="relative bg-surface border border-secondary/20 p-4 md:p-6 flex flex-col items-center justify-center transition-colors hover:bg-surface-container group">
    <div className="absolute inset-1 border border-secondary/10 pointer-events-none" />
    <div className="relative z-10 font-headline-xl text-primary group-hover:text-surface-tint transition-colors">{value}</div>
    <div className="relative z-10 font-label-md text-on-surface-variant uppercase tracking-widest mt-2">{label}</div>
  </div>
);

export default function InsightsPage({ onNavigate }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ uniqueVisitors: 1, pageViews: 0, breedViews: 0, totalEvents: 0 });
  const [personalized, setPersonalized] = useState(null);
  const [trendingList, setTrendingList] = useState([]);
  const [allBreeds, setAllBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBreedClick = (breedNameOrId) => {
    const found = allBreeds.find(
      (b) => 
        b.breedId === breedNameOrId || 
        b._id === breedNameOrId || 
        b.breedName?.toLowerCase() === breedNameOrId?.toLowerCase() ||
        b.name?.toLowerCase() === breedNameOrId?.toLowerCase()
    );
    if (found) {
      navigate(`/breeds/${found.breedId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch up to 100 breeds from backend to use as a pool
        const breedData = await getBreeds({ limit: 100 });
        const items = breedData.items || [];
        setAllBreeds(items);
        
        // Shuffle the pool completely so recommendations aren't stuck alphabetically
        const allBreedsLocal = [...items].sort(() => 0.5 - Math.random());

        if (user) {
          // ─── CLOUD MODE: Fetch from API ───
          const prefs = await userApi.getPreferences();
          const viewedBreeds = prefs.viewedBreeds || [];

          // Merge duplicate names in viewedBreeds (e.g. trailing spaces)
          const mergedCloud = {};
          viewedBreeds.forEach(b => {
            const cleanName = (b.breedName || "").trim();
            if (cleanName) mergedCloud[cleanName] = (mergedCloud[cleanName] || 0) + (b.viewCount || 0);
          });
          const breedViews = Object.values(mergedCloud).reduce((acc, count) => acc + count, 0);

          const localPageViews = Number(localStorage.getItem("pawintel_local_page_views") || "0");
          const pageViews = Math.max(1, localPageViews);
          const totalEvents = pageViews + breedViews;

          setStats({ uniqueVisitors: 1, pageViews, breedViews, totalEvents });

          // Trending from cloud data
          let cloudTrending = Object.entries(mergedCloud)
            .map(([breedName, views]) => ({ breedName, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 6);

          if (cloudTrending.length === 0) {
            cloudTrending = allBreedsLocal.slice(0, 4).map(b => ({
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
              recommendations: allBreedsLocal.slice(0, 6).map(b => ({
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
            const viewedNames = Object.keys(mergedCloud).map(n => n.toLowerCase());

            const recommendations = allBreedsLocal
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
                if (viewedNames.includes(b.breedName.toLowerCase().trim())) return false;
                return sizes.includes(b.size) || energies.includes(b.energyLevel);
              })
              .slice(0, 6);

            // If not enough recommendations matching preferences, fill with random ones
            if (recommendations.length < 6) {
               const extra = allBreedsLocal.filter(b => 
                 !viewedNames.includes((b.breedName || b.name).toLowerCase().trim()) &&
                 !recommendations.find(r => r._id === b._id)
               ).slice(0, 6 - recommendations.length);
               recommendations.push(...extra.map(b => ({
                 ...b,
                 breedName: b.breedName || b.name,
                 size: b.lifestyleFilters?.size || b.size || "medium",
                 energyLevel: b.energyLevel || "medium",
                 temperament: b.coreTraits || b.temperament || []
               })));
            }

            setPersonalized({
              personalized: true,
              basedOn: Object.keys(mergedCloud),
              recommendations
            });
          }
        } else {
          // ─── LOCAL MODE: Fallback to localStorage ───
          const localPageViews = Number(localStorage.getItem("pawintel_local_page_views") || "0");
          const rawLocalViewCounts = JSON.parse(localStorage.getItem("pawintel_local_view_counts") || "{}");
          
          // Merge duplicates
          const localViewCounts = {};
          Object.entries(rawLocalViewCounts).forEach(([name, count]) => {
            const cleanName = name.trim();
            if (cleanName) localViewCounts[cleanName] = (localViewCounts[cleanName] || 0) + count;
          });

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
            localTrending = allBreedsLocal.slice(0, 4).map(b => ({
              breedName: b.breedName || b.name,
              views: 0
            }));
          }
          setTrendingList(localTrending);

          if (localHistory.length === 0) {
            setPersonalized({
              personalized: false,
              basedOn: [],
              recommendations: allBreedsLocal.slice(0, 6).map(b => ({
                ...b,
                breedName: b.breedName || b.name,
                size: b.lifestyleFilters?.size || b.size || "medium",
                energyLevel: b.energyLevel || (b.comparisonMetrics?.energyLevel >= 4 ? "high" : b.comparisonMetrics?.energyLevel === 3 ? "medium" : "low"),
                temperament: b.coreTraits || b.temperament || []
              }))
            });
          } else {
            const sizes = [...new Set(localHistory.map(h => h.size).filter(Boolean))];
            const energies = [...new Set(localHistory.map(h => h.energyLevel).filter(Boolean))];

            const recommendations = allBreedsLocal
              .map(b => {
                const bSize = b.lifestyleFilters?.size || b.size || "medium";
                const bEnergyText = b.energyLevel || (b.comparisonMetrics?.energyLevel >= 4 ? "high" : b.comparisonMetrics?.energyLevel === 3 ? "medium" : "low");
                return {
                  ...b,
                  breedName: b.breedName || b.name,
                  size: bSize,
                  energyLevel: bEnergyText,
                  temperament: b.coreTraits || b.temperament || []
                };
              })
              .filter(b => {
                const isAlreadyViewed = localHistory.some(h => h.breedName.trim().toLowerCase() === b.breedName.trim().toLowerCase());
                if (isAlreadyViewed) return false;
                const sizeMatch = sizes.includes(b.size);
                const energyMatch = energies.includes(b.energyLevel) || energies.includes(b.comparisonMetrics?.energyLevel);
                return sizeMatch || energyMatch;
              })
              .slice(0, 6);

            if (recommendations.length < 6) {
               const viewedNames = localHistory.map(h => h.breedName.trim().toLowerCase());
               const extra = allBreedsLocal.filter(b => 
                 !viewedNames.includes((b.breedName || b.name).trim().toLowerCase()) &&
                 !recommendations.find(r => r._id === b._id)
               ).slice(0, 6 - recommendations.length);
               recommendations.push(...extra.map(b => ({
                 ...b,
                 breedName: b.breedName || b.name,
                 size: b.lifestyleFilters?.size || b.size || "medium",
                 energyLevel: b.energyLevel || (b.comparisonMetrics?.energyLevel >= 4 ? "high" : b.comparisonMetrics?.energyLevel === 3 ? "medium" : "low"),
                 temperament: b.coreTraits || b.temperament || []
               })));
            }

            setPersonalized({
              personalized: true,
              basedOn: Object.keys(localViewCounts),
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

      {/* Fun Facts Section */}
      <div className="mb-8">
        <FunFactBanner />
      </div>

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
              {personalized.recommendations.map((b) => (
                <BreedCard 
                  key={b.breedId || b._id} 
                  breed={b} 
                  onClick={() => handleBreedClick(b.breedId || b._id || b.breedName)} 
                />
              ))}
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
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-secondary/20">
             <h3 className="font-headline-lg-mobile md:font-headline-lg text-primary m-0">
               Highly Researched Subjects
             </h3>
          </div>
          <div className="card-encyclopedia overflow-hidden">
            <table className="w-full text-left border-collapse relative z-10">
              <thead>
                <tr className="bg-surface-container-low border-b border-secondary/20">
                  <th className="py-4 px-6 font-label-md uppercase tracking-widest text-[11px] text-on-surface-variant w-16 text-center">Rank</th>
                  <th className="py-4 px-6 font-label-md uppercase tracking-widest text-[11px] text-on-surface-variant">Subject Name</th>
                  <th className="py-4 px-6 font-label-md uppercase tracking-widest text-[11px] text-on-surface-variant w-1/3 hidden md:table-cell">Research Volume</th>
                </tr>
              </thead>
              <tbody>
                {trendingList.map((t, index) => {
                  const maxTrendingViews = Math.max(...trendingList.map(item => item.views));
                  const percentage = Math.max(5, (t.views / maxTrendingViews) * 100);
                  return (
                    <tr 
                      key={t.breedName}
                      onClick={() => handleBreedClick(t.breedName)}
                      className="group border-b border-secondary/10 hover:bg-surface-container cursor-pointer transition-colors last:border-b-0"
                    >
                      <td className="py-4 px-6 font-display font-semibold text-lg text-secondary/40 group-hover:text-terracotta-accent transition-colors text-center">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-headline-lg-mobile md:font-headline-lg text-[18px] text-primary group-hover:text-surface-tint transition-colors">
                          {t.breedName}
                        </div>
                        {/* Mobile view volume indicator */}
                        <div className="md:hidden mt-2 flex items-center gap-2">
                          <span className="font-label-md text-on-surface-variant text-[10px]">{t.views} inquiries</span>
                          <div className="w-24 h-1 bg-surface-container-high overflow-hidden">
                            <div className="h-full bg-primary/40 group-hover:bg-terracotta-accent transition-all duration-500" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex items-center gap-3">
                          <span className="font-label-md text-on-surface-variant w-16 text-right tabular-nums tracking-wider">{t.views}</span>
                          <div className="flex-1 h-1.5 bg-surface-container-high rounded-none overflow-hidden flex border border-secondary/10">
                            <div 
                              className="h-full bg-primary/40 group-hover:bg-terracotta-accent transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
