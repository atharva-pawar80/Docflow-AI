from fastapi import FastAPI
from backend.app.api.routes.documents import router as document_router


app = FastAPI(
    title="DocFlow AI",
    description="Intelligent Document Processing & Automation Platform",
    version="0.1.0"
)

app.include_router(document_router)


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
