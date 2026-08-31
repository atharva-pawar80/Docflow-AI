from backend.app.services.extraction.pdf import (
    extract_text_from_pdf
)

from backend.app.services.classification.document_classifier import (
    classify_document
)


def process_document(file_path: str) -> dict:
    """
    Run a document through the initial processing pipeline.

    Pipeline:
        PDF → Text Extraction → Classification
    """

    # Step 1: Extract text
    text = extract_text_from_pdf(file_path)

    # Step 2: Classify document
    document_type = classify_document(text)

    return {
        "file_path": file_path,
        "document_type": document_type,
        "text": text
    }