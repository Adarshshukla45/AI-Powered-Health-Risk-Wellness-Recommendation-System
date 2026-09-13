const STYLES = {
  LOW: "bg-green-50 text-green-700 border-green-200",
  MODERATE: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
  INSUFFICIENT_INFO: "bg-slate-100 text-slate-600 border-slate-200",
};

const LABELS = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
  URGENT: "Urgent Attention",
  INSUFFICIENT_INFO: "Insufficient Information",
};

export default function RiskBadge({ level, size = "md" }) {
  const style = STYLES[level] || STYLES.INSUFFICIENT_INFO;
  const label = LABELS[level] || level;
  const sizeClasses = size === "lg" ? "px-4 py-1.5 text-base" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${style} ${sizeClasses}`}
    >
      {label}
    </span>
  );
}
