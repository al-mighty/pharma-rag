from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Chunk, Document
from app.schemas import DocumentOut
from app.services.ingestion import ingest_pdf

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("", response_model=list[DocumentOut])
async def list_documents(db: AsyncSession = Depends(get_db)):
    stmt = select(Document).order_by(Document.created_at.desc())
    result = await db.execute(stmt)
    docs = result.scalars().all()

    out = []
    for doc in docs:
        chunk_count = (
            await db.execute(select(func.count(Chunk.id)).where(Chunk.document_id == doc.id))
        ).scalar() or 0
        out.append(DocumentOut(
            id=doc.id,
            filename=doc.filename,
            drug_name=doc.drug_name,
            page_count=doc.page_count,
            chunk_count=chunk_count,
            created_at=doc.created_at,
        ))
    return out


@router.post("/ingest", response_model=DocumentOut)
async def ingest_document(
    file: UploadFile = File(...),
    drug_name: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    doc = await ingest_pdf(db, content, file.filename, drug_name)
    chunk_count = (
        await db.execute(select(func.count(Chunk.id)).where(Chunk.document_id == doc.id))
    ).scalar() or 0
    return DocumentOut(
        id=doc.id,
        filename=doc.filename,
        drug_name=doc.drug_name,
        page_count=doc.page_count,
        chunk_count=chunk_count,
        created_at=doc.created_at,
    )
