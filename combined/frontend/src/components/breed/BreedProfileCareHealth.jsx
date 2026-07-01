import React from "react";

export function BreedProfileCareHealth({ breed }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="flex flex-col gap-8 text-left">
        <h3 className="font-headline-lg text-[32px]">Care Advice</h3>
        <div className="bg-surface-container border border-secondary/10 rounded p-8 flex flex-col gap-8 shadow-none">
          {breed.careAdvice?.map((advice, idx) => (
            <div
              key={idx}
              className="flex items-start gap-5 pb-6 border-b border-secondary/10 last:border-0 last:pb-0"
            >
              <span className="material-symbols-outlined text-primary mt-1">
                menu_book
              </span>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-[16px]">
                {advice}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-8 text-left">
        <h3 className="font-headline-lg text-[32px]">Health Risks</h3>
        <div className="bg-[#E3A392]/5 border border-tertiary/20 rounded p-8 flex flex-col gap-6 shadow-none">
          <p className="font-body-md text-on-surface-variant leading-relaxed opacity-80 italic">
            Historical records indicate potential pathological vulnerabilities.
          </p>
          <ul className="flex flex-col gap-5">
            {breed.healthRisks?.map((health, idx) => (
              <li key={idx} className="flex items-center gap-4 group">
                <span className="w-2 h-2 rounded-full bg-tertiary group-hover:scale-125 transition-transform"></span>
                <span className="font-body-md text-on-surface text-[17px]">
                  {health}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
