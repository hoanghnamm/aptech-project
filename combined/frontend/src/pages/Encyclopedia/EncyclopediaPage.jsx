import React, { useState, useEffect, useCallback } from 'react';
import { getBreeds } from '../../api/breed.api';
import { trackBreedView } from '../../api/analytics.api';

export default function EncyclopediaPage() {
  const [search, setSearch] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (term) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBreeds({ search: term, limit: 60 });
      setBreeds(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load breeds.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { load(''); }, [load]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  return (
    <div className="page page-wide">
      <div>
        <h1 className="page__title">Dog Encyclopedia</h1>
        <p className="page__subtitle">
          In-depth lookup for origin, habits, and specific health issues of each dog breed.
          {total > 0 && ` (${total} breeds)`}
        </p>
      </div>

      <input
        type="text"
        className="input-text"
        placeholder="🔍 Search breeds (e.g., Husky, Poodle, Corgi)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <div style={{ textAlign: 'center', color: '#999999' }}>Loading breeds…</div>}
      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}
      {!loading && !error && breeds.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999999' }}>No breeds found for "{search}".</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))', gap: 'var(--space-3)' }}>
        {breeds.map(breed => (
          <div
            key={breed._id}
            className="card-standard"
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => trackBreedView(breed.breedName)}
            title="Viewing this breed personalizes your recommendations"
          >
            <div>
              <h3 style={{ fontSize: 'var(--fs-600)', marginBottom: 'var(--space-1)' }}>{breed.breedName}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--fs-400)', color: '#25221E' }}>
                <div>🌐 <strong>Origin:</strong> {breed.origin || 'Unknown'}</div>
                <div>⏳ <strong>Lifespan:</strong> {breed.lifeExpectancy || 'Unknown'}</div>
                <div>📏 <strong>Size:</strong> <span style={{ textTransform: 'capitalize' }}>{breed.size}</span></div>
                <div>⚡ <strong>Energy:</strong> <span style={{ textTransform: 'capitalize' }}>{breed.energyLevel}</span></div>
                {breed.temperament?.length > 0 && (
                  <div>🐾 <strong>Temperament:</strong> {breed.temperament.join(', ')}</div>
                )}
                {breed.healthIssues?.length > 0 && (
                  <div style={{ color: '#E34432' }}>⚠️ <strong>Health:</strong> {breed.healthIssues.join(', ')}</div>
                )}
              </div>
              {breed.description && (
                <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--fs-300)', color: '#6b645c', lineHeight: '1.5' }}>
                  {breed.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
