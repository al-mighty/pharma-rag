from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Chunk, Document
from app.schemas import HealthOut

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthOut)
async def health(db: AsyncSession = Depends(get_db)):
    try:
        doc_count = (await db.execute(select(func.count(Document.id)))).scalar() or 0
        chunk_count = (await db.execute(select(func.count(Chunk.id)))).scalar() or 0
        return HealthOut(status="ok", db=True, documents=doc_count, chunks=chunk_count)
    except Exception:
        return HealthOut(status="error", db=False, documents=0, chunks=0)
