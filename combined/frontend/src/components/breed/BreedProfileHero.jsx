import React from "react";

export function BreedProfileHero({ breed, heroImage }) {
  return (
    <>
      <section className="w-full relative h-[65vh] overflow-hidden group border-b border-secondary/20 shadow-none">
        <img
          alt={breed.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[20s] ease-out"
          src={heroImage}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-90 pointer-events-none"></div>
      </section>

      <section className="flex flex-col gap-6 items-center text-center -mt-16 relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        <div className="inline-flex items-center px-5 py-1.5 bg-[#e3a392] text-white rounded-sm font-label-md uppercase tracking-[0.15em] text-[11px] shadow-none border border-transparent">
          {breed.origin || "Unknown Origin"}
        </div>
        <h1 className="font-headline-xl text-[72px] leading-none text-on-surface tracking-tight mt-2">
          {breed.name}
        </h1>
        <p className="max-w-4xl text-on-surface-variant font-body-md text-[20px] leading-[1.8] text-center italic opacity-90 mt-4">
          {breed.description}
        </p>

        {breed.coreTraits && breed.coreTraits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {breed.coreTraits.map((trait, idx) => (
              <span
                key={idx}
                className="px-5 py-2 border border-primary/20 text-primary font-label-md uppercase tracking-widest text-[10px] rounded-full bg-primary/5 shadow-none"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
