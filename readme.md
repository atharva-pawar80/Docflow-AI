# DocFlow AI

DocFlow AI is an intelligent document processing and automation platform. It uses a hybrid approach to analyze documents:
1. **Traditional Machine Learning**: Classifies the type of document (e.g., invoice, receipt, contract) using a custom-trained Logistic Regression model and TF-IDF.
2. **Retrieval-Augmented Generation (RAG)**: Allows users to interactively chat with their uploaded documents, leveraging Groq (Llama 3) for lightning-fast and free LLM inference, Langchain for orchestration, and ChromaDB for local vector storage.

## Architecture

* **Backend**: FastAPI (Python), serving both the ML classification and the Langchain RAG endpoints.
* **Frontend**: React (Vite) offering a split-pane view to display document classification metrics alongside an interactive chat window.
* **Embeddings**: `all-MiniLM-L6-v2` via HuggingFace (runs locally, completely free).
* **LLM**: ChatGroq (requires a free Groq API key).
* **Vector Store**: ChromaDB (runs locally).

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

1. Create a virtual environment and install dependencies:
   ```bash
   cd Docflow-AI
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Add your Groq API Key:
   Create a `.env` file in the root directory and add your key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn backend.app.main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## Usage

1. **Upload**: Drop a document (PDF, PNG, JPG) into the left pane.
2. **Classification**: The ML pipeline will instantly classify the document and provide confidence metrics.
3. **Chat**: The document's text is chunked and stored in ChromaDB. You can immediately begin asking questions about the document in the right pane.

---

## Technical Details

- **ML Pipeline**: `backend/app/services/pipeline/document_pipeline.py` extracts text and calls the predictor.
- **RAG Pipeline**: `backend/app/services/rag/chain.py` handles chunking, embedding, and answering queries via Langchain.
- **API Routes**: `backend/app/api/routes` contains the `/upload` and `/chat` endpoints.
