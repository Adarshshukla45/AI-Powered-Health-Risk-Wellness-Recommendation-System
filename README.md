# ⭐ SwasthAI — AI-Powered Health Risk & Wellness Recommendation System

SwasthAI is an AI/ML-powered healthcare project that analyzes user-provided symptoms and basic health information to estimate potential health-risk categories and provide personalized wellness guidance.

The system combines **Natural Language Processing (NLP), Machine Learning, Explainable AI, and Content-Based Recommendation** to transform unstructured symptom descriptions into structured insights and relevant wellness-product recommendations.

> ⚠️ **Disclaimer:** SwasthAI is an educational project and is not intended to diagnose diseases, prescribe medicines, or replace professional medical advice.

---

## 🚀 Features

* 🩺 **Natural Language Symptom Analysis**

  * Users can describe symptoms in natural language.
  * Extracts and normalizes relevant symptoms using NLP.

* 🤖 **Machine Learning Health-Risk Prediction**

  * Uses machine-learning classification models to estimate possible health-risk categories.
  * Supports models such as Logistic Regression, Decision Tree, and Random Forest.

* 🔍 **Explainable AI**

  * Shows important symptoms/features that contributed to the model's prediction.
  * Helps users understand how the model reached its result.

* ⚠️ **Safety & Red-Flag Detection**

  * Identifies potentially concerning symptom combinations.
  * Prioritizes professional medical attention when appropriate.
  * Prevents wellness-product recommendations in urgent scenarios.

* 🛍️ **Content-Based Wellness Recommendation**

  * Matches user wellness concerns with relevant products based on product characteristics, categories, and tags.
  * Uses similarity-based ranking to generate relevant recommendations.
  * Initially designed around a verified Patanjali wellness-product catalog.

* 📊 **Assessment History**

  * Users can view previous assessments and their results.

* 🌐 **Hindi / English / Hinglish Support**

  * Designed to accept natural-language symptom descriptions commonly used by Indian users.

* 🔐 **Authentication**

  * Secure user registration and login using JWT authentication.

---

## 🧠 System Architecture

```text
                    User
                     │
                     ▼
             Symptom Description
                     │
                     ▼
              NLP Processing
                     │
                     ▼
          Structured Symptoms
                     │
             ┌───────┴────────┐
             ▼                ▼
       ML Risk Model     Product Retrieval
             │                │
             ▼                ▼
       Risk Assessment   Similarity Search
             │                │
             └───────┬────────┘
                     ▼
              Safety Engine
                     │
                     ▼
             Product Ranking
                     │
                     ▼
          Personalized Results
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

### AI/ML

* Python
* Pandas
* NumPy
* Scikit-learn
* NLP
* TF-IDF
* Cosine Similarity
* Sentence Embeddings

### ML Service

* FastAPI
* Joblib

---

## 🔬 Machine Learning Pipeline

```text
Dataset
   ↓
Data Cleaning
   ↓
Feature Engineering
   ↓
Symptom Encoding
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Model Selection
   ↓
FastAPI Prediction Service
```

The models are evaluated using:

* Accuracy
* Precision
* Recall
* F1 Score
* Confusion Matrix

The project avoids relying on accuracy alone when evaluating health-related classification.

---

## 🛍️ Recommendation System

SwasthAI uses a **Content-Based Recommendation approach**.

Products are represented using attributes such as:

```text
Category
Tags
Description
Ingredients
Intended Use
Warnings
```

The user's wellness concern is converted into a structured representation and compared with product information.

Example:

```text
User Concern
    ↓
Digestive Wellness
    ↓
Product Features
    ↓
Similarity Score
    ↓
Safety Filtering
    ↓
Top Recommendations
```

The recommendation score represents **relevance**, not the probability that a product will medically treat a condition.

---

## 🔎 Example

### User Input

```text
"I have digestive discomfort and constipation."
```

### NLP Output

```json
{
  "concerns": [
    "digestive",
    "constipation"
  ]
}
```

### Recommendation Pipeline

```text
Digestive + Constipation
          ↓
Digestive Wellness Category
          ↓
Product Retrieval
          ↓
Similarity Ranking
          ↓
Safety Filtering
          ↓
Top 3 Relevant Products
```

---

## 📁 Project Structure

```text
SwasthAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── ml-service/
│   ├── data/
│   ├── models/
│   ├── src/
│   │   ├── preprocessing.py
│   │   ├── nlp.py
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── safety_rules.py
│   ├── main.py
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

---

## 🔮 Future Improvements

* Multilingual NLP for major Indian languages
* Better semantic symptom understanding using transformer models
* Vector database for product retrieval
* Hybrid recommendation system
* Personalized recommendations based on user preferences
* Improved explainability using SHAP
* Additional verified wellness-product catalogs
* Improved safety and validation mechanisms
* Cloud deployment
* Continuous model evaluation

---

## ⚠️ Medical Disclaimer

SwasthAI is an educational and experimental AI/ML project.

It does **not** provide medical diagnosis, prescribe medication, or guarantee future health outcomes.

The health-risk predictions are model-generated estimates and should not be treated as medical certainty.

Product recommendations are intended only as wellness/product information and are not treatment recommendations.

Users experiencing severe, persistent, or concerning symptoms should seek advice from a qualified healthcare professional.

---

## 👨‍💻 Project Goal

The goal of SwasthAI is to demonstrate how modern technologies such as **Machine Learning, NLP, Explainable AI, and Recommendation Systems** can be integrated into a full-stack application to create an intelligent and user-friendly health-assistance platform.

---

## 📚 Learning Areas

This project demonstrates practical knowledge of:

* Python
* Data preprocessing
* Machine Learning
* Classification
* NLP
* Feature Engineering
* Model Evaluation
* Explainable AI
* Recommendation Systems
* Content-Based Filtering
* Similarity Search
* REST APIs
* FastAPI
* Node.js
* Express.js
* MongoDB
* React.js
* Authentication
* Full-Stack AI Integration
