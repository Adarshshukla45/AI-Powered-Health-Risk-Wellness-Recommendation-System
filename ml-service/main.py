"""
main.py — Phase 4: FastAPI ML service.

Run:
    cd ml-service
    uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.nlp import extract_symptoms
from src.predict import predict as run_prediction
from src.symptom_vocab import CANONICAL_SYMPTOMS

app = FastAPI(
    title="AI Health Risk & Wellness — ML Service",
    version="1.0.0",
    description=(
        "Educational NLP + ML microservice for symptom extraction and risk "
        "estimation. Does not provide medical diagnosis or treatment."
    ),
)

# In production, restrict this to the actual Node backend origin via env var,
# not "*". Kept permissive here only because this service is called
# server-to-server (Node -> FastAPI), never directly from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class ExtractSymptomsRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


class ExtractSymptomsResponse(BaseModel):
    symptoms: List[str]


class PredictRequest(BaseModel):
    symptoms: List[str] = Field(default_factory=list)
    free_text: Optional[str] = Field(
        default=None, description="Optional raw text; will be merged via NLP extraction."
    )
    age: Optional[int] = Field(default=None, ge=0, le=120)
    gender: Optional[str] = None
    duration_days: Optional[int] = Field(default=None, ge=0)
    severity: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service", "n_symptom_vocab": len(CANONICAL_SYMPTOMS)}


@app.post("/extract-symptoms", response_model=ExtractSymptomsResponse)
def extract_symptoms_endpoint(payload: ExtractSymptomsRequest):
    try:
        symptoms = extract_symptoms(payload.text)
        return {"symptoms": symptoms}
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=500, detail="Symptom extraction failed.") from exc


@app.post("/predict")
def predict_endpoint(payload: PredictRequest):
    try:
        symptoms = list(payload.symptoms)

        if payload.free_text:
            extracted = extract_symptoms(payload.free_text)
            for s in extracted:
                if s not in symptoms:
                    symptoms.append(s)

        # Validate any structured/checkbox symptoms against known vocabulary
        # rather than silently accepting garbage the model has no feature for.
        unknown = [s for s in symptoms if s not in CANONICAL_SYMPTOMS]
        symptoms = [s for s in symptoms if s in CANONICAL_SYMPTOMS]

        result = run_prediction(symptoms)
        result["normalized_symptoms"] = symptoms
        if unknown:
            result["ignored_unrecognized_symptoms"] = unknown
        return result
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts not found. Run `python -m src.train` first.",
        ) from exc
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=500, detail="Prediction failed.") from exc
