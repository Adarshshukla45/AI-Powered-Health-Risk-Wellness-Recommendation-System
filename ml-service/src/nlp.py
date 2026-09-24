"""
nlp.py — Phase 3: NLP symptom extraction.

Turns free-text symptom descriptions ("I have had a headache, fever and
severe tiredness for three days") into a list of canonical symptom
tokens drawn from CANONICAL_SYMPTOMS (see symptom_vocab.py).

Pipeline:
  1. spaCy tokenizes + lemmatizes the input and splits it into candidate
     phrases (multi-word noun chunks + individual content tokens).
  2. Each candidate phrase is looked up in SYNONYM_MAP first (exact /
     near-exact phrase match), since many everyday phrases ("shortness
     of breath") don't lemmatize cleanly onto the canonical token.
  3. Anything not matched by step 2 is fuzzy-matched (rapidfuzz) against
     both SYNONYM_MAP keys and CANONICAL_SYMPTOMS to catch typos and
     minor variations ("feaver" -> "fever" -> "high_fever").
  4. Results are de-duplicated while preserving first-seen order.

This is intentionally a rule-based + fuzzy-matching layer, not a
clinical NLP/NER system — it is transparent and debuggable, which
matters more for a final-year project than raw recall.
"""
from __future__ import annotations

import re
from typing import List

import spacy
from rapidfuzz import fuzz, process

from .symptom_vocab import CANONICAL_SYMPTOMS, SYNONYM_MAP

_NLP = None  # lazy-loaded spaCy pipeline


def _get_nlp():
    global _NLP
    if _NLP is None:
        try:
            _NLP = spacy.load("en_core_web_sm")
        except OSError as exc:  # pragma: no cover - guidance for setup
            raise RuntimeError(
                "spaCy model 'en_core_web_sm' is not installed. Run: "
                "python -m spacy download en_core_web_sm"
            ) from exc
    return _NLP


# All lookup keys we fuzzy-match against: synonym phrases + canonical names
# (canonical names with underscores rewritten as spaces for matching).
_ALL_PHRASES = list(SYNONYM_MAP.keys()) + [
    s.replace("_", " ").strip() for s in CANONICAL_SYMPTOMS
]
_PHRASE_TO_CANONICAL = dict(SYNONYM_MAP)
for s in CANONICAL_SYMPTOMS:
    _PHRASE_TO_CANONICAL.setdefault(s.replace("_", " ").strip(), s)

_FUZZY_THRESHOLD = 88  # rapidfuzz score (0-100); tuned for short phrases
_MIN_FUZZY_LEN = 4      # skip fuzzy matching on very short candidates (unreliable)

# Duration/severity words that shouldn't themselves be treated as symptoms
_STOPWORD_PHRASES = {
    "day", "days", "week", "weeks", "month", "months", "hour", "hours",
    "since", "ago", "have", "having", "feel", "feeling", "experience",
    "experiencing", "severe", "mild", "moderate", "little", "bit",
}


def _clean(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _candidate_phrases(text: str) -> List[str]:
    """Generate candidate phrases: noun chunks + bigrams + unigrams."""
    doc = _get_nlp()(text)
    candidates: List[str] = []

    for chunk in doc.noun_chunks:
        # Skip chunks that are just a pronoun/determiner (e.g. "I", "it")
        if all(t.is_stop or t.pos_ == "PRON" for t in chunk):
            continue
        phrase = _clean(chunk.text)
        if phrase and phrase not in _STOPWORD_PHRASES and len(phrase) >= _MIN_FUZZY_LEN:
            candidates.append(phrase)

    tokens = [t.lemma_.lower() for t in doc if t.is_alpha and not t.is_stop]
    # bigrams first (more specific), then unigrams
    for i in range(len(tokens) - 1):
        bigram = f"{tokens[i]} {tokens[i + 1]}"
        candidates.append(bigram)
    for t in tokens:
        if t not in _STOPWORD_PHRASES:
            candidates.append(t)

    # de-dup, preserve order
    seen = set()
    ordered = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            ordered.append(c)
    return ordered


def extract_symptoms(text: str) -> List[str]:
    """
    Extract normalized, canonical symptom tokens from free-text input.

    Returns a list like ["high_fever", "headache", "fatigue"], de-duplicated
    and in first-seen order. Returns an empty list for empty/irrelevant text.
    """
    if not text or not text.strip():
        return []

    cleaned_full = _clean(text)
    found: List[str] = []
    seen_canonical = set()

    def _add(canonical: str):
        if canonical in CANONICAL_SYMPTOMS and canonical not in seen_canonical:
            seen_canonical.add(canonical)
            found.append(canonical)

    # 1. Exact substring match on full text for multi-word synonyms first
    #    (longer phrases matched first to avoid partial shadowing, e.g.
    #    "shortness of breath" should win over a lone "breath").
    for phrase in sorted(_PHRASE_TO_CANONICAL.keys(), key=len, reverse=True):
        if phrase in cleaned_full:
            _add(_PHRASE_TO_CANONICAL[phrase])

    # 2. Candidate-phrase pass (noun chunks / bigrams / unigrams) with
    #    exact then fuzzy matching, to catch anything the substring pass missed.
    for phrase in _candidate_phrases(cleaned_full):
        if phrase in _PHRASE_TO_CANONICAL:
            _add(_PHRASE_TO_CANONICAL[phrase])
            continue
        if len(phrase) < _MIN_FUZZY_LEN:
            continue
        match = process.extractOne(
            phrase, _ALL_PHRASES, scorer=fuzz.ratio, score_cutoff=_FUZZY_THRESHOLD
        )
        if match:
            matched_phrase = match[0]
            _add(_PHRASE_TO_CANONICAL[matched_phrase])

    return found


if __name__ == "__main__":  # pragma: no cover - manual smoke test
    samples = [
        "I have fever, headache and severe tiredness.",
        "I have been experiencing headache, fever, weakness and cough for three days.",
        "feaver and joint pane since yesterday",
    ]
    for s in samples:
        print(s, "->", extract_symptoms(s))
