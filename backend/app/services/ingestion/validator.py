import pandas as pd


REQUIRED_COLUMNS = [
    "file_content",
    "file_name",
    "extracted_data",
    "document_type",
    "chat_format"
]


EXPECTED_DOCUMENT_TYPES = [
    "Purchase Orders",
    "Invoices",
    "Shipping Orders"
]


def validate_dataset(df: pd.DataFrame) -> bool:
    print("\n========== DATA VALIDATION ==========\n")

    # 1. Validate columns
    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns: {missing_columns}"
        )

    print("✓ Required columns present")

    # 2. Validate missing values
    missing_values = df[REQUIRED_COLUMNS].isnull().sum()

    print("\nMissing values:")
    print(missing_values)

    if missing_values.sum() > 0:
        raise ValueError(
            "Dataset contains missing values"
        )

    # 3. Check empty file content
    empty_content = (
        df["file_content"]
        .astype(str)
        .str.strip()
        .eq("")
        .sum()
    )

    print(f"\nEmpty file_content values: {empty_content}")

    if empty_content > 0:
        raise ValueError(
            "Dataset contains empty file_content values"
        )

    print("✓ No missing or empty content")

    # 4. Validate duplicate rows
    duplicates = df.duplicated().sum()

    print(f"\nDuplicate rows: {duplicates}")

    if duplicates > 0:
        print("⚠ Duplicate rows found")
    else:
        print("✓ No duplicate rows")

    # 5. Validate document types
    document_types = df["document_type"].unique()

    print("\nDocument types:")

    for document_type in document_types:
        print(f"  - {document_type}")

    invalid_types = [
        document_type
        for document_type in document_types
        if document_type not in EXPECTED_DOCUMENT_TYPES
    ]

    if invalid_types:
        raise ValueError(
            f"Unexpected document types: {invalid_types}"
        )

    print("✓ Document types are valid")

    # 6. Display distribution
    print("\nDocument distribution:")
    print(df["document_type"].value_counts())

    print("\n========== VALIDATION PASSED ==========\n")

    return True