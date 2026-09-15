"""
CyberGraph-X Relation Extraction Rule/Dependency Parsing Engine
Configures CTI relation patterns and validates relation extraction logic.
"""

import json
from pathlib import Path

RELATION_RULES = [
    {"source": "THREAT_ACTOR", "relation": "USES", "target": "MALWARE"},
    {"source": "MALWARE", "relation": "EXPLOITS", "target": "CVE"},
    {"source": "THREAT_ACTOR", "relation": "EXPLOITS", "target": "CVE"},
    {"source": "MALWARE", "relation": "COMMUNICATES_WITH", "target": "IP"},
    {"source": "MALWARE", "relation": "COMMUNICATES_WITH", "target": "DOMAIN"},
    {"source": "THREAT_ACTOR", "relation": "COMMUNICATES_WITH", "target": "IP"},
    {"source": "THREAT_ACTOR", "relation": "COMMUNICATES_WITH", "target": "DOMAIN"},
    {"source": "MALWARE", "relation": "ASSOCIATED_WITH", "target": "IOC"},
]


def init_relation_engine():
    print("=== CyberGraph-X Relation Extraction Engine Initialized ===")
    config_path = Path("ml/models/relation_rules.json")
    config_path.parent.mkdir(parents=True, exist_ok=True)
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(RELATION_RULES, f, indent=2)
    print(f"Relation rules stored at {config_path}")


if __name__ == "__main__":
    init_relation_engine()
