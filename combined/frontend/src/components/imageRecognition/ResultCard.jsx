import React from "react";

export function ResultCard({ results, systemFunFact, onReset, navigate }) {
  if (!results) return null;

  return (
    <div className="flex flex-col gap-10 w-full transition-opacity duration-700">
      <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
        <h2 className="font-headline-xl text-on-surface">What we found</h2>
        <button
          onClick={onReset}
          className="font-label-md text-secondary hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-[0.15em] cursor-pointer bg-transparent border-0"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          New photo
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {/* 1. PRIMARY MATCH */}
        {results.length > 0 && (
          <div className="bg-surface-container-lowest border border-secondary/20 p-8 flex flex-col gap-6 rounded-sm shadow-none">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-4 border-b border-secondary/20 pb-6 text-left">
              <div className="flex flex-col gap-2 flex-1">
                <div className="font-label-md text-secondary opacity-80 tracking-[0.2em] uppercase text-[10px]">
                  Top match
                </div>
                <h3 className="font-headline-xl text-primary leading-tight break-normal hyphens-auto text-[32px] md:text-[40px]">
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

            <p className="font-body-md text-on-surface-variant leading-relaxed text-[16px] max-w-xl italic border-l-2 border-primary/20 pl-4 py-1 text-left">
              {results[0].details?.description ||
                "This is our best guess for the breed. Open the full profile for care, temperament and origin."}
            </p>

            {results[0].details?.coreTraits && (
              <div className="flex flex-wrap gap-2 justify-start">
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
                    { state: { from: "identify" } }
                  )
                }
                disabled={!results[0].dbSynced}
                className="group bg-primary text-white font-label-md uppercase tracking-[0.15em] px-8 py-3.5 rounded-full hover:bg-[#b65a3d] transition-colors duration-300 flex items-center gap-3 disabled:bg-secondary/10 disabled:text-secondary/40 disabled:border disabled:border-secondary/20 disabled:cursor-not-allowed border-none shadow-none cursor-pointer"
              >
                {results[0].dbSynced
                  ? "View full profile"
                  : "Profile coming soon"}
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
            <h4 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/20 pb-3 text-[10px] text-left">
              Other possible matches
            </h4>

            {results.slice(1, 3).map((match, idx) => (
              <article
                onClick={() =>
                  match.dbSynced &&
                  navigate(`/breeds/${match.details?.breedId}`, {
                    state: { from: "identify" },
                  })
                }
                key={idx}
                className={`relative bg-surface-container-lowest border-b border-secondary/10 py-5 px-4 flex justify-between items-center transition-colors duration-300 group ${
                  match.dbSynced
                    ? "hover:bg-surface-container-low cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-1 items-center gap-4 min-w-0 text-left">
                  <div className="w-12 h-12 bg-surface-container-high border border-secondary/10 flex items-center justify-center text-secondary shrink-0 rounded-sm group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px] font-light">
                      {match.dbSynced ? "search" : "visibility_off"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 truncate">
                    <div
                      className={`font-headline-lg text-xl text-on-surface transition-colors truncate ${
                        match.dbSynced && "group-hover:text-primary"
                      }`}
                    >
                      {match.breed}
                    </div>
                    <div className="font-body-sm text-secondary flex items-center gap-2 truncate text-[13px] italic">
                      <span>
                        {idx === 0
                          ? "Also a strong resemblance."
                          : "Another possible match."}
                        {!match.dbSynced && " (no profile yet)"}
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

                {/* TOOLTIP HIỂN THỊ THÔNG SỐ */}
                {match.dbSynced && match.details && (
                  <div className="absolute right-[102%] top-1/2 -translate-y-1/2 w-[280px] bg-surface-container-lowest border border-secondary/20 p-5 rounded-sm z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col gap-4 shadow-none">
                    <div className="font-label-md text-primary uppercase tracking-widest text-[10px] font-bold border-b border-secondary/10 pb-2 text-left">
                      {match.breed} at a glance
                    </div>
                    <div className="flex flex-col gap-3">
                      {match.details.physicalStats?.weight && (
                        <div className="grid grid-cols-[130px_1fr] items-center text-[12px] text-left">
                          <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                            <span className="material-symbols-outlined text-[14px] opacity-70">
                              scale
                            </span>
                            Weight
                          </span>
                          <span className="text-primary font-bold text-[11px] text-right whitespace-nowrap">
                            {match.details.physicalStats.weight}
                          </span>
                        </div>
                      )}
                      {match.details.physicalStats?.height && (
                        <div className="grid grid-cols-[130px_1fr] items-center text-[12px] text-left">
                          <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                            <span className="material-symbols-outlined text-[14px] opacity-70">
                              straighten
                            </span>
                            Height
                          </span>
                          <span className="text-primary font-bold text-[11px] text-right whitespace-nowrap">
                            {match.details.physicalStats.height}
                          </span>
                        </div>
                      )}
                      {match.details.origin && (
                        <div className="grid grid-cols-[130px_1fr] items-center text-[12px] text-left">
                          <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                            <span className="material-symbols-outlined text-[14px] opacity-70">
                              public
                            </span>
                            Origin
                          </span>
                          <span className="text-primary font-bold text-[11px] tracking-wide text-right whitespace-nowrap truncate">
                            {match.details.origin.replaceAll(" / ", ", ")}
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
          <div className="mt-4 border-l-2 border-tertiary pl-6 py-2 text-left">
            <p className="font-label-md text-tertiary uppercase tracking-[0.2em] mb-2 text-[10px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">
                auto_stories
              </span>
              Did you know?
            </p>
            <p className="font-body-md text-on-surface-variant italic leading-relaxed">
              "{systemFunFact}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
