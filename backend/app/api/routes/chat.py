from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.services.rag.chain import chat_with_document

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str

@router.post("/{doc_id}")
async def chat_endpoint(doc_id: str, req: ChatRequest):
    try:
        answer = chat_with_document(doc_id, req.message)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
