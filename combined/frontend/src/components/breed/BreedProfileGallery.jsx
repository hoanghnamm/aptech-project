import React from "react";

export function BreedProfileGallery({ remainingImages }) {
  if (!remainingImages || remainingImages.length === 0) return null;

  return (
    <section className="flex flex-col gap-12 border-t border-secondary/10 pt-20">
      <h2 className="font-headline-lg text-center text-[36px]">
        Photo Gallery
      </h2>
      <div
        className={`grid gap-10 w-full ${
          remainingImages.length === 1
            ? "grid-cols-1 max-w-3xl mx-auto"
            : remainingImages.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        }`}
      >
        {remainingImages.map((img, idx) => (
          <div key={idx} className="flex flex-col gap-4 group cursor-pointer text-left">
            <div className="relative p-3 bg-[#F5EFE3] border-[8px] md:border-[10px] border-[#4E3629] rounded-[4px] shadow-[0_12px_28px_rgba(40,25,10,0.25)] flex flex-col justify-between h-full">
              <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px]" />
              <div className="w-full overflow-hidden rounded-sm flex items-center justify-center flex-grow">
                <img
                  src={img.url}
                  alt={img.caption || "Dog photo"}
                  className="w-full h-auto max-h-[380px] object-contain group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                  loading="lazy"
                />
              </div>
              {img.caption && (
                <div className="mt-4 pt-3 border-t border-[#e3d7bf]/60 text-center">
                  <p className="font-serif italic text-[12px] md:text-[13px] text-[#5C3A21]/85 leading-relaxed group-hover:text-primary transition-colors">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
