from fastapi import APIRouter, Query
from typing import List, Dict, Any
from backend.app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="", tags=["Search"])


@router.get("/search")
def search_threat_intel(q: str = Query(..., min_length=1, description="Search query string")) -> Dict[str, Any]:
    matched_nodes = neo4j_service.search_nodes(q)
    return {
        "query": q,
        "total_matches": len(matched_nodes),
        "results": matched_nodes
    }
