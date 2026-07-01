import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  PageHeading,
  Card,
  Field,
  inputClass,
  selectClass,
  PrimaryButton,
  Spinner,
  ErrorNote,
} from "@/components/ui";
import { recommendNutrition } from "@/services/api";

const Metric = ({ label, value, sub, accent }) => (
  <div className="bg-surface-container-lowest border border-secondary/15 rounded-sm p-6 text-center flex flex-col gap-1" style={{ borderTop: `3px solid ${accent}` }}>
    <div className="font-label-md text-secondary uppercase tracking-widest text-[10px]">{label}</div>
    <div className="font-headline-lg text-[34px]" style={{ color: accent }}>{value}</div>
    {sub && <div className="font-body-sm text-secondary text-[12px]">{sub}</div>}
  </div>
);

export default function Nutrition() {
  const [form, setForm] = useState({
    breedName: "",
    ageMonths: "",
    weightKg: "",
    size: "medium",
    activityLevel: "medium",
    lifeStage: "adult",
    goal: "maintain",
    climate: "temperate",
    mealCountPreference: 2,
    allergies: "",
    healthIssues: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        ...form,
        ageMonths: Number(form.ageMonths) || 0,
        weightKg: Number(form.weightKg) || 0,
        mealCountPreference: Number(form.mealCountPreference) || 2,
        allergies: form.allergies ? form.allergies.split(",").map((s) => s.trim()).filter(Boolean) : [],
        healthIssues: form.healthIssues ? form.healthIssues.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      const data = await recommendNutrition(payload);
      if (data.success) setResult(data.data);
      else setError(data.message || "Input data error.");
    } catch {
      setError("Server connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const r = result?.recommendation;
  const b = result?.breed;

  return (
    <Layout>
      <PageHeading
        title="Nutritional Analysis"
        subtitle="Combining breed biology from the archive with AI analysis to optimize daily portions and dietary composition."
      />

      <Card className="max-w-4xl mx-auto">
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <Field label="Breed Name">
              <input className={inputClass} required value={form.breedName} onChange={set("breedName")} placeholder="e.g. Alaskan Malamute" />
            </Field>
          </div>
          <Field label="Weight (kg)">
            <input type="number" step="any" className={inputClass} required value={form.weightKg} onChange={set("weightKg")} placeholder="e.g. 36" />
          </Field>
          <Field label="Age (months)">
            <input type="number" className={inputClass} required value={form.ageMonths} onChange={set("ageMonths")} placeholder="e.g. 10" />
          </Field>
          <Field label="Size">
            <select className={selectClass} value={form.size} onChange={set("size")}>
              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="giant">Giant</option>
            </select>
          </Field>
          <Field label="Life Stage">
            <select className={selectClass} value={form.lifeStage} onChange={set("lifeStage")}>
              <option value="puppy">Puppy</option><option value="adult">Adult</option><option value="senior">Senior</option>
            </select>
          </Field>
          <Field label="Activity Level">
            <select className={selectClass} value={form.activityLevel} onChange={set("activityLevel")}>
              <option value="low">Low (sedentary)</option><option value="medium">Medium</option><option value="high">High (active)</option>
            </select>
          </Field>
          <Field label="Climate">
            <select className={selectClass} value={form.climate} onChange={set("climate")}>
              <option value="temperate">Temperate</option><option value="hot">Hot</option><option value="cold">Cold</option>
            </select>
          </Field>
          <Field label="Goal">
            <select className={selectClass} value={form.goal} onChange={set("goal")}>
              <option value="maintain">Maintain weight</option><option value="lose">Lose weight</option><option value="gain">Gain weight / muscle</option>
            </select>
          </Field>
          <Field label="Meals / day">
            <select className={selectClass} value={form.mealCountPreference} onChange={set("mealCountPreference")}>
              <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
            </select>
          </Field>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Allergies (comma separated)">
              <input className={inputClass} value={form.allergies} onChange={set("allergies")} placeholder="chicken, dairy…" />
            </Field>
            <Field label="Health Issues (comma separated)">
              <input className={inputClass} value={form.healthIssues} onChange={set("healthIssues")} placeholder="obesity, kidney…" />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-center mt-2">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Analyzing…" : "Analyze Nutrition"}
            </PrimaryButton>
          </div>
        </form>
      </Card>

      <div className="mt-12 flex flex-col gap-8">
        {loading && <Spinner label="Computing metabolic requirements…" />}
        {error && <ErrorNote>{error}</ErrorNote>}

        {r && (
          <>
            {/* Summary */}
            <div className="bg-surface-container-low border-l-4 border-primary rounded-sm p-8">
              <div className="flex flex-wrap justify-between items-baseline gap-2 mb-3">
                <h3 className="font-headline-lg text-[26px] text-primary">Plan for {b?.breedName}</h3>
                <span className={`font-label-md uppercase tracking-widest text-[11px] ${result.breedMatched ? "text-primary" : "text-tertiary"}`}>
                  ● {result.breedMatched ? "Database matched" : "Fallback data"}
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant italic leading-relaxed">"{r.summary}"</p>
              {b?.description && <p className="font-body-sm text-secondary mt-2">{b.description}</p>}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Metric label="Calories / day" value={`${r.caloriesPerDay}`} sub={b?.nutritionProfile?.caloriesPerKg ? `${b.nutritionProfile.caloriesPerKg} kcal/kg` : "kcal"} accent="#154212" />
              <Metric label="Meals / day" value={r.mealsPerDay} sub={r.feedingSchedule?.join(" · ")} accent="#582d21" />
              <Metric label="Confidence" value={`${Math.round(r.confidence * 100)}%`} sub="Biological metrics" accent="#3b6934" />
            </div>

            {/* Breed characteristics */}
            {b && (
              <Card>
                <h4 className="font-label-md text-secondary uppercase tracking-widest text-[12px] border-b border-secondary/10 pb-3 mb-4">Breed Characteristics (Archive)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-body-md">
                  <div><span className="text-secondary">Origin:</span> <strong>{b.origin}</strong></div>
                  <div className="capitalize"><span className="text-secondary">Size:</span> <strong>{b.size}</strong></div>
                  <div><span className="text-secondary">Lifespan:</span> <strong>{b.lifeExpectancy}</strong></div>
                  <div className="capitalize"><span className="text-secondary">Energy:</span> <strong>{b.energyLevel}</strong></div>
                  <div className="capitalize"><span className="text-secondary">Shedding:</span> <strong>{b.sheddingLevel}</strong></div>
                  <div><span className="text-secondary">Temperament:</span> <strong>{b.temperament?.length ? b.temperament.join(", ") : "Gentle"}</strong></div>
                </div>
              </Card>
            )}

            {/* Macros */}
            {b?.nutritionProfile && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[["Protein", b.nutritionProfile.proteinRequirement], ["Fat", b.nutritionProfile.fatRequirement], ["Carbohydrate", b.nutritionProfile.carbRequirement]].map(([k, v]) => (
                  <div key={k} className="bg-surface-container border border-secondary/15 rounded-sm p-6 text-center">
                    <div className="font-label-md text-secondary uppercase tracking-widest text-[10px]">{k}</div>
                    <div className="font-headline-md text-[20px] text-primary uppercase mt-1">{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Dietary details */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="font-label-md text-primary uppercase tracking-widest text-[11px] mb-3">✓ Recommended Foods</div>
                  <ul className="list-disc pl-5 font-body-md text-on-surface-variant leading-relaxed">
                    {r.recommendedFoods?.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="font-label-md text-tertiary uppercase tracking-widest text-[11px] mb-3">⚠ Warnings & Notes</div>
                  <div className="font-body-md text-on-surface-variant leading-relaxed">
                    {r.warningFlags?.map((w, i) => <p key={i}>• {w}</p>)}
                    <p className="mt-2"><strong>Hydration:</strong> {r.hydrationTips}</p>
                  </div>
                </div>
              </div>
              {r.supplementSuggestions?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-secondary/10">
                  <div className="font-label-md text-secondary uppercase tracking-widest text-[11px] mb-3">Supplement Suggestions</div>
                  <ul className="list-disc pl-5 font-body-md text-on-surface-variant leading-relaxed">
                    {r.supplementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              <div className="mt-6 p-4 bg-surface-container-high rounded-sm font-body-md">
                <strong>Portion guidance:</strong> {r.portionGuidance}
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
