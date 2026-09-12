import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { fetchAssessmentHistory } from "../services/assessmentService";
import Card from "../components/Card";
import RiskBadge from "../components/RiskBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function History() {
  const { data: assessments, loading, error, reload } = useAsync(fetchAssessmentHistory, []);

  if (loading) return <LoadingSpinner label="Loading your assessment history..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Assessment History</h1>

      {(!assessments || assessments.length === 0) ? (
        <Card>
          <p className="py-8 text-center text-slate-500">No assessments yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {assessments.map((a) => (
            <Card key={a._id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Symptoms: {(a.symptoms || []).join(", ") || "—"}
                  </p>
                  {a.prediction?.possibleConditions?.length > 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      Top estimate: {a.prediction.possibleConditions[0].name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge level={a.riskLevel} />
                  <Link to={`/result/${a._id}`} className="text-sm font-medium text-brand-600 hover:underline">
                    View details
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
