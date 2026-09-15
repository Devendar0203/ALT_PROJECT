import httpx
import json

headers = {"X-API-Key": "cybergraphx_secret_key_2026", "Content-Type": "application/json"}
base_url = "http://localhost:8000/api/v1"


def verify_api_endpoints():
    print("=== CyberGraph-X Phase 5 API Verification ===")
    with httpx.Client(base_url=base_url, headers=headers, timeout=10.0) as client:
        # 1. POST /ingest
        ingest_payload = {
            "report_id": "RPT-CURL-001",
            "text": "Lazarus group used RedLine Stealer exploiting CVE-2021-44228 and connected to C2 10.0.0.15."
        }
        res_ingest = client.post("/ingest", json=ingest_payload)
        print("\n1. POST /api/v1/ingest -> Status:", res_ingest.status_code)
        print(json.dumps(res_ingest.json(), indent=2))

        # 2. GET /entities/MALWARE
        res_ent = client.get("/entities/MALWARE")
        print("\n2. GET /api/v1/entities/MALWARE -> Status:", res_ent.status_code)
        print(json.dumps(res_ent.json()[:3], indent=2))

        # 3. GET /entities/RedLine Stealer/graph
        res_graph = client.get("/entities/RedLine Stealer/graph")
        print("\n3. GET /api/v1/entities/RedLine Stealer/graph -> Status:", res_graph.status_code)
        print(json.dumps(res_graph.json(), indent=2))

        # 4. GET /search?q=Lazarus
        res_search = client.get("/search?q=Lazarus")
        print("\n4. GET /api/v1/search?q=Lazarus -> Status:", res_search.status_code)
        print(json.dumps(res_search.json(), indent=2))

        # 5. GET /campaigns
        res_camp = client.get("/campaigns")
        print("\n5. GET /api/v1/campaigns -> Status:", res_camp.status_code)
        print(json.dumps(res_camp.json(), indent=2))


if __name__ == "__main__":
    verify_api_endpoints()
