from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import DEBUG, ENVIRONMENT  # noqa: F401 — triggers .env loading
from backend.app.database import init_db
from backend.app.api.routes.documents import router as document_router
from backend.app.api.routes.chat import router as chat_router
from backend.app.api.routes.history import router as history_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables on startup."""
    init_db()
    yield


app = FastAPI(
    title="DocFlow AI",
    description="Intelligent Document Processing & Automation Platform",
    version="0.2.0",
    lifespan=lifespan,
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
app.include_router(history_router)


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
