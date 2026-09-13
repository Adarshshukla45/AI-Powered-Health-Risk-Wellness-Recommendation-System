import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import SymptomSelector from "../components/SymptomSelector";
import Disclaimer from "../components/Disclaimer";
import { submitAssessment } from "../services/assessmentService";

const STEPS = ["Basic Info", "Symptoms", "Review"];

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "",
    gender: "",
    duration: "",
    severity: "moderate",
    freeText: "",
    symptoms: [],
    lifestyle: "",
    medicalHistory: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setError("");
    if (form.symptoms.length === 0 && !form.freeText.trim()) {
      setError("Please describe your symptoms or select at least one from the list.");
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitAssessment({
        symptoms: form.symptoms,
        freeText: form.freeText || undefined,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        duration: form.duration || undefined,
        severity: form.severity || undefined,
      });
      navigate(`/result/${result.id}`, { state: { result } });
    } catch (err) {
      setError(err.message || "Unable to submit your assessment right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Symptom Assessment</h1>
      <p className="mb-6 text-sm text-slate-500">
        Answer a few questions so the system can estimate a risk category and explain its reasoning.
      </p>

      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                i <= step ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {i + 1}
            </div>
            <span className={`hidden text-sm sm:inline ${i <= step ? "text-slate-800" : "text-slate-400"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      <Card>
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="age"
                type="number"
                label="Age"
                min={0}
                max={120}
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
              />
              <div>
                <label htmlFor="gender" className="label-text">
                  Gender
                </label>
                <select
                  id="gender"
                  className="input-field"
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <Input
              id="duration"
              label="Duration of symptoms"
              placeholder="e.g. 3 days"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
            />
            <div>
              <label htmlFor="severity" className="label-text">
                Severity
              </label>
              <select
                id="severity"
                className="input-field"
                value={form.severity}
                onChange={(e) => update("severity", e.target.value)}
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <Input
              id="lifestyle"
              label="Lifestyle information (optional)"
              placeholder="e.g. smoker, sedentary, athlete"
              value={form.lifestyle}
              onChange={(e) => update("lifestyle", e.target.value)}
            />
            <Input
              id="medicalHistory"
              label="Known medical history (optional)"
              placeholder="e.g. asthma, diabetes"
              value={form.medicalHistory}
              onChange={(e) => update("medicalHistory", e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="freeText" className="label-text">
                Describe how you're feeling, in your own words
              </label>
              <textarea
                id="freeText"
                rows={4}
                className="input-field"
                placeholder="e.g. I have been experiencing headache, fever, weakness and cough for three days."
                value={form.freeText}
                onChange={(e) => update("freeText", e.target.value)}
              />
            </div>
            <SymptomSelector selected={form.symptoms} onChange={(s) => update("symptoms", s)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold text-slate-900">Review your information</h3>
            <dl className="grid grid-cols-2 gap-y-2">
              <dt className="text-slate-500">Age</dt>
              <dd>{form.age || "—"}</dd>
              <dt className="text-slate-500">Gender</dt>
              <dd>{form.gender || "—"}</dd>
              <dt className="text-slate-500">Duration</dt>
              <dd>{form.duration || "—"}</dd>
              <dt className="text-slate-500">Severity</dt>
              <dd className="capitalize">{form.severity}</dd>
            </dl>
            <div>
              <p className="text-slate-500">Description</p>
              <p className="text-slate-800">{form.freeText || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Selected symptoms</p>
              <p className="text-slate-800">{form.symptoms.length > 0 ? form.symptoms.join(", ") : "—"}</p>
            </div>
            <Disclaimer compact />
          </div>
        )}

        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={back} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting}>
              Get My Assessment
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
