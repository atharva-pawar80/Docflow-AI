import pandas as pd
from pathlib import Path
import re


RAW_FILE = Path("data/raw/company_documents_raw.csv")
PROCESSED_DIR = Path("data/processed")
PROCESSED_FILE = PROCESSED_DIR / "company_documents.csv"


def clean_text(text: str) -> str:
    """Basic text normalization."""

    text = str(text)

    # Remove excessive whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove leading/trailing spaces
    text = text.strip()

    return text


def prepare_dataset() -> pd.DataFrame:

    print("\n========== DATA PREPROCESSING ==========\n")

    # Load raw dataset
    df = pd.read_csv(RAW_FILE)

    print(f"Loaded raw dataset: {len(df)} documents")

    # Keep only what the classifier needs
    processed_df = df[["file_content", "document_type"]].copy()

    # Clean document text
    processed_df["text"] = processed_df["file_content"].apply(clean_text)

    # Rename target column
    processed_df = processed_df.rename(
        columns={
            "document_type": "label"
        }
    )

    # Keep only ML columns
    processed_df = processed_df[["text", "label"]]

    # Remove empty text
    processed_df = processed_df[
        processed_df["text"].str.len() > 0
    ]

    # Save processed dataset
    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    processed_df.to_csv(
        PROCESSED_FILE,
        index=False
    )

    print(f"Processed documents: {len(processed_df)}")

    print("\nLabels:")
    print(processed_df["label"].value_counts())

    print(f"\nSaved to: {PROCESSED_FILE}")

    print("\n========== PREPROCESSING COMPLETE ==========\n")

    return processed_df


if __name__ == "__main__":
    prepare_dataset()