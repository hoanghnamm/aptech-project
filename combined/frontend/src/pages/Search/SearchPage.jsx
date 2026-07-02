import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { smartSearch } from '../../api/search.api';

const EXAMPLES = [
  'Friendly dogs for kids',
  'Dogs suitable for hot weather',
  'Low shedding dog breeds',
  'Cuddly small lap dogs',
  'Good guard dogs for a family',
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
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-container text-primary font-body-sm text-[0.72rem] font-bold uppercase tracking-wider">
          <SearchIcon size={14} /> Smart Search
        </span>
        <h1 className="font-headline-xl text-on-surface text-[clamp(2.25rem,5.5vw,3.75rem)] leading-tight max-w-[20ch]">
          Just describe the dog you want.
        </h1>
        <p className="font-body-md text-on-surface-variant text-[1.1rem]">
          No filters needed — say it like you'd say it to a friend.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={submit} className="w-full max-w-[46rem] mx-auto">
        <div className="flex items-center gap-2 bg-surface-container-lowest border border-primary/15 rounded-full pl-5 pr-2 py-2 shadow-[0_12px_36px_-20px_rgba(61,43,31,0.35)] focus-within:border-primary/40 transition-colors">
          <SearchIcon size={20} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-body-md text-on-surface py-2 placeholder:text-on-surface-variant/70"
            placeholder="e.g. quiet dogs for a small apartment"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 bg-primary hover:bg-[#b65a3d] disabled:opacity-60 text-on-tertiary font-body-md font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer border-none"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {/* Example chips */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => run(ex)}
            className="bg-primary-container/70 hover:bg-primary-container text-on-surface font-body-sm px-4 py-2 rounded-full cursor-pointer border-none transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-center text-error font-semibold">⚠️ {error}</div>
      )}

      {result && (
        <div className="flex flex-col gap-4 w-full max-w-[62rem] mx-auto">
          {chips.length > 0 && (
            <div className="font-body-md text-on-surface-variant text-center">
              Interpreted as: {chips.join(' • ')}
            </div>
          )}
          <div className="font-body-md font-semibold text-on-surface">{result.total} breed(s) found</div>

          {result.total === 0 ? (
            <div className="text-center text-on-surface-variant py-8">
              No breeds matched. Try rephrasing your search.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((breed) => (
                <div key={breed._id} className="bg-surface-container-lowest border border-primary/10 rounded-2xl p-5 flex flex-col gap-2">
                  <h3 className="font-headline-lg text-on-surface text-[1.4rem]">{breed.breedName}</h3>
                  <div className="flex flex-col gap-1 font-body-md text-on-surface-variant">
                    <div>📏 <strong className="text-on-surface">Size:</strong> <span className="capitalize">{breed.size}</span></div>
                    <div>⚡ <strong className="text-on-surface">Energy:</strong> <span className="capitalize">{breed.energyLevel}</span></div>
                    <div>🧼 <strong className="text-on-surface">Shedding:</strong> <span className="capitalize">{breed.sheddingLevel}</span></div>
                    {breed.temperament?.length > 0 && (
                      <div>🐾 <strong className="text-on-surface">Temperament:</strong> {breed.temperament.join(', ')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
