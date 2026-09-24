"""
symptom_vocab.py

Single source of truth for the canonical symptom vocabulary used across
the whole ml-service (NLP extraction, training, and prediction).

CANONICAL_SYMPTOMS matches exactly the 131 distinct symptom tokens found
in ml-service/data/dataset.csv (see data/DATASET_INFO.md). Keeping this
list in one place guarantees the NLP layer, the trained model's feature
columns, and the prediction API all agree on the same symptom space.

SYNONYM_MAP maps common natural-language words/phrases (and some
frequent misspellings) to a canonical symptom. This is a hand-curated,
non-exhaustive mapping intended for an educational project — it is not
a clinical terminology system (like SNOMED CT) and should not be
treated as one.
"""

CANONICAL_SYMPTOMS = sorted([
    "abdominal_pain", "abnormal_menstruation", "acidity", "acute_liver_failure",
    "altered_sensorium", "anxiety", "back_pain", "belly_pain", "blackheads",
    "bladder_discomfort", "blister", "blood_in_sputum", "bloody_stool",
    "blurred_and_distorted_vision", "breathlessness", "brittle_nails",
    "bruising", "burning_micturition", "chest_pain", "chills",
    "cold_hands_and_feets", "coma", "congestion", "constipation",
    "continuous_feel_of_urine", "continuous_sneezing", "cough", "cramps",
    "dark_urine", "dehydration", "depression", "diarrhoea",
    "dischromic _patches", "distention_of_abdomen", "dizziness",
    "drying_and_tingling_lips", "enlarged_thyroid", "excessive_hunger",
    "extra_marital_contacts", "family_history", "fast_heart_rate", "fatigue",
    "fluid_overload", "foul_smell_of urine", "headache", "high_fever",
    "hip_joint_pain", "history_of_alcohol_consumption", "increased_appetite",
    "indigestion", "inflammatory_nails", "internal_itching",
    "irregular_sugar_level", "irritability", "irritation_in_anus",
    "itching", "joint_pain", "knee_pain", "lack_of_concentration",
    "lethargy", "loss_of_appetite", "loss_of_balance", "loss_of_smell",
    "malaise", "mild_fever", "mood_swings", "movement_stiffness",
    "mucoid_sputum", "muscle_pain", "muscle_wasting", "muscle_weakness",
    "nausea", "neck_pain", "nodal_skin_eruptions", "obesity",
    "pain_behind_the_eyes", "pain_during_bowel_movements",
    "pain_in_anal_region", "painful_walking", "palpitations",
    "passage_of_gases", "patches_in_throat", "phlegm", "polyuria",
    "prominent_veins_on_calf", "puffy_face_and_eyes", "pus_filled_pimples",
    "receiving_blood_transfusion", "receiving_unsterile_injections",
    "red_sore_around_nose", "red_spots_over_body", "redness_of_eyes",
    "restlessness", "runny_nose", "rusty_sputum", "scurring", "shivering",
    "silver_like_dusting", "sinus_pressure", "skin_peeling", "skin_rash",
    "slurred_speech", "small_dents_in_nails", "spinning_movements",
    "spotting_ urination", "stiff_neck", "stomach_bleeding", "stomach_pain",
    "sunken_eyes", "sweating", "swelled_lymph_nodes", "swelling_joints",
    "swelling_of_stomach", "swollen_blood_vessels", "swollen_extremeties",
    "swollen_legs", "throat_irritation", "toxic_look_(typhos)",
    "ulcers_on_tongue", "unsteadiness", "visual_disturbances", "vomiting",
    "watering_from_eyes", "weakness_in_limbs", "weakness_of_one_body_side",
    "weight_gain", "weight_loss", "yellow_crust_ooze", "yellow_urine",
    "yellowing_of_eyes", "yellowish_skin",
])

