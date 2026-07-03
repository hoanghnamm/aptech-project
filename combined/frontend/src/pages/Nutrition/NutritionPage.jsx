import React, { useState } from 'react';

/* ─── Decorative image URLs (archival illustrations) ─── */
const IMG_ANATOMICAL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBuhh_KIZTpPTkaYvWVhKuJuT8b2hFGYGnRIXlNaesNL1HsTRndpbs-_3HAUe_dnk0KOahWAKp010hnyaNU3tiPJLFjWuSz4rsZ0qPNIoCjrjeknz5x9E4dN06qzKw_7oodeYCWmtKh6eNpaxwctw1Riaeybl5MGmO3iZoBvMhIvzCPobJtCbyX9OuLp0nSiAogx9h1RJY-aIGrQJar0vMsmieOgDObrsf3elHwM8XctR12KCyeQ_ZSO0bfUzdleMYq6gZ_-Ao8e_il';
const IMG_BOTANICAL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDCfGG1SByHSTtU2W2Ehx_ThJOEvWvm3VJQ6TQFERKVeBcAtrQria5RB8UouxqhjT47cUYNY1Lfisi62d23J4del0s_aKU7RrIuzIjr3Zb4WLCEvrCZ8HKEdd88ZRFzr3NobqT0cwMhkIezqonb1xb8c9hnZhrKRSuBo4SJMXfIod5ADTdQgzMt5QcEBsJaWVbacUnr1oiXh6ZT5X8jMlKbH7z2H7MU_LIj_mf0Uda1CE8iPp2W6IFd8oai_ojQubK4A8gN7pArLQmQ';
const IMG_FOOD_BOWL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2-3eN47Bcd8xB4ut176g2mHxpGtkQtVxgsL5RnK3tjEq_hZaSsHH7swor4eejcX0idR2XdKZsdPeWjL_gnKI16K_VTdArU5eTnIcb2ChRlh2KIjQF64Uv-ntgERAiQKvT1ukYBNbg4xBWTSBBee-YAOuCT903SOKNntLDYlVVdYUXStuZyoD5-p6w508z6Ccwq3Kxh6Tbc6dpaqAtx9FESoeqs0hnSfcEuDQHUfsWWf3F0b3r36RhjOE3U_1KNVY2d7KXYmUU3COZ';

/* ─── Helper: map energy level string to bar count ─── */
function energyToLevel(energy) {
  if (!energy) return 2;
  const e = energy.toLowerCase();
  if (e.includes('low') || e.includes('sedentary')) return 1;
  if (e.includes('high') || e.includes('active') || e.includes('very')) return 3;
  return 2;
}

