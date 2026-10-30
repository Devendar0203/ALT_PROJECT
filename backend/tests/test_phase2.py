from ml.inference import extract_entities, detect_language_and_codemix


def test_language_detection():
    analysis = detect_language_and_codemix("Attacker Kimsuky ne LockBit ransomware execute kiya")
    assert analysis["primary_language"] == "hi-en"
    assert analysis["is_code_mixed"] is True


def test_entity_extraction():
    sample_text = "APT28 deployed Cobalt Strike targeting CVE-2023-38831 at IP 192.168.1.50 and domain darknet-malware.com."
    entities = extract_entities(sample_text)
    types = [e["type"] for e in entities]
    assert "THREAT_ACTOR" in types
    assert "MALWARE" in types
    assert "CVE" in types
    assert "IP" in types
    assert "DOMAIN" in types

    # Check sources and confidences
    cve_ent = next(e for e in entities if e["type"] == "CVE")
    assert cve_ent["source"] == "regex"
    assert cve_ent["confidence"] == 1.0

    actor_ent = next(e for e in entities if e["type"] == "THREAT_ACTOR")
    assert actor_ent["source"] == "keyword_list"
    assert actor_ent["confidence"] == 0.6


def test_hybrid_overlap_handling():
    from ml.inference import ner_service
    sample_text = "Threat report mentioning CVE-2023-38831 and IP 10.0.0.1"
    entities = ner_service.extract_entities(sample_text)
    
    # Ensure start/end offsets are strictly sorted and populated
    for idx in range(len(entities) - 1):
        assert entities[idx]["start"] <= entities[idx + 1]["start"]
        assert "source" in entities[idx]
        assert "start" in entities[idx]
        assert "end" in entities[idx]
