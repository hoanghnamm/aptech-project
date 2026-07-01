import React, { useState } from 'react';

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
    healthIssues: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateNutrition = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // Chuẩn hóa dữ liệu trước khi gửi để khớp với Backend validation
      const payload = {
        ...formData,
        ageMonths: Number(formData.ageMonths) || 0,
        weightKg: Number(formData.weightKg) || 0,
        mealCountPreference: Number(formData.mealCountPreference) || 2,
        allergies: formData.allergies
          ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        healthIssues: formData.healthIssues
          ? formData.healthIssues.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      console.log(">>> [DEBUG FRONTEND] 1. Payload gửi đi:", payload);

      const response = await fetch('http://localhost:5000/api/nutrition/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(">>> [DEBUG FRONTEND] 2. Response từ Backend:", data);

      if (data.success) {
        setResult(data.data);
        console.log(">>> [DEBUG FRONTEND] 3. Result updated in UI.");
      } else {
        // Nếu backend trả về chi tiết lỗi validation (ví dụ array errors)
        const errorDetail = data.errors ? `: ${data.errors.map(e => e.msg).join(', ')}` : '';
        setError((data.message || "Input data error") + errorDetail);
      }
    } catch (err) {
      setError("Server connection error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { display: 'block', fontSize: 'var(--fs-300)', fontWeight: '600', marginBottom: 'var(--space-1)' };

  return (
    <div className="page">
      <div>
        <h1 className="page__title">AI Nutrition Diagnosis</h1>
        <p className="page__subtitle">
          Combining breed data from the Database and AI analysis to optimize portions.
        </p>
      </div>

      <div className="card-standard">
        <form onSubmit={calculateNutrition} className="form-grid">
          <div className="col-span-all">
            <label style={labelStyle}>BREED NAME</label>
            <input
              type="text"
              className="input-text"
              required
              value={formData.breedName}
              onChange={e => setFormData({...formData, breedName: e.target.value})}
              placeholder="Enter breed name (e.g., Alaskan Malamute)"
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <div style={{ flex: 1 }}>
            <label style={labelStyle}>WEIGHT (KG)</label>
            <input
              type="number"
                step="any"
              className="input-text"
              required
              value={formData.weightKg}
              onChange={e => setFormData({...formData, weightKg: e.target.value})}
                placeholder="e.g., 36"
              />
          </div>
            <div style={{ flex: 1 }}>
            <label style={labelStyle}>AGE (MONTHS)</label>
            <input
              type="number"
              className="input-text"
              required
              value={formData.ageMonths}
              onChange={e => setFormData({...formData, ageMonths: e.target.value})}
                placeholder="e.g., 10"
              />
          </div>
          </div>

          <div>
            <label style={labelStyle}>SIZE</label>
            <select className="input-text" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="giant">Giant</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>LIFE STAGE</label>
            <select className="input-text" value={formData.lifeStage} onChange={e => setFormData({...formData, lifeStage: e.target.value})}>
              <option value="puppy">Puppy</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>ACTIVITY LEVEL</label>
            <select className="input-text" value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value})}>
              <option value="low">Low (Sedentary)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Active)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>CLIMATE</label>
            <select className="input-text" value={formData.climate} onChange={e => setFormData({...formData, climate: e.target.value})}>
              <option value="temperate">Temperate</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
            </select>
          </div>

          <div className="col-span-all">
            <label style={labelStyle}>
              ALLERGIES & HEALTH ISSUES (COMMA SEPARATED)
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <input
                type="text" className="input-text" placeholder="Allergies: chicken, dairy..."
                value={formData.allergies}
                onChange={e => setFormData({...formData, allergies: e.target.value})}
              />
              <input
                type="text" className="input-text" placeholder="Issues: obesity, kidney..."
                value={formData.healthIssues}
                onChange={e => setFormData({...formData, healthIssues: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>GOAL</label>
            <select className="input-text" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
              <option value="maintain">Maintain weight</option>
              <option value="lose">Lose weight</option>
              <option value="gain">Gain weight / Muscle</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary col-span-all"
            disabled={loading}
          >
            {loading ? 'Analyzing data...' : 'Analyze nutrition now'}
          </button>
        </form>
      </div>

      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}

      {result && result.recommendation && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Section: Summary & Description */}
          <div className="card-standard" style={{ borderLeft: '6px solid #EE6449', backgroundColor: '#FFFBF8' }}>
            <h3 style={{ marginBottom: 'var(--space-1)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', justifyContent: 'space-between' }}>
              <span>Plan for: {result.breed?.breedName}</span>
              <span style={{ fontSize: 'var(--fs-400)', color: result.breedMatched ? '#438952' : '#EE6449' }}>
                {result.breedMatched ? '● Database Matched' : '● Using Fallback Data'}
              </span>
            </h3>
            <p style={{ color: '#25221E', fontStyle: 'italic' }}>"{result.recommendation.summary}"</p>
            {result.breed?.description && (
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--fs-400)', color: '#666' }}>{result.breed.description}</p>
            )}
          </div>

          {/* Section: Key Metrics */}
          <div className="auto-grid">
            <div className="card-standard" style={{ textAlign: 'center', borderTop: '4px solid #EE6449' }}>
              <div style={{ fontSize: 'var(--fs-300)', color: '#999999', fontWeight: '600' }}>CALORIES / DAY</div>
              <div style={{ fontSize: 'var(--fs-metric)', fontWeight: '600', color: '#EE6449', margin: 'var(--space-1) 0' }}>{result.recommendation.caloriesPerDay} kcal</div>
              <div style={{ fontSize: 'var(--fs-300)' }}>Equivalent to {result.breed?.nutritionProfile?.caloriesPerKg} kcal/kg</div>
            </div>
            <div className="card-standard" style={{ textAlign: 'center', borderTop: '4px solid #316FEA' }}>
              <div style={{ fontSize: 'var(--fs-300)', color: '#999999', fontWeight: '600' }}>MEAL COUNT</div>
              <div style={{ fontSize: 'var(--fs-metric)', fontWeight: '600', color: '#316FEA', margin: 'var(--space-1) 0' }}>{result.recommendation.mealsPerDay} meals</div>
              <div style={{ fontSize: 'var(--fs-300)' }}>{result.recommendation.feedingSchedule?.join(' - ')}</div>
            </div>
            <div className="card-standard" style={{ textAlign: 'center', borderTop: '4px solid #438952' }}>
              <div style={{ fontSize: 'var(--fs-300)', color: '#999999', fontWeight: '600' }}>CONFIDENCE</div>
              <div style={{ fontSize: 'var(--fs-metric)', fontWeight: '600', color: '#438952', margin: 'var(--space-1) 0' }}>{Math.round(result.recommendation.confidence * 100)}%</div>
              <div style={{ fontSize: 'var(--fs-300)' }}>Based on biological metrics</div>
            </div>
          </div>

          {/* Section: Breed Metadata (Dữ liệu từ Database) */}
          <div className="card-standard">
            <h4 style={{ marginBottom: 'var(--space-2)', color: '#25221E' }}>BREED CHARACTERISTICS (DATABASE)</h4>
            <div className="auto-grid" style={{ fontSize: 'var(--fs-400)' }}>
              <div>
                <span style={{ color: '#999' }}>Origin:</span> <strong>{result.breed?.origin}</strong>
              </div>
              <div>
                <span style={{ color: '#999' }}>Size:</span> <strong style={{ textTransform: 'capitalize' }}>{result.breed?.size}</strong>
              </div>
              <div>
                <span style={{ color: '#999' }}>Lifespan:</span> <strong>{result.breed?.lifeExpectancy}</strong>
              </div>
              <div>
                <span style={{ color: '#999' }}>Energy Level:</span> <strong style={{ textTransform: 'capitalize' }}>{result.breed?.energyLevel}</strong>
              </div>
              <div>
                <span style={{ color: '#999' }}>Shedding Level:</span> <strong style={{ textTransform: 'capitalize' }}>{result.breed?.sheddingLevel}</strong>
              </div>
              <div>
                <span style={{ color: '#999' }}>Temperament:</span> <strong>{result.breed?.temperament?.length > 0 ? result.breed.temperament.join(', ') : 'Gentle'}</strong>
              </div>
            </div>
          </div>

          {/* Section: In-depth Nutrition Profile */}
          <div className="card-standard" style={{ backgroundColor: '#F8F9FF' }}>
            <h4 style={{ marginBottom: 'var(--space-2)', color: '#316FEA' }}>IN-DEPTH NUTRITION PROFILE</h4>
            <div className="auto-grid" style={{ textAlign: 'center' }}>
              <div style={{ padding: 'var(--space-1)', background: 'white', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 'var(--fs-300)', color: '#999' }}>PROTEIN</div>
                <div style={{ fontWeight: '600', textTransform: 'uppercase' }}>{result.breed?.nutritionProfile?.proteinRequirement}</div>
              </div>
              <div style={{ padding: 'var(--space-1)', background: 'white', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 'var(--fs-300)', color: '#999' }}>FAT</div>
                <div style={{ fontWeight: '600', textTransform: 'uppercase' }}>{result.breed?.nutritionProfile?.fatRequirement}</div>
              </div>
              <div style={{ padding: 'var(--space-1)', background: 'white', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 'var(--fs-300)', color: '#999' }}>CARBOHYDRATE</div>
                <div style={{ fontWeight: '600', textTransform: 'uppercase' }}>{result.breed?.nutritionProfile?.carbRequirement}</div>
              </div>
            </div>
          </div>

          {/* Section: Dietary Details */}
          <div className="card-standard">
            <h4 style={{ marginBottom: 'var(--space-2)', color: '#25221E', borderBottom: '1px solid #EEE', paddingBottom: 'var(--space-1)' }}>DIETARY DETAILS</h4>
            <div className="form-grid">
              <div>
                <div style={{ color: '#438952', fontWeight: '700', fontSize: 'var(--fs-300)', marginBottom: 'var(--space-1)' }}>✅ RECOMMENDED FOODS</div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--fs-400)', lineHeight: '1.6' }}>
                  {result.recommendation.recommendedFoods.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div>
                <div style={{ color: '#E34432', fontWeight: '700', fontSize: 'var(--fs-300)', marginBottom: 'var(--space-1)' }}>⚠️ WARNINGS / NOTES</div>
                <div style={{ fontSize: 'var(--fs-400)', lineHeight: '1.6' }}>
                  {result.recommendation.warningFlags.map((w, i) => <p key={i}>• {w}</p>)}
                  <p style={{ marginTop: 'var(--space-1)' }}><strong>Water:</strong> {result.recommendation.hydrationTips}</p>
                </div>
              </div>
            </div>
            {result.recommendation.supplementSuggestions?.length > 0 && (
              <div style={{ marginTop: 'var(--space-2)', borderTop: '1px solid rgba(37, 34, 30, 0.08)', paddingTop: 'var(--space-2)' }}>
                <div style={{ color: '#316FEA', fontWeight: '700', fontSize: 'var(--fs-300)', marginBottom: 'var(--space-1)' }}>💊 SUPPLEMENT SUGGESTIONS</div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--fs-400)', lineHeight: '1.6' }}>
                  {result.recommendation.supplementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2)', backgroundColor: '#F2EFED', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-400)' }}>
              <strong>Portion Guidance:</strong> {result.recommendation.portionGuidance}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
