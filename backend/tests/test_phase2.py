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
