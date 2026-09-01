from backend.app.services.pipeline.document_pipeline import process_document


file_path = "data/raw/banner bill .pdf"

result = process_document(file_path)


print("\n========== DOCUMENT PIPELINE ==========\n")

print("Document type:", result["document_type"])
print("Confidence:", result["confidence"])

print("\nProbabilities:")

for label, probability in result["probabilities"].items():
    print(f"  {label}: {probability}")


print("\n========== EXTRACTED TEXT ==========\n")

print(result["text"])


print("\n====================================")