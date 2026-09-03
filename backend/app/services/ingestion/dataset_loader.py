from datasets import load_dataset
import pandas as pd
from pathlib import Path


DATASET_NAME = "AyoubChLin/CompanyDocuments"

RAW_DIR = Path("data/raw")
RAW_FILE = RAW_DIR / "company_documents_raw.csv"


def load_company_documents() -> pd.DataFrame:
    """
    Download and load the CompanyDocuments dataset
    from Hugging Face.
    """

    print("\n========== DATA INGESTION ==========\n")
    print(f"Loading dataset: {DATASET_NAME}")

    dataset = load_dataset(
        DATASET_NAME,
        split="train"
    )

    df = dataset.to_pandas()

    print(f"Loaded {len(df)} documents")
    print("\nOriginal columns:")
    print(df.columns.tolist())

    return df


def save_raw_dataset(df: pd.DataFrame) -> None:
    """
    Save the original dataset locally without modifying it.
    """

    RAW_DIR.mkdir(parents=True, exist_ok=True)

    df.to_csv(
        RAW_FILE,
        index=False
    )

    print(f"\nRaw dataset saved to: {RAW_FILE}")


if __name__ == "__main__":
    df = load_company_documents()
    save_raw_dataset(df)

    print("\n========== INGESTION COMPLETE ==========\n")