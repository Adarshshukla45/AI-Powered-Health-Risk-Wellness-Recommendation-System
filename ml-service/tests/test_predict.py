import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.predict import predict


def test_predict_insufficient_info():
    result = predict([])
    assert result["risk_level"] == "INSUFFICIENT_INFO"
    assert result["possible_conditions"] == []


def test_predict_returns_conditions_and_explanation():
    result = predict(["high_fever", "headache", "fatigue", "cough"])
    assert result["risk_level"] in {"LOW", "MODERATE", "HIGH", "URGENT"}
    assert len(result["possible_conditions"]) > 0
    assert 0 <= result["possible_conditions"][0]["probability"] <= 1
    assert len(result["important_symptoms"]) > 0


def test_predict_red_flag_forces_urgent_regardless_of_model():
    result = predict(["chest_pain", "breathlessness"])
    assert result["risk_level"] == "URGENT"
    assert result["red_flags"]["is_urgent"] is True


def test_predict_no_red_flag_symptoms_never_urgent_by_model_alone():
    # None of these are in RED_FLAG_SYMPTOMS / RED_FLAG_COMBINATIONS
    result = predict(["itching", "skin_rash", "nodal_skin_eruptions"])
    assert result["risk_level"] != "URGENT"
