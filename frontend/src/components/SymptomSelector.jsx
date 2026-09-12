import { useMemo, useState } from "react";
import { SYMPTOMS } from "../constants/symptoms";

export default function SymptomSelector({ selected, onChange }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return SYMPTOMS.slice(0, 30); // keep initial list manageable
    const q = query.toLowerCase();
    return SYMPTOMS.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 30);
  }, [query]);

  function toggle(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div>
      <label htmlFor="symptom-search" className="label-text">
        Search and select specific symptoms (optional)
      </label>
      <input
        id="symptom-search"
        type="text"
        className="input-field mb-3"
        placeholder="Type to search, e.g. 'cough', 'joint pain'..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selected.map((value) => {
            const item = SYMPTOMS.find((s) => s.value === value);
            return (
              <button
                type="button"
                key={value}
                onClick={() => toggle(value)}
                className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-200"
              >
                {item ? item.label : value}
                <span aria-hidden="true">&times;</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid max-h-52 grid-cols-1 gap-1 overflow-y-auto rounded-lg border border-slate-200 p-2 sm:grid-cols-2">
        {filtered.map((s) => (
          <label
            key={s.value}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selected.includes(s.value)}
              onChange={() => toggle(s.value)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            {s.label}
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-4 text-center text-sm text-slate-400">No matching symptoms found.</p>
        )}
      </div>
    </div>
  );
}
