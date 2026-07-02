import React from "react";

export function ImagePreview({ previewUrl, isSplit, results }) {
  return (
    <div className="w-full relative overflow-hidden rounded-sm flex items-center justify-center">
      <img
        src={previewUrl}
        alt="Dog photo"
        className={`w-full h-auto max-h-[500px] object-contain transition-all duration-1000 ${
          isSplit ? "contrast-105" : "group-hover:scale-105 group-hover:opacity-60"
        }`}
        loading="lazy"
      />
      {/* Indicator when not scanning */}
      {!isSplit && (
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="material-symbols-outlined text-[40px] text-primary mb-2">
            swap_horiz
          </span>
          <p className="font-label-md text-primary uppercase tracking-[0.2em] font-bold bg-surface-container-high px-4 py-2 border border-secondary/20">
            Change photo
          </p>
        </div>
      )}
      {/* Indicator when scanning complete */}
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
  );
}
