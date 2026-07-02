import React from "react";

export function BreedFilter({
  filters,
  isFiltered,
  onResetFilters,
  onSingleFilterChange,
  onMultiFilterChange,
}) {
  const filterBlocks = [
    {
      key: "size",
      title: "Size",
      options: ["Small", "Medium", "Large"],
    },
    {
      key: "sheddingLevel",
      title: "Shedding Level",
      options: ["Low", "Medium", "High"],
    },
    {
      key: "spaceRequirement",
      title: "Home Space",
      options: ["Apartment", "Small Yard", "Large Yard"],
    },
    {
      key: "barkingLevel",
      title: "Barking",
      options: ["Quiet", "Moderate", "Vocal"],
    },
    {
      key: "weatherTolerance",
      title: "Climate",
      options: ["Warm", "Cold", "Adaptable"],
    },
    {
      key: "vulnerabilityToDisease",
      title: "Health Resilience",
      options: ["Hardy", "Moderate", "Fragile"],
    },
  ];

  return (
    <aside className="md:col-span-3 flex flex-col gap-8 md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto pr-4 pb-8 custom-scrollbar">
      <div
        className={`flex justify-end -mb-4 transition-opacity duration-500 ease-in-out ${isFiltered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={onResetFilters}
          className="font-label-md uppercase tracking-[0.15em] text-[10px] text-on-surface-variant hover:text-primary transition-colors bg-transparent border-b border-transparent hover:border-primary pb-0.5 p-0 cursor-pointer shadow-none outline-none"
        >
          Reset
        </button>
      </div>

      {/* Kinetic Energy */}
      <div className="flex flex-col gap-4">
        <h3 className="font-label-md uppercase text-primary tracking-widest border-b border-primary/20 pb-2">
          Energy Level
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Low / Calm", val: "1,2" },
            { label: "Moderate", val: "3" },
            { label: "High / Athletic", val: "4,5" },
          ].map((level) => (
            <label
              key={level.val}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.energyLevel.includes(level.val)}
                onChange={() => onMultiFilterChange("energyLevel", level.val)}
                className="appearance-none w-4 h-4 cursor-pointer rounded-sm border border-primary/40 bg-surface relative flex items-center justify-center checked:border-primary after:content-[''] after:w-2 after:h-2 after:bg-primary after:rounded-xs after:scale-0 checked:after:scale-100 after:transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
              <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dynamic Blocks */}
      {filterBlocks.map((filterBlock) => (
        <div key={filterBlock.key} className="flex flex-col gap-4">
          <h3 className="font-label-md uppercase text-on-surface-variant tracking-widest border-b border-secondary/20 pb-2">
            {filterBlock.title}
          </h3>
          <div className="flex flex-col gap-3">
            {filterBlock.options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters[filterBlock.key] === opt}
                  onChange={() => onSingleFilterChange(filterBlock.key, opt)}
                  className="appearance-none w-4 h-4 cursor-pointer rounded-sm border border-primary/40 bg-surface relative flex items-center justify-center checked:border-primary after:content-[''] after:w-2 after:h-2 after:bg-primary after:rounded-xs after:scale-0 checked:after:scale-100 after:transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                />
                <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">
                  {opt}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
