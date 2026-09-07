# AI Health Risk & Wellness Recommendation System

> ⚠️ **Educational project — not a medical device.**
> This application does not diagnose disease and does not replace a
> qualified healthcare professional. See [Medical Safety Disclaimer](#medical-safety-disclaimer).

Status: **Phase 1 of 15 — Architecture & Folder Structure** ✅
(See [Development Roadmap](#development-roadmap) below.)

## Project Overview
A final-year full-stack project that takes user-reported symptoms
(natural language + structured fields), extracts and normalizes
symptoms with NLP, estimates a **risk category** (not a diagnosis)
with an interpretable ML model, explains which symptoms drove that
estimate, applies a separate rule-based red-flag/urgency check, and
— only when safe to do so — surfaces general wellness product
*information* (never a prescription or cure claim).

## Architecture

```
 React (frontend)
      │  Axios (JWT-authenticated requests)
      ▼
 Node.js + Express (backend)
      │  REST call
      ▼
 Python FastAPI (ml-service)
      │
      ├── NLP symptom extraction (spaCy + normalization dictionary)
      └── ML model (scikit-learn, joblib) ──▶ risk_level + possible_conditions
      │
      ▼
 Node.js (backend)
      │  persists assessment, applies safety rules, fetches wellness
      │  product info from MongoDB
      ▼
 MongoDB (users, assessments, products)
      │
      ▼
 React (result page: risk summary, explanation, monitoring
        guidance, wellness info, disclaimer)
```

Two independent safety layers sit outside the ML model itself:
1. **Red-flag rule engine** (ml-service/src/safety_rules.py) — decides
   `URGENT` from explicit emergency-symptom rules, never from model
   probability alone.
2. **Recommendation safety gate** (backend) — blocks wellness product
   suggestions whenever risk is `URGENT` or input is insufficient.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT |
| ML Service | Python, FastAPI, pandas, NumPy, scikit-learn, joblib, spaCy |

## Folder Structure

```
ai-health-risk-system/
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Card, RiskBadge, ProductCard, etc.
│   │   ├── pages/        # Landing, Login, Dashboard, Assessment, Result...
│   │   ├── services/     # Axios API clients
│   │   ├── hooks/        # custom React hooks
│   │   ├── context/      # auth context / global state
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/      # request handlers
│   ├── models/           # Mongoose schemas: User, Assessment, Product
│   ├── routes/           # Express routers
│   ├── middleware/       # auth, error handling, rate limiting
│   ├── services/         # ML-service client, recommendation logic
│   ├── config/           # db connection, env loading
│   └── server.js
│
├── ml-service/
│   ├── data/              # dataset (raw/processed) — see Dataset section
│   ├── models/            # model.pkl, symptom_encoder.pkl, feature_columns.pkl
│   ├── notebooks/         # exploratory analysis / training notebooks
│   ├── src/
│   │   ├── preprocessing.py
│   │   ├── train.py
│   │   ├── predict.py
│   │   ├── nlp.py
│   │   └── safety_rules.py
│   ├── main.py            # FastAPI app
│   └── requirements.txt
│
├── README.md
├── .gitignore
└── .env.example
```

## Installation
_(Filled in as each service is built — Phases 4–9.)_

## Environment Variables
See [`.env.example`](./.env.example) at the repo root. Copy the
relevant section into `backend/.env`, `ml-service/.env`, and
`frontend/.env`. Never commit real `.env` files.

## Dataset
_To be documented in Phase 2 — name, source, license, column
meanings, and limitations will be recorded here **before** any
training happens._

## ML Pipeline
_Documented in Phase 2._

## API Documentation
_Documented as each API is built (Phases 4–6, 11)._

## Database Schema
_Documented in Phase 6._

## How to Train the Model
_Documented in Phase 2._

## How to Run
- Backend — _Phase 5_
- Frontend — _Phase 8_
- ML service — _Phase 4_

## Testing
_Documented in Phase 13._

## Limitations
- The ML model estimates statistical association between reported
  symptoms and risk categories in a training dataset. It is **not**
  a diagnostic tool and has not been clinically validated.
- Symptom self-report and NLP extraction are imperfect and may
  miss or misinterpret symptoms.
- Wellness product information is descriptive only and is never a
  treatment or cure recommendation.

## Medical Safety Disclaimer
**This application is for educational and informational purposes
only. It does not provide medical diagnosis or treatment. If
symptoms are severe, persistent, or concerning, consult a qualified
healthcare professional.**

## Future Improvements
_Documented in later phases._

## Development Roadmap
| Phase | Scope | Status |
|---|---|---|
| 1 | Architecture + folder structure | ✅ Done |
| 2 | Dataset selection + preprocessing + model training | ⏳ Next |
| 3 | NLP symptom extraction | Pending |
| 4 | FastAPI ML service | Pending |
| 5 | Node.js + Express backend | Pending |
| 6 | MongoDB integration | Pending |
| 7 | Authentication | Pending |
| 8 | React frontend shell | Pending |
| 9 | Assessment UI | Pending |
| 10 | Prediction result UI | Pending |
| 11 | Wellness recommendation engine | Pending |
| 12 | Dashboard / history | Pending |
| 13 | Testing | Pending |
| 14 | Security hardening | Pending |
| 15 | Deployment | Pending |
"# AI-Powered-Health-Risk-Wellness-Recommendation-System" 
