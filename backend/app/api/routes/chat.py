from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.db_models import Document, ChatMessage
from backend.app.services.rag.chain import chat_with_document

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/{doc_id}")
async def chat_endpoint(doc_id: str, req: ChatRequest, db: Session = Depends(get_db)):
    # Verify document exists
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        answer = chat_with_document(doc_id, req.message)

        # Save user message
        user_msg = ChatMessage(
            document_id=doc_id,
            role="user",
            content=req.message,
        )
        db.add(user_msg)

        # Save assistant message
        assistant_msg = ChatMessage(
            document_id=doc_id,
            role="assistant",
            content=answer,
        )
        db.add(assistant_msg)
        db.commit()

        return ChatResponse(answer=answer)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
