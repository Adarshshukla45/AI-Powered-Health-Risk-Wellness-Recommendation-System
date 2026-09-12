export default function Disclaimer({ compact = false }) {
  return (
    <div
      role="note"
      className={
        compact
          ? "rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600"
          : "rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
      }
    >
      <p>
        <strong className="font-semibold text-slate-700">
          This application is for educational and informational purposes only.
        </strong>{" "}
        It does not provide medical diagnosis or treatment. If symptoms are
        severe, persistent, or concerning, consult a qualified healthcare
        professional.
      </p>
    </div>
  );
}
