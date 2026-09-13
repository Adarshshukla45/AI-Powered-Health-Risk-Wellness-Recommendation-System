import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { fetchAssessmentHistory } from "../services/assessmentService";
import Card from "../components/Card";
import Button from "../components/Button";
import RiskBadge from "../components/RiskBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const RISK_TO_NUM = { LOW: 1, MODERATE: 2, HIGH: 3, URGENT: 4, INSUFFICIENT_INFO: 0 };

function buildRiskHistory(assessments) {
  return [...assessments]
    .reverse()
    .map((a, i) => ({
      index: i + 1,
      risk: RISK_TO_NUM[a.riskLevel] ?? 0,
      label: a.riskLevel,
      date: new Date(a.createdAt).toLocaleDateString(),
    }));
}

function buildSymptomFrequency(assessments) {
  const counts = {};
  for (const a of assessments) {
    for (const s of a.symptoms || []) {
      const label = s.replace(/_/g, " ");
      counts[label] = (counts[label] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([symptom, count]) => ({ symptom, count }));
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: assessments, loading, error, reload } = useAsync(fetchAssessmentHistory, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const latest = assessments?.[0];
  const riskHistory = buildRiskHistory(assessments || []);
  const symptomFrequency = buildSymptomFrequency(assessments || []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name?.split(" ")[0] || "there"}</h1>
          <p className="text-sm text-slate-500">Here's an overview of your wellness assessments.</p>
        </div>
        <Link to="/assessment">
          <Button>Start Assessment</Button>
        </Link>
      </div>

      {!assessments || assessments.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <p className="text-slate-600">You haven't completed an assessment yet.</p>
            <Link to="/assessment" className="mt-3 inline-block">
              <Button>Start Your First Assessment</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card title="Latest Risk">
              <RiskBadge level={latest.riskLevel} size="lg" />
              <p className="mt-2 text-xs text-slate-400">
                {new Date(latest.createdAt).toLocaleString()}
              </p>
            </Card>
            <Card title="Possible Conditions (latest)">
              {latest.prediction?.possibleConditions?.length > 0 ? (
                <ul className="space-y-1 text-sm text-slate-700">
                  {latest.prediction.possibleConditions.map((c) => (
                    <li key={c.name}>{c.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">None recorded.</p>
              )}
            </Card>
          </div>

          {riskHistory.length > 1 && (
            <Card title="Risk History" subtitle="How your estimated risk level has changed over time">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={riskHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 4]}
                    ticks={[0, 1, 2, 3, 4]}
                    tickFormatter={(v) => ["N/A", "Low", "Moderate", "High", "Urgent"][v]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(_, __, props) => props.payload.label} />
                  <Line type="monotone" dataKey="risk" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {symptomFrequency.length > 0 && (
            <Card title="Most Frequently Reported Symptoms">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={symptomFrequency} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="symptom" type="category" width={110} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Card title="Previous Assessments">
            <ul className="divide-y divide-slate-100">
              {assessments.slice(0, 5).map((a) => (
                <li key={a._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">{(a.symptoms || []).slice(0, 3).join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge level={a.riskLevel} />
                    <Link to={`/result/${a._id}`} className="text-sm font-medium text-brand-600 hover:underline">
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/history" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
              View full history &rarr;
            </Link>
          </Card>
        </>
      )}
    </div>
  );
}
