import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/ui";
import { getBreed, trackBreedView } from "@/services/api";

export function BreedProfile() {
  const { breedId } = useParams();
  const navigate = useNavigate();
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBreed(breedId);
        setBreed(data);
        if (data?.breedName) trackBreedView(data.breedName);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Record not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [breedId]);

  if (loading) {
    return (
      <Layout>
        <Spinner label="Consulting biological archives…" />
      </Layout>
    );
  }

  if (error || !breed) {
    return (
      <Layout>
        <div className="text-center py-24 flex flex-col gap-4">
          <h2 className="font-headline-lg text-error">Record Not Found</h2>
          <p className="font-body-md text-on-surface-variant">{error}</p>
          <button onClick={() => navigate("/encyclopedia")} className="font-label-md uppercase tracking-widest text-primary cursor-pointer bg-transparent border-0 mt-2">
            ← Return to Archive
          </button>
        </div>
      </Layout>
    );
  }

  const stats = [
    { label: "Size", value: breed.size },
    { label: "Energy Level", value: breed.energyLevel },
    { label: "Shedding", value: breed.sheddingLevel },
    { label: "Life Expectancy", value: breed.lifeExpectancy },
  ].filter((s) => s.value);

  const np = breed.nutritionProfile;

  return (
    <Layout>
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-label-md uppercase tracking-[0.2em] text-secondary/70 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer mb-8"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Return to Archive
      </button>

      <section className="flex flex-col gap-6 items-center text-center mb-16">
        {breed.origin && (
          <div className="inline-flex items-center px-5 py-1.5 bg-terracotta text-white rounded-sm font-label-md uppercase tracking-[0.15em] text-[11px]">
            {breed.origin}
          </div>
        )}
        <h1 className="font-headline-xl text-[clamp(40px,8vw,72px)] leading-none text-on-surface tracking-tight">
          {breed.breedName}
        </h1>
        {breed.description && (
          <p className="max-w-3xl text-on-surface-variant font-body-md text-[19px] leading-[1.8] italic opacity-90">
            {breed.description}
          </p>
        )}
        {breed.temperament?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {breed.temperament.map((t, i) => (
              <span key={i} className="px-5 py-2 border border-primary/20 text-primary font-label-md uppercase tracking-widest text-[10px] rounded-sm bg-primary/5">
                {t}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-low border border-secondary/10 rounded-sm p-8 flex flex-col items-center justify-center text-center gap-2">
              <span className="font-label-md text-secondary/60 uppercase tracking-[0.2em] text-[11px]">{s.label}</span>
              <span className="font-headline-lg text-[26px] text-primary-container capitalize">{s.value}</span>
            </div>
          ))}
        </section>
      )}

      {/* Care & Health + Nutrition */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        <div className="flex flex-col gap-6">
          <h3 className="font-headline-lg text-[28px]">Health Considerations</h3>
          <div className="bg-terracotta/5 border border-tertiary/20 rounded-sm p-8 flex flex-col gap-5">
            {breed.healthIssues?.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {breed.healthIssues.map((h, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    <span className="font-body-md text-on-surface text-[17px]">{h}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body-md text-on-surface-variant italic opacity-80">No notable hereditary vulnerabilities recorded for this breed.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-headline-lg text-[28px]">Nutritional Baseline</h3>
          <div className="bg-surface-container border border-secondary/10 rounded-sm p-8 flex flex-col gap-4">
            {np ? (
              <>
                {np.caloriesPerKg != null && (
                  <div className="flex justify-between border-b border-secondary/10 pb-3">
                    <span className="font-body-md text-secondary">Energy density</span>
                    <span className="font-headline-md text-[18px] text-primary">{np.caloriesPerKg} kcal/kg</span>
                  </div>
                )}
                {[["Protein", np.proteinRequirement], ["Fat", np.fatRequirement], ["Carbohydrate", np.carbRequirement]].map(
                  ([k, v]) => v && (
                    <div key={k} className="flex justify-between">
                      <span className="font-body-md text-secondary">{k}</span>
                      <span className="font-body-md text-on-surface capitalize">{v}</span>
                    </div>
                  )
                )}
                <button
                  onClick={() => navigate("/nutrition")}
                  className="mt-2 self-start font-label-md uppercase tracking-widest text-[11px] text-primary border-b border-primary/30 hover:border-primary bg-transparent border-x-0 border-t-0 pb-0.5 cursor-pointer"
                >
                  Build a full nutrition plan →
                </button>
              </>
            ) : (
              <p className="font-body-md text-on-surface-variant italic opacity-80">No nutritional baseline on file. Use the Nutrition tool for a tailored plan.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default BreedProfile;