/* ─── Helper: render energy level bars ─── */
function EnergyBars({ level = 2, max = 4 }) {
  return (
    <div className="nutrition-energy-bars">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`nutrition-energy-bar ${i < level ? 'nutrition-energy-bar--filled' : 'nutrition-energy-bar--empty'}`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FORM VIEW (Input Page)
   ═══════════════════════════════════════════════════════ */
function FormView({ formData, setFormData, onSubmit, loading }) {
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 'clamp(2rem, 1.5rem + 2vw, 3.5rem)', maxWidth: '42rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.75rem, 1.2rem + 2.5vw, 3.5rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#154212',
          marginBottom: 'clamp(0.5rem, 0.4rem + 0.3vw, 1rem)',
        }}>
          Canine Nutritional Profile Intake
        </h1>
        <p style={{ color: '#625e50', fontSize: 'var(--fs-400)', lineHeight: 1.6 }}>
          Record comprehensive physiological and environmental data to generate an archival dietary strategy.
        </p>
      </div>

      {/* 12-column Grid: Form + Sidebar images */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(1rem, 0.8rem + 1vw, 1.5rem)',
      }} className="lg:!grid-cols-[1fr_33%]">
        {/* Left: Form */}
        <div>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 1rem + 1vw, 2rem)' }}>
            {/* ── Identification ── */}
            <div className="nutrition-flat-card">
              <div className="nutrition-section-header">
                <h2>Identification</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.25rem)' }}
                   className="sm:!grid-cols-2">
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="nutrition-label" htmlFor="breed">Breed Name</label>
                  <input
                    id="breed"
                    type="text"
                    className="nutrition-input"
                    required
                    placeholder="e.g. Golden Retriever"
                    value={formData.breedName}
                    onChange={handleChange('breedName')}
                  />
                </div>
                <div>
                  <label className="nutrition-label" htmlFor="weight">Weight (kg)</label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="nutrition-input"
                    required
                    placeholder="0.0"
                    value={formData.weightKg}
                    onChange={handleChange('weightKg')}
                  />
                </div>
                <div>
                  <label className="nutrition-label" htmlFor="age">Age (Months)</label>
                  <input
                    id="age"
                    type="number"
                    className="nutrition-input"
                    required
                    placeholder="0"
                    value={formData.ageMonths}
                    onChange={handleChange('ageMonths')}
                  />
                </div>
              </div>
            </div>

            {/* ── Physiology & Context ── */}
            <div className="nutrition-flat-card">
              <div className="nutrition-section-header">
                <h2>Physiology &amp; Context</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.25rem)' }}
                   className="sm:!grid-cols-2">
                <div>
                  <label className="nutrition-label" htmlFor="size">Size</label>
                  <select id="size" className="nutrition-input" value={formData.size} onChange={handleChange('size')}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="giant">Giant</option>
                  </select>
                </div>
                <div>
                  <label className="nutrition-label" htmlFor="lifestage">Life Stage</label>
                  <select id="lifestage" className="nutrition-input" value={formData.lifeStage} onChange={handleChange('lifeStage')}>
                    <option value="puppy">Puppy</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label className="nutrition-label" htmlFor="activity">Activity Level</label>
                  <select id="activity" className="nutrition-input" value={formData.activityLevel} onChange={handleChange('activityLevel')}>
                    <option value="low">Low</option>
                    <option value="medium">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="nutrition-label" htmlFor="climate">Climate</label>
                  <select id="climate" className="nutrition-input" value={formData.climate} onChange={handleChange('climate')}>
                    <option value="cold">Cold</option>
                    <option value="temperate">Moderate</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Medical Profile & Objectives ── */}
            <div className="nutrition-flat-card nutrition-flat-card--accent">
              <div className="nutrition-section-header">
                <span className="material-symbols-outlined" style={{ color: '#154212', fontSize: '1.25em' }}>medical_services</span>
                <h2>Medical Profile &amp; Objectives</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.25rem)' }}>
                <div>
                  <label className="nutrition-label" htmlFor="allergies">Allergies &amp; Health Issues (comma separated)</label>
                  <textarea
                    id="allergies"
                    className="nutrition-input"
                    rows="3"
                    placeholder="e.g. Chicken, Hip Dysplasia..."
                    value={formData.allergies}
                    onChange={handleChange('allergies')}
                  />
                </div>
                <div>
                  <label className="nutrition-label">Primary Nutritional Goal</label>
                  <div className="nutrition-radio-group">
                    {[
                      { value: 'lose', label: 'Weight Loss' },
                      { value: 'maintain', label: 'Maintain Weight' },
                      { value: 'gain', label: 'Weight Gain' },
                    ].map((opt) => (
                      <label key={opt.value}>
                        <input
                          type="radio"
                          name="goal"
                          value={opt.value}
                          checked={formData.goal === opt.value}
                          onChange={handleChange('goal')}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ paddingTop: 'var(--space-2)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="nutrition-submit-btn" disabled={loading}>
                {loading ? 'Analyzing data...' : 'Analyze nutrition now'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Decorative images (hidden on mobile) */}
        <div className="hidden lg:block">
          <div style={{ position: 'sticky', top: 'clamp(5rem, 4rem + 3vw, 6rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 0.8rem + 0.8vw, 2rem)' }}>
            {/* Anatomical reference */}
            <div className="nutrition-flat-card" style={{ padding: 'clamp(0.5rem, 0.4rem + 0.4vw, 1rem)', overflow: 'hidden' }}>
              <img
                src={IMG_ANATOMICAL}
                alt="Anatomical Reference"
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', objectFit: 'cover', background: '#fff9eb', opacity: 0.95 }}
              />
              <div style={{ marginTop: 'clamp(0.5rem, 0.4rem + 0.3vw, 1rem)', background: 'rgba(249,250,242,0.95)', padding: 'clamp(0.5rem, 0.4rem + 0.4vw, 1rem)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <p className="nutrition-label" style={{ marginBottom: '0.25rem' }}>Archival Reference</p>
                <p style={{ fontSize: 'var(--fs-300)', color: 'var(--primary-dark)', lineHeight: 1.5 }}>
                  Extracting primary nutritional baselines from provided documentation.
                </p>
              </div>
            </div>

            {/* Botanical ingredients */}
            <div className="nutrition-flat-card nutrition-flat-card--accent" style={{ padding: 'clamp(0.5rem, 0.4rem + 0.4vw, 1rem)', overflow: 'hidden' }}>
              <img
                src={IMG_BOTANICAL}
                alt="Botanical Ingredients"
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', objectFit: 'cover', background: '#fff9eb', opacity: 0.95 }}
              />
              <div style={{ marginTop: 'clamp(0.5rem, 0.4rem + 0.3vw, 1rem)', background: 'rgba(249,250,242,0.95)', padding: 'clamp(0.5rem, 0.4rem + 0.4vw, 1rem)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <p className="nutrition-label" style={{ marginBottom: '0.25rem', color: '#e3a392' }}>Dietary Details</p>
                <p style={{ fontSize: 'var(--fs-300)', color: 'var(--primary-dark)', lineHeight: 1.5 }}>
                  Approved botanical supplements and whole-food ingredients for the archival strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULTS VIEW (Output Page)
   ═══════════════════════════════════════════════════════ */
function ResultsView({ result, onBack }) {
  const rec = result.recommendation;
  const breed = result.breed || {};
  const confidence = Math.round((rec.confidence || 0) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 1.5rem + 2vw, 3.5rem)' }}>
      {/* Back button */}
      <button type="button" className="nutrition-back-btn" onClick={onBack}>
        <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }}>arrow_back</span>
        Back to form
      </button>

      {/* ── Header Section ── */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1rem, 0.8rem + 1vw, 2rem)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: 'clamp(2rem, 1.5rem + 1.5vw, 3rem)',
      }} className="md:!flex-row md:!items-center md:!justify-between">
        {/* Text */}
        <div style={{ flex: 1, maxWidth: '42rem' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.2em 0.75em',
            background: '#e7e9e1',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            marginBottom: 'clamp(1rem, 0.8rem + 0.5vw, 1.5rem)',
          }}>
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#e3a392' }} />
            <span className="nutrition-label" style={{ margin: 0 }}>
              {result.breedMatched ? 'Nutrition Plan Active' : 'Using Fallback Data'}
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.75rem, 1.2rem + 2.5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#154212',
            marginBottom: 'clamp(0.5rem, 0.4rem + 0.3vw, 1rem)',
          }}>
            Plan for: {breed.breedName || formData?.breedName || 'Unknown'}
          </h1>

          <p style={{
            color: '#154212',
            fontSize: 'var(--fs-400)',
            lineHeight: 1.6,
            borderLeft: '4px solid #e3a392',
            paddingLeft: 'clamp(0.75rem, 0.5rem + 0.5vw, 1rem)',
          }}>
            {rec.summary}
          </p>
        </div>

        {/* Specimen image */}
        <div style={{
          width: 'clamp(10rem, 8rem + 8vw, 16rem)',
          aspectRatio: '1',
          flexShrink: 0,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          position: 'relative',
          background: '#fff',
        }}>
          <img
            src={IMG_ANATOMICAL}
            alt="Breed specimen"
            style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.9 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '0.5rem solid rgba(249,250,242,0.5)',
            pointerEvents: 'none',
            borderRadius: 'var(--radius-md)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            background: 'rgba(249,250,242,0.8)',
            backdropFilter: 'blur(4px)',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'clamp(0.55rem, 0.5rem + 0.1vw, 0.65rem)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#625e50',
            border: '1px solid var(--border-color)',
          }}>
            Specimen Ref. A1
          </div>
        </div>
      </section>

      {/* ── Bento Grid: Left Content + Right Sidebar ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(1rem, 0.8rem + 1vw, 1.5rem)',
        alignItems: 'start',
      }} className="lg:!grid-cols-[1fr_33%]">

        {/* ── Left Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 1rem + 1.5vw, 3rem)' }}>

          {/* Metrics + Macronutrient bento row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(1rem, 0.8rem + 0.6vw, 1.5rem)',
          }} className="md:!grid-cols-[38%_1fr]">

            {/* Metrics column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 0.5rem + 0.5vw, 1.25rem)' }}>
              {/* Calories */}
              <div className="nutrition-metric-card" style={{ background: 'var(--bg-pale-beige)' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.08 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 'clamp(2.5rem, 2rem + 2vw, 4rem)', color: '#e3a392' }}>local_fire_department</span>
                </div>
                <div className="nutrition-metric-card__label">Target Calories / Day</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginTop: 'var(--space-2)' }}>
                  <span className="nutrition-metric-card__value" style={{ color: '#154212' }}>{rec.caloriesPerDay}</span>
                  <span className="nutrition-metric-card__unit">kcal</span>
                </div>
              </div>

              {/* Meal count */}
              <div className="nutrition-metric-card" style={{ background: 'var(--bg-light-gray)' }}>
                <div className="nutrition-metric-card__label">Feeding Frequency</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginTop: 'var(--space-2)' }}>
                  <span className="nutrition-metric-card__value" style={{ color: '#154212' }}>{rec.mealsPerDay}</span>
                  <span className="nutrition-metric-card__unit">meals</span>
                </div>
                <p style={{ fontSize: 'var(--fs-300)', color: '#72796e', marginTop: 'var(--space-1)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-1)' }}>
                  {rec.feedingSchedule?.join(' & ') || 'Morning & Evening'}
                </p>
              </div>

              {/* Confidence */}
              <div className="nutrition-metric-card" style={{ background: '#e7e9e1' }}>
                <div className="nutrition-metric-card__label">Analysis Confidence</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.1rem', marginTop: 'var(--space-2)' }}>
                  <span className="nutrition-metric-card__value" style={{ color: '#e3a392' }}>{confidence}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.25rem, 1rem + 1vw, 1.75rem)', fontWeight: 600, color: '#e3a392' }}>%</span>
                </div>
                <div className="nutrition-progress-track">
                  <div className="nutrition-progress-fill" style={{ width: `${confidence}%`, background: '#e3a392' }} />
                </div>
              </div>
            </div>

            {/* Macronutrient Profile */}
            <div className="nutrition-flat-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'clamp(1rem, 0.8rem + 0.8vw, 2rem)' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'var(--fs-600)', fontWeight: 600, color: '#154212', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: '#e3a392' }}>pie_chart</span>
                  Macronutrient Profile
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 1rem + 0.8vw, 2rem)', flex: 1, justifyContent: 'center' }}>
                {/* Protein */}
                <div className="nutrition-macro-bar">
                  <div className="nutrition-macro-bar__header">
                    <h4 className="nutrition-macro-bar__name">Protein</h4>
                    <span className="nutrition-macro-bar__badge" style={{ color: '#e3a392', background: 'rgba(227,163,146,0.1)', border: '1px solid rgba(227,163,146,0.3)' }}>
                      {breed.nutritionProfile?.proteinRequirement || 'Medium'}
                    </span>
                  </div>
                  <div className="nutrition-macro-bar__track">
                    <div className="nutrition-macro-bar__fill" style={{ width: '33%', background: '#e3a392' }}>
                      Amino Acids
                    </div>
                    <div className="nutrition-macro-bar__desc">
                      Baseline for muscle maintenance.
                    </div>
                  </div>
                </div>

                {/* Fat */}
                <div className="nutrition-macro-bar">
                  <div className="nutrition-macro-bar__header">
                    <h4 className="nutrition-macro-bar__name">Fat</h4>
                    <span className="nutrition-macro-bar__badge" style={{ color: '#625e50', background: 'var(--bg-pale-beige)', border: '1px solid var(--border-color)' }}>
                      {breed.nutritionProfile?.fatRequirement || 'Medium'}
                    </span>
                  </div>
                  <div className="nutrition-macro-bar__track">
                    <div className="nutrition-macro-bar__fill" style={{ width: '25%', background: '#809c78' }}>
                      Lipids
                    </div>
                    <div className="nutrition-macro-bar__desc">
                      Focus on Omega-3 &amp; 6 for coat health.
                    </div>
                  </div>
                </div>

                {/* Carbohydrate */}
                <div className="nutrition-macro-bar">
                  <div className="nutrition-macro-bar__header">
                    <h4 className="nutrition-macro-bar__name">Carbohydrate</h4>
                    <span className="nutrition-macro-bar__badge" style={{ color: '#625e50', background: 'var(--bg-pale-beige)', border: '1px solid var(--border-color)' }}>
                      {breed.nutritionProfile?.carbRequirement || 'Medium'}
                    </span>
                  </div>
                  <div className="nutrition-macro-bar__track">
                    <div className="nutrition-macro-bar__fill" style={{ width: '40%', background: '#c2c9bb' }}>
                      Complex Carbs
                    </div>
                    <div className="nutrition-macro-bar__desc">
                      Sustained energy for activity level.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Taxonomic Overview (Breed Characteristics) ── */}
          <div className="nutrition-ledger">
            <div className="nutrition-ledger__header">
              <h2>Taxonomic Overview</h2>
              <span className="material-symbols-outlined" style={{ color: '#625e50', fontSize: '1.25em' }}>info</span>
            </div>

            <div className="nutrition-ledger__item">
              <div className="nutrition-ledger__key">
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>public</span>
                Origin
              </div>
              <div className="nutrition-ledger__value">{breed.origin || '—'}</div>
            </div>

            <div className="nutrition-ledger__item">
              <div className="nutrition-ledger__key">
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>straighten</span>
                Size
              </div>
              <div className="nutrition-ledger__value" style={{ textTransform: 'capitalize' }}>{breed.size || '—'}</div>
            </div>

            <div className="nutrition-ledger__item">
              <div className="nutrition-ledger__key">
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>hourglass_bottom</span>
                Lifespan
              </div>
              <div className="nutrition-ledger__value">{breed.lifeExpectancy || '—'}</div>
            </div>

            <div className="nutrition-ledger__item">
              <div className="nutrition-ledger__key">
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>bolt</span>
                Energy Level
              </div>
              <div className="nutrition-ledger__value" style={{ textTransform: 'capitalize' }}>
                {breed.energyLevel || '—'}
                <EnergyBars level={energyToLevel(breed.energyLevel)} />
              </div>
            </div>

            <div className="nutrition-ledger__item">
              <div className="nutrition-ledger__key">
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>shower</span>
                Shedding Level
              </div>
              <div className="nutrition-ledger__value" style={{ textTransform: 'capitalize' }}>{breed.sheddingLevel || '—'}</div>
            </div>

            <div className="nutrition-ledger__item">
              <div className="nutrition-ledger__key">
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>psychology</span>
                Temperament
              </div>
              <div className="nutrition-ledger__value">
                {breed.temperament?.length > 0 ? breed.temperament.join(', ') : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar: Dietary Details ── */}
        <div className="nutrition-flat-card lg:sticky" style={{ top: 'clamp(5rem, 4rem + 3vw, 7rem)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'var(--fs-600)', fontWeight: 600, color: '#154212', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            Dietary Details
          </h2>

          {/* Botanical illustration */}
          <div style={{ marginBottom: 'var(--space-3)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-light-gray)', aspectRatio: '1', position: 'relative' }}>
            <img
              src={IMG_FOOD_BOWL}
              alt="Food bowl illustration"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 'clamp(1rem, 0.8rem + 1vw, 2rem)', mixBlendMode: 'multiply', opacity: 0.9 }}
            />
          </div>

          {/* Recommended Foods */}
          <div className="nutrition-sidebar-section" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ color: '#154212' }}>Recommended Foods</h3>
            <ul>
              {rec.recommendedFoods?.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          {/* Warnings */}
          {rec.warningFlags?.length > 0 && (
            <div className="nutrition-sidebar-section" style={{ marginBottom: 'var(--space-3)' }}>
              <h3 style={{ color: '#e3a392' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>warning</span>
                Warnings / Notes
              </h3>
              <ul>
                {rec.warningFlags.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
              {rec.hydrationTips && (
                <p style={{ fontSize: 'var(--fs-400)', color: '#154212', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
                  <strong>Water:</strong> {rec.hydrationTips}
                </p>
              )}
            </div>
          )}

          {/* Supplements */}
          {rec.supplementSuggestions?.length > 0 && (
            <div className="nutrition-sidebar-section" style={{ marginBottom: 'var(--space-3)' }}>
              <h3 style={{ color: '#154212' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>medication</span>
                Supplement Suggestions
              </h3>
              <ul style={{}}>
                {rec.supplementSuggestions.map((s, i) => (
                  <li key={i} style={{}}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Portion Guidance */}
          {rec.portionGuidance && (
            <div className="nutrition-portion-box" style={{ marginTop: 'auto' }}>
              <strong>Portion Guidance:</strong> {rec.portionGuidance}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function NutritionPage() {
  const [formData, setFormData] = useState({
    breedName: '',
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
  });

  const [result, setResult] = useState(null);
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
        allergies: formData.allergies
          ? formData.allergies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        healthIssues: formData.healthIssues
          ? formData.healthIssues.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
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
    <>
      {/* Background pattern */}
      <div className="nutrition-bg-pattern" />

      <div style={{
        width: '100%',
        maxWidth: 'min(64rem, 100%)',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 1rem + 2vw, 3rem) clamp(1rem, 0.5rem + 2vw, 2rem)',
      }}>
        {/* Error display */}
        {error && (
          <div style={{
            background: '#ffdad6',
            color: '#93000a',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-3)',
            fontWeight: 600,
            textAlign: 'center',
            border: '1px solid rgba(147, 0, 10, 0.15)',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Conditional rendering: form or results */}
        {!result ? (
          <FormView
            formData={formData}
            setFormData={setFormData}
            onSubmit={calculateNutrition}
            loading={loading}
          />
        ) : (
          <ResultsView
            result={result}
            onBack={() => {
              setResult(null);
              setError(null);
            }}
          />
        )}
      </div>
    </>
  );
}
