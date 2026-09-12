export default function Input({ label, id, error, hint, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-text">
          {label}
        </label>
      )}
      <input id={id} className="input-field" aria-invalid={!!error} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