# Natural-language phrase / word -> canonical symptom.
# Keys are lowercase, space-separated (not snake_case) for readability;
# the NLP layer normalizes user text the same way before lookup.
SYNONYM_MAP = {
    # Fatigue / weakness cluster
    "tired": "fatigue", "tiredness": "fatigue", "exhausted": "fatigue",
    "exhaustion": "fatigue", "weakness": "fatigue", "low energy": "fatigue",
    "no energy": "fatigue", "worn out": "fatigue",
    "body weakness": "muscle_weakness", "weak muscles": "muscle_weakness",
    "limb weakness": "weakness_in_limbs", "weak legs": "weakness_in_limbs",
    "one side weakness": "weakness_of_one_body_side",

    # Fever cluster
    "fever": "high_fever", "high temperature": "high_fever",
    "temperature": "high_fever", "mild temperature": "mild_fever",
    "slight fever": "mild_fever", "low grade fever": "mild_fever",
    "chills and fever": "chills",

    # Head / neuro
    "headache": "headache", "head pain": "headache", "migraine": "headache",
    "dizzy": "dizziness", "dizziness": "dizziness", "lightheaded": "dizziness",
    "spinning": "spinning_movements", "vertigo": "spinning_movements",
    "confusion": "altered_sensorium", "disoriented": "altered_sensorium",
    "slurred speech": "slurred_speech", "trouble speaking": "slurred_speech",
    "loss of balance": "loss_of_balance", "unsteady": "unsteadiness",

    # Respiratory
    "cough": "cough", "coughing": "cough", "dry cough": "cough",
    "breathless": "breathlessness", "shortness of breath": "breathlessness",
    "difficulty breathing": "breathlessness", "hard to breathe": "breathlessness",
    "runny nose": "runny_nose", "blocked nose": "congestion",
    "stuffy nose": "congestion", "sneezing": "continuous_sneezing",
    "sore throat": "throat_irritation", "throat pain": "throat_irritation",
    "phlegm": "phlegm", "mucus": "phlegm", "blood in cough": "blood_in_sputum",
    "coughing blood": "blood_in_sputum",

    # GI
    "nausea": "nausea", "nauseous": "nausea", "feeling sick": "nausea",
    "vomiting": "vomiting", "throwing up": "vomiting", "vomit": "vomiting",
    "diarrhea": "diarrhoea", "diarrhoea": "diarrhoea", "loose motion": "diarrhoea",
    "loose motions": "diarrhoea", "constipated": "constipation",
    "constipation": "constipation", "stomach pain": "stomach_pain",
    "stomach ache": "stomach_pain", "belly pain": "belly_pain",
    "abdominal pain": "abdominal_pain", "acidity": "acidity",
    "heartburn": "acidity", "indigestion": "indigestion",
    "loss of appetite": "loss_of_appetite", "not hungry": "loss_of_appetite",
    "increased appetite": "increased_appetite", "always hungry": "excessive_hunger",

    # Pain
    "chest pain": "chest_pain", "back pain": "back_pain",
    "joint pain": "joint_pain", "knee pain": "knee_pain",
    "neck pain": "neck_pain", "stiff neck": "stiff_neck",
    "muscle pain": "muscle_pain", "body ache": "muscle_pain",
    "body pain": "muscle_pain", "cramps": "cramps",

    # Skin
    "rash": "skin_rash", "skin rash": "skin_rash", "itching": "itching",
    "itchy": "itching", "red spots": "red_spots_over_body",
    "skin peeling": "skin_peeling", "pimples": "pus_filled_pimples",
    "acne": "pus_filled_pimples", "blackheads": "blackheads",
    "bruising": "bruising", "bruises": "bruising",

    # Eyes
    "blurred vision": "blurred_and_distorted_vision",
    "blurry vision": "blurred_and_distorted_vision",
    "watery eyes": "watering_from_eyes", "red eyes": "redness_of_eyes",
    "yellow eyes": "yellowing_of_eyes", "puffy eyes": "puffy_face_and_eyes",
    "pain behind eyes": "pain_behind_the_eyes",

    # Urinary
    "burning urination": "burning_micturition",
    "painful urination": "burning_micturition",
    "dark urine": "dark_urine", "yellow urine": "yellow_urine",
    "frequent urination": "polyuria", "frequent urine": "polyuria",

    # Cardio / metabolic
    "palpitations": "palpitations", "racing heart": "fast_heart_rate",
    "rapid heartbeat": "fast_heart_rate", "sweating": "sweating",
    "night sweats": "sweating", "weight loss": "weight_loss",
    "weight gain": "weight_gain", "obesity": "obesity",
    "swollen legs": "swollen_legs", "swelling in legs": "swollen_legs",
    "cold hands and feet": "cold_hands_and_feets",

    # Mental health / mood (informational only — see safety_rules for
    # anything crisis-related, which this project does not attempt to
    # triage clinically)
    "anxiety": "anxiety", "anxious": "anxiety", "depressed": "depression",
    "depression": "depression", "mood swings": "mood_swings",
    "irritable": "irritability", "restless": "restlessness",

    # Misc commonly typed
    "jaundice": "yellowish_skin", "yellow skin": "yellowish_skin",
    "swollen glands": "swelled_lymph_nodes",
    "swollen lymph nodes": "swelled_lymph_nodes",
    "enlarged thyroid": "enlarged_thyroid",
    "brittle nails": "brittle_nails",
    "family history": "family_history",
}
