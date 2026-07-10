import React from "react";

export function DogNewsCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-encyclopedia p-2 md:p-3 flex flex-col gap-3 shadow-none transition-colors duration-300 block"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container relative z-10 border border-secondary/10">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover filter grayscale-[15%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-700 ease-out"
          loading="lazy"
        />
        {/* Subtle source badge on overlay */}
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest text-primary text-[9px] uppercase tracking-wider font-semibold border border-secondary/15 opacity-90 group-hover:opacity-100 transition-opacity">
          {article.source}
        </span>
      </div>
      <div className="px-1 pb-1 flex flex-col gap-2 relative z-10">
        <h3 className="font-display font-semibold text-lg text-primary leading-snug group-hover:text-surface-tint transition-colors line-clamp-2 md:line-clamp-3">
          {article.title}
        </h3>
      </div>
    </a>
  );
}
