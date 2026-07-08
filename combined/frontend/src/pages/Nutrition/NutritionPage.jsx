import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Constants ─── */
const API_BASE = 'http://localhost:5000/api/nutrition';
const BCS_DATA = [
  { score: 1, label: 'Emaciated', icon: '🦴' },
  { score: 2, label: 'Very Thin', icon: '🦴' },
  { score: 3, label: 'Thin', icon: '🐕' },
  { score: 4, label: 'Slightly Under', icon: '🐕' },
  { score: 5, label: 'Ideal', icon: '✅' },
  { score: 6, label: 'Slightly Over', icon: '🐕‍🦺' },
  { score: 7, label: 'Overweight', icon: '⚠️' },
  { score: 8, label: 'Obese', icon: '🔴' },
  { score: 9, label: 'Severely Obese', icon: '🔴' },
];

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
const MACRO_COLORS = { protein: '#e3a392', fat: '#809c78', carb: '#c2c9bb', fiber: '#625e50' };

/* ─── Helper: energy bars ─── */
function energyToLevel(e) {
  if (!e) return 2;
  const s = String(e).toLowerCase();
  if (s.includes('low')) return 1;
  if (s.includes('high')) return 3;
  return 2;
}
function EnergyBars({ level = 2, max = 4 }) {
  return (
    <div className="nutrition-energy-bars">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`nutrition-energy-bar ${i < level ? 'nutrition-energy-bar--filled' : 'nutrition-energy-bar--empty'}`} />
      ))}
    </div>
  );
}

