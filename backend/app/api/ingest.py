import uuid
from fastapi import APIRouter, HTTPException, Depends
from backend.app.models.schemas import IngestRequest, IngestResponse
from ml.inference import process_report
from backend.app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="", tags=["Ingest"])


@router.post("/ingest", response_model=IngestResponse)
def ingest_report(payload: IngestRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Report text cannot be empty.")

    report_id = payload.report_id or f"RPT-{str(uuid.uuid4())[:8].upper()}"
    raw_report = {"report_id": report_id, "text": payload.text}

    processed = process_report(raw_report)
    
    report_data = {
        "report_id": report_id,
        "text": payload.text,
        "language_analysis": processed["language_analysis"],
        "entities": processed["entities"],
        "relations": processed["relations"]
    }
    
    neo4j_service.upsert_report_and_graph(report_data)

    return IngestResponse(
        status="success",
        report_id=report_id,
        primary_language=processed["language_analysis"]["primary_language"],
        is_code_mixed=processed["language_analysis"]["is_code_mixed"],
        entity_count=processed["entity_count"],
        entities=processed["entities"],
        relation_count=processed["relation_count"],
        relations=processed["relations"]
    )
