from backend.app.services.extraction.pdf import extract_text_from_pdf

from backend.app.services.classification.predict import (
    predict_document
)


def process_document(file_path: str) -> dict:
    """
    Process a document through the DocFlow pipeline.

    Pipeline:
        PDF → Text Extraction → ML Classification
    """

    # Step 1: Extract text
    text = extract_text_from_pdf(file_path)

    # Step 2: Classify using trained ML model
    document_type = predict_document(text)

    return {
        "file_path": file_path,
        "document_type": document_type,
        "text": text
    }