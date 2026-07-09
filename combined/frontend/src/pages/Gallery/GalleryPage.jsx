import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uploadGalleryImage, getGallery } from '../../api/gallery.api';
import { useAuth } from '../../context/AuthContext';

export default function GalleryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showMine, setShowMine] = useState(false);

  // Staged upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
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

  // Stage a file for review instead of immediate upload
  const prepareFile = (file) => {
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewFileUrl(URL.createObjectURL(file));
      setUploadSuccess(false);
      setError(null);
    } else {
      setError("Please select or drop a valid image file.");
    }
  };

  // Triggers actual posting to backend
  const handlePost = async () => {
    if (!selectedFile || uploading) return;
    setUploading(true);
    setError(null);
    setUploadSuccess(false);
    try {
      const newItem = await uploadGalleryImage(selectedFile);
      if (activeTag && !(newItem.tags || []).includes(activeTag)) {
        setActiveTag(null);
      }
      setItems((prev) => [newItem, ...prev]);
      setUploadSuccess(true);
      setSelectedFile(null);
      setPreviewFileUrl(null);
      
      // Auto dismiss success notification after 4 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 4000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Archive upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPost = () => {
    setSelectedFile(null);
    setPreviewFileUrl(null);
    setError(null);
  };

  const handleUpload = (e) => {
    prepareFile(e.target.files[0]);
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
    prepareFile(file);
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

  // Filter for "My Submissions" tab
  const displayItems = showMine && user
    ? items.filter((item) => {
        const uploaderId = item.userId?._id || item.userId;
        return uploaderId === user._id || uploaderId === user.id;
      })
    : items;

  // Helper: get user initial
  const getInitial = (name) => {
    if (!name || name === 'Guest') return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="page page-wide" style={{ position: 'relative' }}>
      <div className="nutrition-bg-pattern" style={{ position: 'absolute', zIndex: -1 }}></div>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <h1 className="page__title" style={{ color: 'var(--primary-coral)' }}>Visual Archives & Tagging</h1>
        <p className="page__subtitle" style={{ color: 'var(--sepia)' }}>
          Contribute to the PawIntel biological records. Upload an image, and our AI will automatically classify and tag the specimen.
        </p>
      </div>

      {/* Success Notification */}
      {uploadSuccess && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          marginBottom: 'var(--space-4)',
          fontWeight: 600,
          textAlign: 'center',
          fontSize: 'var(--fs-400)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#155724', fontSize: '20px' }}>check_circle</span>
          Uploaded successfully
        </div>
      )}

      {/* Dropzone or Review Card */}
      {!selectedFile ? (
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
              {isDragging ? 'Drop Image Here' : 'Click or Drag & Drop to Upload Specimen'}
            </span>
            <p style={{ color: 'var(--sepia)', fontSize: 'var(--fs-300)', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Supports JPG, PNG, WEBP.
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>
      ) : (
        /* Image Review and Post Area */
        <div 
          className="card-standard"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
            borderColor: 'var(--primary-coral)',
            position: 'relative',
            backgroundColor: '#fff',
            borderWidth: '2px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-coral)', fontSize: 'var(--fs-600)' }}>
            Review Biological Specimen
          </h3>
          <div style={{
            maxWidth: '100%',
            height: '240px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-pale-beige)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img 
              src={previewFileUrl} 
              alt="Staged specimen" 
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ fontSize: 'var(--fs-300)', color: 'var(--sepia)', fontStyle: 'italic' }}>
            File: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={handleCancelPost}
              disabled={uploading}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid var(--border-color)',
                background: '#fff',
                color: 'var(--primary-dark)',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: 'var(--fs-300)',
                fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.background = '#f3f4ed'; }}
              onMouseLeave={(e) => { if (!uploading) e.currentTarget.style.background = '#fff'; }}
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={uploading}
              style={{
                padding: '0.625rem 2rem',
                borderRadius: '9999px',
                border: 'none',
                background: uploading ? '#625e50' : '#154212',
                color: '#fff',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: 'var(--fs-300)',
                fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.background = '#2d5a27'; }}
              onMouseLeave={(e) => { if (!uploading) e.currentTarget.style.background = '#154212'; }}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && <div style={{ color: 'var(--error-state)', textAlign: 'center', fontWeight: '600', background: 'var(--bg-pale-beige)', padding: 'var(--space-2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}

      {/* Tabs: All / My Submissions */}
      {user && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <button
            onClick={() => setShowMine(false)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: !showMine ? '#154212' : 'var(--bg-white)',
              color: !showMine ? '#fff' : 'var(--primary-dark)',
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: 'var(--fs-300)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            All Records
          </button>
          <button
            onClick={() => setShowMine(true)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: showMine ? '#154212' : 'var(--bg-white)',
              color: showMine ? '#fff' : 'var(--primary-dark)',
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: 'var(--fs-300)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            My Submissions
          </button>
        </div>
      )}

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
      
      {!loading && displayItems.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--sepia)', padding: 'var(--space-6)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          {showMine ? 'You haven\'t submitted any photos yet.' : 'No photographic records found in the archive.'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 16rem), 1fr))', gap: 'var(--space-3)' }}>
        {displayItems.map((item) => (
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
              {/* Uploader info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: item.uploaderName === 'Guest' ? '#c2c9bb' : 'linear-gradient(135deg, #2d5a27, #154212)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                    {getInitial(item.uploaderName)}
                  </span>
                </div>
                <span style={{
                  fontSize: 'var(--fs-300)',
                  color: 'var(--sepia)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.uploaderName || 'Guest'}
                </span>
              </div>

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

      {hasMore && !showMine && (
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
