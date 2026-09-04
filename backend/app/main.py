from fastapi import FastAPI
from backend.app.api.routes.documents import router as document_router
from backend.app.api.routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="DocFlow AI",
    description="Intelligent Document Processing & Automation Platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(document_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "name": "DocFlow AI",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
