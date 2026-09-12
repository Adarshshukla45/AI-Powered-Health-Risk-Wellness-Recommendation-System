import { Link } from "react-router-dom";
import Disclaimer from "../components/Disclaimer";
import Button from "./../components/Button";

const FEATURES = [
  {
    title: "Describe symptoms naturally",
    desc: "Type how you're feeling in plain language — the system extracts and normalizes the relevant symptoms.",
  },
  {
    title: "Estimated risk category",
    desc: "An interpretable ML model estimates a risk category and possible conditions — never a diagnosis.",
  },
  {
    title: "Explainable results",
    desc: "See exactly which reported symptoms contributed most to the estimate.",
  },
  {
    title: "Safety-first design",
    desc: "An independent rule engine flags potential emergencies and always prioritizes urgent care over product suggestions.",
  },
];

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          AI Health Risk &amp; Wellness Recommendation System
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          An educational final-year project that combines NLP symptom extraction,
          an interpretable ML model, explainable AI, and a safety-first rule
          engine to help you understand — not diagnose — how you might be feeling.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register">
            <Button>Start a Free Assessment</Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary">Browse Wellness Products</Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="card">
            <h3 className="font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <Disclaimer />
      </div>
    </div>
  );
}
