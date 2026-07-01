import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { identifyBreed, trackBreedView } from "@/services/api";

const LOADING_FACTS = [
  "Analyzing cranial structure metrics…",
  "Cross-referencing pigmentary traits with archival data…",
  "Evaluating morphological indicators…",
];

export function ImageAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      setLoadingText(LOADING_FACTS[0]);
      interval = setInterval(() => {
        i++;
        setLoadingText(LOADING_FACTS[i % LOADING_FACTS.length]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const onFile = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setResults(null);
      setError(null);
    }
  };

  const scan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await identifyBreed(file);
      if (!data?.success || !data.predictions?.length) {
        setError("The system could not extract identifying features. Please provide a clearer specimen photograph.");
      } else {
        setResults(data.predictions);
        if (data.predictions[0]?.breed) trackBreedView(data.predictions[0].breed);
      }
    } catch {
      setError("Archival system disruption or invalid imagery detected. Please try a clearer photograph.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  const isSplit = loading || results || error;
  const top = results?.[0];
  const openRecord = (name) => {
    trackBreedView(name);
    navigate(`/breeds/${encodeURIComponent(name)}`);
  };

  return (
    <Layout>
      {/* Header (collapses on analysis) */}
      <div
        className={`text-center max-w-2xl mx-auto flex flex-col gap-4 overflow-hidden transition-all duration-700 ${
          isSplit ? "max-h-0 opacity-0 mb-0" : "max-h-[220px] opacity-100 mb-10"
        }`}
      >
        <h1 className="font-headline-xl text-primary leading-tight">Digitize Specimen</h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          Upload high-resolution photography of the subject to engage the archival identification matrix.
        </p>
      </div>

      <div className={`mx-auto w-full flex flex-col lg:flex-row items-start gap-12 transition-all duration-700 ${isSplit ? "max-w-[1280px]" : "max-w-2xl"}`}>
        {/* Image column */}
        <div className={`w-full shrink-0 transition-all duration-700 ${isSplit ? "lg:w-5/12 lg:sticky lg:top-24" : "lg:w-full"}`}>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={onFile}
            className={`w-full bg-surface-container-lowest flex flex-col items-center justify-center gap-5 relative overflow-hidden group rounded-sm transition-all duration-700 ${
              isSplit ? "aspect-[4/5] border border-secondary/20 p-3" : "h-[380px] md:h-[440px] border border-dashed border-secondary/40 cursor-pointer hover:bg-surface-container"
            }`}
          >
            {previewUrl ? (
              <div className="w-full h-full relative overflow-hidden rounded-sm">
                <img src={previewUrl} alt="Specimen" className={`w-full h-full object-cover transition-all duration-1000 ${isSplit ? "grayscale-[20%] contrast-105" : "group-hover:opacity-70"}`} />
                {!isSplit && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-label-md text-primary uppercase tracking-[0.2em] font-bold bg-surface-container-high px-4 py-2 border border-secondary/20">Change Specimen</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-secondary/50 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[60px] font-light">center_focus_weak</span>
                <div className="text-center">
                  <p className="font-label-md uppercase tracking-[0.2em] font-bold mb-2">Drag & Drop Image</p>
                  <p className="font-body-md italic opacity-80">or click to browse local archives</p>
                </div>
              </div>
            )}
            {!isSplit && <input type="file" accept="image/*" className="hidden" onChange={onFile} />}
          </label>

          <div className={`flex justify-center overflow-hidden transition-all duration-700 ${isSplit || !file ? "h-0 opacity-0 mt-0" : "h-[80px] opacity-100 mt-8"}`}>
            <button onClick={scan} className="px-12 py-4 rounded-sm font-label-md uppercase tracking-[0.2em] bg-primary text-white hover:bg-[#0f2e0d] transition-colors border-none cursor-pointer">
              Commence Analysis
            </button>
          </div>
        </div>

        {/* Ledger column */}
        <div className={`w-full transition-all duration-700 ${isSplit ? "lg:w-7/12 opacity-100" : "lg:w-0 opacity-0 max-h-0 overflow-hidden"}`}>
          {loading && (
            <div className="flex flex-col items-center justify-center gap-8 min-h-[400px] w-full bg-surface-container-lowest border border-secondary/20 rounded-sm p-12">
              <div className="w-12 h-12 border border-secondary/20 border-t-primary rounded-full animate-spin" />
              <p className="font-body-md text-primary italic text-center animate-pulse tracking-wide">{loadingText}</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center gap-6 w-full bg-surface-container-lowest border-t-2 border-error p-10 rounded-sm">
              <span className="material-symbols-outlined text-[48px] text-error font-light">troubleshoot</span>
              <div className="text-center flex flex-col gap-3">
                <h3 className="font-headline-lg text-error">Extraction Failed</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto">{error}</p>
              </div>
              <button onClick={reset} className="font-label-md text-secondary hover:text-primary transition-colors uppercase tracking-[0.15em] cursor-pointer bg-transparent border-b border-secondary/30 pb-1">
                Mount New Specimen
              </button>
            </div>
          )}

          {results && !loading && (
            <div className="flex flex-col gap-10 w-full">
              <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
                <h2 className="font-headline-xl text-primary">Diagnostic Ledger</h2>
                <button onClick={reset} className="font-label-md text-secondary hover:text-primary transition-colors uppercase tracking-[0.15em] cursor-pointer bg-transparent border-0">
                  New Scan
                </button>
              </div>

              {/* Primary */}
              {top && (
                <div className="bg-surface-container-lowest border border-secondary/20 p-8 flex flex-col gap-6 rounded-sm">
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-4 border-b border-secondary/20 pb-6">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="font-label-md text-secondary tracking-[0.2em] uppercase text-[10px]">Primary Designation</div>
                      <h3 className="font-headline-xl text-primary leading-tight">{top.breed}</h3>
                    </div>
                    <div className="bg-tertiary text-on-tertiary px-4 py-2 font-label-md rounded-sm uppercase tracking-widest shrink-0">
                      {top.confidencePercentage}% Match
                    </div>
                  </div>

                  <p className="font-body-md text-on-surface-variant leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                    {top.details?.description || "Phenotypic analysis indicates correlation with archival records. Open the full profile for anatomical data."}
                  </p>

                  {top.details?.temperament?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {top.details.temperament.slice(0, 5).map((t, i) => (
                        <span key={i} className="bg-surface-container-high text-secondary font-label-md px-3 py-1 border border-secondary/10 uppercase tracking-widest text-[10px] rounded-sm">{t}</span>
                      ))}
                    </div>
                  )}

                  {top.details && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 font-body-sm text-secondary">
                      {top.details.origin && <span>📍 {top.details.origin}</span>}
                      {top.details.size && <span className="capitalize">📏 {top.details.size}</span>}
                      {top.details.energyLevel && <span className="capitalize">⚡ {top.details.energyLevel}</span>}
                      {top.details.lifeExpectancy && <span>⏳ {top.details.lifeExpectancy}</span>}
                    </div>
                  )}

                  <div className="pt-4 border-t border-secondary/10">
                    <button
                      onClick={() => top.details && openRecord(top.breed)}
                      disabled={!top.details}
                      className="group bg-primary text-white font-label-md uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-[#0f2e0d] transition-colors flex items-center gap-3 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer"
                    >
                      {top.details ? "Open Archival Record" : "Record Unavailable"}
                      {top.details && <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-variants */}
              {results.length > 1 && (
                <div className="flex flex-col gap-2">
                  <h4 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/20 pb-3 text-[10px]">Correlated Sub-Variants</h4>
                  {results.slice(1, 4).map((m, idx) => (
                    <article
                      key={idx}
                      onClick={() => m.details && openRecord(m.breed)}
                      className={`bg-surface-container-lowest border-b border-secondary/10 py-5 px-4 flex justify-between items-center transition-colors group ${m.details ? "hover:bg-surface-container-low cursor-pointer" : "opacity-60"}`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 bg-surface-container-high border border-secondary/10 flex items-center justify-center text-secondary shrink-0 rounded-sm group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px] font-light">{m.details ? "search" : "visibility_off"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 truncate">
                          <div className="font-headline-md text-[18px] text-on-surface truncate">{m.breed}</div>
                          <div className="font-body-sm text-secondary italic text-[13px]">{m.details ? "Correlation noted" : "Unarchived correlation"}</div>
                        </div>
                      </div>
                      <div className="font-label-md text-secondary text-[14px] shrink-0 pl-4">{m.confidencePercentage}%</div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ImageAnalyzer;
