"""
preprocessing.py — Phase 2/19: shared preprocessing so training and the
live prediction API apply the EXACT same transformation.

Raw dataset.csv layout: column 0 = disease label, columns 1..17 = up to
17 symptom names per row (many cells empty). We convert each row into a
multi-hot feature vector over CANONICAL_SYMPTOMS (1 = symptom present).
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import List, Tuple

import pandas as pd

from .symptom_vocab import CANONICAL_SYMPTOMS

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "dataset.csv"


def _clean_symptom_cell(value) -> str:
    if pd.isna(value):
        return ""
    return str(value).strip()


def load_raw_dataset(path: Path = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)
    df.columns = ["disease"] + [f"symptom_{i}" for i in range(1, len(df.columns))]
    df["disease"] = df["disease"].str.strip()
    return df


def rows_to_multihot(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Converts the raw wide dataframe (disease + symptom_1..symptom_17) into
    a multi-hot feature matrix X (one column per canonical symptom) and a
    target series y (disease label).
    """
    symptom_cols = [c for c in df.columns if c.startswith("symptom_")]
    feature_rows = []

    for _, row in df.iterrows():
        present = set()
        for c in symptom_cols:
            v = _clean_symptom_cell(row[c])
            if v:
                present.add(v)
        feature_rows.append({s: int(s in present) for s in CANONICAL_SYMPTOMS})

    X = pd.DataFrame(feature_rows, columns=CANONICAL_SYMPTOMS)
    y = df["disease"].reset_index(drop=True)
    return X, y


def symptoms_to_feature_vector(symptoms: List[str]) -> pd.DataFrame:
    """
    Used at prediction time: turn a list of canonical symptom strings
    (already normalized by nlp.py) into the same multi-hot column layout
    the model was trained on. Unknown symptoms are silently ignored (they
    can't contribute a feature the model doesn't have).
    """
    present = set(symptoms)
    row = {s: int(s in present) for s in CANONICAL_SYMPTOMS}
    return pd.DataFrame([row], columns=CANONICAL_SYMPTOMS)


if __name__ == "__main__":  # pragma: no cover
    df = load_raw_dataset()
    X, y = rows_to_multihot(df)
    print("Feature matrix:", X.shape, "| Labels:", y.shape)
    print("Classes:", y.nunique())
