from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.db_models import Document, ChatMessage

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    """List all uploaded documents, newest first."""
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "document_type": doc.document_type,
            "confidence": doc.confidence,
            "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
        }
        for doc in docs
    ]


@router.get("/documents/{doc_id}")
def get_document(doc_id: str, db: Session = Depends(get_db)):
    """Get a single document with its chat history."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.document_id == doc_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    return {
        "id": doc.id,
        "filename": doc.filename,
        "document_type": doc.document_type,
        "confidence": doc.confidence,
        "probabilities": doc.probabilities,
        "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat() if msg.created_at else None,
            }
            for msg in messages
        ],
    }


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    """Delete a document and its chat history."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()
    return {"status": "deleted", "doc_id": doc_id}
