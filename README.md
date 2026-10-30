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
2. **Hybrid CTI Entity Extraction:** 
   - **Structured Types (`CVE`, `IP`, `DOMAIN`, `IOC`):** Deterministic high-precision regex matching (`source: "regex"`, `confidence: 1.0`).
   - **Contextual Types (`THREAT_ACTOR`, `MALWARE`, `ORG`):** Fine-tuned **XLM-RoBERTa** Token Classifier (`source: "model"`) when model checkpoint weights are loaded.
   - **3rd-Tier Fallback (`THREAT_ACTOR`, `MALWARE`):** Dictionary lookup (`source: "keyword_list"`, `confidence: 0.6`) when no trained neural checkpoint binary is loaded.
3. **CTI Relation Triples:** Rule and dependency-based relation extraction producing structured triples:
   - `(THREAT_ACTOR, USES, MALWARE)`
   - `(MALWARE, EXPLOITS, CVE)`
   - `(MALWARE, COMMUNICATES_WITH, IP)`
   - `(MALWARE, COMMUNICATES_WITH, DOMAIN)`
   - `(MALWARE, HAS_PAYLOAD, IOC)`
4. **Neo4j Aura Knowledge Graph:** Node deduplication and alias normalization using **100% parameterized Cypher queries** to prevent Cypher injection.
5. **FastAPI Backend REST API:** Endpoints for `/ingest`, `/entities/{type}`, `/entities/{id}/graph`, `/search`, `/campaigns`, and `/health` with `X-API-Key` authentication and CORS middleware.
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
- **FastAPI Backend Health:** `http://localhost:8000/api/v1/health`
- **Swagger Docs:** `http://localhost:8000/docs`

---

## Model Checkpoints & Fallback Modes

The service features explicit fallback status indicators exposed via `/api/v1/health`:

- **Missing Checkpoint / Un-trained Mode (Default):**
  - If no model weight binary (`pytorch_model.bin` or `model.safetensors`) exists in `ml/models/xlm-roberta-cti-ner/`, the backend logs a loud warning on startup and sets status flags:
    `model_loaded: false`
    `contextual_extraction_mode: "keyword_list_only"`
  - Structured entities (`CVE`, `IP`, `DOMAIN`, `IOC`) continue extracting at 100% precision via regex (`source: "regex"`, `confidence: 1.0`).
  - Known threat actors and malware match against the 3rd-tier lookup dictionary (`source: "keyword_list"`, `confidence: 0.6`). Fictional / unlisted actors are not extracted until a checkpoint is present.

- **Training & Deploying a Production Checkpoint:**
  1. Train on real annotated CTI corpora (such as CASIE or MalwareTextDB) or synthetic data:
     ```bash
     python ml/train_ner.py
     ```
  2. Save model weight artifacts (`pytorch_model.bin` / `model.safetensors` + `label_map.json`) to `ml/models/xlm-roberta-cti-ner/`.
  3. Set `NER_MODEL_PATH=ml/models/xlm-roberta-cti-ner` environment variable.
  4. On backend startup, XLM-RoBERTa token classification loads and `/api/v1/health` returns `model_loaded: true` and `contextual_extraction_mode: "hybrid_model"`.

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
| `GET` | `/api/v1/health` | Health check returning status, `model_loaded`, and `contextual_extraction_mode` |

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

- **Training Corpus:** The fine-tuning script (`ml/train_ner.py`) trains on synthetic multilingual CTI data as a baseline pipeline demo. Production deployments should fine-tune on expanded annotated corpora (CASIE, MalwareTextDB, STIX 2.1 datasets).
- **Relation Extraction:** Baseline relation extraction uses heuristic pattern matching. Future iterations can incorporate a Transformer joint entity-relation head.
