# CyberGraph-X — Multilingual Cyber Threat Intelligence Framework

CyberGraph-X is a full-stack, AI-driven framework for ingesting multilingual and code-mixed cyber threat intelligence (CTI) reports, extracting security entities (Threat Actors, Malware, CVEs, IoCs, IPs, Domains), resolving CTI relation triples, correlating threat actors/campaigns across multi-language advisories, and visualizing knowledge graphs via Neo4j Aura and React.js.

## System Architecture

```
                                +-----------------------------------+
                                |     React.js + Vite Dashboard     |
                                |     (Graph Explorer / Search)     |
                                +-----------------+-----------------+
                                                  |
                                                  v  HTTP / REST
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
        |  (Multilingual Token Classifier)                     |   (Parameterized Cypher Graph) |
        +--------------+--------------+                       +-----------------------------+
                       |
                       v
        +--------------+--------------+
        |  CTI Relation Extraction    |
        |   (Dependency / Heuristics) |
        +-----------------------------+
```

## Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ / npm

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/cybergraph-x.git
   cd cybergraph-x
   ```
2. Copy environment files:
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   ```
3. Install backend packages:
   ```bash
   pip install -r backend/requirements.txt
   pip install -r ml/requirements.txt
   ```
4. Start FastAPI backend server:
   ```bash
   python -m uvicorn backend.app.main:app --reload --port 8000
   ```
5. Install and run frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ML Checkpoint Regeneration
Model checkpoints are saved under `ml/models/` (git ignored). To train or fine-tune the XLM-RoBERTa token classification model:
```bash
python ml/train_ner.py
```
