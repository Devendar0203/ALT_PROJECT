from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
API_HEADERS = {"X-API-Key": "cybergraphx_secret_key_2026"}


def test_post_ingest_endpoint():
    payload = {
        "report_id": "TEST-RPT-999",
        "text": "APT28 deployed Cobalt Strike to exploit CVE-2023-38831 via IP 192.168.1.50 and domain darknet-malware.com."
    }
    response = client.post("/api/v1/ingest", json=payload, headers=API_HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["report_id"] == "TEST-RPT-999"
    assert data["primary_language"] == "en"
    assert data["entity_count"] > 0
    assert data["relation_count"] > 0


def test_get_entities_by_type():
    # Test valid entity type
    response = client.get("/api/v1/entities/MALWARE", headers=API_HEADERS)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # Test invalid entity type
    response_invalid = client.get("/api/v1/entities/INVALID_TYPE", headers=API_HEADERS)
    assert response_invalid.status_code == 400


def test_get_entity_subgraph():
    response = client.get("/api/v1/entities/Cobalt Strike/graph", headers=API_HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data


def test_search_endpoint():
    response = client.get("/api/v1/search?q=APT28", headers=API_HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "APT28"
    assert data["total_matches"] >= 1


def test_get_campaigns_endpoint():
    response = client.get("/api/v1/campaigns", headers=API_HEADERS)
    assert response.status_code == 200
    campaigns = response.json()
    assert isinstance(campaigns, list)
    assert len(campaigns) > 0
