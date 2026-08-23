from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException


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

    return {
        "filename": file.filename,
        "status": "uploaded",
        "path": str(file_path)
    }