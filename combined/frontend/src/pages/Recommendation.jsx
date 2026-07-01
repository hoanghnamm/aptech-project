import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  PageHeading,
  Card,
  Field,
  selectClass,
  PrimaryButton,
  Spinner,
  ErrorNote,
} from "@/components/ui";
import { recommendBreeds } from "@/services/api";

const FIELDS = [
  { key: "homeSize", label: "Habitat", options: [["apartment", "Apartment"], ["house_small", "Small house"], ["house_large", "Large house / yard"]] },
  { key: "activityLevel", label: "Activity Level", options: [["low", "Low (mostly indoors)"], ["medium", "Medium (daily walks)"], ["high", "High (very active)"]] },
  { key: "familyType", label: "Household", options: [["single", "Single"], ["couple", "Couple"], ["family_kids", "Family with kids"], ["seniors", "Seniors"]] },
  { key: "climate", label: "Climate", options: [["temperate", "Temperate"], ["hot", "Hot"], ["cold", "Cold"]] },
  { key: "experience", label: "Owner Experience", options: [["first_time", "First-time owner"], ["experienced", "Experienced owner"]] },
  { key: "sheddingTolerance", label: "Shedding Tolerance", options: [["low", "Low (minimal)"], ["medium", "Medium"], ["high", "High (don't mind)"]] },
];

export default function Recommendation() {
  const [prefs, setPrefs] = useState({
    homeSize: "apartment",
    activityLevel: "medium",
    familyType: "single",
    climate: "temperate",
    experience: "first_time",
    sheddingTolerance: "medium",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (key) => (e) => setPrefs({ ...prefs, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await recommendBreeds(prefs);
      if (!data.recommendations?.length) {
        setError("No matching breeds found. Try different preferences.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeading
        title="Companion Matching"
        subtitle="Describe your lifestyle and the archive will correlate it against breed biology to surface your most compatible companions."
      />

      <Card className="max-w-4xl mx-auto">
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <select className={selectClass} value={prefs[f.key]} onChange={update(f.key)}>
                {f.options.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
          ))}
          <div className="sm:col-span-2 flex justify-center mt-2">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Correlating…" : "Find My Match"}
            </PrimaryButton>
          </div>
        </form>
      </Card>

      <div className="mt-12 flex flex-col gap-6">
        {loading && <Spinner label="Cross-referencing archival records…" />}
        {error && <ErrorNote>{error}</ErrorNote>}

        {result && (
          <>
            <h2 className="font-headline-lg text-[32px] text-on-surface text-center">
              Top Matches
            </h2>
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
              {result.recommendations.map((rec, i) => (
                <article
                  key={rec.breedName}
                  className="bg-surface-container-lowest border border-secondary/20 rounded-sm p-8 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start gap-4 border-b border-secondary/10 pb-4">
                    <div className="flex items-baseline gap-4">
                      <span className="font-headline-lg text-[28px] text-tertiary/30">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <h3 className="font-headline-lg text-[26px] text-primary">
                        {rec.breedName}
                      </h3>
                    </div>
                    <div className="bg-tertiary text-on-tertiary px-4 py-2 font-label-md uppercase tracking-widest rounded-sm shrink-0">
                      {rec.matchScore}% Match
                    </div>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {rec.reasons.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-3 font-body-md text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_small</span>
                        {r}
                      </li>
                    ))}
                  </ul>

                  {rec.details && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 pt-3 border-t border-secondary/10 font-body-sm text-secondary">
                      <span>📍 {rec.details.origin}</span>
                      <span className="capitalize">📏 {rec.details.size}</span>
                      <span className="capitalize">⚡ {rec.details.energyLevel} energy</span>
                      <span>⏳ {rec.details.lifeExpectancy}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
