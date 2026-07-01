import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Footer } from "@/components/Footer";
const API_BASE = "http://localhost:5000/api/v1";

export function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [systemFunFact, setSystemFunFact] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadingFacts = [
    "Analyzing cranial structure metrics...",
    "Cross-referencing pigmentary traits with archival data...",
    "Evaluating morphological indicators...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      setLoadingText(loadingFacts[0]);
      interval = setInterval(() => {
        i++;
        setLoadingText(loadingFacts[i % loadingFacts.length]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const savedResults = sessionStorage.getItem("identifyResults");
    const savedPreviewUrl = sessionStorage.getItem("identifyPreviewUrl");
    const savedFact = sessionStorage.getItem("identifyFact");

    if (savedResults && savedPreviewUrl) {
      setResults(JSON.parse(savedResults));
      setPreviewUrl(savedPreviewUrl);
      setSystemFunFact(savedFact || "");
    }
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0] || e.target.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/ai/identify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = response.data?.data || response.data;

      if (response.data?.success || payload?.success) {
        const preds = payload.predictions || [];
        const fact = payload.systemFunFact || "";

        setResults(preds);
        setSystemFunFact(fact);

        sessionStorage.setItem("identifyResults", JSON.stringify(preds));
        sessionStorage.setItem("identifyFact", fact);
        sessionStorage.setItem("identifyPreviewUrl", previewUrl);
      } else {
        setError(
          "Due to archival limitations or suboptimal lighting of the specimen, the system could not extract identifying features. Please try again with a clearer photograph.",
        );
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(
        "Archival system disruption or invalid imagery detected. Please provide a clearer specimen photograph.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreviewUrl(null);
    setResults(null);
    setSystemFunFact("");
    setError(null);
    sessionStorage.removeItem("identifyResults");
    sessionStorage.removeItem("identifyPreviewUrl");
    sessionStorage.removeItem("identifyFact");
  };

  // Cờ kiểm soát hiệu ứng tách đôi màn hình
  const isSplit = loading || results || error;

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-tertiary selection:text-on-tertiary overflow-x-hidden">
      {/* NAVBAR */}
      <header className="bg-surface border-b border-secondary/20 sticky top-0 z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-[1280px] mx-auto w-full">
          <div
            className="font-headline-lg text-primary tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            Canis Archive
          </div>
          <nav className="hidden md:flex gap-8 items-center font-label-md uppercase tracking-widest text-[11px]">
            <span
              onClick={() => navigate("/breeds")}
              className="text-on-surface-variant hover:text-primary pb-1 border-b-2 border-transparent transition-colors cursor-pointer"
            >
              Encyclopedia
            </span>
            <span className="text-primary border-b-2 border-primary pb-1 font-bold cursor-pointer transition-colors">
              Identify
            </span>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-12 flex flex-col justify-center">
        {/* HEADER TEXT (Mờ đi và thu gọn khi bắt đầu phân tích) */}
        <div
          className={`text-center max-w-2xl mx-auto flex flex-col gap-4 overflow-hidden transition-all duration-[800ms] ease-in-out ${
            isSplit
              ? "max-h-0 opacity-0 mb-0"
              : "max-h-[200px] opacity-100 mb-10"
          }`}
        >
          <h1 className="font-headline-xl text-primary leading-tight">
            Digitize Specimen
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Upload high-resolution photography of the subject to engage the
            archival identification matrix. Ensure neutral lighting for optimal
            phenotypical analysis.
          </p>
        </div>

        {/* CONTAINER HIỆU ỨNG TRƯỢT */}
        <div
          className={`mx-auto w-full flex flex-col lg:flex-row items-start transition-all duration-[1000ms] ease-in-out ${
            isSplit ? "max-w-[1280px]" : "max-w-2xl"
          }`}
        >
          {/* CỘT TRÁI: Ô CHỨA ẢNH */}
          <div
            className={`w-full shrink-0 transition-all duration-[1000ms] ease-in-out ${
              isSplit ? "lg:w-5/12 sticky top-24" : "lg:w-full"
            }`}
          >
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`w-full bg-surface-container-lowest flex flex-col items-center justify-center gap-5 relative overflow-hidden group shadow-none transition-all duration-[1000ms] ${
                isSplit
                  ? "aspect-[4/5] border border-secondary/20 p-3 rounded-sm"
                  : "h-[380px] md:h-[460px] border border-dashed border-secondary/40 cursor-pointer hover:bg-surface-container rounded-sm"
              }`}
            >
              {previewUrl ? (
                <div
                  className={`w-full h-full relative overflow-hidden rounded-sm ${isSplit ? "bg-surface-variant border border-secondary/10" : ""}`}
                >
                  <img
                    src={previewUrl}
                    alt="Specimen"
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      isSplit
                        ? "grayscale-[20%] sepia-[10%] contrast-105"
                        : "group-hover:scale-105 group-hover:opacity-60"
                    }`}
                  />
                  {/* Text khi chưa phân tích */}
                  {!isSplit && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="material-symbols-outlined text-[40px] text-primary mb-2">
                        swap_horiz
                      </span>
                      <p className="font-label-md text-primary uppercase tracking-[0.2em] font-bold bg-surface-container-high px-4 py-2 border border-secondary/20">
                        Change Specimen
                      </p>
                    </div>
                  )}
                  {/* Nhãn hiệu ĐÃ FIX YÊU CẦU: ANALYSIS COMPLETE khi hoàn tất */}
                  {isSplit && results && (
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="px-3 py-1.5 bg-surface text-primary font-label-md text-[10px] uppercase tracking-widest border border-secondary/20 rounded-sm flex items-center gap-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">
                          task_alt
                        </span>
                        Analysis Complete
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-secondary/50 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[60px] font-light">
                    view_finder
                  </span>
                  <div className="text-center">
                    <p className="font-label-md uppercase tracking-[0.2em] font-bold mb-2">
                      Drag & Drop Image
                    </p>
                    <p className="font-body-md italic opacity-80">
                      or click to browse local archives
                    </p>
                  </div>
                </div>
              )}
              {!isSplit && (
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileDrop}
                />
              )}
            </label>

            {/* Nút bấm Initiate (Tự ẩn đi khi bắt đầu trượt) */}
            <div
              className={`flex justify-center overflow-hidden transition-all duration-[800ms] ease-in-out ${
                isSplit || !file
                  ? "h-0 opacity-0 mt-0"
                  : "h-[80px] opacity-100 mt-8"
              }`}
            >
              <button
                onClick={handleScan}
                className="px-12 py-4 h-fit rounded-sm font-label-md uppercase tracking-[0.2em] transition-colors duration-300 border-none cursor-pointer bg-primary text-white hover:bg-[#0f2e0d] shadow-none"
              >
                Commence Analysis
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN SỔ CÁI (Mở bung ra) */}

          <div
            className={`w-full relative z-20 transition-all duration-[1000ms] ease-in-out ${
              isSplit
                ? "lg:w-7/12 opacity-100 max-h-[5000px] overflow-visible"
                : "lg:w-0 opacity-0 max-h-0 lg:max-h-[5000px] overflow-hidden"
            }`}
          >
            <div className="w-full lg:min-w-[650px] lg:pl-16 pt-12 lg:pt-0 flex flex-col gap-10">
              {/* TRẠNG THÁI LOADING */}
              {loading && (
                <div className="flex flex-col items-center justify-center gap-8 min-h-[500px] w-full bg-surface-container-lowest border border-secondary/20 rounded-sm p-12">
                  <div className="w-12 h-12 border border-secondary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="font-body-md text-primary italic text-center animate-pulse tracking-wide">
                    {loadingText}
                  </p>
                </div>
              )}

              {/* TRẠNG THÁI ERROR */}
              {error && !loading && !results && (
                <div className="flex flex-col items-center justify-center gap-6 w-full bg-surface-container-lowest border-t-2 border-error p-10 rounded-sm">
                  <span className="material-symbols-outlined text-[48px] text-error opacity-80 font-light">
                    troubleshoot
                  </span>
                  <div className="text-center flex flex-col gap-3">
                    <h3 className="font-headline-lg text-error">
                      Extraction Failed
                    </h3>
                    <p className="font-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={resetScan}
                    className="mt-2 font-label-md text-secondary hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-[0.15em] cursor-pointer bg-transparent border-b border-secondary/30 hover:border-primary pb-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      refresh
                    </span>
                    Mount New Specimen
                  </button>
                </div>
              )}

              {/* TRẠNG THÁI KẾT QUẢ SỔ CÁI (LEDGER) */}
              {results && !loading && (
                <div className="flex flex-col gap-10 w-full transition-opacity duration-700">
                  <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
                    <h2 className="font-headline-xl text-primary">
                      Diagnostic Ledger
                    </h2>
                    <button
                      onClick={resetScan}
                      className="font-label-md text-secondary hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-[0.15em] cursor-pointer bg-transparent border-0"
                    >
                      <span className="material-symbols-outlined text-sm">
                        refresh
                      </span>
                      New Scan
                    </button>
                  </div>

                  <div className="flex flex-col gap-10">
                    {/* 1. PRIMARY MATCH */}
                    {results.length > 0 && (
                      <div className="bg-surface-container-lowest border border-secondary/20 p-8 flex flex-col gap-6 rounded-sm shadow-none">
                        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-4 border-b border-secondary/20 pb-6">
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="font-label-md text-secondary opacity-80 tracking-[0.2em] uppercase text-[10px]">
                              Primary Designation
                            </div>
                            <h3 className="font-headline-xl text-primary leading-tight break-normal hyphens-auto">
                              {results[0].breed}
                            </h3>
                          </div>
                          <div className="bg-tertiary text-on-tertiary px-4 py-2 font-label-md flex items-center gap-2 rounded-sm uppercase tracking-widest shrink-0 mt-1 shadow-none">
                            <span className="material-symbols-outlined text-[16px]">
                              verified
                            </span>
                            {results[0].confidencePercentage}% Match
                          </div>
                        </div>

                        <p className="font-body-md text-on-surface-variant leading-relaxed text-[16px] max-w-xl italic border-l-2 border-primary/20 pl-4 py-1">
                          {results[0].details?.description ||
                            "Phenotypic analysis indicates correlation with archival records. Proceed to full profile for anatomical data."}
                        </p>

                        {results[0].details?.coreTraits && (
                          <div className="flex flex-wrap gap-2">
                            {results[0].details.coreTraits
                              .slice(0, 4)
                              .map((trait, idx) => (
                                <span
                                  key={idx}
                                  className="bg-surface-container-high text-secondary font-label-md px-3 py-1 border border-secondary/10 uppercase tracking-widest text-[10px] rounded-sm"
                                >
                                  {trait}
                                </span>
                              ))}
                          </div>
                        )}

                        <div className="mt-4 pt-6 border-t border-secondary/10 flex justify-start">
                          <button
                            onClick={() =>
                              results[0].dbSynced &&
                              navigate(
                                `/breeds/${results[0].details.breedId}`,
                                { state: { from: "identify" } },
                              )
                            }
                            disabled={!results[0].dbSynced}
                            className="group bg-primary text-white font-label-md uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-[#0f2e0d] transition-colors duration-300 flex items-center gap-3 rounded-sm disabled:bg-secondary/10 disabled:text-secondary/40 disabled:border disabled:border-secondary/20 disabled:cursor-not-allowed border-none shadow-none"
                          >
                            {results[0].dbSynced
                              ? "Open Archival Record"
                              : "Record Unavailable"}
                            {results[0].dbSynced && (
                              <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                                arrow_forward
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 2. SUB-VARIANTS */}
                    {results.length > 1 && (
                      <div className="flex flex-col gap-2">
                        <h4 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/20 pb-3 text-[10px]">
                          Correlated Sub-Variants
                        </h4>

                        {results.slice(1, 3).map((match, idx) => (
                          <article
                            key={idx}
                            className={`relative bg-surface-container-lowest border-b border-secondary/10 py-5 px-4 flex justify-between items-center transition-colors duration-300 group ${
                              match.dbSynced
                                ? "hover:bg-surface-container-low cursor-pointer"
                                : "opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div
                              className="flex flex-1 items-center gap-4 min-w-0"
                              onClick={() =>
                                match.dbSynced &&
                                navigate(`/breeds/${match.details?.breedId}`, {
                                  state: { from: "identify" },
                                })
                              }
                            >
                              <div className="w-12 h-12 bg-surface-container-high border border-secondary/10 flex items-center justify-center text-secondary shrink-0 rounded-sm group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px] font-light">
                                  {match.dbSynced ? "search" : "visibility_off"}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1 truncate">
                                <div
                                  className={`font-headline-lg text-xl text-on-surface transition-colors truncate ${match.dbSynced && "group-hover:text-primary"}`}
                                >
                                  {match.breed}
                                </div>
                                <div className="font-body-sm text-secondary flex items-center gap-2 truncate text-[13px] italic">
                                  <span>
                                    {idx === 0
                                      ? "Secondary correlation noted."
                                      : "Tertiary correlation noted."}
                                    {!match.dbSynced && " (Unarchived)"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 pl-4 pointer-events-none">
                              <div className="font-label-md text-secondary text-[14px]">
                                {match.confidencePercentage}%
                              </div>
                              {match.dbSynced && (
                                <span className="material-symbols-outlined text-secondary/40 group-hover:text-primary transition-colors">
                                  arrow_forward
                                </span>
                              )}
                            </div>

                            {/* TOOLTIP HIỂN THỊ THÔNG SỐ (Hoàn toàn phẳng) */}
                            {match.dbSynced && match.details && (
                              <div className="absolute right-[102%] top-1/2 -translate-y-1/2 w-[280px] bg-surface-container-lowest border border-secondary/20 p-5 rounded-sm z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col gap-4 shadow-none">
                                <div className="font-label-md text-primary uppercase tracking-widest text-[10px] font-bold border-b border-secondary/10 pb-2">
                                  {match.breed} Specifications
                                </div>
                                <div className="flex flex-col gap-3">
                                  {match.details.physicalStats?.weight && (
                                    <div className="grid grid-cols-[130px_1fr] items-center text-[12px]">
                                      <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <span className="material-symbols-outlined text-[14px] opacity-70">
                                          scale
                                        </span>
                                        Weight Metric
                                      </span>
                                      <span className="text-primary font-bold text-[11px] text-right whitespace-nowrap">
                                        {match.details.physicalStats.weight}
                                      </span>
                                    </div>
                                  )}
                                  {match.details.physicalStats?.height && (
                                    <div className="grid grid-cols-[130px_1fr] items-center text-[12px]">
                                      <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <span className="material-symbols-outlined text-[14px] opacity-70">
                                          straighten
                                        </span>
                                        Height Metric
                                      </span>
                                      <span className="text-primary font-bold text-[11px] text-right whitespace-nowrap">
                                        {match.details.physicalStats.height}
                                      </span>
                                    </div>
                                  )}
                                  {match.details.origin && (
                                    <div className="grid grid-cols-[130px_1fr] items-center text-[12px]">
                                      <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <span className="material-symbols-outlined text-[14px] opacity-70">
                                          public
                                        </span>
                                        Geographic Origin
                                      </span>
                                      <span className="text-primary font-bold text-[11px] tracking-wide text-right whitespace-nowrap truncate">
                                        {match.details.origin.replaceAll(
                                          " / ",
                                          ", ",
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-surface-container-lowest border-r border-t border-secondary/20 rotate-45"></div>
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}

                    {/* 3. ARCHIVAL TRIVIA */}
                    {systemFunFact && (
                      <div className="mt-4 border-l-2 border-tertiary pl-6 py-2">
                        <p className="font-label-md text-tertiary uppercase tracking-[0.2em] mb-2 text-[10px] flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">
                            auto_stories
                          </span>
                          Archival Trivia
                        </p>
                        <p className="font-body-md text-on-surface-variant italic leading-relaxed">
                          "{systemFunFact}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
