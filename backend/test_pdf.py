from backend.app.services.extraction.pdf import extract_text_from_pdf


file_path = "data/raw/banner bill.pdf"

text = extract_text_from_pdf(file_path)

print("\n========== EXTRACTED TEXT ==========\n")
print(text)
print("\n====================================")