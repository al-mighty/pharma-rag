# PharmaRAG

AI assistant for pharmaceutical documentation powered by RAG (Retrieval-Augmented Generation).
Answers questions about drug instructions with source citations using Claude + pgvector.

**Live:** [cheslav.space/pharma-rag](https://cheslav.space/pharma-rag/)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| AI/ML | Claude API (Anthropic), Voyage embeddings, RAG pipeline |
| Database | PostgreSQL 16 + pgvector |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Deploy | Docker Compose, nginx |

## Getting Started

```bash
cp .env.example .env
# Set your ANTHROPIC_API_KEY in .env

docker compose up -d

# Ingest sample drug instructions
docker compose exec backend python -m app.seed
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pharma-rag/
├── backend/           # FastAPI + RAG pipeline
│   ├── app/
│   │   ├── routers/   # API endpoints
│   │   ├── services/  # RAG, embeddings, ingestion, LLM
│   │   └── prompts/   # System prompts
│   └── alembic/       # DB migrations
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/ # Chat, Sources, Layout
│       └── hooks/      # useChat (SSE streaming)
├── data/samples/      # Drug instruction PDFs
└── docker-compose.yml
```

## Architecture

```
User Query → Embed → pgvector search (top-5) → Context assembly → Claude → Streamed response with [1][2] citations
```

## Author

Vyacheslav Kovalev — [cheslav.space](https://cheslav.space) · [GitHub](https://github.com/al-mighty)