import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/ui";
import { getBreeds, trackBreedView } from "@/services/api";

const FILTER_GROUPS = [
  { key: "size", title: "Morphology Size", options: ["small", "medium", "large", "giant"] },
  { key: "energyLevel", title: "Kinetic Energy", options: ["low", "medium", "high"] },
  { key: "sheddingLevel", title: "Shedding Level", options: ["low", "medium", "high"] },
];

export function BreedEncyclopedia() {
  const navigate = useNavigate();
  const [allBreeds, setAllBreeds] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ size: "", energyLevel: "", sheddingLevel: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch (server-side search; client-side facet filtering for robustness)
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBreeds({ search: search.trim(), limit: 200 });
        setAllBreeds(data.items || []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load the archive.");
        setAllBreeds([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const breeds = useMemo(() => {
    return allBreeds.filter((b) =>
      FILTER_GROUPS.every(({ key }) => {
        if (!filters[key]) return true;
        return (b[key] || "").toLowerCase() === filters[key];
      })
    );
  }, [allBreeds, filters]);

  const isFiltered = Object.values(filters).some(Boolean);
  const toggle = (key, val) =>
    setFilters((p) => ({ ...p, [key]: p[key] === val ? "" : val }));

  const open = (b) => {
    trackBreedView(b.breedName);
    navigate(`/breeds/${encodeURIComponent(b.breedName)}`);
  };

  return (
    <Layout>
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <h1 className="font-headline-xl text-primary">The Breed Repository</h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            An archival collection of canine specimens, cataloged for scholarly review and biological study.
            {allBreeds.length > 0 && ` (${allBreeds.length} records)`}
          </p>
          <div className="mt-6 relative max-w-md mx-auto w-full">
            <input
              className="w-full border-b border-secondary/30 focus:border-primary px-4 py-3 bg-transparent text-center font-body-md placeholder:text-on-surface-variant/60 outline-none transition-colors rounded-t-sm"
              placeholder="Search the archive…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant">search</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-4 items-start">
          {/* Sidebar filters */}
          <aside className="md:col-span-3 flex flex-col gap-8 md:sticky md:top-24">
            <div className={`flex justify-end -mb-4 transition-opacity ${isFiltered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <button
                onClick={() => setFilters({ size: "", energyLevel: "", sheddingLevel: "" })}
                className="font-label-md uppercase tracking-[0.15em] text-[10px] text-on-surface-variant hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
              >
                Reset
              </button>
            </div>
            {FILTER_GROUPS.map((g) => (
              <div key={g.key} className="flex flex-col gap-4">
                <h3 className="font-label-md uppercase text-on-surface-variant tracking-widest border-b border-secondary/20 pb-2">
                  {g.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {g.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters[g.key] === opt}
                        onChange={() => toggle(g.key, opt)}
                        className="appearance-none w-4 h-4 cursor-pointer rounded-sm border border-primary/40 bg-surface relative flex items-center justify-center checked:border-primary after:content-[''] after:w-2 after:h-2 after:bg-primary after:rounded-xs after:scale-0 checked:after:scale-100 after:transition-transform"
                      />
                      <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors capitalize">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Grid */}
          <div className="md:col-span-9">
            {loading ? (
              <Spinner label="Consulting the archive…" />
            ) : error ? (
              <div className="text-center text-error font-body-md py-12">{error}</div>
            ) : breeds.length === 0 ? (
              <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-4">
                <span className="material-symbols-outlined text-4xl text-secondary/50">find_in_page</span>
                <p className="font-body-md text-on-surface-variant italic">No biological records found for this query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {breeds.map((breed) => (
                  <article
                    key={breed._id}
                    onClick={() => open(breed)}
                    className="group cursor-pointer border border-secondary/20 p-6 flex flex-col gap-4 bg-surface hover:bg-surface-container transition-colors rounded-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">
                        {breed.breedName}
                      </h2>
                      {breed.size && (
                        <span className="px-2.5 py-1 bg-terracotta/25 text-on-surface font-label-md text-[10px] uppercase tracking-wider rounded-sm capitalize shrink-0">
                          {breed.size}
                        </span>
                      )}
                    </div>
                    {breed.description && (
                      <p className="font-body-sm text-on-surface-variant italic line-clamp-3">{breed.description}</p>
                    )}
                    <div className="flex flex-col gap-1 font-body-sm text-secondary">
                      {breed.origin && <span>🌐 {breed.origin}</span>}
                      <span className="capitalize">⚡ {breed.energyLevel} energy · 🧼 {breed.sheddingLevel} shedding</span>
                    </div>
                    <div className="mt-auto border-t border-secondary/20 pt-3 flex justify-between items-center">
                      <span className="font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">View Record</span>
                      <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default BreedEncyclopedia;
