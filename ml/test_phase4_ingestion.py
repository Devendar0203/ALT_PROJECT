import json
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ml.inference import process_report
from backend.app.services.neo4j_service import neo4j_service


def run_phase4_verification():
    print("=== CyberGraph-X Phase 4: Neo4j Aura Knowledge Graph Ingestion ===")
    sample_path = Path("ml/data/sample_reports.json")
    with open(sample_path, "r", encoding="utf-8") as f:
        reports = json.load(f)

    ingested_summary = []
    for r in reports:
        report_output = process_report(r)
        report_data = {
            "report_id": r.get("report_id"),
            "text": r.get("text"),
            "language_analysis": report_output["language_analysis"],
            "entities": report_output["entities"],
            "relations": report_output["relations"]
        }
        res = neo4j_service.upsert_report_and_graph(report_data)
        ingested_summary.append(res)
        print(f"Ingested {r.get('report_id')}: {res['entities_ingested']} entities, {res['relations_ingested']} relations.")

    print("\nExecuting Cypher Subgraph Query for entity 'Cobalt Strike':")
    subgraph = neo4j_service.query_subgraph("Cobalt Strike")
    print(json.dumps(subgraph, indent=2))

    print("\nCorrelated Cross-Lingual Campaigns:")
    campaigns = neo4j_service.get_campaign_clusters()
    print(json.dumps(campaigns, indent=2))


if __name__ == "__main__":
    run_phase4_verification()
