import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uploadGalleryImage, getGallery } from '../../api/gallery.api';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 12;

  const fileInputRef = useRef(null);

  const load = useCallback(async (tag, pageNum = 1, append = false) => {
    if (!append) setLoading(true);
    setError(null);
    try {
      const data = await getGallery(tag, pageNum, LIMIT);
      const fetchedItems = data.items || [];
      
      if (append) {
        setItems((prev) => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(i => i._id || i.imageUrl));
          const newUnique = fetchedItems.filter(i => !existingIds.has(i._id || i.imageUrl));
          return [...prev, ...newUnique];
        });
      } else {
        setItems(fetchedItems);
      }
      
      setHasMore(fetchedItems.length === LIMIT && (pageNum * LIMIT < data.total));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load gallery archives.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    setPage(1);
    load(activeTag, 1, false); 
  }, [activeTag, load]);

  const processFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const newItem = await uploadGalleryImage(file);
      if (activeTag && !(newItem.tags || []).includes(activeTag)) {
        setActiveTag(null);
      }
      setItems((prev) => [newItem, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Archive upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = (e) => {
    processFile(e.target.files[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const filterByTag = (tag) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    load(activeTag, nextPage, true);
  };

  // Collect all tags currently visible for the filter bar
  const allTags = Array.from(new Set(items.flatMap((i) => i.tags || [])));

  return (
    <div className="page page-wide" style={{ position: 'relative' }}>
      <div className="nutrition-bg-pattern" style={{ position: 'absolute', zIndex: -1 }}></div>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <h1 className="page__title" style={{ color: 'var(--primary-coral)' }}>Visual Archives & Tagging</h1>
        <p className="page__subtitle" style={{ color: 'var(--sepia)' }}>
          Contribute to the PawIntel biological records. Upload an image, and our AI will automatically classify and tag the specimen.
        </p>
      </div>

      <div 
        className="card-standard" 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ 
          borderStyle: 'dashed', 
          borderWidth: '2px', 
          textAlign: 'center', 
          backgroundColor: isDragging ? 'var(--bg-pale-beige)' : 'var(--bg-white)',
          borderColor: isDragging ? 'var(--primary-coral)' : 'var(--border-color)',
          transition: 'all 0.2s ease',
          marginBottom: 'var(--space-4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <label style={{ cursor: 'pointer', display: 'block', padding: 'var(--space-4) var(--space-2)' }}>
          <div style={{ fontSize: 'clamp(2rem, 1.5rem + 3vw, 2.5rem)', marginBottom: 'var(--space-2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit', color: 'var(--tertiary-accent)' }}>add_photo_alternate</span>
          </div>
          <span style={{ color: 'var(--primary-coral)', fontWeight: '600', fontSize: 'var(--fs-btn)', fontFamily: 'var(--font-display)', display: 'block' }}>
            {uploading ? 'Processing & Analyzing...' : (isDragging ? 'Drop Image Here' : 'Click or Drag & Drop to Upload Specimen')}
          </span>
          <p style={{ color: 'var(--sepia)', fontSize: 'var(--fs-300)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Supports JPG, PNG, WEBP.
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
        
        {uploading && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyItems: 'center', borderRadius: 'inherit', alignContent: 'center', justifyContent: 'center' }}>
            <div className="w-8 h-8 border-2 border-secondary/20 border-t-primary rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--primary-coral)' }}></div>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'var(--error-state)', textAlign: 'center', fontWeight: '600', background: 'var(--bg-pale-beige)', padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}

      {/* Tag filter bar */}
      {(allTags.length > 0 || activeTag) && (
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ color: 'var(--sepia)', fontSize: 'var(--fs-300)', fontWeight: '600', textTransform: 'uppercase', marginRight: '0.5rem' }}>Filter by Trait:</span>
          {activeTag && (
            <button className="feature-tag" style={{ cursor: 'pointer', background: 'var(--primary-coral)', color: 'var(--bg-white)', border: '1px solid var(--primary-coral)' }} onClick={() => filterByTag(activeTag)}>
              {activeTag} <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>✕</span>
            </button>
          )}
          {!activeTag && allTags.slice(0, 12).map((t) => (
            <button key={t} className="feature-tag" style={{ cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--bg-white)', color: 'var(--primary-dark)' }} onClick={() => filterByTag(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {loading && page === 1 && <div style={{ textAlign: 'center', color: 'var(--sepia)', fontStyle: 'italic' }}>Retrieving visual archives...</div>}
      
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--sepia)', padding: 'var(--space-6)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          No photographic records found in the archive.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 16rem), 1fr))', gap: 'var(--space-3)' }}>
        {items.map((item) => (
          <div key={item._id || item.imageUrl} className="card-standard" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: 'var(--bg-pale-beige)' }}>
              <img
                src={item.imageUrl}
                alt={item.breed || 'Biological Specimen'}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderBottom: '1px solid var(--border-color)' }}
                loading="lazy"
              />
            </div>
            <div style={{ padding: 'var(--space-3)', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-white)' }}>
              {item.breed && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                  <div style={{ fontWeight: '600', fontSize: 'var(--fs-500)', color: 'var(--primary-dark)', fontFamily: 'var(--font-display)' }}>
                    {item.breed}
                  </div>
                  {item.confidence != null && (
                    <div style={{ fontSize: 'var(--fs-300)', color: 'var(--bg-white)', backgroundColor: 'var(--tertiary-accent)', padding: '0.2em 0.5em', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}>
                      {Math.round(item.confidence)}%
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.4em', flexWrap: 'wrap', marginTop: 'auto' }}>
                {(item.tags || []).map((t) => (
                  <span key={t} className="feature-tag" style={{ cursor: 'pointer', fontSize: 'var(--fs-300)', padding: '0.2em 0.6em', background: 'var(--bg-pale-beige)', color: 'var(--sepia)', border: '1px solid var(--border-color)' }} onClick={() => filterByTag(t)}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <button 
            className="btn-secondary" 
            onClick={handleLoadMore} 
            disabled={loading}
            style={{ padding: '0.8em 2em' }}
          >
            {loading ? 'Retrieving more records...' : 'Load More Records'}
          </button>
        </div>
      )}
    </div>
  );
}
