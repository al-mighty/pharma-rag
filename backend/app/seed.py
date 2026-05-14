"""Seed script: ingest all PDFs from data/samples/ directory."""
import asyncio
import os
from pathlib import Path

from app.database import engine, Base, async_session
from app.services.ingestion import ingest_pdf
from sqlalchemy import text

DATA_DIR = Path("/app/data/samples")
LOCAL_DATA_DIR = Path(__file__).parent.parent.parent / "data" / "samples"


async def main():
    # Init DB
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)

    data_dir = DATA_DIR if DATA_DIR.exists() else LOCAL_DATA_DIR
    if not data_dir.exists():
        print(f"No data directory found at {data_dir}")
        return

    pdf_files = sorted(data_dir.glob("*.pdf"))
    if not pdf_files:
        print(f"No PDF files found in {data_dir}")
        return

    print(f"Found {len(pdf_files)} PDF files")

    async with async_session() as db:
        for pdf_path in pdf_files:
            drug_name = pdf_path.stem.replace("_", " ").title()
            print(f"  Ingesting: {pdf_path.name} ({drug_name})")

            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()

            doc = await ingest_pdf(db, pdf_bytes, pdf_path.name, drug_name)
            print(f"    → {doc.page_count} pages, document_id={doc.id}")

    print("Done!")


if __name__ == "__main__":
    asyncio.run(main())
