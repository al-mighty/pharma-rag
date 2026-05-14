import httpx

from app.config import settings


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed texts using Ollama nomic-embed-text model."""
    embeddings = []
    async with httpx.AsyncClient(timeout=60.0) as client:
        for text in texts:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/embed",
                json={"model": settings.embedding_model, "input": text},
            )
            resp.raise_for_status()
            data = resp.json()
            embeddings.append(data["embeddings"][0])
    return embeddings


async def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    result = await embed_texts([text])
    return result[0]
