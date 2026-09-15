from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="", tags=["Campaigns"])


@router.get("/campaigns")
def get_campaigns() -> List[Dict[str, Any]]:
    campaigns = neo4j_service.get_campaign_clusters()
    return campaigns
