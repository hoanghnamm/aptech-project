import React from "react";

export function BreedCard({ breed, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer border border-secondary/20 p-4 flex flex-col gap-4 bg-surface hover:bg-surface-container transition-colors shadow-none"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border border-secondary/10 shadow-none">
        <img
          alt={`${breed.name} profile`}
          className="w-full h-full object-cover"
          src={
            breed.thumbnail ||
            "https://placehold.co/600x450/efe8d5/154212?text=No+Image"
          }
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-[#e3a392]/25 text-[#1e1c10] font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-md shadow-none">
            {breed.lifestyleFilters?.size || "Canine"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">
          {breed.name}
        </h2>
        <p className="font-body-sm text-on-surface-variant italic line-clamp-2">
          {breed.description}
        </p>
      </div>
      <div className="mt-auto border-t border-secondary/20 pt-3 flex justify-between items-center">
        <span className="font-body-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
          View Record
        </span>
        <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary transition-colors">
          arrow_forward
        </span>
      </div>
    </article>
  );
}