/* ─── F3: Conic Donut Chart ─── */
function DonutChart({ macros }) {
  if (!macros) return null;

  const proteinPercent = Math.round(macros.protein?.percent || 0);
  const fatPercent = Math.round(macros.fat?.percent || 0);
  const carbPercent = Math.round(macros.carb?.percent || 0);
  const fiberPercent = Math.round(macros.fiber?.percent || 0);

  const pEnd = proteinPercent;
  const fEnd = pEnd + fatPercent;
  const cEnd = fEnd + carbPercent;

  const totalGrams = (macros.protein?.grams || 0) + (macros.fat?.grams || 0) + (macros.carb?.grams || 0) + (macros.fiber?.grams || 0);

  const donutBg = `conic-gradient(
    #7eaf73 0% ${pEnd}%, 
    #c2c9bb ${pEnd}% ${fEnd}%, 
    #f4eedb ${fEnd}% ${cEnd}%, 
    #e3a392 ${cEnd}% 100%
  )`;

  return (
    <div className="flex flex-col md:flex-row items-center justify-around gap-8 w-full">
      <div className="donut-chart flex items-center justify-center" style={{ '--surface': '#f3f4ed', background: donutBg }}>
        <div className="flex flex-col items-center z-10">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{totalGrams}g</span>
          <span className="font-label-md text-[10px] uppercase text-secondary tracking-widest">total / day</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
        <div className="flex items-center justify-between border-b border-border-taupe pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-on-primary-container"></span>
            <span className="font-body-md text-body-md text-on-surface">Protein</span>
          </div>
          <div className="flex gap-2">
            <span className="font-body-sm text-body-sm text-secondary">{macros.protein?.grams || 0}g</span>
            <span className="font-body-sm text-body-sm text-secondary w-10 text-right">({proteinPercent}%)</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-border-taupe pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-outline-variant"></span>
            <span className="font-body-md text-body-md text-on-surface">Fat</span>
          </div>
          <div className="flex gap-2">
            <span className="font-body-sm text-body-sm text-secondary">{macros.fat?.grams || 0}g</span>
            <span className="font-body-sm text-body-sm text-secondary w-10 text-right">({fatPercent}%)</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-border-taupe pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-surface-container"></span>
            <span className="font-body-md text-body-md text-on-surface">Carb</span>
          </div>
          <div className="flex gap-2">
            <span className="font-body-sm text-body-sm text-secondary">{macros.carb?.grams || 0}g</span>
            <span className="font-body-sm text-body-sm text-secondary w-10 text-right">({carbPercent}%)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-terracotta-accent"></span>
            <span className="font-body-md text-body-md text-on-surface">Fiber</span>
          </div>
          <div className="flex gap-2">
            <span className="font-body-sm text-body-sm text-secondary">{macros.fiber?.grams || 0}g</span>
            <span className="font-body-sm text-body-sm text-secondary w-10 text-right">({fiberPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── F5: Weight Status Gauge ─── */
function WeightGauge({ weightStatus }) {
  if (!weightStatus || weightStatus.status === 'unknown' || !weightStatus.idealRange) return null;
  const { currentWeight, idealRange, status, deviationKg } = weightStatus;
  const rangeSpan = (idealRange.max - idealRange.min) || 1;
  const extendedMin = idealRange.min - rangeSpan * 0.5;
  const extendedMax = idealRange.max + rangeSpan * 0.5;
  const totalRange = extendedMax - extendedMin;
  const markerPos = Math.max(2, Math.min(98, ((currentWeight - extendedMin) / totalRange) * 100));

  const statusColors = { underweight: '#e3a392', healthy: '#002b02', overweight: '#ba1a1a' };
  const statusLabels = { underweight: 'Underweight', healthy: 'Healthy Weight', overweight: 'Overweight' };

  return (
    <div className="bg-surface-container-low border border-border-taupe rounded-xl p-4 md:p-6 flex flex-col gap-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-label-md text-label-md uppercase text-secondary">Weight Status</span>
        <span style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 600, color: statusColors[status] }}>
          {statusLabels[status]}
          {deviationKg !== 0 && ` (${deviationKg > 0 ? '+' : ''}${deviationKg}kg)`}
        </span>
      </div>
      <div className="relative w-full h-2 rounded-full overflow-hidden my-2" style={{ background: 'linear-gradient(90deg, #e3a392 0%, #7eaf73 30%, #002b02 50%, #7eaf73 70%, #e3a392 100%)' }}>
        <div className="absolute top-0 bottom-0 w-2 bg-on-surface border border-white rounded-full translate-x-[-50%]" style={{ left: `${markerPos}%` }} />
      </div>
      <div className="flex justify-between font-body-sm text-body-sm text-secondary">
        <span>Min: {idealRange.min}kg</span>
        <span className="font-bold text-primary">Ideal Range: {idealRange.min}–{idealRange.max}kg</span>
        <span>Max: {idealRange.max}kg</span>
      </div>
    </div>
  );
}

/* ─── F6: Health Alerts Panel ─── */
function HealthAlertsPanel({ alerts, breedName }) {
  if (!alerts || alerts.length === 0) return null;
  const severityIcons = { critical: '🚨', high: '⚠️', medium: '🔶', low: 'ℹ️' };

  return (
    <section className="bg-surface-container-low border border-border-taupe rounded-xl p-6 md:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-border-taupe pb-4">
        <span className="material-symbols-outlined text-terracotta-accent" style={{ fontVariationSettings: "'FILL' 0" }}>health_and_safety</span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Health Risks for {breedName}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {alerts.map((alert, i) => (
          <div key={i} className={`border border-border-taupe rounded-xl p-4 flex gap-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors border-l-4 ${
            alert.severity === 'critical' ? 'border-l-error' : alert.severity === 'high' ? 'border-l-terracotta-accent' : 'border-l-secondary'
          }`}>
            <span className="text-xl shrink-0">{severityIcons[alert.severity] || 'ℹ️'}</span>
            <div className="flex flex-col gap-1">
              <h4 className="font-body-md text-body-md font-bold text-on-surface">{alert.risk}</h4>
              <p className="font-body-sm text-body-sm text-secondary leading-relaxed">{alert.nutritionTip}</p>
              {alert.supplements?.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-label-md text-[10px] uppercase tracking-widest text-secondary">Supplements:</span>
                  <span className="font-body-sm text-body-sm text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded text-[11px] font-medium">
                    {alert.supplements.join(' • ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── F4: Weekly Meal Planner ─── */
function WeeklyMealPlanner({ mealPlan, caloriesPerDay, mealsPerDay, recommendedFoods }) {
  const [activeDay, setActiveDay] = useState(0);
  const dayShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (!mealPlan || mealPlan.length === 0) return null;

  const dayData = mealPlan.find(d => {
    const name = String(d.day || '').toLowerCase();
    return name.includes(daysOfWeek[activeDay].toLowerCase()) || name.includes(dayShortNames[activeDay].toLowerCase());
  }) || mealPlan[activeDay] || mealPlan[0];

  return (
    <section className="bg-surface-container-low border border-border-taupe rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6 border-b border-border-taupe pb-4">
        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_month</span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Weekly Meal Plan</h2>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {dayShortNames.map((shortName, idx) => {
          const isActive = idx === activeDay;
          return (
            <button
              key={shortName}
              type="button"
              onClick={() => setActiveDay(idx)}
              className={`min-w-[48px] h-10 border rounded-lg flex items-center justify-center font-label-md text-label-md uppercase transition-colors ${
                isActive
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-border-taupe text-secondary hover:bg-surface-container'
              }`}
            >
              {shortName}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        {dayData && dayData.meals && dayData.meals.length > 0 ? (
          dayData.meals.map((meal, idx) => {
            const isDinner = String(meal.type || '').toLowerCase().includes('dinner') || String(meal.type || '').toLowerCase().includes('night');
            return (
              <div key={idx} className="border border-border-taupe rounded-xl p-4 flex gap-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isDinner ? 'dark_mode' : 'light_mode'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-body-md text-body-md font-bold text-on-surface capitalize">{meal.type}</h4>
                  <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                    {Array.isArray(meal.items) ? meal.items.join(', ') : meal.items}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-label-md text-[10px] uppercase tracking-widest text-secondary">{meal.portionGrams}g</span>
                    <span className="font-label-md text-[10px] uppercase tracking-widest text-secondary">{meal.calories} kcal</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="font-body-sm text-body-sm text-secondary">No meals planned for this day.</p>
        )}
      </div>
    </section>
  );
}

/* ─── F1: Breed Autocomplete ─── */
function BreedAutocomplete({ value, onSelect, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const search = useCallback(async (q) => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`${API_BASE}/breeds/autocomplete?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      if (data.success) setSuggestions(data.data || []);
    } catch { setSuggestions([]); }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(val);
    setSelectedBreed(null);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 300);
    setShowDropdown(true);
  };

  const handleSelect = (breed) => {
    setSelectedBreed(breed);
    onChange(breed.breedName);
    onSelect(breed);
    setShowDropdown(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="nutrition-autocomplete" ref={containerRef}>
      <input
        id="breed" type="text" required placeholder="Start typing... e.g. Golden Retriever"
        style={{ background: '#f3f4ed', border: '1px solid rgba(98,94,80,0.2)', borderRadius: '0.25rem', padding: '12px 16px', width: '100%', fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', color: '#1e1c10', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
        value={value} onChange={handleInput} onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        autoComplete="off"
      />

      {showDropdown && suggestions.length > 0 && (
        <div className="nutrition-autocomplete__dropdown">
          {suggestions.map((b) => (
            <div key={b._id} className="nutrition-autocomplete__item" onClick={() => handleSelect(b)}>
              {b.thumbnail && <img src={b.thumbnail} alt="" />}
              <div className="nutrition-autocomplete__item-info">
                <div className="nutrition-autocomplete__item-name">{b.breedName}</div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── F2: BCS Visual Selector (inline in FormView) ─── */
// Inlined into FormView below

/* ═══════════════════════════════════════════════════════
   FORM VIEW — Scholarly Intake Design (matches mockup)
   ═══════════════════════════════════════════════════════ */
function FormView({ formData, setFormData, onSubmit, loading }) {
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBreedSelect = (breed) => {
    setFormData((prev) => ({
      ...prev,
      breedId: breed._id || '',
      size: breed.size || prev.size,
    }));
  };

  const selectStyle = {
    background: `#f3f4ed url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23625e50' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center / 1.5em no-repeat`,
    border: '1px solid rgba(98,94,80,0.2)',
    borderRadius: '0.25rem',
    padding: '12px 2.5rem 12px 16px',
    width: '100%',
    appearance: 'none',
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: '16px',
    color: '#1e1c10',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const inputStyle = {
    background: '#f3f4ed',
    border: '1px solid rgba(98,94,80,0.2)',
    borderRadius: '0.25rem',
    padding: '12px 16px',
    width: '100%',
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: '16px',
    color: '#1e1c10',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#625e50',
    marginBottom: '0.75rem',
  };

  const sectionHeadStyle = {
    fontSize: 'clamp(1.15rem, 1rem + 1vw, 2rem)',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    color: '#002b02',
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-border-taupe overflow-hidden">

      {/* Scholarly Header Banner */}
      <div className="p-8 md:p-12 border-b border-border-taupe bg-paper-base">
        <div className="flex items-center gap-4 mb-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '2.5rem' }}>menu_book</span>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '-0.02em', color: '#002b02', fontSize: 'clamp(1.6rem, 1.2rem + 2.5vw, 3.5rem)', lineHeight: 1.15 }}>
              Canine Nutritional Profile Intake
            </h1>
            <p className="text-secondary font-body-md text-body-md mt-2">
              Record comprehensive physiological and environmental data to generate an archival dietary strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Left Column: Intake Form ── */}
        <div className="lg:col-span-2 space-y-12">
          <form className="space-y-12" onSubmit={onSubmit}>

            {/* Identification Section */}
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-border-taupe pb-4">
                <span className="material-symbols-outlined text-primary">fingerprint</span>
                <h2 style={sectionHeadStyle}>Identification</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label style={labelStyle} htmlFor="breed">Breed Name</label>
                  <BreedAutocomplete
                    value={formData.breedName}
                    onChange={(val) => setFormData((prev) => ({ ...prev, breedName: val }))}
                    onSelect={handleBreedSelect}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="weight">Weight (kg)</label>
                  <input id="weight" type="number" step="0.1" required placeholder="0.0"
                    style={inputStyle} value={formData.weightKg} onChange={handleChange('weightKg')} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="age">Age (Months)</label>
                  <input id="age" type="number" required placeholder="0"
                    style={inputStyle} value={formData.ageMonths} onChange={handleChange('ageMonths')} />
                </div>
              </div>
            </section>

            {/* Physiology & Context Section */}
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-border-taupe pb-4">
                <span className="material-symbols-outlined text-primary">monitoring</span>
                <h2 style={sectionHeadStyle}>Physiology &amp; Context</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label style={labelStyle} htmlFor="size">Size</label>
                  <select id="size" style={selectStyle} value={formData.size} onChange={handleChange('size')}>
                    <option value="toy">Toy</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="giant">Giant</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="lifestage">Life Stage</label>
                  <select id="lifestage" style={selectStyle} value={formData.lifeStage} onChange={handleChange('lifeStage')}>
                    <option value="puppy">Puppy</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="activity">Activity Level</label>
                  <select id="activity" style={selectStyle} value={formData.activityLevel} onChange={handleChange('activityLevel')}>
                    <option value="low">Low</option>
                    <option value="medium">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="climate">Climate</label>
                  <select id="climate" style={selectStyle} value={formData.climate} onChange={handleChange('climate')}>
                    <option value="cold">Cold</option>
                    <option value="temperate">Moderate</option>
                    <option value="hot">Hot</option>
                    <option value="humid">Humid</option>
                  </select>
                </div>
              </div>
              {/* B6: Neutered toggle */}
              <div className="mt-6">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setFormData((p) => ({ ...p, isNeutered: !p.isNeutered }))}>
                  <div style={{ position: 'relative', width: '2.5rem', height: '1.4rem', borderRadius: '999px', background: formData.isNeutered ? '#002b02' : '#c2c9bb', transition: 'background 0.2s ease' }}>
                    <div style={{ position: 'absolute', top: '2px', left: formData.isNeutered ? 'calc(100% - 1.2rem - 2px)' : '2px', width: 'calc(1.4rem - 4px)', height: 'calc(1.4rem - 4px)', background: '#fff', borderRadius: '50%', transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                  <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', color: '#1e1c10' }}>Neutered / Spayed</span>
                </div>
              </div>
            </section>

            {/* Body Condition Assessment Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-8 border-b border-border-taupe pb-4">
                <span className="material-symbols-outlined text-primary">pets</span>
                <h2 style={sectionHeadStyle}>Body Condition Assessment</h2>
              </div>
              <div className="space-y-4">
                <p style={{ ...labelStyle, marginBottom: 0 }}>Body Condition Score (Optional)</p>
                <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                  {BCS_DATA.map((b) => {
                    const isSelected = formData.bodyConditionScore === b.score;
                    return (
                      <button key={b.score} type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, bodyConditionScore: isSelected ? null : b.score }))}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          padding: '0.5rem 0.25rem',
                          border: isSelected ? '2px solid #002b02' : '1px solid rgba(98,94,80,0.2)',
                          borderRadius: '0.25rem',
                          background: isSelected ? 'rgba(21,66,18,0.1)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 700, color: isSelected ? '#002b02' : '#191c18' }}>{b.score}</span>
                        <span style={{ fontSize: '8px', textTransform: 'uppercase', color: isSelected ? '#002b02' : '#625e50', textAlign: 'center', lineHeight: 1.3, marginTop: '2px' }}>{b.label}</span>
                      </button>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* Medical Profile & Objectives Section */}
            <section style={{ padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid rgba(227,163,146,0.2)', background: 'rgba(255,249,235,0.5)' }}>
              <div className="flex items-center gap-3 mb-8 border-b border-border-taupe pb-4">
                <span className="material-symbols-outlined text-primary">medical_services</span>
                <h2 style={sectionHeadStyle}>Medical Profile &amp; Objectives</h2>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label style={labelStyle} htmlFor="allergiesHealth">Allergies &amp; Health Issues (comma separated)</label>
                  <textarea id="allergiesHealth" rows={3}
                    placeholder="e.g. Chicken, Hip Dysplasia..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    value={`${formData.allergies}${formData.allergies && formData.healthIssues ? ', ' : ''}${formData.healthIssues}`}
                    onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value, healthIssues: '' }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Primary Nutritional Goal</label>
                  <div className="flex flex-wrap gap-6 mt-2">
                    {[{ value: 'lose', label: 'Weight Loss' }, { value: 'maintain', label: 'Maintain Weight' }, { value: 'gain', label: 'Weight Gain' }].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="goal" value={opt.value}
                          checked={formData.goal === opt.value}
                          onChange={handleChange('goal')}
                          style={{ accentColor: '#002b02', width: '1.25rem', height: '1.25rem' }}
                        />
                        <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', color: '#1e1c10' }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8 flex justify-center lg:justify-start">
              <button type="submit" disabled={loading}
                style={{
                  background: loading ? '#625e50' : '#002b02',
                  color: '#ffffff',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '1rem 3rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(0,43,2,0.25)',
                  transition: 'all 0.3s ease',
                  transform: loading ? 'none' : 'scale(1)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3b6934'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#002b02'; }}
              >
                {loading ? 'Analyzing data...' : 'Analyze nutrition now'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Column: Scholarly Illustrations Aside ── */}
        <aside className="hidden lg:flex flex-col gap-8">
          <div className="space-y-4">
            <div className="border border-border-taupe p-2 bg-paper-base shadow-sm rounded-lg">
              <img
                alt="Canine Anatomy Illustration"
                className="w-full h-auto transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbr3KLtN_RtBAjdCDIWYTTpbylnufLMg1O2An3ajTjXzx8_q0Dwl1Fy3VOf9Xm7juv8JqSduTdeJgI4ATkf4gK9DaGi2UBIp4aTpAZ_7h2MpBQI171JdKbyA9iq79yHCxhJawt2BLBVSQjHJhC05blHZIotMX_sdETo_21WP0-_rl5Z83gfdFdEoFHiQn45mGup6p-KwuWUUkkPy2nPMLWdpoWYVB4oTGtR3GKD853B8NYBaexn9EtL_isE5dBIAWYYt-Xi_VQzvyg"
              />
            </div>
            <p className="font-label-md text-label-md text-secondary italic text-center">Plate 23: Anatomia Canis</p>
          </div>
          <div className="space-y-4">
            <div className="border border-border-taupe p-2 bg-paper-base shadow-sm rounded-lg">
              <img
                alt="Botanical Ingredients Illustration"
                className="w-full h-auto transition-all duration-500"
                src="/botanical_reference.jpg"
              />
            </div>
            <p className="font-label-md text-label-md text-secondary italic text-center">Botanical Reference: Dietary Components</p>
          </div>
          <div className="p-6 border-t border-border-taupe border-dashed mt-4">
            <div className="flex flex-col gap-3">
              <span className="material-symbols-outlined text-primary" style={{ opacity: 0.8 }}>lightbulb</span>
              <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                Our archival methodology integrates historical physiological data with modern nutritional science to ensure optimal canine longevity.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULTS VIEW — with F3-F8 upgrades
   ═══════════════════════════════════════════════════════ */
function ResultsView({ result, onBack, previousResult }) {
  const rec = result.recommendation;
  const breed = result.breed || {};
  const confidence = Math.round((rec.confidence || 0) * 100);

  // F8: Compare with previous
  const prev = previousResult?.recommendation;
  const calorieDiff = prev ? rec.caloriesPerDay - prev.caloriesPerDay : null;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-sm border border-border-taupe flex flex-col gap-gutter">
      {/* Header Buttons */}
      <header className="flex justify-between items-center w-full mb-4">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors py-2 px-4 border border-border-taupe rounded-lg bg-surface-container-lowest"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          <span className="font-label-md text-label-md uppercase">Back to form</span>
        </button>
        <button
          onClick={() => window.print()}
          type="button"
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors py-2 px-4 border border-border-taupe rounded-lg bg-surface-container-lowest"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
          <span className="font-label-md text-label-md uppercase">Print / PDF</span>
        </button>
      </header>

      {/* Main Breed Header */}
      <section className="flex flex-col gap-4 border-b border-border-taupe pb-8">
        <div className="flex items-center gap-2 bg-surface-container-high w-max px-3 py-1 rounded-full border border-border-taupe">
          <span className={`w-2 h-2 rounded-full ${result.breedMatched ? 'bg-primary-container' : 'bg-outline'}`}></span>
          <span className="font-label-md text-label-md uppercase text-secondary">
            {result.breedMatched ? 'Breed-Specific Plan' : 'Using Fallback Data'}
          </span>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary tracking-tight">
            Nutrition Plan: {breed.breedName || 'Unknown'}
          </h1>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border-taupe bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
            {breed.thumbnail ? (
              <img src={breed.thumbnail} alt={breed.breedName} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-secondary opacity-40 text-[32px]">pets</span>
            )}
          </div>
        </div>
        <div className="border-l-2 border-terracotta-accent pl-4 ml-1">
          <p className="font-body-md text-body-md text-secondary max-w-3xl">
            {rec.summary}
          </p>
        </div>
      </section>

      {/* Primary Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
        {/* Calories */}
        <div className="bg-surface-container-low border border-border-taupe rounded-xl p-4 md:p-6 flex flex-col gap-6 justify-between">
          <h3 className="font-label-md text-label-md uppercase text-secondary">Target Calories / Day</h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-primary">{rec.caloriesPerDay}</span>
              <span className="font-body-sm text-body-sm text-secondary">kcal</span>
            </div>
            {calorieDiff !== null && calorieDiff !== 0 && (
              <span className={`nutrition-compare-badge ${calorieDiff > 0 ? 'nutrition-compare-badge--up' : 'nutrition-compare-badge--down'} text-[11px] w-max`}>
                {calorieDiff > 0 ? '↑' : '↓'} {Math.abs(calorieDiff)} kcal vs prev
              </span>
            )}
          </div>
        </div>

        {/* Feeding Frequency */}
        <div className="bg-surface-container-low border border-border-taupe rounded-xl p-4 md:p-6 flex flex-col gap-6">
          <h3 className="font-label-md text-label-md uppercase text-secondary">Feeding Frequency</h3>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 border-b border-border-taupe pb-2 mb-2">
              <span className="font-headline-lg text-headline-lg text-primary">{rec.mealsPerDay}</span>
              <span className="font-body-sm text-body-sm text-secondary">meals</span>
            </div>
            <span className="font-body-sm text-body-sm text-secondary">{rec.feedingSchedule?.join(' & ') || 'Morning & Evening'}</span>
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-surface-container-high border border-border-taupe rounded-xl p-4 md:p-6 flex flex-col gap-6">
          <h3 className="font-label-md text-label-md uppercase text-secondary">Analysis Confidence</h3>
          <div className="flex flex-col gap-2">
            <span className="font-headline-lg text-headline-lg text-terracotta-accent">{confidence}%</span>
            <div className="w-full bg-surface-dim h-1 rounded-full overflow-hidden">
              <div className="bg-terracotta-accent h-full" style={{ width: `${confidence}%` }}></div>
            </div>
          </div>
        </div>

        {/* Body Condition */}
        <div className="bg-surface-container-low border border-border-taupe rounded-xl p-4 md:p-6 flex flex-col gap-6">
          <h3 className="font-label-md text-label-md uppercase text-secondary">Body Condition</h3>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-primary">{rec.bodyConditionScore?.score || 5}</span>
              <span className="font-body-sm text-body-sm text-secondary">/9</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary leading-tight mt-1">
              {rec.bodyConditionScore?.label || 'Ideal'}
              {rec.bodyConditionScore?.calorieAdjust ? ` — Calorie ${rec.bodyConditionScore.calorieAdjust > 0 ? '+' : ''}${Math.round(rec.bodyConditionScore.calorieAdjust * 100)}%` : ''}
            </p>
          </div>
        </div>
      </section>

      {/* F5: Weight Status Gauge */}
      {rec.weightStatus && (
        <div className="my-2">
          <WeightGauge weightStatus={rec.weightStatus} />
        </div>
      )}

      {/* Main Grid: Left Column & Right Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        {/* Left Column */}
        <div className="md:col-span-8 flex flex-col gap-gutter">
          {/* Macronutrients */}
          {rec.macronutrients && (
            <div className="bg-surface-container-low border border-border-taupe rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-8 border-b border-border-taupe pb-4">
                <span className="material-symbols-outlined text-terracotta-accent" style={{ fontVariationSettings: "'FILL' 0" }}>pie_chart</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Macronutrient Profile</h2>
              </div>
              <DonutChart macros={rec.macronutrients} />
            </div>
          )}

          {/* F6: Breed Specific Health Risks */}
          {rec.healthAlerts && rec.healthAlerts.length > 0 && (
            <HealthAlertsPanel alerts={rec.healthAlerts} breedName={breed.breedName} />
          )}

          {/* Weekly Meal Plan */}
          {rec.weeklyMealPlan && (
            <WeeklyMealPlanner
              mealPlan={rec.weeklyMealPlan}
              caloriesPerDay={rec.caloriesPerDay}
              mealsPerDay={rec.mealsPerDay}
              recommendedFoods={rec.recommendedFoods}
            />
          )}

          {/* Breed Overview Ledger */}
          <section className="bg-surface-container border border-border-taupe rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 bg-surface-container-low border-b border-border-taupe">
              <h2 className="font-headline-lg text-[24px] md:text-headline-lg text-primary">Breed Overview</h2>
              <span className="material-symbols-outlined text-secondary cursor-pointer" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
            </div>
            <div className="flex flex-col">
              {/* Origin */}
              <div className="flex items-center p-4 border-b border-border-taupe border-opacity-10">
                <div className="w-1/3 flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-sm">public</span>
                  <span className="font-label-md text-[10px] uppercase tracking-widest">Origin</span>
                </div>
                <div className="w-2/3 font-body-sm text-body-sm text-on-surface">{breed.origin || '—'}</div>
              </div>
              {/* Size */}
              <div className="flex items-center p-4 border-b border-border-taupe border-opacity-10 bg-surface-container-low bg-opacity-50">
                <div className="w-1/3 flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  <span className="font-label-md text-[10px] uppercase tracking-widest">Size</span>
                </div>
                <div className="w-2/3 font-body-sm text-body-sm text-on-surface capitalize">{breed.size || '—'}</div>
              </div>
              {/* Lifespan */}
              <div className="flex items-center p-4 border-b border-border-taupe border-opacity-10">
                <div className="w-1/3 flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                  <span className="font-label-md text-[10px] uppercase tracking-widest">Lifespan</span>
                </div>
                <div className="w-2/3 font-body-sm text-body-sm text-on-surface">{breed.lifeExpectancy || '—'}</div>
              </div>
              {/* Energy */}
              <div className="flex items-center p-4 border-b border-border-taupe border-opacity-10 bg-surface-container-low bg-opacity-50">
                <div className="w-1/3 flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span className="font-label-md text-[10px] uppercase tracking-widest">Energy</span>
                </div>
                <div className="w-2/3 flex items-center gap-1">
                  <span className="font-body-sm text-body-sm text-on-surface mr-2 capitalize">{breed.energyLevel || 'medium'}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => {
                      const level = energyToLevel(breed.energyLevel);
                      const isFilled = i < level;
                      return (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded-sm ${isFilled ? 'bg-terracotta-accent' : 'border border-border-taupe'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-4 h-full">
          <aside className="bg-surface-container-low border border-border-taupe rounded-xl p-6 h-full flex flex-col gap-6 sticky top-8">
            {/* Dog Bowl Image Header */}
            <div className="w-full flex justify-center mb-2">
              <img
                alt="Dog Bowl"
                className="w-24 h-24 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzczRoDUrtfYJxnrB54cDi0YKCeUrfx0lEeoC6Si3j8WngZHqejxe2F-kQIJgiKl8-QGVbbgTw47onNPkdoRvPY51hs7J6kRVjVblBZF6pShT1G1I_48cVG-71C3QV3xpP8gH8D2PUuEWacTv2Puj0kOo9leDIG8r2BLIUbLCxEMksp-uuUyMgNxcJutZgDshWkJ15jMu0D7Y7J5fobWw1hSldijNuBFBZBPGcQCv9G5OjIiRQ1vnt3ndhtHcXOoAOfJDhMW25isYv"
              />
            </div>
            
            <h2 className="font-headline-lg text-[28px] text-primary border-b border-border-taupe pb-4">Dietary Details</h2>

            {/* Recommended Foods */}
            <div className="flex flex-col gap-3">
              <h3 className="font-label-md text-label-md uppercase text-secondary tracking-widest">Recommended Foods</h3>
              <ul className="flex flex-col gap-2">
                {rec.recommendedFoods?.map((food, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-terracotta-accent mt-2 shrink-0"></span>
                    <span className="font-body-sm text-body-sm text-on-surface">{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid Foods */}
            {rec.avoidFoods && rec.avoidFoods.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-label-md text-label-md uppercase text-secondary tracking-widest text-error">Foods to Avoid</h3>
                <ul className="flex flex-col gap-2">
                  {rec.avoidFoods.map((food, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-error mt-2 shrink-0"></span>
                      <span className="font-body-sm text-body-sm text-on-surface">{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {rec.warningFlags && rec.warningFlags.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-sm">warning</span>
                  <h3 className="font-label-md text-label-md uppercase text-secondary tracking-widest">Warnings</h3>
                </div>
                {rec.warningFlags.map((warning, idx) => (
                  <p key={idx} className="font-body-sm text-body-sm text-on-surface flex items-start gap-2 pl-1">
                    <span className="w-1 h-1 rounded-full bg-error mt-2 shrink-0"></span>
                    <span>{warning}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Hydration Tips */}
            {rec.hydrationTips && (
              <div className="bg-surface-container p-3 rounded-lg mt-2 border border-border-taupe flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-sm shrink-0">water_drop</span>
                <p className="font-body-sm text-body-sm text-on-surface text-[13px] leading-relaxed">
                  <strong className="font-bold">Water:</strong> {rec.hydrationTips}
                </p>
              </div>
            )}

            {/* Supplements */}
            {rec.supplementSuggestions && rec.supplementSuggestions.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">medication</span>
                  <h3 className="font-label-md text-label-md uppercase text-secondary tracking-widest">Supplements</h3>
                </div>
                <ul className="flex flex-col gap-2 pl-1">
                  {rec.supplementSuggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-secondary mt-2 shrink-0"></span>
                      <span className="font-body-sm text-body-sm text-on-surface">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Portion Guidance */}
            {rec.portionGuidance && (
              <div className="bg-surface-container-lowest border border-border-taupe rounded-lg p-4 mt-auto">
                <p className="font-body-sm text-body-sm text-on-surface text-[13px] leading-relaxed">
                  <strong className="font-bold">Portion Guidance:</strong> {rec.portionGuidance}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
/* ─── F2.5: Loading State View with Lottie ─── */
function LoadingView() {
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    // Programmatic backup to start play if autoplay attribute is ignored by custom elements wrapper
    const timer = setTimeout(() => {
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.play === 'function') {
            playerRef.current.play();
          } else {
            // Set properties directly
            playerRef.current.autoplay = true;
            playerRef.current.loop = true;
          }
        } catch (e) {
          console.warn('Lottie player activation fallback failed:', e);
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-sm border border-border-taupe max-w-lg mx-auto text-center gap-6">
      <div className="w-56 h-56 flex items-center justify-center">
        <dotlottie-wc
          ref={playerRef}
          src="https://lottie.host/36ae9068-6b96-4f74-b310-0d9289221a0c/KUSRn6wkg5.lottie"
          autoplay="true"
          loop="true"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="space-y-3">
        <h2 className="font-headline-lg text-primary text-2xl md:text-3xl tracking-tight animate-pulse">
          AI is generating answer
        </h2>
        <div className="flex justify-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"></span>
        </div>
        <p className="font-body-sm text-secondary text-sm italic mt-2">
          Analyzing breed bio-metrics, body conditions, and life stages...
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function NutritionPage() {
  const [formData, setFormData] = useState({
    breedName: '',
    breedId: '',
    ageMonths: '',
    weightKg: '',
    size: 'medium',
    activityLevel: 'medium',
    lifeStage: 'adult',
    goal: 'maintain',
    climate: 'temperate',
    mealCountPreference: 2,
    allergies: '',
    healthIssues: '',
    bodyConditionScore: null,
    isNeutered: false,
  });

  const [result, setResult] = useState(null);
  const [previousResult, setPreviousResult] = useState(null); // F8
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        allergies: formData.allergies ? formData.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        healthIssues: formData.healthIssues ? formData.healthIssues.split(',').map((s) => s.trim()).filter(Boolean) : [],
        bodyConditionScore: formData.bodyConditionScore || undefined,
        isNeutered: formData.isNeutered,
      };

      const response = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // F8: Save previous for comparison
        if (result) setPreviousResult(result);
        setResult(data.data);
      } else {
        const errorDetail = data.errors ? `: ${data.errors.map((e) => e.msg).join(', ')}` : '';
        setError((data.message || 'Input data error') + errorDetail);
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased font-body-md min-h-screen relative overflow-x-hidden">
      {/* Background Pattern Wrapper */}
      <div className="fixed inset-0 pattern-bg opacity-40 pointer-events-none z-[-1]"></div>
      
      {/* Main Content Canvas */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-gutter">
        {error && (
          <div style={{
            background: '#ffdad6', color: '#93000a', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-3)', fontWeight: 600, textAlign: 'center', border: '1px solid rgba(147, 0, 10, 0.15)',
          }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <LoadingView />
        ) : !result ? (
          <FormView formData={formData} setFormData={setFormData} onSubmit={calculateNutrition} loading={loading} />
        ) : (
          <ResultsView
            result={result}
            previousResult={previousResult}
            onBack={() => { setResult(null); setError(null); }}
          />
        )}
      </main>
    </div>
  );
}
