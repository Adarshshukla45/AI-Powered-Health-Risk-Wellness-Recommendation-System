"""
Run: cd ml-service && pytest tests/ -v
Requires the model to already be trained (python -m src.train) since
test_predict.py loads the real model artifacts.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.nlp import extract_symptoms
from src.preprocessing import symptoms_to_feature_vector
from src.safety_rules import check_red_flags, get_progression_guidance
from src.symptom_vocab import CANONICAL_SYMPTOMS


def test_extract_symptoms_basic():
    result = extract_symptoms("I have fever, headache and severe tiredness.")
    assert "high_fever" in result
    assert "headache" in result
    assert "fatigue" in result


def test_extract_symptoms_handles_typo():
    result = extract_symptoms("feaver and joint pane since yesterday")
    assert "high_fever" in result
    assert "joint_pain" in result


def test_extract_symptoms_empty_text():
    assert extract_symptoms("") == []
    assert extract_symptoms("   ") == []


def test_extract_symptoms_no_false_positive_on_short_words():
    # "pain" alone should not fuzzy-match "head pain" -> headache
    result = extract_symptoms("I have chest pain and difficulty breathing")
    assert "headache" not in result
    assert "chest_pain" in result
    assert "breathlessness" in result


def test_feature_vector_shape_and_values():
    df = symptoms_to_feature_vector(["high_fever", "headache"])
    assert df.shape == (1, len(CANONICAL_SYMPTOMS))
    assert df["high_fever"].iloc[0] == 1
    assert df["headache"].iloc[0] == 1
    assert df["itching"].iloc[0] == 0


def test_feature_vector_ignores_unknown_symptom():
    df = symptoms_to_feature_vector(["not_a_real_symptom", "cough"])
    assert df["cough"].iloc[0] == 1
    assert "not_a_real_symptom" not in df.columns


def test_red_flag_single_symptom_triggers_urgent():
    result = check_red_flags(["chest_pain", "cough"])
    assert result["is_urgent"] is True
    assert "chest_pain" in result["triggered_by"]


def test_red_flag_combination_triggers_urgent():
    result = check_red_flags(["high_fever", "stiff_neck"])
    assert result["is_urgent"] is True


def test_red_flag_no_trigger_on_mild_symptoms():
    result = check_red_flags(["itching", "skin_rash"])
    assert result["is_urgent"] is False
    assert result["triggered_by"] == []


def test_progression_guidance_urgent_has_no_home_monitoring():
    guidance = get_progression_guidance("URGENT")
    assert "seek" in guidance["when_to_seek_help"][0].lower()


def test_progression_guidance_unknown_defaults_to_moderate():
    guidance = get_progression_guidance("NOT_A_REAL_LEVEL")
    assert guidance == get_progression_guidance("MODERATE")
