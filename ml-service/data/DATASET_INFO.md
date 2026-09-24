# Dataset Information

**Name:** Disease-Symptom dataset ("Disease Symptom Prediction")
**Primary source used in this project:** `dataset.csv`, downloaded from the
original author's public GitHub repository:
https://github.com/itachi9604/healthcare-chatbot (path: `Data/dataset.csv`)

**Also published on Kaggle by the same author as:**
https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset
("Disease Symptom Prediction")

**License:** The GitHub repository and the linked Kaggle dataset do not
attach a formal open-data license (e.g. no LICENSE file / no explicit
CC license badge on the dataset page at the time of writing). It is a
widely used, publicly downloadable educational dataset with no
gated/paid access. Because there is no explicit permissive license,
this project uses it strictly for **non-commercial, educational,
final-year-project purposes** and does not redistribute it as a
standalone product. **You should re-verify the current license/terms
on the Kaggle page before any use beyond coursework** (e.g. before
including it in a portfolio deployed publicly, or any commercial use).

**Shape:** 4,920 rows × 18 columns (1 disease/target column +
17 symptom-slot columns, many of which are empty per row since not
every case has 17 symptoms).

**Columns:**
- Column 0 (unnamed / "Disease"): the disease label, one of 41 classes
  (e.g. `Fungal infection`, `Common Cold`, `Diabetes`, `Heart attack`,
  `Tuberculosis`, `Hypertension`, etc.)
- Columns 1–17 (`Symptom_1` … `Symptom_17`): each cell holds one
  symptom name associated with that case (e.g. `itching`, `skin_rash`,
  `high_fever`). Unused slots are empty. There is no fixed order or
  severity encoded in the column position.
- There are 131 distinct symptom tokens across the dataset, each in a
  normalized `snake_case` form (e.g. `chest_pain`, `breathlessness`,
  `weakness_of_one_body_side`).
- Each of the 41 diseases has exactly 120 rows (synthetic/balanced
  resampling of underlying symptom combinations, not 120 unique real
  patients per disease).

**What the columns mean:** each row is a symptom *set* believed to be
associated with a disease label — it is **not** a real de-identified
patient record with a clinical diagnosis workflow behind it. The
dataset was assembled for building/teaching symptom-checker style
classifiers, not for clinical research.

**Limitations (read before relying on any output of this project):**
- This is **not** a clinically validated dataset. The disease labels
  are illustrative associations between symptom sets and named
  conditions, not confirmed diagnoses from real patient charts.
- The class balance (exactly 120 rows per disease) is artificial —
  real-world disease prevalence is not remotely this uniform, so raw
  model probabilities do **not** reflect real-world epidemiological
  risk.
- Only 41 disease categories are covered; countless other conditions
  (including many serious/urgent ones) are entirely absent from the
  label space.
- Symptom presence is binary per case — there is no severity, timing,
  duration, or patient-history nuance encoded, even though the app's
  input form collects some of that.
- Because of all of the above, this project treats model output as an
  **educational risk-category estimate**, never a diagnosis — see the
  Medical Safety Disclaimer in the root README. The `URGENT` category
  is deliberately **not** derived from this model at all; it comes
  from an independent, manually curated red-flag rule engine
  (`src/safety_rules.py`) so that emergency-symptom detection does not
  depend on this dataset's coverage or quality.
