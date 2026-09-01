from backend.app.services.classification.predict import predict_document


invoice_text = """
Helix Studio

Date: June 8, 2026

Bill To:
Suchita Ghute

Payment Status:
Unpaid

Banner
Quantity: 3
Rate: ₹300
Amount: ₹900

Subtotal: ₹900
Tax: ₹0
Total: ₹900
"""


prediction = predict_document(invoice_text)

print("Predicted document type:", prediction)