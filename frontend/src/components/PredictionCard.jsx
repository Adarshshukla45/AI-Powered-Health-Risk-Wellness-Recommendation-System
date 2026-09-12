export default function PredictionCard({ possibleConditions }) {
  if (!possibleConditions || possibleConditions.length === 0) {
    return <p className="text-sm text-slate-500">No possible conditions could be estimated from the information provided.</p>;
  }

  return (
    <div className="space-y-3">
      {possibleConditions.map((condition) => (
        <div key={condition.name}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-800">{condition.name}</span>
            <span className="text-slate-500">{Math.round(condition.probability * 100)}% estimated likelihood</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${Math.round(condition.probability * 100)}%` }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-slate-400">
        Probabilities reflect statistical association in the model's training data, not medical certainty.
      </p>
    </div>
  );
}
