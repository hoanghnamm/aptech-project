import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { PageHeading, Spinner, ErrorNote } from "@/components/ui";
import { uploadGalleryImage, getGallery } from "@/services/api";

const HOST = import.meta.env.VITE_API_URL || "http://localhost:5000";
const absUrl = (u) => (u && u.startsWith("/") ? `${HOST}${u}` : u);

export default function Gallery() {
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
      setError(err?.response?.data?.message || err?.message || "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(null);
  }, [load]);

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
      setError(err?.response?.data?.message || err?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const filterByTag = (tag) => {
    const next = activeTag === tag ? null : tag;
    setActiveTag(next);
    load(next);
  };

  const allTags = Array.from(new Set(items.flatMap((i) => i.tags || [])));

  return (
    <Layout>
      <PageHeading
        title="Visual Archive"
        subtitle="Upload your dog photographs — the AI identification matrix detects the breed and catalogs each image automatically."
      />

      <label
        onDragOver={(e) => e.preventDefault()}
        className="block w-full border border-dashed border-secondary/40 rounded-sm bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer text-center py-12 px-6"
      >
        <span className="material-symbols-outlined text-[48px] text-secondary/50">add_photo_alternate</span>
        <div className="mt-3 font-label-md uppercase tracking-[0.15em] text-primary font-bold">
          {uploading ? "Uploading & tagging…" : "Click to upload a specimen photograph"}
        </div>
        <p className="font-body-sm text-on-surface-variant italic mt-1">JPG / PNG — analyzed on submission</p>
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      <div className="mt-6">{error && <ErrorNote>{error}</ErrorNote>}</div>

      {/* Tag filter */}
      {(allTags.length > 0 || activeTag) && (
        <div className="flex flex-wrap gap-2 items-center mt-6">
          {activeTag ? (
            <button onClick={() => filterByTag(activeTag)} className="font-label-md uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-sm bg-primary text-white border-none cursor-pointer">
              {activeTag} ✕
            </button>
          ) : (
            allTags.slice(0, 14).map((t) => (
              <button key={t} onClick={() => filterByTag(t)} className="font-label-md uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-sm bg-transparent text-secondary border border-secondary/20 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                {t}
              </button>
            ))
          )}
        </div>
      )}

      <div className="mt-8">
        {loading && <Spinner label="Loading archive…" />}
        {!loading && items.length === 0 && (
          <div className="text-center font-body-md text-on-surface-variant italic py-12">
            No photographs catalogued yet. Upload your first specimen above.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id || item.imageUrl} className="border border-secondary/20 rounded-sm overflow-hidden bg-surface-container-lowest flex flex-col">
              <div className="aspect-square overflow-hidden bg-surface-container-high">
                <img
                  src={absUrl(item.imageUrl)}
                  alt={item.breed || "Specimen"}
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                {item.breed && (
                  <div className="font-headline-md text-[16px] text-primary">
                    {item.breed}
                    {item.confidence != null && (
                      <span className="font-body-sm text-secondary"> · {item.confidence}%</span>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {(item.tags || []).map((t) => (
                    <button key={t} onClick={() => filterByTag(t)} className="font-label-md uppercase tracking-wider text-[9px] px-2 py-1 rounded-sm bg-surface-container-high text-secondary border border-secondary/10 hover:text-primary transition-colors cursor-pointer">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
