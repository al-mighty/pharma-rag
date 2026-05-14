"""Local embeddings using fastembed (lightweight, no PyTorch)."""
from fastembed import TextEmbedding

_model: TextEmbedding | None = None


def _get_model() -> TextEmbedding:
    global _model
    if _model is None:
        _model = TextEmbedding("BAAI/bge-small-en-v1.5")
    return _model


async def embed_texts(texts: list[str]) -> list[list[float]]:
    model = _get_model()
    embeddings = list(model.embed(texts))
    return [e.tolist() for e in embeddings]


async def embed_query(text: str) -> list[float]:
    model = _get_model()
    embeddings = list(model.query_embed(text))
    return embeddings[0].tolist()
