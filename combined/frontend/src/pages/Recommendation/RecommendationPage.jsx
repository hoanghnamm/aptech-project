import React, { useState } from 'react';
import { recommendBreeds } from '../../api/recommendation.api';

const labelStyle = { display: 'block', fontSize: 'var(--fs-300)', fontWeight: '600', marginBottom: 'var(--space-1)' };

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
        setError('No matching breeds found. Try different preferences.');
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
    <div className="page page-wide">
      <div>
        <h1 className="page__title">AI Breed Recommendation</h1>
        <p className="page__subtitle">
          Tell us about your lifestyle and our AI will match you with the most suitable dog breeds.
        </p>
      </div>

      <div className="card-standard">
        <form onSubmit={submit} className="form-grid">
          <div>
            <label style={labelStyle}>HOME SIZE</label>
            <select className="input-text" value={prefs.homeSize} onChange={update('homeSize')}>
              <option value="apartment">Apartment</option>
              <option value="house_small">Small house</option>
              <option value="house_large">Large house / yard</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>ACTIVITY LEVEL</label>
            <select className="input-text" value={prefs.activityLevel} onChange={update('activityLevel')}>
              <option value="low">Low (mostly indoors)</option>
              <option value="medium">Medium (daily walks)</option>
              <option value="high">High (very active)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>FAMILY TYPE</label>
            <select className="input-text" value={prefs.familyType} onChange={update('familyType')}>
              <option value="single">Single</option>
              <option value="couple">Couple</option>
              <option value="family_kids">Family with kids</option>
              <option value="seniors">Seniors</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>CLIMATE</label>
            <select className="input-text" value={prefs.climate} onChange={update('climate')}>
              <option value="temperate">Temperate</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>OWNER EXPERIENCE</label>
            <select className="input-text" value={prefs.experience} onChange={update('experience')}>
              <option value="first_time">First-time owner</option>
              <option value="experienced">Experienced owner</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>SHEDDING TOLERANCE</label>
            <select className="input-text" value={prefs.sheddingTolerance} onChange={update('sheddingTolerance')}>
              <option value="low">Low (minimal shedding)</option>
              <option value="medium">Medium</option>
              <option value="high">High (don't mind shedding)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary col-span-all" disabled={loading}>
            {loading ? 'Finding your match...' : 'Find my breed match'}
          </button>
        </form>
      </div>

      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h3 style={{ fontSize: 'var(--fs-600)' }}>Top matches for you</h3>
          {result.recommendations.map((rec) => (
            <div key={rec.breedName} className="card-standard" style={{ borderLeft: '6px solid #154212' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                <h4 style={{ fontSize: 'var(--fs-600)' }}>{rec.breedName}</h4>
                <span style={{ fontSize: 'var(--fs-500)', fontWeight: '700', color: '#154212' }}>{rec.matchScore}% match</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', marginTop: 'var(--space-1)', fontSize: 'var(--fs-400)', lineHeight: '1.6' }}>
                {rec.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              {rec.details && (
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--fs-300)', color: '#6b645c' }}>
                  Origin: {rec.details.origin} • Size: {rec.details.size} • Energy: {rec.details.energyLevel} • Lifespan: {rec.details.lifeExpectancy}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
