import React, { useState } from 'react';
import { identifyBreed } from '../../api/breed.api';
import { trackBreedView } from '../../api/analytics.api';

export default function BreedRecognitionPage() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setImage(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const reset = () => {
    setFile(null);
    setImage(null);
    setResult(null);
    setError(null);
  };

  const runAIAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const res = await identifyBreed(file);
      const data = res?.data || res;

      if (!data?.success || !data.predictions?.length) {
        setError(
          data?.message ||
            "Could not identify a dog breed from this image. Try a clearer photo."
        );
      } else {
        setResult(data);
        if (data.predictions?.[0]?.breed) trackBreedView(data.predictions[0].breed);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Something went wrong while analyzing the image.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const top = result?.predictions?.[0];
  const details = top?.details;

  return (
    <div className="page">
      <div>
        <h1 className="page__title">AI Breed Recognition</h1>
        <p className="page__subtitle">Upload a clear image of your dog's face or body for AI breed analysis.</p>
      </div>

      <div className="card-standard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: '2px', padding: 'var(--space-6)', backgroundColor: '#FCFCFC' }}>
        {image ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <img src={image} alt="Preview" style={{ maxHeight: 'min(40vh, 18.75rem)', maxWidth: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)' }} />
            <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={reset} disabled={analyzing}>Choose another photo</button>
              <button className="btn-primary" onClick={runAIAnalysis} disabled={analyzing}>
                {analyzing ? 'Scanning image...' : 'Analyze now'}
              </button>
            </div>
          </div>
        ) : (
          <label style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(2.5rem, 1.5rem + 4vw, 3rem)', marginBottom: 'var(--space-2)' }}>📸</div>
            <span style={{ fontSize: 'var(--fs-btn)', fontWeight: '500', color: '#EE6449' }}>Click to choose photo</span> or drag and drop file here
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        )}
      </div>

      {error && (
        <div className="card-standard" style={{ backgroundColor: '#FFF1F0', border: '1px solid rgba(227, 68, 50, 0.25)', color: '#E34432' }}>
          <strong>⚠️ {error}</strong>
        </div>
      )}

      {top && (
        <div className="card-standard" style={{ backgroundColor: '#FFF6F0', border: '1px solid rgba(238, 100, 73, 0.2)' }}>
          <h3 style={{ color: '#EE6449', fontSize: 'var(--fs-600)', marginBottom: 'var(--space-2)' }}>AI Analysis Results</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--fs-400)' }}>
            <div><strong>Identified Breed:</strong> {top.breed} (Confidence: {top.confidencePercentage}%)</div>

            {details ? (
              <>
                {details.origin && <div><strong>Origin:</strong> {details.origin}</div>}
                {details.size && <div><strong>Size:</strong> {details.size}</div>}
                {details.energyLevel && <div><strong>Energy Level:</strong> {details.energyLevel}</div>}
                {details.lifeExpectancy && <div><strong>Life Expectancy:</strong> {details.lifeExpectancy}</div>}
                {Array.isArray(details.temperament) && details.temperament.length > 0 && (
                  <div><strong>Temperament:</strong> {details.temperament.join(', ')}</div>
                )}
                {Array.isArray(details.healthIssues) && details.healthIssues.length > 0 && (
                  <div style={{ color: '#E34432' }}>
                    <strong>⚠️ Common Health Issues:</strong> {details.healthIssues.join(', ')}
                  </div>
                )}
                {details.description && <div>{details.description}</div>}
              </>
            ) : (
              <div style={{ color: '#999999' }}>No detailed profile found in the encyclopedia for this breed yet.</div>
            )}

            {result.predictions.length > 1 && (
              <div style={{ marginTop: 'var(--space-1)' }}>
                <strong>Other possibilities:</strong>{' '}
                {result.predictions.slice(1).map((p) => `${p.breed} (${p.confidencePercentage}%)`).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
