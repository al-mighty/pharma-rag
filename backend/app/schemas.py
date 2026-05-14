import uuid
from datetime import datetime

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    conversation_id: uuid.UUID | None = None


class SourceRef(BaseModel):
    chunk_id: str
    document_id: str
    drug_name: str | None
    filename: str
    page_number: int | None
    content: str
    score: float


class MessageOut(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    sources: list[dict] | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    id: uuid.UUID
    title: str | None
    created_at: datetime
    messages: list[MessageOut] = []

    model_config = {"from_attributes": True}


class DocumentOut(BaseModel):
    id: uuid.UUID
    filename: str
    drug_name: str | None
    page_count: int
    chunk_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class HealthOut(BaseModel):
    status: str
    db: bool
    documents: int
    chunks: int
