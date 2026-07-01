import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeading, Spinner, ErrorNote, Chip } from "@/components/ui";
import { smartSearch, trackBreedView } from "@/services/api";

const EXAMPLES = [
  "friendly dogs for kids",
  "low shedding apartment dogs",
  "calm small dogs for seniors",
  "high energy dogs for running",
  "protective guard dogs",
];

export default function SmartSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
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
      setResult(await smartSearch(term));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    run();
  };

  const f = result?.interpreted?.filters || {};
  const kw = result?.interpreted?.keywords || [];
  const chips = [
    f.size && `size: ${f.size}`,
    f.energyLevel && `energy: ${f.energyLevel}`,
    f.sheddingLevel && `shedding: ${f.sheddingLevel}`,
    f.familyFriendly === true && "family-friendly",
    f.apartmentFriendly === true && "apartment-friendly",
    ...kw.map((k) => `"${k}"`),
  ].filter(Boolean);

  const openBreed = (name) => {
    trackBreedView(name);
    navigate(`/breeds/${encodeURIComponent(name)}`);
  };

  return (
    <Layout>
      <PageHeading
        title="Semantic Search"
        subtitle="Describe what you're looking for in plain language. The archive interprets your intent and retrieves matching specimens."
      />

      <form onSubmit={submit} className="max-w-2xl mx-auto flex gap-3 flex-wrap">
        <input
          type="text"
          className="flex-1 min-w-[12rem] bg-surface-container-high border-b border-secondary/30 focus:border-primary px-4 py-3 bg-transparent font-body-md placeholder:text-on-surface-variant/60 outline-none transition-colors rounded-t-sm"
          placeholder='e.g. "friendly low shedding dogs for apartments"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white font-label-md uppercase tracking-[0.15em] px-8 py-3 rounded-sm hover:bg-[#0f2e0d] transition-colors border-none cursor-pointer disabled:opacity-40"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      <div className="max-w-2xl mx-auto mt-5 flex flex-wrap gap-2 justify-center">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => run(ex)}
            className="font-label-md uppercase tracking-widest text-[10px] text-secondary border border-secondary/20 rounded-sm px-3 py-1.5 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-transparent"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-12">
        {loading && <Spinner label="Interpreting your query…" />}
        {error && <ErrorNote>{error}</ErrorNote>}

        {result && !loading && (
          <>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-center mb-6">
                <span className="font-label-md text-secondary uppercase tracking-widest text-[10px]">
                  Interpreted as
                </span>
                {chips.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </div>
            )}
            <p className="text-center font-body-md text-on-surface-variant mb-8">
              {result.total} specimen(s) found
            </p>

            {result.total === 0 ? (
              <div className="text-center font-body-md text-on-surface-variant italic py-12">
                No specimens matched. Try rephrasing your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {result.items.map((breed) => (
                  <article
                    key={breed._id}
                    onClick={() => openBreed(breed.breedName)}
                    className="group cursor-pointer border border-secondary/20 p-6 flex flex-col gap-3 bg-surface hover:bg-surface-container transition-colors rounded-sm"
                  >
                    <h3 className="font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">
                      {breed.breedName}
                    </h3>
                    <div className="flex flex-col gap-1 font-body-sm text-on-surface-variant">
                      <span className="capitalize">📏 Size: {breed.size}</span>
                      <span className="capitalize">⚡ Energy: {breed.energyLevel}</span>
                      <span className="capitalize">🧼 Shedding: {breed.sheddingLevel}</span>
                      {breed.temperament?.length > 0 && (
                        <span>🐾 {breed.temperament.join(", ")}</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
