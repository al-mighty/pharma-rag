from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import Chunk, Document
from app.services.embeddings import embed_query


async def search_similar(db: AsyncSession, query: str, top_k: int | None = None) -> list[dict]:
    """Search for chunks similar to query using pgvector cosine distance."""
    top_k = top_k or settings.retrieval_top_k
    query_embedding = await embed_query(query)

    stmt = (
        select(
            Chunk,
            Document.drug_name,
            Document.filename,
            Chunk.embedding.cosine_distance(query_embedding).label("distance"),
        )
        .join(Document, Chunk.document_id == Document.id)
        .order_by("distance")
        .limit(top_k)
    )

    result = await db.execute(stmt)
    rows = result.all()

    sources = []
    for chunk, drug_name, filename, distance in rows:
        score = 1 - distance  # cosine similarity
        if score < settings.similarity_threshold:
            continue
        sources.append({
            "chunk_id": str(chunk.id),
            "document_id": str(chunk.document_id),
            "drug_name": drug_name or "Unknown",
            "filename": filename,
            "page_number": chunk.page_number,
            "content": chunk.content,
            "score": round(score, 3),
        })

    return sources
