export default function ProductCard({ product }) {
  return (
    <div className="card flex h-full flex-col">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="font-semibold text-slate-900">{product.name}</h4>
        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {product.category}
        </span>
      </div>
      <p className="mb-3 text-sm text-slate-600">{product.description}</p>

      {product.ingredients?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ingredients</p>
          <p className="text-sm text-slate-600">{product.ingredients.join(", ")}</p>
        </div>
      )}

      {product.warnings?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Warnings</p>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {product.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto space-y-2 pt-3">
        {product.sourceUrl && (
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Official product information &rarr;
          </a>
        )}
        <p className="text-xs text-slate-400">
          This product recommendation is not a diagnosis or treatment recommendation.
        </p>
      </div>
    </div>
  );
}
