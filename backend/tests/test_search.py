from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
API_HEADERS = {"X-API-Key": "cybergraphx_secret_key_2026"}


def test_ingest_and_search_lazarus_case_insensitive():
    # 1. Ingest report mentioning Lazarus
    payload = {
        "report_id": "TEST-LAZARUS-RPT",
        "text": "El grupo Lazarus utilizo RedLine Stealer y la vulnerabilidad CVE-2021-44228."
    }
    ingest_res = client.post("/api/v1/ingest", json=payload, headers=API_HEADERS)
    assert ingest_res.status_code == 200

    # 2. Search for lowercase 'lazarus'
    search_res = client.get("/api/v1/search?q=lazarus", headers=API_HEADERS)
    assert search_res.status_code == 200
    data = search_res.json()
    assert data["total_matches"] >= 1
    labels = [n["label"] for n in data["results"]]
    assert any("Lazarus" in l for l in labels)


def test_search_apt28_and_cobalt_strike():
    # Ingest report mentioning APT28 and Cobalt Strike
    payload = {
        "report_id": "TEST-APT28-RPT",
        "text": "APT28 deployed Cobalt Strike payload to target financial institutions."
    }
    client.post("/api/v1/ingest", json=payload, headers=API_HEADERS)

    # Search for 'apt28'
    res_apt = client.get("/api/v1/search?q=apt28", headers=API_HEADERS)
    assert res_apt.status_code == 200
    assert res_apt.json()["total_matches"] >= 1

    # Search for 'cobalt'
    res_cobalt = client.get("/api/v1/search?q=cobalt", headers=API_HEADERS)
    assert res_cobalt.status_code == 200
    assert res_cobalt.json()["total_matches"] >= 1
