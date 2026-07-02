import React from "react";

export function BreedSearchHeader({ searchValue, onSearchChange }) {
  return (
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <h1 className="font-headline-xl text-on-surface">Breed Encyclopedia</h1>
      <p className="font-body-md text-on-surface-variant leading-relaxed">
        Explore dog breeds by country, classification, behavior and grooming needs.
      </p>
      <div className="mt-8 relative max-w-md mx-auto">
        <input
          className="w-full bg-surface-container-high border-b border-secondary/30 focus:border-primary focus:ring-0 px-4 py-3 bg-transparent text-center font-body-md placeholder:text-on-surface-variant outline-none transition-colors rounded-t-sm shadow-none"
          placeholder="Search breeds…"
          type="text"
          value={searchValue}
          onChange={onSearchChange}
        />
        <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant">
          search
        </span>
      </div>
    </div>
  );
}
