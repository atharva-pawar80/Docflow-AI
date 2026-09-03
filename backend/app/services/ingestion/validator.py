import pandas as pd


REQUIRED_COLUMNS = ["text", "label"]


def validate_dataset(df: pd.DataFrame) -> bool:

    

    # 1. Check required columns
    for column in REQUIRED_COLUMNS:
        if column not in df.columns:
            raise ValueError(
                f"Missing required column: {column}"
            )

    print("✓ Required columns present")

    # 2. Check missing values
    print("\nMissing values:")
    print(df[REQUIRED_COLUMNS].isnull().sum())

    # 3. Check duplicates
    duplicates = df.duplicated().sum()

    print(f"\nDuplicate rows: {duplicates}")

    # 4. Check labels
    print("\nLabel distribution:")
    print(df["label"].value_counts())

    

    return True