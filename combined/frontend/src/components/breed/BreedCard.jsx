import React from "react";

export function BreedCard({ breed, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer border border-secondary/15 p-5 flex flex-col gap-4 bg-white hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(21,66,18,0.06)] transition-all duration-300 rounded-xl"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container relative border border-secondary/10 rounded-lg">
        <img
          alt={`${breed.name} profile`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          src={
            breed.thumbnail ||
            "https://placehold.co/600x450/efe8d5/154212?text=No+Image"
          }
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-white/95 text-[#1e1c10] font-label-md font-semibold text-[9px] uppercase tracking-wider rounded backdrop-blur-sm border border-secondary/10 shadow-sm">
            {breed.lifestyleFilters?.size || "Canine"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-display font-semibold text-[22px] text-primary group-hover:text-primary-coral-hover transition-colors leading-snug">
          {breed.name}
        </h2>
        <p className="font-body-sm text-on-surface-variant italic line-clamp-2 leading-relaxed">
          {breed.description}
        </p>
      </div>
      <div className="mt-auto border-t border-secondary/15 pt-3 flex justify-between items-center">
        <span className="font-body-sm text-on-surface-variant uppercase tracking-widest text-[11px] group-hover:text-primary transition-colors">
          View Record
        </span>
        <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">
          arrow_forward
        </span>
      </div>
    </article>
  );
}
