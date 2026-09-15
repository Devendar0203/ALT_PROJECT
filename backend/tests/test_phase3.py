from ml.inference import process_report


def test_relation_extraction_triples():
    report = {
        "report_id": "TEST-001",
        "text": "APT28 deployed Cobalt Strike to exploit CVE-2023-38831 via IP 192.168.1.50 and domain darknet-malware.com."
    }
    output = process_report(report)
    assert output["relation_count"] > 0
    relations = output["relations"]
    
    # Verify specific triples
    uses_rel = [r for r in relations if r["relation"] == "USES"]
    exploits_rel = [r for r in relations if r["relation"] == "EXPLOITS"]
    comm_rel = [r for r in relations if r["relation"] == "COMMUNICATES_WITH"]
    
    assert len(uses_rel) == 1
    assert uses_rel[0]["source"] == "APT28"
    assert uses_rel[0]["target"] == "Cobalt Strike"

    assert len(exploits_rel) == 1
    assert exploits_rel[0]["target"] == "CVE-2023-38831"

    assert len(comm_rel) >= 2
