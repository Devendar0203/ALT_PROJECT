from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class IngestRequest(BaseModel):
    report_id: Optional[str] = Field(default=None, description="Optional custom CTI report identifier")
    text: str = Field(..., description="Raw text of the cyber threat report")


class EntityItem(BaseModel):
    entity: str
    type: str
    start: int
    end: int
    confidence: float


class RelationItem(BaseModel):
    source: str
    source_type: str
    relation: str
    target: str
    target_type: str
    confidence: float


class IngestResponse(BaseModel):
    status: str
    report_id: str
    primary_language: str
    is_code_mixed: bool
    entity_count: int
    entities: List[EntityItem]
    relation_count: int
    relations: List[RelationItem]


class SubgraphResponse(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


class CampaignCluster(BaseModel):
    campaign_id: Optional[str] = None
    campaign_name: str
    threat_actor: str
    shared_malware: List[str]
    correlated_reports: List[str]
    languages: Optional[List[str]] = None
