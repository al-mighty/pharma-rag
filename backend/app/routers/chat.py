import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Conversation
from app.schemas import ChatRequest, ConversationOut
from app.services.rag import rag_stream

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    return StreamingResponse(
        rag_stream(db, req.message, req.conversation_id),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/conversations", response_model=list[ConversationOut])
async def list_conversations(db: AsyncSession = Depends(get_db)):
    stmt = select(Conversation).order_by(Conversation.created_at.desc()).limit(20)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/conversations/{conv_id}", response_model=ConversationOut)
async def get_conversation(conv_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Conversation).where(Conversation.id == conv_id)
    result = await db.execute(stmt)
    conv = result.scalar_one()
    return conv
