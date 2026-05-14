from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://pharma:pharma_secret@localhost:5432/pharma_rag"
    gigachat_auth_key: str = ""
    gigachat_scope: str = "GIGACHAT_API_PERS"
    llm_model: str = "GigaChat"
    embedding_model: str = "Embeddings"
    embedding_dim: int = 384
    chunk_size: int = 800
    chunk_overlap: int = 200
    retrieval_top_k: int = 5
    similarity_threshold: float = 0.3

    model_config = {"env_file": ".env"}


settings = Settings()
