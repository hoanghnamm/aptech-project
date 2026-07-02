import React, { useState, useEffect, useCallback } from 'react';
import { uploadGalleryImage, getGallery } from '../../api/gallery.api';

const CHIP = "font-label-md text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm border cursor-pointer transition-colors";

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
      setError(err?.response?.data?.message || err?.message || 'Failed to load archive.');
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

  const allTags = Array.from(new Set(items.flatMap((i) => i.tags || [])));

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-12 bg-[#FEFDFC] text-[#25221E] min-h-screen">
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
          Visual Archives
        </span>
        <h1 className="font-headline-xl text-[clamp(2rem,4vw,2.75rem)] text-[#25221E] leading-tight">
          Photographic Plates
        </h1>
        <p className="font-serif italic text-[15px] text-[#5C3A21]/85 leading-relaxed">
          Contribute a photograph to the archive — our index catalogues each plate by breed and trait.
        </p>
      </header>

      {/* Deposit */}
      <label className="block cursor-pointer bg-[#FCFBF7] border border-dashed border-[#25221E]/25 rounded-sm p-10 text-center hover:border-[#EE6449] transition-colors">
        <div className="text-[2.5rem] mb-2">🖼️</div>
        <span className="font-label-md text-[11px] uppercase tracking-[0.2em] text-[#EE6449] font-bold">
          {uploading ? 'Cataloguing plate…' : 'Deposit a photographic plate'}
        </span>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
      </label>

      {error && <div className="border-l-2 border-error bg-[#FEFDFC] p-6 font-serif italic text-error">{error}</div>}

      {/* Tag filters */}
      {(allTags.length > 0 || activeTag) && (
        <div className="flex flex-wrap gap-2 items-center">
          {activeTag && (
            <button onClick={() => filterByTag(activeTag)} className={`${CHIP} bg-[#25221E] text-white border-[#25221E]`}>
              {activeTag} ✕
            </button>
          )}
          {!activeTag && allTags.slice(0, 12).map((t) => (
            <button key={t} onClick={() => filterByTag(t)} className={`${CHIP} bg-[#F5EFE3] text-[#5C3A21] border-[#e3d7bf] hover:border-[#EE6449]`}>
              {t}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="text-center font-serif italic text-[#5C3A21]/60">Retrieving the archive…</div>}
      {!loading && items.length === 0 && (
        <div className="border border-dashed border-[#25221E]/15 rounded-sm p-12 text-center font-serif italic text-[#5C3A21]/60">
          No plates catalogued yet. Deposit the first above.
        </div>
      )}

      {/* Specimen frames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item) => (
          <div
            key={item._id || item.imageUrl}
            className="relative p-3.5 bg-[#F5EFE3] border-[10px] md:border-[14px] border-[#4E3629] rounded-[4px] shadow-[0_16px_36px_rgba(40,25,10,0.3)] w-full flex flex-col"
          >
            <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px]" />
            <img
              src={item.imageUrl}
              alt={item.breed || 'Dog'}
              className="w-full h-auto max-h-[320px] object-cover rounded-sm"
              loading="lazy"
            />
            <div className="mt-4 pt-3 border-t border-[#e3d7bf]/60 text-center flex flex-col gap-2">
              <p className="font-serif italic text-[13px] text-[#5C3A21]/85 leading-relaxed">
                {item.breed ? `Plate — ${item.breed}` : 'Uncatalogued plate'}
                {item.confidence != null && `, ${item.confidence}% certainty`}
              </p>
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {item.tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => filterByTag(t)}
                      className="font-label-md text-[9px] uppercase tracking-[0.15em] text-[#5C3A21]/70 hover:text-[#EE6449] bg-transparent border-none cursor-pointer"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
