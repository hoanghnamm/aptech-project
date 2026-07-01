import React from "react";

export function BreedPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center border-t border-secondary/20 pt-6 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 font-label-md uppercase tracking-widest text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0 shadow-none cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Previous
      </button>
      <span className="font-body-sm text-on-surface-variant">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 font-label-md uppercase tracking-widest text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0 shadow-none cursor-pointer"
      >
        Next
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  );
}
