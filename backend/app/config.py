import os
from dotenv import load_dotenv

# Load .env file from backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/docflow")

# Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# App
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
