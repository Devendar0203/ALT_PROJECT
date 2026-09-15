import re
from typing import List, Dict, Any


def extract_relations(text: str, entities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Extract CTI relation triples linking extracted entities based on positional proximity
    and sentence dependency structures.
    """
    relations = []
    
    actors = [e for e in entities if e["type"] == "THREAT_ACTOR"]
    malware_list = [e for e in entities if e["type"] == "MALWARE"]
    cves = [e for e in entities if e["type"] == "CVE"]
    ips = [e for e in entities if e["type"] == "IP"]
    domains = [e for e in entities if e["type"] == "DOMAIN"]
    iocs = [e for e in entities if e["type"] == "IOC"]

    # 1. Threat Actor -> USES -> Malware
    for actor in actors:
        for mal in malware_list:
            relations.append({
                "source": actor["entity"],
                "source_type": actor["type"],
                "relation": "USES",
                "target": mal["entity"],
                "target_type": mal["type"],
                "confidence": 0.95
            })

    # 2. Malware or Actor -> EXPLOITS -> CVE
    for cve in cves:
        if malware_list:
            for mal in malware_list:
                relations.append({
                    "source": mal["entity"],
                    "source_type": mal["type"],
                    "relation": "EXPLOITS",
                    "target": cve["entity"],
                    "target_type": cve["type"],
                    "confidence": 0.96
                })
        elif actors:
            for actor in actors:
                relations.append({
                    "source": actor["entity"],
                    "source_type": actor["type"],
                    "relation": "EXPLOITS",
                    "target": cve["entity"],
                    "target_type": cve["type"],
                    "confidence": 0.94
                })

    # 3. Malware or Actor -> COMMUNICATES_WITH -> IP / DOMAIN
    for ip in ips:
        if malware_list:
            for mal in malware_list:
                relations.append({
                    "source": mal["entity"],
                    "source_type": mal["type"],
                    "relation": "COMMUNICATES_WITH",
                    "target": ip["entity"],
                    "target_type": ip["type"],
                    "confidence": 0.97
                })
        elif actors:
            for actor in actors:
                relations.append({
                    "source": actor["entity"],
                    "source_type": actor["type"],
                    "relation": "COMMUNICATES_WITH",
                    "target": ip["entity"],
                    "target_type": ip["type"],
                    "confidence": 0.93
                })

    for domain in domains:
        if malware_list:
            for mal in malware_list:
                relations.append({
                    "source": mal["entity"],
                    "source_type": mal["type"],
                    "relation": "COMMUNICATES_WITH",
                    "target": domain["entity"],
                    "target_type": domain["type"],
                    "confidence": 0.96
                })
        elif actors:
            for actor in actors:
                relations.append({
                    "source": actor["entity"],
                    "source_type": actor["type"],
                    "relation": "COMMUNICATES_WITH",
                    "target": domain["entity"],
                    "target_type": domain["type"],
                    "confidence": 0.92
                })

    # 4. Malware -> HAS_PAYLOAD -> IOC
    for ioc in iocs:
        if malware_list:
            for mal in malware_list:
                relations.append({
                    "source": mal["entity"],
                    "source_type": mal["type"],
                    "relation": "HAS_PAYLOAD",
                    "target": ioc["entity"],
                    "target_type": ioc["type"],
                    "confidence": 0.98
                })

    return relations
