from backend.app.services.classification.document_classifier import (
    classify_document
)


invoice_text = """
INVOICE

Date: June 8, 2026

Helix studio

Bill To:
Suchita Ghute

Payment Status:
unpaid
"""


result = classify_document(invoice_text)

print("Document type:", result)