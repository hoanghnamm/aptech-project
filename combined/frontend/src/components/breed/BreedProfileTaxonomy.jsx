import React from "react";

const metricDefinitions = {
  trainability: {
    label: "Trainability",
    desc: "Capacity to absorb and execute curatorial instructions.",
    scale: "1: Stubborn instinct — 5: Highly compliant",
  },
  energyLevel: {
    label: "Energy Level",
    desc: "Daily kinetic output and physical stamina requirements.",
    scale: "1: Sedentary nature — 5: Relentless endurance",
  },
  apartmentFriendly: {
    label: "Apartment Friendly",
    desc: "Suitability for confined living spaces and restricted boundaries.",
    scale: "1: Requires acreage — 5: Thrives in compact quarters",
  },
  kidFriendly: {
    label: "Kid Friendly",
    desc: "Patience and gentleness when interacting with human children.",
    scale: "1: Easily overwhelmed — 5: Highly nurturing",
  },
  aloneTolerance: {
    label: "Alone Tolerance",
    desc: "Psychological resilience when left in complete solitude.",
    scale: "1: Severe separation anxiety — 5: Highly independent",
  },
  petFriendly: {
    label: "Pet Friendly",
    desc: "How sociable and tolerant this breed is around other dogs and pets.",
    scale: "1: Highly territorial — 5: Universally amicable",
  },
};

const lifestyleDefinitions = {
  size: {
    label: "Size",
    desc: "General body mass and structural scale at full maturity.",
  },
  sheddingLevel: {
    label: "Shedding Level",
    desc: "Frequency and volume of fur renewal and follicle shedding.",
  },
  spaceRequirement: {
    label: "Space Requirement",
    desc: "Minimum spatial volume needed for psychological well-being.",
  },
  barkingLevel: {
    label: "Vocalization",
    desc: "Tendency for audible communication and territorial barking.",
  },
  weatherTolerance: {
    label: "Climate Adaptability",
    desc: "Biological resilience against extreme temperature fluctuations.",
  },
  vulnerabilityToDisease: {
    label: "Pathological Vulnerability",
    desc: "Overall genetic resistance to common canine ailments.",
  },
};

export function BreedProfileTaxonomy({ breed }) {
  const calculateProgress = (val) => `${((val || 0) / 5) * 100}%`;

  return (
    <section className="flex flex-col gap-12">
      <h2 className="font-headline-lg text-center text-[36px] text-on-surface">
        Biological & Behavioral Taxonomy
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Qualitative Sidebar */}
        <div className="bg-surface-container-low border border-secondary/10 rounded p-12 flex flex-col gap-10 shadow-none">
          <h3 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/10 pb-5 text-[14px] text-left">
            Lifestyle Classification
          </h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10">
            {Object.entries(breed.lifestyleFilters || {}).map(([key, value]) => {
              const def = lifestyleDefinitions[key] || { label: key };
              return (
                <div key={key} className="flex flex-col gap-3 group relative text-left">
                  <span className="font-label-md text-secondary/70 uppercase tracking-widest text-[12px] cursor-help border-b border-dashed border-secondary/30 w-fit pb-0.5">
                    {def.label}
                  </span>
                  <span className="font-body-md text-on-surface text-[20px] font-medium capitalize">
                    {value}
                  </span>

                  <div className="absolute z-30 bottom-full left-0 mb-3 w-64 bg-secondary text-surface-container-lowest rounded p-4 text-[14px] leading-relaxed hidden group-hover:block transition-all shadow-xl">
                    {def.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantitative Analytics */}
        <div className="bg-surface-container border border-secondary/10 rounded p-12 flex flex-col gap-10 shadow-none">
          <h3 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/10 pb-5 text-[14px] text-left">
            Analytical Metrics
          </h3>
          <div className="flex flex-col gap-8">
            {Object.entries(breed.comparisonMetrics || {}).map(([key, value]) => {
              const def = metricDefinitions[key] || { label: key };
              return (
                <div key={key} className="flex flex-col gap-3 group relative text-left">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-on-surface uppercase tracking-widest text-[13px] cursor-help border-b border-dashed border-secondary/30 pb-0.5">
                      {def.label}
                    </span>
                    <span className="font-label-md text-primary font-bold lining-nums text-[16px]">
                      {value} / 5
                    </span>
                  </div>
                  <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden shadow-none">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: calculateProgress(value) }}
                    ></div>
                  </div>

                  <div className="absolute z-30 bottom-full left-0 mb-3 w-72 bg-primary text-surface-container-lowest rounded p-5 text-[15px] leading-relaxed hidden group-hover:block shadow-xl">
                    <p className="mb-2 font-medium">{def.desc}</p>
                    <p className="opacity-70 italic text-[12px]">{def.scale}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
