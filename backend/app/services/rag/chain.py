import os
from pathlib import Path

from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document

CHROMA_DB_DIR = "data/vectorstore"
os.makedirs(CHROMA_DB_DIR, exist_ok=True)

# We initialize embeddings
# using a lightweight model that runs locally via sentence-transformers
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vectorstore = Chroma(
    collection_name="docflow_collection",
    embedding_function=embeddings,
    persist_directory=CHROMA_DB_DIR
)


def get_llm():
    # Require GROQ_API_KEY environment variable to be set
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is missing")
    
    return ChatGroq(
        model="llama3-8b-8192",
        temperature=0,
        api_key=api_key
    )

def add_document_to_vectorstore(doc_id: str, text: str):
    # Split text into chunks (naive chunking for now, could be improved)
    # Using a simple chunk size of 1000 characters
    chunk_size = 1000
    overlap = 200
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]
        chunks.append(
            Document(page_content=chunk_text, metadata={"doc_id": doc_id})
        )
        start = end - overlap
        
    if chunks:
        vectorstore.add_documents(chunks)


def chat_with_document(doc_id: str, query: str):
    llm = get_llm()
    
    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 3, "filter": {"doc_id": doc_id}}
    )

    system_prompt = (
        "You are an intelligent assistant. Use the following pieces of retrieved context "
        "to answer the question. If you don't know the answer, say that you don't know. "
        "Use three sentences maximum and keep the answer concise.\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    response = rag_chain.invoke({"input": query})
    return response["answer"]

