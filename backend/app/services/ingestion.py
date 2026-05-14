import io

from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import Chunk, Document
from app.services.embeddings import embed_texts


def extract_pages(pdf_bytes: bytes) -> list[tuple[int, str]]:
    """Extract text from each page of a PDF. Returns list of (page_number, text)."""
    reader = PdfReader(io.BytesIO(pdf_bytes))
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages.append((i + 1, text))
    return pages


def chunk_pages(pages: list[tuple[int, str]]) -> list[dict]:
    """Split pages into chunks with metadata."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " "],
    )

    chunks = []
    for page_num, text in pages:
        splits = splitter.split_text(text)
        for split in splits:
            chunks.append({"content": split, "page_number": page_num})
    return chunks


async def ingest_pdf(
    db: AsyncSession,
    pdf_bytes: bytes,
    filename: str,
    drug_name: str | None = None,
) -> Document:
    """Parse PDF, chunk, embed, and store in database."""
    pages = extract_pages(pdf_bytes)

    doc = Document(
        filename=filename,
        drug_name=drug_name,
        page_count=len(pages),
    )
    db.add(doc)
    await db.flush()

    chunks = chunk_pages(pages)
    texts = [c["content"] for c in chunks]

    # Embed in batches of 64
    all_embeddings = []
    for i in range(0, len(texts), 64):
        batch = texts[i : i + 64]
        embeddings = await embed_texts(batch)
        all_embeddings.extend(embeddings)

    for i, (chunk_data, embedding) in enumerate(zip(chunks, all_embeddings)):
        chunk = Chunk(
            document_id=doc.id,
            content=chunk_data["content"],
            page_number=chunk_data["page_number"],
            chunk_index=i,
            embedding=embedding,
            metadata_={"drug_name": drug_name, "filename": filename},
        )
        db.add(chunk)

    await db.commit()
    await db.refresh(doc)
    return doc
