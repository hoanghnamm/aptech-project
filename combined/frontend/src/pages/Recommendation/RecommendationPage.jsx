import React, { useState } from 'react';
import { recommendBreeds } from '../../api/recommendation.api';

const LABEL = "font-label-md text-[10px] uppercase tracking-[0.2em] text-[#25221E]/60 mb-2 block";
const FIELD = "w-full bg-white border border-[#25221E]/20 rounded-sm px-4 py-3 outline-none focus:border-[#EE6449] focus:ring-1 focus:ring-[#EE6449]";

export default function RecommendationPage() {
  const [prefs, setPrefs] = useState({
    homeSize: 'apartment',
    activityLevel: 'medium',
    familyType: 'single',
    climate: 'temperate',
    experience: 'first_time',
    sheddingTolerance: 'medium',
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
        setError('No matching records found. Revise your criteria and consult the index again.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-12 bg-[#FEFDFC] text-[#25221E] min-h-screen">
      {/* Page heading */}
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
          Lifestyle Analysis
        </span>
        <h1 className="font-headline-xl text-[clamp(2rem,4vw,2.75rem)] text-[#25221E] leading-tight">
          Companion Matching Survey
        </h1>
        <p className="font-serif italic text-[15px] text-[#5C3A21]/85 leading-relaxed">
          Submit your living conditions to the archive — our index will nominate the breeds best
          suited to your household.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: form ledger */}
        <form onSubmit={submit} className="lg:col-span-5 bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none flex flex-col gap-6">
          <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
            Survey Parameters
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 -mt-2">
            <div>
              <label className={LABEL}>Home Size</label>
              <select className={FIELD} value={prefs.homeSize} onChange={update('homeSize')}>
                <option value="apartment">Apartment</option>
                <option value="house_small">Small house</option>
                <option value="house_large">Large house / yard</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Activity Level</label>
              <select className={FIELD} value={prefs.activityLevel} onChange={update('activityLevel')}>
                <option value="low">Low (mostly indoors)</option>
                <option value="medium">Medium (daily walks)</option>
                <option value="high">High (very active)</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Family Type</label>
              <select className={FIELD} value={prefs.familyType} onChange={update('familyType')}>
                <option value="single">Single</option>
                <option value="couple">Couple</option>
                <option value="family_kids">Family with kids</option>
                <option value="seniors">Seniors</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Climate</label>
              <select className={FIELD} value={prefs.climate} onChange={update('climate')}>
                <option value="temperate">Temperate</option>
                <option value="hot">Hot</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Owner Experience</label>
              <select className={FIELD} value={prefs.experience} onChange={update('experience')}>
                <option value="first_time">First-time owner</option>
                <option value="experienced">Experienced owner</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Shedding Tolerance</label>
              <select className={FIELD} value={prefs.sheddingTolerance} onChange={update('sheddingTolerance')}>
                <option value="low">Low (minimal shedding)</option>
                <option value="medium">Medium</option>
                <option value="high">High (don't mind shedding)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#EE6449] hover:bg-[#F07459] disabled:opacity-60 text-white font-label-md uppercase tracking-[0.15em] text-[11px] py-4 px-8 rounded-sm shadow-none transition-colors cursor-pointer border-none"
          >
            {loading ? 'Compiling matches…' : 'Consult the index'}
          </button>
        </form>

        {/* Right: results ledger */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {error && (
            <div className="border-l-2 border-error bg-[#FEFDFC] p-6 font-serif italic text-error">
              {error}
            </div>
          )}

          {!result && !error && (
            <div className="border border-dashed border-[#25221E]/15 rounded-sm p-12 text-center font-serif italic text-[#5C3A21]/60">
              Your nominated records will appear here once the survey is submitted.
            </div>
          )}

          {result && (
            <>
              <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
                Nominated Records
              </span>
              {result.recommendations.map((rec) => (
                <article key={rec.breedName} className="bg-[#FEFDFC] border border-[#25221E]/10 rounded-sm p-8 shadow-none text-left flex flex-col gap-4">
                  <div className="flex justify-between items-baseline gap-3 flex-wrap border-b border-[#25221E]/10 pb-4">
                    <h3 className="font-headline-lg text-[24px] text-[#25221E]">{rec.breedName}</h3>
                    <span className="font-label-md text-[13px] uppercase tracking-[0.15em] text-[#EE6449] font-bold">
                      {rec.matchScore}% match
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2 font-body-md text-[15px] text-[#25221E]/90 leading-relaxed list-disc pl-5">
                    {rec.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                  {rec.details && (
                    <div className="pt-2 font-serif italic text-[13px] text-[#5C3A21]/85">
                      Origin: {rec.details.origin} · Size: {rec.details.size} · Energy: {rec.details.energyLevel} · Lifespan: {rec.details.lifeExpectancy}
                    </div>
                  )}
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
