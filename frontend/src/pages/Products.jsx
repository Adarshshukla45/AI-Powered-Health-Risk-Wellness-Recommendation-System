import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Disclaimer from "../components/Disclaimer";

const CATEGORIES = [
  "All",
  "Stress & Vitality",
  "Throat & Respiratory",
  "Cold & Immunity",
  "Fever & Immunity",
  "Mental Wellness",
  "Digestive Health",
];

export default function Products() {
  const [category, setCategory] = useState("All");
  const { data: products, loading, error, reload } = useAsync(
    () => fetchProducts(category === "All" ? undefined : category),
    [category]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Wellness Products</h1>
      <p className="mb-6 text-sm text-slate-500">
        General wellness product information. Not a substitute for medical treatment.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              category === c
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner label="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          {(!products || products.length === 0) ? (
            <p className="py-8 text-center text-slate-500">No products found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}
