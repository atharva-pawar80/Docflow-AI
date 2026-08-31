from backend.app.services.classification.document_classifier import (
    classify_document
)


bill_text = """
Helix Studio

Date: June 8, 2026

Bill To:
Suchita Ghute

Banner
Quantity: 3
Rate: ₹300
Amount: ₹900

Subtotal: ₹900
Tax: ₹0
Total: ₹900

Payment Status: Unpaid
"""


result = classify_document(bill_text)

print("Document type:", result)