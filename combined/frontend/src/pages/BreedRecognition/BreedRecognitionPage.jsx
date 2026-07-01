import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { identifyBreed } from "../../api/breed.api";
import { UploadBox } from "../../components/imageRecognition/UploadBox";
import { ImagePreview } from "../../components/imageRecognition/ImagePreview";
import { ResultCard } from "../../components/imageRecognition/ResultCard";

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

    try {
      const data = await identifyBreed(file);
      const payload = data?.data || data;

      if (data?.success || payload?.success || payload?.predictions) {
        const preds = payload.predictions || payload.data?.predictions || [];
        const fact = payload.systemFunFact || payload.data?.systemFunFact || "";

        setResults(preds);
        setSystemFunFact(fact);

        sessionStorage.setItem("identifyResults", JSON.stringify(preds));
        sessionStorage.setItem("identifyFact", fact);
        sessionStorage.setItem("identifyPreviewUrl", previewUrl);
      } else {
        setError(
          "Due to archival limitations or suboptimal lighting of the specimen, the system could not extract identifying features. Please try again with a clearer photograph."
        );
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(
        "Archival system disruption or invalid imagery detected. Please provide a clearer specimen photograph."
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

  const isSplit = loading || results || error;

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop py-12 flex flex-col items-center justify-center overflow-x-hidden">
        {/* HEADER TEXT */}
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

        {/* CONTAINER WITH SLIDE EFFECT */}
        <div
          className={`mx-auto w-full flex flex-col lg:flex-row items-start transition-all duration-[1000ms] ease-in-out ${
            isSplit ? "max-w-[1280px]" : "max-w-2xl"
          }`}
        >
          {/* LEFT COLUMN: IMAGE PREVIEW / DROPZONE */}
          <div
            className={`w-full shrink-0 transition-all duration-[1000ms] ease-in-out ${
              isSplit ? "lg:w-5/12 sticky top-24" : "lg:w-full"
            }`}
          >
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`w-full bg-surface-container-lowest flex flex-col items-center justify-center gap-5 relative overflow-hidden group shadow-none transition-all duration-[1000ms] ${
                previewUrl
                  ? "border border-secondary/20 p-3 rounded-sm"
                  : "h-[380px] md:h-[460px] border border-dashed border-secondary/40 cursor-pointer hover:bg-surface-container rounded-sm"
              }`}
            >
              {previewUrl ? (
                <ImagePreview
                  previewUrl={previewUrl}
                  isSplit={isSplit}
                  results={results}
                />
              ) : (
                <UploadBox />
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

            {/* Scan button */}
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

          {/* RIGHT COLUMN: RESULTS CARD */}
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

              {/* TRẠNG THÁI RESULTS */}
              {results && !loading && (
                <ResultCard
                  results={results}
                  systemFunFact={systemFunFact}
                  onReset={resetScan}
                  navigate={navigate}
                />
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default ImageAnalyzer;
