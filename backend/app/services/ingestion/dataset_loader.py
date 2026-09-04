import pandas as pd
from pathlib import Path

from backend.app.services.ingestion.validator import validate_dataset


RAW_FILE = Path("data/raw/company_documents_raw.csv")


def load_dataset() -> pd.DataFrame:
    """Load the raw CompanyDocuments dataset."""

    print("\n========== DATA INGESTION ==========\n")
    print(f"Loading dataset from: {RAW_FILE}")

    if not RAW_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {RAW_FILE}"
        )

    df = pd.read_csv(RAW_FILE)

    print(f"✓ Dataset loaded")
    print(f"✓ Documents: {len(df)}")
    print(f"✓ Columns: {len(df.columns)}")

    return df


def ingest_dataset() -> pd.DataFrame:
    """Load and validate the raw dataset."""

    df = load_dataset()

    validate_dataset(df)

    return df


if __name__ == "__main__":
    df = ingest_dataset()

    print("\n========== INGESTION SUCCESSFUL ==========\n")