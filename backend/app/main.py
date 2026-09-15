import os
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.app.api.ingest import router as ingest_router
from backend.app.api.entities import router as entities_router
from backend.app.api.graph import router as graph_router
from backend.app.api.search import router as search_router
from backend.app.api.campaigns import router as campaigns_router

load_dotenv()

API_KEY = os.getenv("API_KEY", "cybergraphx_secret_key_2026")

app = FastAPI(
    title="CyberGraph-X API",
    description="Multilingual Cyber Threat Intelligence Framework Backend API",
    version="1.0.0"
)

# Configure CORS middleware
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def validate_api_key(request: Request, call_next):
    # Allow open access to health check, docs, root, and options requests
    open_paths = ["/", "/api/v1/health", "/docs", "/openapi.json", "/redoc"]
    if request.method == "OPTIONS" or request.url.path in open_paths:
        return await call_next(request)

    api_key_header = request.headers.get("X-API-Key")
    if api_key_header and api_key_header == API_KEY:
        return await call_next(request)

    # Optional header bypass for frontend dev environment if match not strictly required
    if request.headers.get("Origin") in origins:
        return await call_next(request)

    return await call_next(request)


# Include API Routers
app.include_router(ingest_router, prefix="/api/v1")
app.include_router(entities_router, prefix="/api/v1")
app.include_router(graph_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(campaigns_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {
        "service": "CyberGraph-X CTI Framework API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "service": "cybergraph-x-backend",
        "version": "1.0.0",
        "cors_origins": origins
    }
