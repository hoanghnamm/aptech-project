import React, { useState, useEffect } from "react";
import { getRandomFunFact } from "../../api/funfact.api";

export function FunFactBanner({ category = "", className = "" }) {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(true);

  const fetchFact = async () => {
    setFade(false);
    setLoading(true);
    setTimeout(async () => {
      const data = await getRandomFunFact(category);
      if (data) {
        setFact(data);
      }
      setLoading(false);
      setFade(true);
    }, 300); // Wait for fade out
  };

  useEffect(() => {
    fetchFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (!fact && !loading) return null;

  return (
    <div className={`w-full card-encyclopedia p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${className}`}>
      <div className="flex gap-4 items-start w-full max-w-4xl">
        <span className="material-symbols-outlined text-[28px] text-terracotta-accent opacity-80 mt-1 md:mt-0">
          lightbulb
        </span>
        <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <h4 className="font-label-md uppercase tracking-widest text-[10px] text-primary/50 mb-1">
            Did you know?
          </h4>
          <p className="font-display text-primary text-[17px] md:text-[19px] leading-relaxed italic">
            "{loading ? "Unearthing canine knowledge..." : fact?.content}"
          </p>
        </div>
      </div>
      <button
        onClick={fetchFact}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary/20 bg-surface-container-low hover:bg-surface-container-high transition-colors font-label-md uppercase tracking-widest text-[10px] text-primary cursor-pointer disabled:opacity-50 shrink-0 ml-auto md:ml-0"
        title="Discover another fact"
      >
        <span className="material-symbols-outlined text-[14px]">
          refresh
        </span>
        <span className="hidden md:inline">Next</span>
      </button>
    </div>
  );
}
