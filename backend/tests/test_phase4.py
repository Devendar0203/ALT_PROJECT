from backend.app.services.neo4j_service import neo4j_service


def test_neo4j_parameterized_ingestion():
    sample_report = {
        "report_id": "TEST-NEO4J-001",
        "text": "APT41 deployed PlugX to exploit CVE-2024-1709.",
        "language_analysis": {"primary_language": "en"},
        "entities": [
            {"entity": "APT41", "type": "THREAT_ACTOR", "confidence": 0.95},
            {"entity": "PlugX", "type": "MALWARE", "confidence": 0.94},
            {"entity": "CVE-2024-1709", "type": "CVE", "confidence": 0.99}
        ],
        "relations": [
            {"source": "APT41", "source_type": "THREAT_ACTOR", "relation": "USES", "target": "PlugX", "target_type": "MALWARE"},
            {"source": "PlugX", "source_type": "MALWARE", "relation": "EXPLOITS", "target": "CVE-2024-1709", "target_type": "CVE"}
        ]
    }
    
    res = neo4j_service.upsert_report_and_graph(sample_report)
    assert res["status"] == "success"
    assert res["entities_ingested"] == 3
    assert res["relations_ingested"] == 2

    # Query subgraph around PlugX
    subgraph = neo4j_service.query_subgraph("PlugX")
    assert len(subgraph["nodes"]) > 0
    assert len(subgraph["edges"]) > 0
