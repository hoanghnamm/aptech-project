import React from "react";

export function BreedProfileStats({ breed }) {
  const statsList = [
    {
      label: "Weight Range",
      val: breed.physicalStats?.weight,
      unit: "kg",
    },
    {
      label: "Height Average",
      val: breed.physicalStats?.height,
      unit: "cm",
    },
    {
      label: "Life Expectancy",
      val: breed.physicalStats?.lifespan,
      unit: "yrs",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {statsList.map((stat, i) => (
        <div
          key={i}
          className="bg-surface-container-low border border-secondary/10 rounded p-10 flex flex-col items-center justify-center text-center gap-3 shadow-none"
        >
          <span className="font-label-md text-secondary/60 uppercase tracking-[0.2em] text-[11px]">
            {stat.label}
          </span>
          <span className="font-headline-lg text-[40px] text-primary-container lining-nums">
            {stat.val?.split(" ")[0] || "?"}{" "}
            <span className="text-body-sm font-normal text-on-surface-variant/50">
              {stat.unit}
            </span>
          </span>
        </div>
      ))}
    </section>
  );
}
