from fastapi import APIRouter
from backend.app.models.schemas import SubgraphResponse
from backend.app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="", tags=["Graph"])


@router.get("/entities/{entity_id:path}/graph", response_model=SubgraphResponse)
def get_entity_subgraph(entity_id: str):
    subgraph = neo4j_service.query_subgraph(entity_id)
    return SubgraphResponse(
        nodes=subgraph["nodes"],
        edges=subgraph["edges"]
    )
