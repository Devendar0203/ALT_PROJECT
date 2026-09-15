from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="", tags=["Entities"])


@router.get("/entities/{entity_type}")
def get_entities_by_type(entity_type: str) -> List[Dict[str, Any]]:
    valid_types = ["THREAT_ACTOR", "MALWARE", "CVE", "IOC", "IP", "DOMAIN", "ALL"]
    normalized_type = entity_type.upper()
    if normalized_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid entity type '{entity_type}'. Allowed: {valid_types}")

    store = neo4j_service._in_memory_store["nodes"]
    results = []
    for nid, node in store.items():
        if normalized_type == "ALL" or node.get("type") == normalized_type:
            results.append(node)

    return results
