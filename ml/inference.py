import re
import json
import os
import sys
from pathlib import Path
from typing import Optional
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    torch = None
    TORCH_AVAILABLE = False

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from langdetect import detect, DetectorFactory

# Set seed for deterministic language detection
DetectorFactory.seed = 0

import logging

logger = logging.getLogger("cybergraph-x.ner")

KNOWN_THREAT_ACTORS = [
    "APT28", "Lazarus", "Sandworm", "APT41", "Kimsuky", "FIN7", "Fancy Bear", "Volt Typhoon", "Cozy Bear"
]

KNOWN_MALWARE = [
    "Cobalt Strike", "RedLine Stealer", "AgentTesla", "PlugX", "LockBit", "Qakbot", "Emotet", "AsyncRAT", "X-Agent"
]


def detect_language_and_codemix(text: str) -> dict:
    """
    Detect primary language and evaluate code-mixing indicators across English, Spanish, Hindi, Russian, and Chinese.
    """
    detected_codes = set()
    try:
        from langdetect import detect_langs
        for l in detect_langs(text):
            if l.prob >= 0.08:
                detected_codes.add(l.lang.lower())
    except Exception:
        try:
            detected_codes.add(detect(text).lower())
        except Exception:
            detected_codes.add("en")

    contains_cyrillic = bool(re.search(r'[\u0400-\u04FF]', text))
    contains_chinese = bool(re.search(r'[\u4E00-\u9FFF]', text))
    contains_latin = bool(re.search(r'[a-zA-Z]', text))

    spanish_markers = ['el', 'la', 'los', 'las', 'del', 'para', 'utilizo', 'servidores', 'estatales', 'vulnerabilidad', 'infectar', 'usando', 'grupo', 'con', 'por', 'que']
    hinglish_markers = ['kiya', 'karke', 'banaya', 'hai', 'hain', 'raha', 'rahe', 'huye', 'gaya', 'gaye', 'ne', 'aur', 'par', 'sabse', 'wala', 'wali']

    has_spanish = ('es' in detected_codes) or any(re.search(rf'\b{m}\b', text, re.IGNORECASE) for m in spanish_markers)
    has_hinglish = ('hi' in detected_codes) or any(re.search(rf'\b{m}\b', text, re.IGNORECASE) for m in hinglish_markers)
    has_russian = ('ru' in detected_codes) or contains_cyrillic
    has_chinese = ('zh-cn' in detected_codes or 'zh-tw' in detected_codes or 'zh' in detected_codes) or contains_chinese
    has_english = ('en' in detected_codes) or contains_latin

    langs_set = []
    if has_hinglish:
        langs_set.append('HI')
        langs_set.append('EN')
    if has_spanish:
        langs_set.append('ES')
    if has_russian:
        langs_set.append('RU')
    if has_chinese:
        langs_set.append('ZH')
    if has_english and 'EN' not in langs_set:
        langs_set.append('EN')

    unique_langs = []
    for l in langs_set:
        if l not in unique_langs:
            unique_langs.append(l)

    details = []
    if len(unique_langs) > 1:
        lang_str = '-'.join(unique_langs).lower()
        is_code_mixed = True
        details.append(f"Multilingual CTI advisory combining {', '.join(unique_langs)}")
    elif len(unique_langs) == 1:
        lang_str = unique_langs[0].lower()
        is_code_mixed = False
    else:
        lang_str = 'en'
        is_code_mixed = False

    return {
        "primary_language": lang_str,
        "is_code_mixed": is_code_mixed,
        "mixing_details": details
    }


