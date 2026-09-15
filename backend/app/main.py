import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

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
