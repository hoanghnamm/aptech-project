import Card from "../common/Card";

export default function NutritionHistory({ meta }) {
  if (!meta) return null;

  return (
    <Card className="mt-4 p-4">
      <h3 className="text-sm font-semibold text-slate-900">Saved Session</h3>
      <div className="mt-2 space-y-1 text-sm text-slate-600">
        {meta.historyId && (
          <p>
            <span className="font-medium text-slate-900">History ID:</span> {meta.historyId}
          </p>
        )}
        {meta.breed?.breedName && (
          <p>
            <span className="font-medium text-slate-900">Breed:</span> {meta.breed.breedName}
          </p>
        )}
        {meta.breed?.origin && (
          <p>
            <span className="font-medium text-slate-900">Origin:</span> {meta.breed.origin}
          </p>
        )}
      </div>
    </Card>
  );
}