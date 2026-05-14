import anthropic

from app.config import settings

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _client


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed texts using Anthropic's Voyage model via the embeddings API."""
    client = _get_client()
    response = client.embeddings.create(
        model=settings.embedding_model,
        input=texts,
    )
    return [item.embedding for item in response.data]


async def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    result = await embed_texts([text])
    return result[0]
