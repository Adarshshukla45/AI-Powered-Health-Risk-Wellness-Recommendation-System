"""
train.py — Phase 2/19: model training pipeline.

Raw Dataset -> Data Cleaning -> Symptom Encoding (multi-hot) ->
Stratified Train/Test Split -> Model Training (3 candidates) ->
Cross Validation -> Evaluation -> Model Selection -> Save Model

Run:
    cd ml-service
    python -m src.train
"""
from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.tree import DecisionTreeClassifier

from .preprocessing import load_raw_dataset, rows_to_multihot
from .symptom_vocab import CANONICAL_SYMPTOMS

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

RANDOM_STATE = 42


def evaluate(model, X_test, y_test, name: str) -> dict:
    y_pred = model.predict(X_test)
    metrics = {
        "model": name,
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision_macro": round(precision_score(y_test, y_pred, average="macro", zero_division=0), 4),
        "recall_macro": round(recall_score(y_test, y_pred, average="macro", zero_division=0), 4),
        "f1_macro": round(f1_score(y_test, y_pred, average="macro", zero_division=0), 4),
    }
    print(f"\n=== {name} ===")
    for k, v in metrics.items():
        if k != "model":
            print(f"{k}: {v}")
    cm = confusion_matrix(y_test, y_pred, labels=sorted(y_test.unique()))
    print(f"Confusion matrix shape: {cm.shape} (classes x classes)")
    return metrics


def main():
    print("Loading raw dataset...")
    df = load_raw_dataset()
    X, y = rows_to_multihot(df)
    print(f"Feature matrix: {X.shape}, classes: {y.nunique()}")

    # Stratified split so every disease class is represented proportionally
    # in both train and test sets (avoids a class vanishing from test data).
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    candidates = {
        "LogisticRegression": LogisticRegression(max_iter=2000, random_state=RANDOM_STATE),
        "DecisionTree": DecisionTreeClassifier(max_depth=None, random_state=RANDOM_STATE),
        "RandomForest": RandomForestClassifier(
            n_estimators=200, max_depth=None, random_state=RANDOM_STATE, n_jobs=-1
        ),
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    results = []
    fitted = {}

    for name, model in candidates.items():
        print(f"\nCross-validating {name} (5-fold stratified)...")
        cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring="f1_macro")
        print(f"CV f1_macro: mean={cv_scores.mean():.4f} std={cv_scores.std():.4f}")

        model.fit(X_train, y_train)
        fitted[name] = model
        metrics = evaluate(model, X_test, y_test, name)
        metrics["cv_f1_macro_mean"] = round(cv_scores.mean(), 4)
        metrics["cv_f1_macro_std"] = round(cv_scores.std(), 4)
        results.append(metrics)

    # Model selection: prefer highest macro-F1 (balanced across all 41
    # classes, not just accuracy which a dominant class could inflate),
    # break ties by lower CV variance (more stable), then prefer the
    # simpler/more interpretable model.
    interpretability_rank = {"LogisticRegression": 0, "DecisionTree": 1, "RandomForest": 2}
    results_sorted = sorted(
        results,
        key=lambda r: (-r["f1_macro"], r["cv_f1_macro_std"], interpretability_rank[r["model"]]),
    )
    best_name = results_sorted[0]["model"]
    best_model = fitted[best_name]

    print("\n=== Model comparison summary ===")
    for r in results_sorted:
        print(r)
    print(f"\nSelected model: {best_name}")

    # Persist model + the exact feature column order + a small metadata file
    symptom_to_index = {s: i for i, s in enumerate(CANONICAL_SYMPTOMS)}

    joblib.dump(best_model, MODELS_DIR / "model.pkl")
    joblib.dump(CANONICAL_SYMPTOMS, MODELS_DIR / "feature_columns.pkl")
    joblib.dump(symptom_to_index, MODELS_DIR / "symptom_encoder.pkl")

    metadata = {
        "model_version": "1.0.0",
        "selected_model": best_name,
        "n_features": len(CANONICAL_SYMPTOMS),
        "n_classes": int(y.nunique()),
        "comparison": results_sorted,
    }
    with open(MODELS_DIR / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nSaved model.pkl, feature_columns.pkl, symptom_encoder.pkl, metadata.json to {MODELS_DIR}")


if __name__ == "__main__":
    main()
