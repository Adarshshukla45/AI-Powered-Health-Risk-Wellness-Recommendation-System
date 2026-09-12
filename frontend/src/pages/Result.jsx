import { useLocation, useParams, Link } from "react-router-dom";
import Card from "../components/Card";
import RiskBadge from "../components/RiskBadge";
import PredictionCard from "../components/PredictionCard";
import ProductCard from "../components/ProductCard";
import Disclaimer from "../components/Disclaimer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import { useAsync } from "../hooks/useAsync";
import { fetchAssessmentById } from "../services/assessmentService";

export default function Result() {
  const { id } = useParams();
  const location = useLocation();

  // If we arrived right after submitting, the result was passed via
  // navigation state — no need to re-fetch. Otherwise (e.g. a direct
  // link, or a page refresh), fetch it from the history endpoint.
  const passedResult = location.state?.result;

  const { data: fetched, loading, error, reload } = useAsync(
    () => (passedResult ? Promise.resolve(null) : fetchAssessmentById(id)),
    [id]
  );

  if (!passedResult && loading) return <LoadingSpinner label="Loading your assessment..." />;
  if (!passedResult && error) return <ErrorMessage message={error} onRetry={reload} />;

  // Normalize the two possible shapes (freshly-submitted vs. fetched-by-id)
  const a = passedResult || fetched?.assessment || fetched;
  const riskLevel = a.riskLevel || a.risk_level;
  const prediction = a.prediction || {
    possibleConditions: a.prediction?.possibleConditions,
    importantSymptoms: a.prediction?.importantSymptoms,
    modelExplanationNote: a.prediction?.modelExplanationNote,
  };
  const progression = a.progressionGuidance || {};
  const wellnessProducts = a.wellnessProducts || a.recommendedProductIds || [];
  const isUrgent = riskLevel === "URGENT";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {isUrgent && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
          <h2 className="text-lg font-bold text-red-700">Urgent Attention</h2>
          <p className="mt-1 text-sm text-red-700">
            Some of the symptoms entered may require urgent professional medical
            evaluation. Please seek appropriate medical care immediately.
          </p>
        </div>
      )}

      {/* Risk Summary */}
      <Card title="Risk Summary">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Estimated Risk Level:</span>
          <RiskBadge level={riskLevel} size="lg" />
        </div>
      </Card>

      {/* Possible Conditions */}
      {!isUrgent && (
        <Card title="Possible Conditions" subtitle="Estimated likelihood based on reported symptoms">
          <PredictionCard possibleConditions={prediction.possibleConditions} />
        </Card>
      )}

      {/* Important Symptoms + Model Explanation */}
      <Card title="Important Symptoms" subtitle="Model explanation, not a medical explanation">
        {prediction.importantSymptoms?.length > 0 ? (
          <ul className="space-y-1">
            {prediction.importantSymptoms.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-brand-600">✓</span>
                {s.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No specific contributing symptoms identified.</p>
        )}
        {prediction.modelExplanationNote && (
          <p className="mt-3 text-xs text-slate-400">{prediction.modelExplanationNote}</p>
        )}
      </Card>

      {/* What to Monitor / When to Seek Help */}
      <Card title="Possible Progression / What to Monitor">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">What to monitor</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
              {(progression.whatToMonitor || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">When to seek professional help</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
              {(progression.whenToSeekHelp || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Wellness Products */}
      {!isUrgent && wellnessProducts.length > 0 && (
        <Card title="Wellness Product Information" subtitle="Not a diagnosis or treatment recommendation">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {wellnessProducts.map((p) => (
              <ProductCard key={p._id || p.name} product={p} />
            ))}
          </div>
        </Card>
      )}
      {!isUrgent && wellnessProducts.length === 0 && a.recommendationsSkippedReason && (
        <Card title="Wellness Product Information">
          <p className="text-sm text-slate-500">{a.recommendationsSkippedReason}</p>
        </Card>
      )}

      <Disclaimer />

      <div className="flex justify-center gap-3 pb-8">
        <Link to="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
        <Link to="/assessment">
          <Button>New Assessment</Button>
        </Link>
      </div>
    </div>
  );
}
