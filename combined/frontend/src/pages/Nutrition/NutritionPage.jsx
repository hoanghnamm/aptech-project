import React, { useState } from 'react';

const LABEL = "font-label-md text-[10px] uppercase tracking-[0.2em] text-[#25221E]/60 mb-2 block";
const FIELD = "w-full bg-white border border-[#25221E]/20 rounded-sm px-4 py-3 outline-none focus:border-[#EE6449] focus:ring-1 focus:ring-[#EE6449]";

function LedgerLine({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#25221E]/5 text-[15px] font-body-md gap-4">
      <span className="text-[#25221E]/60">{label}</span>
      <span className="text-[#25221E] font-medium text-right">{value}</span>
    </div>
  );
}

export default function NutritionPage() {
  const [formData, setFormData] = useState({
    breedName: '', ageMonths: '', weightKg: '', size: 'medium',
    activityLevel: 'medium', lifeStage: 'adult', goal: 'maintain',
    climate: 'temperate', mealCountPreference: 2, allergies: '', healthIssues: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });

  const calculateNutrition = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        ageMonths: Number(formData.ageMonths) || 0,
        weightKg: Number(formData.weightKg) || 0,
        mealCountPreference: Number(formData.mealCountPreference) || 2,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        healthIssues: formData.healthIssues ? formData.healthIssues.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      const response = await fetch('http://localhost:5000/api/nutrition/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        const detail = data.errors ? `: ${data.errors.map(e => e.msg).join(', ')}` : '';
        setError((data.message || 'Input data error') + detail);
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const r = result?.recommendation;
  const b = result?.breed;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-12 bg-[#FEFDFC] text-[#25221E] min-h-screen">
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
          Dietary Prescription
        </span>
        <h1 className="font-headline-xl text-[clamp(2rem,4vw,2.75rem)] text-[#25221E] leading-tight">
          Nutrition Ledger
        </h1>
        <p className="font-serif italic text-[15px] text-[#5C3A21]/85 leading-relaxed">
          Cross-referencing archival breed data with your companion’s biology to prescribe daily portions.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: form */}
        <form onSubmit={calculateNutrition} className="lg:col-span-5 bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none flex flex-col gap-5">
          <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
            Specimen Details
          </span>
          <div>
            <label className={LABEL}>Breed Name</label>
            <input type="text" required className={FIELD} value={formData.breedName} onChange={set('breedName')} placeholder="e.g. Alaskan Malamute" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Weight (kg)</label>
              <input type="number" step="any" required className={FIELD} value={formData.weightKg} onChange={set('weightKg')} placeholder="e.g. 36" />
            </div>
            <div>
              <label className={LABEL}>Age (months)</label>
              <input type="number" required className={FIELD} value={formData.ageMonths} onChange={set('ageMonths')} placeholder="e.g. 10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Size</label>
              <select className={FIELD} value={formData.size} onChange={set('size')}>
                <option value="small">Small</option><option value="medium">Medium</option>
                <option value="large">Large</option><option value="giant">Giant</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Life Stage</label>
              <select className={FIELD} value={formData.lifeStage} onChange={set('lifeStage')}>
                <option value="puppy">Puppy</option><option value="adult">Adult</option><option value="senior">Senior</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Activity Level</label>
              <select className={FIELD} value={formData.activityLevel} onChange={set('activityLevel')}>
                <option value="low">Low (sedentary)</option><option value="medium">Medium</option><option value="high">High (active)</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Climate</label>
              <select className={FIELD} value={formData.climate} onChange={set('climate')}>
                <option value="temperate">Temperate</option><option value="hot">Hot</option><option value="cold">Cold</option>
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Goal</label>
            <select className={FIELD} value={formData.goal} onChange={set('goal')}>
              <option value="maintain">Maintain weight</option><option value="lose">Lose weight</option><option value="gain">Gain weight / muscle</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Allergies & Health Issues (comma separated)</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" className={FIELD} placeholder="Allergies: chicken, dairy…" value={formData.allergies} onChange={set('allergies')} />
              <input type="text" className={FIELD} placeholder="Issues: obesity, kidney…" value={formData.healthIssues} onChange={set('healthIssues')} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="mt-1 bg-[#EE6449] hover:bg-[#F07459] disabled:opacity-60 text-white font-label-md uppercase tracking-[0.15em] text-[11px] py-4 px-8 rounded-sm shadow-none transition-colors cursor-pointer border-none">
            {loading ? 'Computing prescription…' : 'Compute prescription'}
          </button>
        </form>

        {/* Right: results */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {error && (
            <div className="border-l-2 border-error bg-[#FEFDFC] p-6 font-serif italic text-error">{error}</div>
          )}
          {!result && !error && (
            <div className="border border-dashed border-[#25221E]/15 rounded-sm p-12 text-center font-serif italic text-[#5C3A21]/60">
              The dietary prescription will be recorded here once the specimen is submitted.
            </div>
          )}

          {r && (
            <>
              {/* Summary ledger */}
              <div className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none flex flex-col gap-4">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">Prescription</span>
                    <h3 className="font-headline-lg text-[24px] text-[#25221E]">Plan for {b?.breedName}</h3>
                  </div>
                  <span className="font-label-md text-[10px] uppercase tracking-[0.15em] text-[#5C3A21]/70">
                    {result.breedMatched ? '● Archive matched' : '● Fallback data'}
                  </span>
                </div>
                <p className="font-serif italic text-[15px] text-[#5C3A21]/85 leading-relaxed border-l-2 border-[#e3d7bf] pl-4">“{r.summary}”</p>
                <div className="border-t border-[#25221E]/10 pt-2">
                  <LedgerLine label="Calories / day" value={`${r.caloriesPerDay} kcal`} />
                  <LedgerLine label="Meals / day" value={`${r.mealsPerDay} meals`} />
                  <LedgerLine label="Feeding schedule" value={r.feedingSchedule?.join(' · ') || '—'} />
                  <LedgerLine label="Confidence" value={`${Math.round(r.confidence * 100)}%`} />
                </div>
              </div>

              {/* Breed characteristics ledger */}
              {b && (
                <div className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none flex flex-col gap-2">
                  <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold mb-2">Breed Characteristics</span>
                  <LedgerLine label="Origin" value={b.origin || '—'} />
                  <LedgerLine label="Size" value={<span className="capitalize">{b.size}</span>} />
                  <LedgerLine label="Lifespan" value={b.lifeExpectancy || '—'} />
                  <LedgerLine label="Energy level" value={<span className="capitalize">{b.energyLevel}</span>} />
                  <LedgerLine label="Shedding level" value={<span className="capitalize">{b.sheddingLevel}</span>} />
                  {b.nutritionProfile && (
                    <>
                      <LedgerLine label="Protein" value={<span className="uppercase">{b.nutritionProfile.proteinRequirement}</span>} />
                      <LedgerLine label="Fat" value={<span className="uppercase">{b.nutritionProfile.fatRequirement}</span>} />
                      <LedgerLine label="Carbohydrate" value={<span className="uppercase">{b.nutritionProfile.carbRequirement}</span>} />
                    </>
                  )}
                </div>
              )}

              {/* Dietary details */}
              <div className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none flex flex-col gap-6">
                <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">Dietary Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="font-label-md text-[10px] uppercase tracking-[0.15em] text-[#4c8a54] font-bold mb-2">Recommended foods</div>
                    <ul className="list-disc pl-5 font-body-md text-[14px] leading-relaxed text-[#25221E]/90 flex flex-col gap-1">
                      {r.recommendedFoods.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="font-label-md text-[10px] uppercase tracking-[0.15em] text-error font-bold mb-2">Warnings / notes</div>
                    <div className="font-body-md text-[14px] leading-relaxed text-[#25221E]/90 flex flex-col gap-1">
                      {r.warningFlags.map((w, i) => <p key={i}>• {w}</p>)}
                      <p className="mt-1"><strong>Water:</strong> {r.hydrationTips}</p>
                    </div>
                  </div>
                </div>
                {r.supplementSuggestions?.length > 0 && (
                  <div className="border-t border-[#25221E]/10 pt-4">
                    <div className="font-label-md text-[10px] uppercase tracking-[0.15em] text-[#5C3A21] font-bold mb-2">Supplement suggestions</div>
                    <ul className="list-disc pl-5 font-body-md text-[14px] leading-relaxed text-[#25221E]/90 flex flex-col gap-1">
                      {r.supplementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                <div className="bg-[#F5EFE3] border border-[#e3d7bf] rounded-sm p-4 font-body-md text-[14px] text-[#25221E]">
                  <strong>Portion guidance:</strong> {r.portionGuidance}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
