import React, { useState } from 'react';
import { smartSearch } from '../../api/search.api';

const EXAMPLES = [
  'friendly dogs for kids',
  'low shedding apartment dogs',
  'calm small dogs for seniors',
  'high energy dogs for running',
  'protective guard dogs',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (q) => {
    const term = (q ?? query).trim();
    if (!term) return;
    setQuery(term);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await smartSearch(term);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => { e.preventDefault(); run(); };

  const f = result?.interpreted?.filters || {};
  const kw = result?.interpreted?.keywords || [];
  const chips = [
    f.size && `size: ${f.size}`,
    f.energyLevel && `energy: ${f.energyLevel}`,
    f.sheddingLevel && `shedding: ${f.sheddingLevel}`,
    f.familyFriendly === true && 'family-friendly',
    f.apartmentFriendly === true && 'apartment-friendly',
    ...kw.map((k) => `“${k}”`),
  ].filter(Boolean);

  return (
    <div className="page page-wide">
      <div>
        <h1 className="page__title">Smart Breed Search</h1>
        <p className="page__subtitle">
          Ask in plain language — our AI understands what you mean and finds matching breeds.
        </p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="input-text"
          style={{ flex: 1, minWidth: '12rem' }}
          placeholder='e.g. "friendly low shedding dogs for apartments"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary" style={{ flexShrink: 0 }} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Example chips */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="feature-tag"
            style={{ cursor: 'pointer', border: '1px solid var(--border-color)' }}
            onClick={() => run(ex)}
          >
            {ex}
          </button>
        ))}
      </div>

      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}

      {result && (
        <>
          {chips.length > 0 && (
            <div style={{ fontSize: 'var(--fs-400)', color: '#6b645c' }}>
              Interpreted as: {chips.join(' • ')}
            </div>
          )}
          <div style={{ fontWeight: '600' }}>{result.total} breed(s) found</div>

          {result.total === 0 ? (
            <div style={{ textAlign: 'center', color: '#999999' }}>
              No breeds matched. Try rephrasing your search.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))', gap: 'var(--space-3)' }}>
              {result.items.map((breed) => (
                <div key={breed._id} className="card-standard">
                  <h3 style={{ fontSize: 'var(--fs-600)', marginBottom: 'var(--space-1)' }}>{breed.breedName}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--fs-400)', color: '#1e1c10' }}>
                    <div>📏 <strong>Size:</strong> <span style={{ textTransform: 'capitalize' }}>{breed.size}</span></div>
                    <div>⚡ <strong>Energy:</strong> <span style={{ textTransform: 'capitalize' }}>{breed.energyLevel}</span></div>
                    <div>🧼 <strong>Shedding:</strong> <span style={{ textTransform: 'capitalize' }}>{breed.sheddingLevel}</span></div>
                    {breed.temperament?.length > 0 && (
                      <div>🐾 <strong>Temperament:</strong> {breed.temperament.join(', ')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
