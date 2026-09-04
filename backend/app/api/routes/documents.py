from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException


from backend.app.services.pipeline.document_pipeline import process_document
from backend.app.services.rag.chain import add_document_to_vectorstore

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = Path("data/raw")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

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
        
    doc_id = file.filename
        
    try:
        # Step 1: Process and classify document
        result = process_document(str(file_path))
        
        # Step 2: Add to Vectorstore for RAG
        add_document_to_vectorstore(doc_id, result["text"])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "status": "uploaded and processed",
        "path": str(file_path),
        "document_type": result.get("document_type"),
        "confidence": result.get("confidence")
    }