"""
predict.py — Phase 2/6/7: loads the trained model and produces a full
prediction response combining:
  - ML-estimated possible conditions + probabilities
  - Explainable-AI contributing symptoms
  - Baseline risk category (from disease_risk_map, a documented heuristic)
  - URGENT override from the independent red-flag rule engine
  - "What to monitor" / "when to seek help" guidance

This is the single function the FastAPI layer (main.py) calls for /predict.
"""
from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import joblib
import numpy as np

from .disease_risk_map import get_baseline_risk
from .preprocessing import symptoms_to_feature_vector
from .safety_rules import check_red_flags, get_progression_guidance

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

TOP_K_CONDITIONS = 3
MIN_SYMPTOMS_FOR_PREDICTION = 1  # below this, we don't even attempt a prediction


class ModelBundle:
    """Loads model + artifacts once and reuses them across requests."""

    def __init__(self):
        self.model = joblib.load(MODELS_DIR / "model.pkl")
        self.feature_columns: List[str] = joblib.load(MODELS_DIR / "feature_columns.pkl")
        self.symptom_encoder: Dict[str, int] = joblib.load(MODELS_DIR / "symptom_encoder.pkl")


_bundle: ModelBundle | None = None


def get_bundle() -> ModelBundle:
    global _bundle
    if _bundle is None:
        _bundle = ModelBundle()
    return _bundle


def _explain_logistic(model, feature_row: np.ndarray, class_index: int, feature_names: List[str], top_n: int = 5) -> List[str]:
    """
    For LogisticRegression: contribution of each present symptom to the
    predicted class = coefficient[class_index, feature_index] * feature_value.
    We only surface symptoms the user actually reported (feature_value == 1)
    with a positive contribution, ranked by contribution size.
    """
    coefs = model.coef_[class_index]  # shape (n_features,)
    present_idx = np.where(feature_row == 1)[0]
    contributions = [(feature_names[i], coefs[i]) for i in present_idx]
    contributions = [c for c in contributions if c[1] > 0]
    contributions.sort(key=lambda c: c[1], reverse=True)
    return [c[0] for c in contributions[:top_n]]


def _explain_tree_based(model, feature_row: np.ndarray, feature_names: List[str], top_n: int = 5) -> List[str]:
    """
    For DecisionTree/RandomForest: use global feature_importances_ restricted
    to symptoms the user actually reported, as a proxy for "what mattered".
    """
    importances = model.feature_importances_
    present_idx = np.where(feature_row == 1)[0]
    contributions = [(feature_names[i], importances[i]) for i in present_idx]
    contributions.sort(key=lambda c: c[1], reverse=True)
    return [c[0] for c in contributions[:top_n]]


def predict(symptoms: List[str]) -> Dict:
    """
    Main entry point. `symptoms` should already be canonical tokens
    (output of nlp.extract_symptoms + any structured checkboxes from the
    frontend). Returns a fully-formed prediction payload.
    """
    bundle = get_bundle()

    # Insufficient information guard — never guess wildly on empty input.
    if len(symptoms) < MIN_SYMPTOMS_FOR_PREDICTION:
        return {
            "risk_level": "INSUFFICIENT_INFO",
            "possible_conditions": [],
            "important_symptoms": [],
            "red_flags": {"is_urgent": False, "triggered_by": []},
            "progression_guidance": None,
            "disclaimer_required": True,
        }

    # Red-flag check happens independently of the ML model, per project spec.
    red_flags = check_red_flags(symptoms)

    feature_df = symptoms_to_feature_vector(symptoms)
    feature_row = feature_df.iloc[0].values
    proba = bundle.model.predict_proba(feature_df)[0]
    classes = bundle.model.classes_

    top_indices = np.argsort(proba)[::-1][:TOP_K_CONDITIONS]
    possible_conditions = [
        {"name": classes[i], "probability": round(float(proba[i]), 4)}
        for i in top_indices
        if proba[i] > 0
    ]

    top_class_index = int(top_indices[0])
    model_type = type(bundle.model).__name__
    if hasattr(bundle.model, "coef_"):
        important_symptoms = _explain_logistic(
            bundle.model, feature_row, top_class_index, bundle.feature_columns
        )
    else:
        important_symptoms = _explain_tree_based(
            bundle.model, feature_row, bundle.feature_columns
        )

    top_disease = classes[top_class_index]
    baseline_risk = get_baseline_risk(top_disease)

    # URGENT always wins, regardless of the model's own risk estimate —
    # this is the core safety requirement of the project.
    final_risk = "URGENT" if red_flags["is_urgent"] else baseline_risk

    return {
        "risk_level": final_risk,
        "possible_conditions": possible_conditions,
        "important_symptoms": important_symptoms,
        "model_explanation_note": (
            "These symptoms had the strongest statistical association with the "
            f"top estimated category, according to the {model_type} model. "
            "This is a model explanation, not a medical explanation."
        ),
        "red_flags": red_flags,
        "progression_guidance": get_progression_guidance(final_risk),
        "disclaimer_required": True,
    }
