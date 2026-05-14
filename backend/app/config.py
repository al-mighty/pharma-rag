from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://pharma:pharma_secret@localhost:5432/pharma_rag"
    anthropic_api_key: str = ""
    embedding_model: str = "voyage-3-lite"
    llm_model: str = "claude-sonnet-4-20250514"
    chunk_size: int = 800
    chunk_overlap: int = 200
    retrieval_top_k: int = 5
    similarity_threshold: float = 0.3

    model_config = {"env_file": ".env"}


settings = Settings()
