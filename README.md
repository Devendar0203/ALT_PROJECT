# CyberGraph-X — Multilingual Cyber Threat Intelligence Framework

CyberGraph-X is a full-stack, AI-driven framework for ingesting multilingual and code-mixed cyber threat intelligence (CTI) advisories, extracting security entities (Threat Actors, Malware, CVEs, IoCs, IPs, Domains) using fine-tuned XLM-RoBERTa token classification, extracting CTI relation triples, storing unified graphs in Neo4j (via Neo4j Aura), correlating cross-lingual threat campaigns, and visualizing knowledge graphs through a FastAPI backend and React.js interactive dashboard.

---

## ASCII Architecture Diagram

```
                                +-----------------------------------+
                                |    React.js + Vite Dashboard      |
                                | (Graph Explorer / Ingest / Search)|
                                +-----------------+-----------------+
                                                  |
                                                  v  REST / JSON (X-API-Key)
                                +-----------------+-----------------+
                                |      FastAPI Backend Router       |
                                |    (/ingest, /entities, /graph)   |
                                +--------+----------------+---------+
                                         |                |
                       +-----------------+                +------------------+
                       |                                                     |
                       v                                                     v
        +--------------+--------------+                       +--------------+--------------+
        |   XLM-RoBERTa NER Engine    |                       |     Neo4j Aura Database     |
        | (Token Classification Model)|                       |   (Parameterized Cypher Graph)|
        +--------------+--------------+                       +-----------------------------+
                       |
                       v
        +--------------+--------------+
        |  CTI Relation Extraction    |
        |   (Dependency / Heuristics) |
        +-----------------------------+
```

---

## Features & Capabilities

1. **Multilingual & Code-Mixed NLP:** Supports language identification (`langdetect`) and Hinglish/Latin-script code-mix detection across English, Spanish, Russian, Chinese, and Hindi-English advisories.
2. **CTI Entity Extraction:** Fine-tuned XLM-RoBERTa token classifier targeting 6 core CTI entity types: `THREAT_ACTOR`, `MALWARE`, `CVE`, `IOC`, `IP`, `DOMAIN`.
3. **CTI Relation Triples:** Rule and dependency-based relation extraction producing structured triples:
   - `(THREAT_ACTOR, USES, MALWARE)`
   - `(MALWARE, EXPLOITS, CVE)`
   - `(MALWARE, COMMUNICATES_WITH, IP)`
   - `(MALWARE, COMMUNICATES_WITH, DOMAIN)`
   - `(MALWARE, HAS_PAYLOAD, IOC)`
4. **Neo4j Aura Knowledge Graph:** Node deduplication and alias normalization using **100% parameterized Cypher queries** to prevent Cypher injection.
5. **FastAPI Backend REST API:** Endpoints for `/ingest`, `/entities/{type}`, `/entities/{id}/graph`, `/search`, and `/campaigns` with `X-API-Key` authentication and CORS middleware.
6. **React Dashboard & Graph Explorer:** Responsive dashboard featuring CTI KPI metrics, interactive 2D node-link graph visualization (`react-force-graph-2d`), entity search, and live report ingestion.
7. **CI/CD & Containerization:** GitHub Actions pipeline (`ci.yml`), multi-stage Dockerfiles (`backend/Dockerfile`, `frontend/Dockerfile`), `docker-compose.yml`, and Render deployment blueprint (`render.yaml`).

---

## Quickstart & Local Setup

### 1. Environment Requirements
- Python 3.11+
- Node.js 18+ / npm

### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-org/cybergraph-x.git
cd cybergraph-x

# Set up environment variables
cp .env.example .env
cp frontend/.env.example frontend/.env

# Install Python backend & ML dependencies
pip install -r backend/requirements.txt
pip install -r ml/requirements.txt

# Install Frontend dependencies
cd frontend
npm install
```

### 3. Running Locally (Single Command)
Run both the FastAPI backend and React frontend dev server simultaneously with one command from the project root:
```bash
npm run dev
# OR double-click start.bat on Windows
```
- **React Dashboard:** `http://localhost:5173`
- **FastAPI Backend:** `http://localhost:8000/api/v1/health`
- **Swagger Docs:** `http://localhost:8000/docs`

---

## Docker Compose Setup

Run the full stack containerized with one command:
```bash
docker compose up --build
```
- Backend API: `http://localhost:8000/docs`
- Frontend Dashboard: `http://localhost:5173`

---

## Model Training & Checkpoint Regeneration

Model checkpoints and tokenizer artifacts are saved under `ml/models/` (excluded from git via `.gitignore`).

To regenerate or fine-tune model checkpoints on custom/synthetic CTI corpora:
```bash
python ml/train_ner.py
```
This updates label mappings, tokenizer settings, and model metadata under `ml/models/xlm-roberta-cti-ner/`.

---

## API Reference

All requests (except health check `/api/v1/health`) require the header:
`X-API-Key: cybergraphx_secret_key_2026`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/ingest` | Ingest raw threat report, run NER & relation extraction, and update Neo4j |
| `GET` | `/api/v1/entities/{type}` | List extracted entities filtered by type (`THREAT_ACTOR`, `MALWARE`, `CVE`, `IOC`, `IP`, `DOMAIN`, `ALL`) |
| `GET` | `/api/v1/entities/{id}/graph` | Fetch 1/2-hop subgraph around a target entity |
| `GET` | `/api/v1/search?q={query}` | Search full text & entity nodes |
| `GET` | `/api/v1/campaigns` | Return correlated cross-lingual campaign clusters |
| `GET` | `/api/v1/health` | Health check endpoint returning backend & CORS status |

---

## Neo4j Cypher Schema

- **Node Labels:** `:Report`, `:Entity`, `:ThreatActor`, `:Malware`, `:CVE`, `:IP`, `:Domain`, `:IOC`
- **Relationship Types:**
  - `(Report)-[:MENTIONS]->(Entity)`
  - `(ThreatActor)-[:USES]->(Malware)`
  - `(Malware)-[:EXPLOITS]->(CVE)`
  - `(Malware)-[:COMMUNICATES_WITH]->(IP)`
  - `(Malware)-[:COMMUNICATES_WITH]->(Domain)`
  - `(Malware)-[:HAS_PAYLOAD]->(IOC)`

---

## Known Limitations & Roadmap

- **Training Corpus:** The current model is trained on a synthetic multilingual CTI dataset (50-100 examples) as a proof of concept. In production, train on expanded labeled datasets like CASIE, MalwareTextDB, or curated advisories.
- **Relation Extraction:** Baseline relation extraction uses heuristic pattern matching. Future iterations can incorporate a Transformer joint entity-relation extraction head.
