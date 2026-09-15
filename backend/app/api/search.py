from fastapi import APIRouter, Query
from typing import List, Dict, Any
from backend.app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="", tags=["Search"])


@router.get("/search")
def search_threat_intel(q: str = Query(..., min_length=1, description="Search query string")) -> Dict[str, Any]:
    query = q.lower().strip()
    store = neo4j_service._in_memory_store

    matched_nodes = []
    for nid, node in store["nodes"].items():
        if query in node["label"].lower() or query in nid.lower() or query in str(node.get("properties", {})).lower():
            matched_nodes.append(node)

    return {
        "query": q,
        "total_matches": len(matched_nodes),
        "results": matched_nodes
    }
