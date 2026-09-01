from backend.app.services.extraction.pdf import extract_text_from_pdf

from backend.app.services.classification.predict import (
    predict_document
)


def process_document(file_path: str) -> dict:

    # Step 1: Extract text
    text = extract_text_from_pdf(file_path)

    # Step 2: ML classification
    classification = predict_document(text)

    return {
        "file_path": file_path,
        "document_type": classification["document_type"],
        "confidence": classification["confidence"],
        "probabilities": classification["probabilities"],
        "text": text
    }