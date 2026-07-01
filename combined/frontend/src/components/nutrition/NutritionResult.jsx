function PillList({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-slate-500">No data</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function NutritionResult({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Calories / Day</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {result.caloriesPerDay} kcal
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Meals / Day</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {result.mealsPerDay}
          </p>
        </div>
      </div>

      <Section title="Recommended Foods">
        <PillList items={result.recommendedFoods} />
      </Section>

      <Section title="Foods to Avoid">
        <PillList items={result.avoidFoods} />
      </Section>

      <Section title="Feeding Schedule">
        <PillList items={result.feedingSchedule} />
      </Section>

      <Section title="Supplement Suggestions">
        <PillList items={result.supplementSuggestions} />
      </Section>

      <Section title="Warning Flags">
        <PillList items={result.warningFlags} />
      </Section>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Portion Guidance</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {result.portionGuidance}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Hydration Tips</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {result.hydrationTips}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Summary</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{result.summary}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Confidence:</span>{" "}
          {(Number(result.confidence) * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}