class NERService:
    def __init__(self, model_path: Optional[str] = None):
        self.model_loaded = False
        self.contextual_extraction_mode = "keyword_list_only"
        self.model = None
        self.tokenizer = None
        self.id_to_label = {}
        self.init_model(model_path)

    def init_model(self, model_path: Optional[str] = None):
        path_str = model_path or os.getenv("NER_MODEL_PATH", "ml/models/xlm-roberta-cti-ner")
        path = Path(path_str)

        if not TORCH_AVAILABLE:
            logger.warning(
                f"[NER WARNING] PyTorch is not available in this environment. "
                f"Falling back to contextual_extraction_mode='keyword_list_only'."
            )
            self.model_loaded = False
            self.contextual_extraction_mode = "keyword_list_only"
            return

        # Check if model directory and weights binary exist
        weights_exist = False
        if path.exists():
            for w_file in ["pytorch_model.bin", "model.safetensors"]:
                if (path / w_file).exists():
                    weights_exist = True
                    break

        if not weights_exist:
            logger.warning(
                f"[NER WARNING] No trained model weights binary (pytorch_model.bin/model.safetensors) found at '{path}'. "
                f"Contextual entity types (THREAT_ACTOR, MALWARE, ORG) cannot use XLM-RoBERTa neural extraction. "
                f"Falling back to contextual_extraction_mode='keyword_list_only'."
            )
            self.model_loaded = False
            self.contextual_extraction_mode = "keyword_list_only"
            return

        try:
            from transformers import AutoTokenizer, AutoModelForTokenClassification
            import torch
            self.tokenizer = AutoTokenizer.from_pretrained(path)
            self.model = AutoModelForTokenClassification.from_pretrained(path)
            self.model.eval()

            label_map_file = path / "label_map.json"
            if label_map_file.exists():
                with open(label_map_file, "r", encoding="utf-8") as f:
                    map_data = json.load(f)
                    self.id_to_label = {int(k): v for k, v in map_data.get("id_to_label", {}).items()}

            self.model_loaded = True
            self.contextual_extraction_mode = "hybrid_model"
            logger.info(f"Successfully loaded fine-tuned XLM-R NER model from '{path}'")
        except Exception as e:
            logger.warning(
                f"[NER LOAD ERROR] Failed to load model from '{path}': {e}. "
                f"Falling back to contextual_extraction_mode='keyword_list_only'."
            )
            self.model_loaded = False
            self.contextual_extraction_mode = "keyword_list_only"

    def get_status(self) -> dict:
        return {
            "model_loaded": self.model_loaded,
            "contextual_extraction_mode": self.contextual_extraction_mode
        }

    def extract_entities(self, text: str) -> list:
        entities = []
        regex_entities = []

        # Tier 1: Structured Regex matches (Deterministic, 1.0 confidence)
        cve_pattern = r'\bCVE-\d{4}-\d{4,7}\b'
        for match in re.finditer(cve_pattern, text, re.IGNORECASE):
            regex_entities.append({
                "entity": match.group(0).upper(),
                "type": "CVE",
                "start": match.start(),
                "end": match.end(),
                "confidence": 1.0,
                "source": "regex"
            })

        ip_pattern = r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
        for match in re.finditer(ip_pattern, text):
            regex_entities.append({
                "entity": match.group(0),
                "type": "IP",
                "start": match.start(),
                "end": match.end(),
                "confidence": 1.0,
                "source": "regex"
            })

        domain_pattern = r'\b(?:[a-zA-Z0-9-]+\.)+(?:com|net|org|ru|cn|xyz|info|io)\b'
        for match in re.finditer(domain_pattern, text, re.IGNORECASE):
            if not re.match(r'^\d+\.\d+\.\d+\.\d+$', match.group(0)):
                regex_entities.append({
                    "entity": match.group(0).lower(),
                    "type": "DOMAIN",
                    "start": match.start(),
                    "end": match.end(),
                    "confidence": 1.0,
                    "source": "regex"
                })

        hash_pattern = r'\b[a-fA-F0-9]{32}\b|\b[a-fA-F0-9]{40}\b|\b[a-fA-F0-9]{64}\b'
        for match in re.finditer(hash_pattern, text):
            regex_entities.append({
                "entity": match.group(0).lower(),
                "type": "IOC",
                "start": match.start(),
                "end": match.end(),
                "confidence": 1.0,
                "source": "regex"
            })

        for r_ent in regex_entities:
            entities.append(r_ent)

        # Tier 2: Model-based neural extraction (when model is loaded)
        model_spans = []
        if self.model_loaded and self.model and self.tokenizer:
            try:
                # Run neural token classification inference when model weights are available
                inputs = self.tokenizer(text, return_tensors="pt", return_offsets_mapping=True, truncation=True)
                offset_mapping = inputs["offset_mapping"][0]
                with torch.no_grad():
                    outputs = self.model(**{k: v for k, v in inputs.items() if k != "offset_mapping"})
                    logits = outputs.logits[0]
                    probs = torch.softmax(logits, dim=-1)
                    predictions = torch.argmax(probs, dim=-1)

                MIN_MODEL_CONFIDENCE = 0.50
                CONTEXTUAL_ENTITY_TYPES = {"THREAT_ACTOR", "MALWARE", "ORG"}
                current_entity = None
                for idx, (pred, offset) in enumerate(zip(predictions, offset_mapping)):
                    start, end = offset[0].item(), offset[1].item()
                    if start == end:
                        continue
                    label = self.id_to_label.get(pred.item(), "O")
                    prob = probs[idx][pred].item()

                    if label == "O" or prob < MIN_MODEL_CONFIDENCE:
                        if current_entity:
                            model_spans.append(current_entity)
                            current_entity = None
                        continue

                    ent_type = label[2:] if (label.startswith("B-") or label.startswith("I-")) else label
                    if ent_type not in CONTEXTUAL_ENTITY_TYPES:
                        if current_entity:
                            model_spans.append(current_entity)
                            current_entity = None
                        continue

                    if label.startswith("B-"):
                        if current_entity:
                            model_spans.append(current_entity)
                        current_entity = {
                            "entity": text[start:end],
                            "type": ent_type,
                            "start": start,
                            "end": end,
                            "confidence": round(prob, 2),
                            "source": "model"
                        }
                    elif label.startswith("I-") and current_entity and ent_type == current_entity["type"]:
                        current_entity["end"] = end
                        current_entity["entity"] = text[current_entity["start"]:end]
                        current_entity["confidence"] = min(current_entity["confidence"], round(prob, 2))
                    else:
                        if current_entity:
                            model_spans.append(current_entity)
                            current_entity = None
                if current_entity:
                    model_spans.append(current_entity)
            except Exception as e:
                logger.warning(f"Error during model inference: {e}")

        # Filter model_spans to resolve any overlap with structured regex matches
        filtered_model_spans = []
        for m_ent in model_spans:
            overlap_regex = None
            for r_ent in regex_entities:
                if not (m_ent["end"] <= r_ent["start"] or m_ent["start"] >= r_ent["end"]):
                    overlap_regex = r_ent
                    break
            if overlap_regex:
                logger.warning(
                    f"Span conflict detected between structured regex match '{overlap_regex['entity']}' ({overlap_regex['type']}) "
                    f"and model prediction '{m_ent['entity']}' ({m_ent['type']}) at span [{m_ent['start']}:{m_ent['end']}]. "
                    f"Preferring structured regex match."
                )
            else:
                filtered_model_spans.append(m_ent)

        for m_ent in filtered_model_spans:
            entities.append(m_ent)

        # Tier 3: Keyword List lookup (for THREAT_ACTOR and MALWARE)
        # 0.6 confidence assigned because this is a fixed 9-name lookup with zero generalization capabilities.
        # It can only match these exact names, so its confidence reflects that unlisted actors/malware will be missed.
        keyword_entities = []
        for actor in KNOWN_THREAT_ACTORS:
            pattern = rf'\b{re.escape(actor)}\b'
            for match in re.finditer(pattern, text, re.IGNORECASE):
                keyword_entities.append({
                    "entity": match.group(0),
                    "type": "THREAT_ACTOR",
                    "start": match.start(),
                    "end": match.end(),
                    "confidence": 0.6,
                    "source": "keyword_list"
                })

        for malware in KNOWN_MALWARE:
            pattern = rf'\b{re.escape(malware)}\b'
            for match in re.finditer(pattern, text, re.IGNORECASE):
                keyword_entities.append({
                    "entity": match.group(0),
                    "type": "MALWARE",
                    "start": match.start(),
                    "end": match.end(),
                    "confidence": 0.6,
                    "source": "keyword_list"
                })

        # Merge Tier 3 (keyword_list): Only fill in if no regex or model entity overlaps span
        for kw_ent in keyword_entities:
            overlap = False
            for r_ent in regex_entities:
                if not (kw_ent["end"] <= r_ent["start"] or kw_ent["start"] >= r_ent["end"]):
                    overlap = True
                    break
            if not overlap and self.model_loaded:
                for m_ent in filtered_model_spans:
                    if not (kw_ent["end"] <= m_ent["start"] or kw_ent["start"] >= m_ent["end"]):
                        overlap = True
                        break
            if not overlap:
                entities.append(kw_ent)

        # Sort entities by character start position
        entities = sorted(entities, key=lambda x: x["start"])
        return entities


# Singleton service instance
ner_service = NERService()


def extract_entities(text: str) -> list:
    return ner_service.extract_entities(text)


from ml.relation_extractor import extract_relations


def process_report(report: dict) -> dict:
    text = report.get("text", "")
    lang_info = detect_language_and_codemix(text)
    entities = extract_entities(text)
    relations = extract_relations(text, entities)
    
    return {
        "report_id": report.get("report_id", "N/A"),
        "language_analysis": lang_info,
        "entity_count": len(entities),
        "entities": entities,
        "relation_count": len(relations),
        "relations": relations
    }


def main():
    print("=== CyberGraph-X Multilingual NER Inference Pipeline ===")
    sample_path = Path("ml/data/sample_reports.json")
    if not sample_path.exists():
        print(f"Error: {sample_path} not found.")
        return

    with open(sample_path, "r", encoding="utf-8") as f:
        reports = json.load(f)

    results = []
    for r in reports:
        output = process_report(r)
        results.append(output)

    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
