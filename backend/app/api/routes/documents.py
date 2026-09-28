from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.db_models import Document
from backend.app.services.pipeline.document_pipeline import process_document
from backend.app.services.rag.chain import add_document_to_vectorstore

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = Path("data/raw")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):

    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    file_path = UPLOAD_DIR / file.filename

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    try:
        # Step 1: Process and classify document
        result = process_document(str(file_path))

        # Step 2: Save to database
        doc = Document(
            filename=file.filename,
            file_path=str(file_path),
            document_type=result.get("document_type"),
            confidence=result.get("confidence"),
            probabilities=result.get("probabilities"),
            extracted_text=result.get("text"),
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # Step 3: Add to Vectorstore for RAG using the DB-generated ID
        add_document_to_vectorstore(doc.id, result["text"])

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    return {
        "doc_id": doc.id,
        "filename": doc.filename,
        "status": "uploaded and processed",
        "path": str(file_path),
        "document_type": doc.document_type,
        "confidence": doc.confidence,
        "probabilities": doc.probabilities,
    }