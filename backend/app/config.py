from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://pharma:pharma_secret@localhost:5432/pharma_rag"
    ollama_base_url: str = "http://host.docker.internal:11434"
    embedding_model: str = "nomic-embed-text"
    embedding_dim: int = 768
    llm_model: str = "llama3.2"
    chunk_size: int = 800
    chunk_overlap: int = 200
    retrieval_top_k: int = 5
    similarity_threshold: float = 0.3

    model_config = {"env_file": ".env"}


settings = Settings()
