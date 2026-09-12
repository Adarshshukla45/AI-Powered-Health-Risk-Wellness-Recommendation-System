export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p className="font-medium">{message || "Something went wrong."}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 font-semibold underline hover:no-underline">
          Try again
        </button>
      )}
    </div>
  );
}
