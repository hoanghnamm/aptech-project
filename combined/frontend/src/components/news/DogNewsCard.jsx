import React from "react";

export function DogNewsCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white border border-secondary/15 rounded-xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(21,66,18,0.06)]"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container relative">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Subtle source badge on overlay */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-primary text-[9px] uppercase tracking-wider font-semibold rounded backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity border border-secondary/10">
          {article.source}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-display font-semibold text-lg text-primary leading-snug group-hover:text-primary-coral-hover transition-colors line-clamp-2 md:line-clamp-3">
          {article.title}
        </h3>
      </div>
    </a>
  );
}
