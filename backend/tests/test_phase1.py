from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "cybergraph-x-backend"
    assert "model_loaded" in data
    assert "contextual_extraction_mode" in data
    if data["model_loaded"]:
        assert data["contextual_extraction_mode"] == "hybrid_model"
    else:
        assert data["contextual_extraction_mode"] == "keyword_list_only"
    assert "http://localhost:5173" in data["cors_origins"]


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "docs" in data


def test_model_missing_fallback_behavior():
    from ml.inference import NERService
    service = NERService(model_path="non_existent_path_directory")
    status = service.get_status()
    assert status["model_loaded"] is False
    assert status["contextual_extraction_mode"] == "keyword_list_only"

    # Known threat actor in lookup list
    entities_known = service.extract_entities("Threat actor APT28 deployed Cobalt Strike")
    actor_known = [e for e in entities_known if e["type"] == "THREAT_ACTOR"]
    assert len(actor_known) == 1
    assert actor_known[0]["source"] == "keyword_list"
    assert actor_known[0]["confidence"] == 0.6

    # Fictional threat actor NOT in lookup list
    entities_fictional = service.extract_entities("Threat actor ShadowDragon123 attacked system")
    actor_fictional = [e for e in entities_fictional if e["type"] == "THREAT_ACTOR"]
    assert len(actor_fictional) == 0
