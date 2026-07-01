import React, { useState, useEffect, useCallback } from 'react';
import { uploadGalleryImage, getGallery } from '../../api/gallery.api';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (tag) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGallery(tag);
      setItems(data.items || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(null); }, [load]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const newItem = await uploadGalleryImage(file);
      setActiveTag(null);
      setItems((prev) => [newItem, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const filterByTag = (tag) => {
    const next = activeTag === tag ? null : tag;
    setActiveTag(next);
    load(next);
  };

  // Collect all tags currently visible for the filter bar
  const allTags = Array.from(new Set(items.flatMap((i) => i.tags || [])));

  return (
    <div className="page page-wide">
      <div>
        <h1 className="page__title">AI Tagging Gallery</h1>
        <p className="page__subtitle">
          Upload your dog photos — our AI automatically detects the breed and tags each image.
        </p>
      </div>

      <div className="card-standard" style={{ borderStyle: 'dashed', borderWidth: '2px', textAlign: 'center', backgroundColor: '#FCFCFC' }}>
        <label style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{ fontSize: 'clamp(2rem, 1.5rem + 3vw, 3rem)', marginBottom: 'var(--space-1)' }}>📸</div>
          <span style={{ color: '#EE6449', fontWeight: '600', fontSize: 'var(--fs-btn)' }}>
            {uploading ? 'Uploading & tagging…' : 'Click to upload a dog photo'}
          </span>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>

      {error && <div style={{ color: '#E34432', textAlign: 'center', fontWeight: '600' }}>⚠️ {error}</div>}

      {/* Tag filter bar */}
      {(allTags.length > 0 || activeTag) && (
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', alignItems: 'center' }}>
          {activeTag && (
            <button className="feature-tag" style={{ cursor: 'pointer', background: '#EE6449', color: '#fff' }} onClick={() => filterByTag(activeTag)}>
              {activeTag} ✕
            </button>
          )}
          {!activeTag && allTags.slice(0, 12).map((t) => (
            <button key={t} className="feature-tag" style={{ cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => filterByTag(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', color: '#999999' }}>Loading gallery…</div>}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999999' }}>
          No photos yet. Upload your first dog photo above!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 15rem), 1fr))', gap: 'var(--space-3)' }}>
        {items.map((item) => (
          <div key={item._id || item.imageUrl} className="card-standard" style={{ padding: '0', overflow: 'hidden' }}>
            <img
              src={item.imageUrl}
              alt={item.breed || 'Dog'}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: 'var(--space-2)' }}>
              {item.breed && (
                <div style={{ fontWeight: '700', fontSize: 'var(--fs-400)', marginBottom: 'var(--space-1)' }}>
                  {item.breed} {item.confidence != null && <span style={{ color: '#999' }}>({item.confidence}%)</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.4em', flexWrap: 'wrap' }}>
                {(item.tags || []).map((t) => (
                  <span key={t} className="feature-tag" style={{ cursor: 'pointer', fontSize: 'var(--fs-300)' }} onClick={() => filterByTag(t)}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
