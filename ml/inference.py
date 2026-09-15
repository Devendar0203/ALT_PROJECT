import re
import json
import os
from pathlib import Path
from langdetect import detect, DetectorFactory

# Set seed for deterministic language detection
DetectorFactory.seed = 0

KNOWN_THREAT_ACTORS = [
    "APT28", "Lazarus", "Sandworm", "APT41", "Kimsuky", "FIN7", "Fancy Bear", "Volt Typhoon", "Cozy Bear"
]

KNOWN_MALWARE = [
    "Cobalt Strike", "RedLine Stealer", "AgentTesla", "PlugX", "LockBit", "Qakbot", "Emotet", "AsyncRAT", "X-Agent"
]


def detect_language_and_codemix(text: str) -> dict:
    """
    Detect primary language and evaluate code-mixing indicators.
    """
    try:
        lang = detect(text)
    except Exception:
        lang = "en"

    is_code_mixed = False
    details = []

    # Check for script mixing or English terms mixed with non-English scripts/words
    contains_cyrillic = bool(re.search(r'[\u0400-\u04FF]', text))
    contains_chinese = bool(re.search(r'[\u4E00-\u9FFF]', text))
    contains_latin = bool(re.search(r'[a-zA-Z]', text))

    if lang != "en" and contains_latin:
        is_code_mixed = True
        details.append(f"Mixed Latin CTI technical terms with {lang} base text")
    
    # Hindi-English code-mixed heuristics (e.g. 'ne', 'kiya', 'aur', 'karke', 'se')
    hi_en_markers = ["ne", "kiya", "aur", "karke", "se", "ko", "banaya"]
    if any(re.search(rf'\b{marker}\b', text, re.IGNORECASE) for marker in hi_en_markers) and contains_latin:
        lang = "hi-en"
        is_code_mixed = True
        details.append("Detected Hindi-English (Hinglish) code-mixed syntax")

    return {
        "primary_language": lang,
        "is_code_mixed": is_code_mixed,
        "mixing_details": details
    }


def extract_entities(text: str) -> list:
    """
    Extract CTI entities (THREAT_ACTOR, MALWARE, CVE, IOC, IP, DOMAIN) with character offsets.
    """
    entities = []

    # 1. Extract CVEs
    cve_pattern = r'\bCVE-\d{4}-\d{4,7}\b'
    for match in re.finditer(cve_pattern, text, re.IGNORECASE):
        entities.append({
            "entity": match.group(0).upper(),
            "type": "CVE",
            "start": match.start(),
            "end": match.end(),
            "confidence": 0.99
        })

    # 2. Extract IP Addresses
    ip_pattern = r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
    for match in re.finditer(ip_pattern, text):
        entities.append({
            "entity": match.group(0),
            "type": "IP",
            "start": match.start(),
            "end": match.end(),
            "confidence": 0.98
        })

    # 3. Extract Domains
    domain_pattern = r'\b(?:[a-zA-Z0-9-]+\.)+(?:com|net|org|ru|cn|xyz|info|io)\b'
    for match in re.finditer(domain_pattern, text, re.IGNORECASE):
        # Exclude IP string matches if matched by mistake
        if not re.match(r'^\d+\.\d+\.\d+\.\d+$', match.group(0)):
            entities.append({
                "entity": match.group(0).lower(),
                "type": "DOMAIN",
                "start": match.start(),
                "end": match.end(),
                "confidence": 0.96
            })

    # 4. Extract IoCs (Hashes: MD5, SHA1, SHA256)
    hash_pattern = r'\b[a-fA-F0-9]{32}\b|\b[a-fA-F0-9]{40}\b|\b[a-fA-F0-9]{64}\b'
    for match in re.finditer(hash_pattern, text):
        entities.append({
            "entity": match.group(0).lower(),
            "type": "IOC",
            "start": match.start(),
            "end": match.end(),
            "confidence": 0.97
        })

    # 5. Extract Threat Actors
    for actor in KNOWN_THREAT_ACTORS:
        pattern = rf'\b{re.escape(actor)}\b'
        for match in re.finditer(pattern, text, re.IGNORECASE):
            entities.append({
                "entity": match.group(0),
                "type": "THREAT_ACTOR",
                "start": match.start(),
                "end": match.end(),
                "confidence": 0.95
            })

    # 6. Extract Malware
    for malware in KNOWN_MALWARE:
        pattern = rf'\b{re.escape(malware)}\b'
        for match in re.finditer(pattern, text, re.IGNORECASE):
            entities.append({
                "entity": match.group(0),
                "type": "MALWARE",
                "start": match.start(),
                "end": match.end(),
                "confidence": 0.94
            })

    # Sort entities by character start position
    entities = sorted(entities, key=lambda x: x["start"])
    return entities


def process_report(report: dict) -> dict:
    text = report.get("text", "")
    lang_info = detect_language_and_codemix(text)
    entities = extract_entities(text)
    
    return {
        "report_id": report.get("report_id", "N/A"),
        "language_analysis": lang_info,
        "entity_count": len(entities),
        "entities": entities
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
