"""
disease_risk_map.py

The training dataset (dataset.csv) has NO severity/risk labels — only a
disease name per row. Since the project needs a LOW / MODERATE / HIGH
risk category (URGENT is handled separately and exclusively by
safety_rules.py), this module provides a small, manually curated
mapping from the 41 disease labels in the dataset to a baseline risk
category.

*** This mapping is a simplified, non-clinical heuristic created for
*** this educational project only. It is NOT a clinical severity
*** grading system, is not sourced from a medical guideline, and must
*** not be presented to end users as authoritative. It exists purely
*** so the app has *something* principled and transparent to show
*** besides raw class probabilities. Treat it as a documented
*** assumption, not a verified fact, and feel free to revise it with
*** guidance from a clinician if this project is extended.

Any disease not listed defaults to "MODERATE" (a conservative middle
ground) rather than silently defaulting to "LOW".
"""

DISEASE_RISK_MAP = {
    # Generally low-acuity / self-limiting in most cases
    "Fungal infection": "LOW",
    "Allergy": "LOW",
    "Common Cold": "LOW",
    "Acne": "LOW",
    "Psoriasis": "LOW",
    "Impetigo": "LOW",
    "Dimorphic hemmorhoids(piles)": "LOW",
    "Varicose veins": "LOW",
    "Osteoarthristis": "LOW",
    "Arthritis": "LOW",
    "Cervical spondylosis": "LOW",
    "Drug Reaction": "LOW",

    # Generally warrant attention / can become serious if unmanaged
    "GERD": "MODERATE",
    "Chronic cholestasis": "MODERATE",
    "Gastroenteritis": "MODERATE",
    "Migraine": "MODERATE",
    "Hypothyroidism": "MODERATE",
    "Hyperthyroidism": "MODERATE",
    "Hypoglycemia": "MODERATE",
    "Urinary tract infection": "MODERATE",
    "Peptic ulcer diseae": "MODERATE",
    "Bronchial Asthma": "MODERATE",
    "Hypertension ": "MODERATE",
    "Diabetes ": "MODERATE",
    "Jaundice": "MODERATE",
    "(vertigo) Paroymsal  Positional Vertigo": "MODERATE",
    "Chicken pox": "MODERATE",
    "Typhoid": "MODERATE",

    # Generally higher-acuity / systemic / need prompt medical attention
    "Dengue": "HIGH",
    "Malaria": "HIGH",
    "hepatitis A": "HIGH",
    "Hepatitis B": "HIGH",
    "Hepatitis C": "HIGH",
    "Hepatitis D": "HIGH",
    "Hepatitis E": "HIGH",
    "Alcoholic hepatitis": "HIGH",
    "Tuberculosis": "HIGH",
    "Pneumonia": "HIGH",
    "AIDS": "HIGH",
    "Paralysis (brain hemorrhage)": "HIGH",
    "Heart attack": "HIGH",
}

DEFAULT_RISK = "MODERATE"


def get_baseline_risk(disease: str) -> str:
    return DISEASE_RISK_MAP.get(disease, DEFAULT_RISK)
