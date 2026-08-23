import pymupdf
from pathlib import Path


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.

    Args:
        file_path: Path to the PDF file.

    Returns:
        Extracted text from all pages.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    if path.suffix.lower() != ".pdf":
        raise ValueError("File must be a PDF")

    document = pymupdf.open(file_path)

    pages_text = []

    for page in document:
        text = page.get_text()
        pages_text.append(text)

    document.close()

    return "\n".join(pages_text)