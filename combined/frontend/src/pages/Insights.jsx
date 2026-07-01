import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeading, Spinner, ErrorNote } from "@/components/ui";
import { getPersonalized, getTrending, trackBreedView } from "@/services/api";

const StatBox = ({ label, value }) => (
  <div className="bg-surface-container-lowest border border-secondary/15 rounded-sm p-6 text-center">
    <div className="font-headline-lg text-[36px] text-primary">{value}</div>
    <div className="font-label-md text-secondary uppercase tracking-widest text-[10px] mt-1">{label}</div>
  </div>
);

export default function Insights() {
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
        setError(err?.response?.data?.message || err?.message || "Failed to load insights.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openBreed = (name) => {
    trackBreedView(name);
    navigate(`/breeds/${encodeURIComponent(name)}`);
  };

  return (
    <Layout>
      <PageHeading
        title="Curated For You"
        subtitle="Personalized specimen suggestions drawn from what you've explored, alongside what is trending across the archive."
      />

      {loading && <Spinner label="Compiling your reading record…" />}
      {error && <ErrorNote>{error}</ErrorNote>}

      {/* Stats */}
      {trending?.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatBox label="Unique Visitors" value={trending.stats.uniqueVisitors} />
          <StatBox label="Page Views" value={trending.stats.pageViews} />
          <StatBox label="Breed Views" value={trending.stats.breedViews} />
          <StatBox label="Total Events" value={trending.stats.totalEvents} />
        </div>
      )}

      {/* Personalized */}
      {personalized && (
        <section className="mb-12">
          <h2 className="font-headline-lg text-[28px] text-on-surface mb-2">
            {personalized.personalized ? "Recommended for you" : "Popular picks to get you started"}
          </h2>
          {personalized.personalized && personalized.basedOn?.length > 0 && (
            <p className="font-body-sm text-secondary italic mb-6">
              Based on your interest in: {personalized.basedOn.join(", ")}
            </p>
          )}
          {personalized.recommendations?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {personalized.recommendations.map((b) => (
                <article
                  key={b._id}
                  onClick={() => openBreed(b.breedName)}
                  className="group cursor-pointer border border-secondary/20 p-6 flex flex-col gap-2 bg-surface hover:bg-surface-container transition-colors rounded-sm"
                >
                  <h3 className="font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">{b.breedName}</h3>
                  <div className="font-body-sm text-on-surface-variant flex flex-col gap-1">
                    <span className="capitalize">📏 {b.size} • ⚡ {b.energyLevel} energy</span>
                    {b.origin && <span>🌐 {b.origin}</span>}
                    {b.temperament?.length > 0 && <span>🐾 {b.temperament.slice(0, 3).join(", ")}</span>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="font-body-md text-on-surface-variant italic">
              Browse the{" "}
              <button onClick={() => navigate("/encyclopedia")} className="text-primary underline cursor-pointer bg-transparent border-0">
                Encyclopedia
              </button>{" "}
              to personalize this page.
            </p>
          )}
        </section>
      )}

      {/* Trending */}
      {trending?.trending?.length > 0 && (
        <section>
          <h2 className="font-headline-lg text-[28px] text-on-surface mb-6">🔥 Trending breeds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.trending.map((t) => (
              <button
                key={t.breedName}
                onClick={() => openBreed(t.breedName)}
                className="flex justify-between items-center gap-3 bg-surface-container-lowest border border-secondary/20 rounded-sm px-5 py-4 hover:border-primary transition-colors cursor-pointer text-left"
              >
                <span className="font-headline-md text-[16px] text-on-surface">{t.breedName}</span>
                <span className="font-label-md text-tertiary uppercase tracking-widest text-[10px] whitespace-nowrap">{t.views} views</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
