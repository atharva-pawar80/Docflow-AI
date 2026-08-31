def classify_document(text: str) -> str:
    """
    Classify a document using simple keyword rules.

    This is our V1 baseline.
    """

    text_lower = text.lower()

    if "invoice" in text_lower:
        return "invoice"

    if "receipt" in text_lower:
        return "receipt"

    return "unknown"